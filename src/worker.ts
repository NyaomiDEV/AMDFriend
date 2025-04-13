/// <reference lib="webworker" />

import { basename, dirname, extname, resolve } from "@std/path";
import { copy, move } from "@std/fs";
import regexes from "./regexes.ts";
import { replaceAll } from "./routines.ts";
import type { PatchingResult, PatchOptions } from "./types.d.ts";
import { spawnProcess } from "./utils.ts";

self.onmessage = async (e) => {
	const { originalFilePath, options } = e.data;
	
	console.log(`Analyzing and patching file: ${originalFilePath}`);
	const p = await patchFile(originalFilePath, options);

	if (p) {

		console.log(`Routines found for ${originalFilePath}:`);
		console.log(
			p.patchedRoutines
				.map(x => `- <${Array.from(x.bytes).map(y => y.toString(16).padStart(2, "0")).join("").toUpperCase().match(/.{1,2}/g)!.join(" ")}> at offset ${x.offset} (Hex: ${x.offset.toString(16)})`)
				.join("\n")
		);

		console.log(`File ${originalFilePath} was patched.`);
		console.log(`Patched file location: ${p.patchedPath}`);
	}

	console.log(`Finished processing file: ${originalFilePath}`);
	self.postMessage(p || undefined);
	self.close();
}

export async function patchFile(filePath: string, options: PatchOptions): Promise<PatchingResult | null> {
	const result: PatchingResult = {
		patchedPath: resolve(dirname(filePath), basename(filePath, extname(filePath)) + ".patched" + extname(filePath)),
		patchedRoutines: []
	};

	let buffer: Uint8Array<ArrayBufferLike>;
	let stat: Deno.FileInfo;
	try {
		stat = await Deno.stat(filePath);
		buffer = await Deno.readFile(filePath);
	// deno-lint-ignore no-explicit-any
	} catch (e: any) {
		switch(e.code){
			case "ENOENT":
				console.error(`Cannot read ${filePath} as it was not found.`);
				break;
			default:
				console.error(`Cannot read ${filePath}. Skipping...`);
				break;
		}
		return null;
	}

	result.patchedRoutines.push(...replaceAll(
		buffer,
		regexes.__mkl_serv_intel_cpu_true.find,
		regexes.__mkl_serv_intel_cpu_true.replace
	));

	result.patchedRoutines.push(...replaceAll(
		buffer,
		regexes.__intel_fast_memset_or_memcpy_A.find,
		regexes.__intel_fast_memset_or_memcpy_A.replace
	));

	if (result.patchedRoutines.length) {
		if (!options.dryRun) {
			if (options.inPlace){
				result.patchedPath = filePath;
				if (options.backup)
					await copy(filePath, filePath + ".bak", { overwrite: true });
			}

			const _tempFile = await Deno.makeTempFile({
				prefix: "amdfriend-"
			});
			await Deno.writeFile(_tempFile, buffer);

			if (options.clearXA)
				await clearXAFile(_tempFile);

			if (options.sign)
				await signFile(_tempFile);

			try{
				await Deno.remove(result.patchedPath);

				await move(_tempFile, result.patchedPath, {
					overwrite: true
				});

				if(stat.mode)
					await Deno.chmod(result.patchedPath, stat.mode);
			}catch(e){
				console.error(`Error while moving patched file to original path: ${filePath}`);
				console.error(e);
			}
		}

		return result;
	}

	return null;
}

export async function clearXAFile(filePath: string) {
	return await spawnProcess("/usr/bin/xattr", ["-c", filePath]);
}

export async function signFile(filePath: string) {
	return await spawnProcess("/usr/bin/codesign", ["--force", "--sign", "-", filePath]);
}
