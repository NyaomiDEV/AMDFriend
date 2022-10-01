import { mkdtempSync } from "fs";
import { copyFile, readFile, rename, writeFile } from "fs/promises";
import { basename, dirname, extname, resolve } from "path";
import regexes from "./regexes";
import { replaceAll } from "./routines";
import { PatchingResult, PatchOptions } from "./types";
import { md5, spawnProcess } from "./utils";

const _tempDir = mkdtempSync("amdfriend");

export async function patchFile(filePath: string, options: PatchOptions): Promise<PatchingResult|null> {
	const result: PatchingResult = {
		patchedPath: resolve(dirname(filePath), basename(filePath, extname(filePath)) + ".patched" + extname(filePath)),
		patchedRoutines: []
	};

	if (options.inPlace)
		result.patchedPath = filePath;

	let buffer;
	try{
		buffer = await readFile(filePath);
	}catch(err: any){
		if(err.code === "EISDIR")
			console.log(`${filePath} is a directory. Skipping...`);
		else
			console.error(`Error while opening ${filePath}: ${err.message}`);

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
				await copyFile(filePath, filePath + ".bak");

			const _tempFile = resolve(_tempDir, md5(filePath + Date.now().toString()));
			await writeFile(_tempFile, buffer);

			if (options.clearXA)
				await clearXAFile(_tempFile);

			if (options.sign)
				await signFile(_tempFile);

			await rename(_tempFile, result.patchedPath);
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
