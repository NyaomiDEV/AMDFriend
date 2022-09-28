import { copyFile, readFile, writeFile } from "fs/promises";
import { basename, dirname, extname, resolve } from "path";
import regexes from "./regexes";
import { replaceAll } from "./routines";
import { PatchingResult, PatchOptions } from "./types";
import { spawnProcess } from "./utils";

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

			await writeFile(result.patchedPath, buffer);
		}

		return result;
	}

	return null;
}

export async function clearXAFile(filePath: string, dryRun: boolean){
	if (!dryRun)
		await spawnProcess("/usr/bin/xattr", ["-c", filePath]);
}

export async function signFile(filePath: string, dryRun: boolean){
	if(!dryRun)
		await spawnProcess("/usr/bin/codesign", ["--force", "--sign", "-", filePath]);
}
