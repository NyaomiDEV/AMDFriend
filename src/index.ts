import { exec } from "child_process";
import { promisify } from "util";
import { copyFile, readFile, writeFile } from "fs/promises";
import { basename, dirname, extname, resolve } from "path";
import regexes from "./regexes";
import { replaceAll } from "./routines";
import { PatchingResult } from "./types";

export async function patchFile(filePath: string, dryRun: boolean, inPlace: boolean, backup: boolean): Promise<PatchingResult|null> {
	const result: PatchingResult = {
		patchedPath: resolve(dirname(filePath), basename(filePath, extname(filePath)) + ".patched" + extname(filePath)),
		patchedRoutines: []
	};

	if (inPlace)
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
		if (!dryRun){

			if(inPlace && backup)
				await copyFile(filePath, filePath + ".bak");

			await writeFile(result.patchedPath, buffer);
		}

		const xattrCmd = `xattr -cr "${result.patchedPath}"`;
		if (!dryRun)
			await promisify(exec)(xattrCmd);

		return result;
	}

	return null;
}

export async function signFile(filePath: string, dryRun: boolean){
	const signCmd = `codesign --force --deep --sign - "${filePath}"`;
	if(!dryRun)
		await promisify(exec)(signCmd);
}
