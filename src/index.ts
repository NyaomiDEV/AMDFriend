import { basename, dirname, extname, resolve } from "@std/path";
import { copy, move } from "@std/fs";
import regexes from "./regexes.ts";
import { replaceAll } from "./routines.ts";
import type { PatchingResult, PatchOptions } from "./types.d.ts";
import { md5, spawnProcess } from "./utils.ts";

const _tempDir = await Deno.makeTempDir({
	prefix: "amdfriend-"
});

export async function patchFile(filePath: string, options: PatchOptions): Promise<PatchingResult|null> {
	const result: PatchingResult = {
		patchedPath: resolve(dirname(filePath), basename(filePath, extname(filePath)) + ".patched" + extname(filePath)),
		patchedRoutines: []
	};

	if (options.inPlace)
		result.patchedPath = filePath;

	let buffer: Uint8Array<ArrayBufferLike>;
	try{
		buffer = await Deno.readFile(filePath);
	}catch(_){
		console.log(`${filePath} is a directory. Skipping...`);
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

	if(result.patchedRoutines.length){
		if (!options.dryRun){

			if(options.inPlace && options.backup)
				await copy(filePath, filePath + ".bak", { overwrite: true });

			const _tempFile = resolve(_tempDir, md5(filePath + Date.now().toString()));
			await Deno.writeFile(_tempFile, buffer);

			if (options.clearXA)
				await clearXAFile(_tempFile);

			if (options.sign)
				await signFile(_tempFile);

			await move(_tempFile, result.patchedPath, {
				overwrite: true
			});
		}

		return result;
	}

	return null;
}

export async function clearXAFile(filePath: string){
	return await spawnProcess("/usr/bin/xattr", ["-c", filePath]);
}

export async function signFile(filePath: string){
	return await spawnProcess("/usr/bin/codesign", ["--force", "--sign", "-", filePath]);
}
