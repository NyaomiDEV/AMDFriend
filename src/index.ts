import { exec } from "child_process";
import { promisify } from "util";
import { readFile, writeFile } from "fs/promises";
import { basename, dirname, extname, resolve } from "path";
import regexes from "./regexes";
import { replaceAll } from "./routines";

export async function patchFile(filePath: string, dryRun: boolean, inPlace: boolean): Promise<string|null> {
	let patchedFilePath = resolve(dirname(filePath), basename(filePath, extname(filePath)) + ".patched" + extname(filePath));
	if(inPlace)
		patchedFilePath = filePath;

	let buffer = Object(await readFile(filePath, "binary"));
	let matchCount = 0;
	let patchOccurred = false;


	console.log("Searching and replacing for instruction __mkl_serv_intel_cpu_true...");
	[buffer, matchCount] = replaceAll(
		buffer,
		regexes.__mkl_serv_intel_cpu_true.find,
		regexes.__mkl_serv_intel_cpu_true.replace
	);
	if(matchCount) patchOccurred = true;

	console.log("Searching and replacing for instructions __intel_fast_memset.A and __intel_fast_memcpy.A...");
	[buffer, matchCount] = replaceAll(
		buffer,
		regexes.__intel_fast_memset_or_memcpy_A.find,
		regexes.__intel_fast_memset_or_memcpy_A.replace
	);
	if(patchOccurred || matchCount) patchOccurred = true;

	if(patchOccurred){
		console.log("Writing resulting file...");
		if (!dryRun)
			await writeFile(patchedFilePath, buffer, "binary");

		const xattrCmd = `xattr -cr "${patchedFilePath}"`;
		console.log("Invoking command:", xattrCmd);
		if (!dryRun)
			await promisify(exec)(xattrCmd);

		return patchedFilePath;
	}

	return null;
}

export async function signFile(filePath: string, dryRun: boolean){
	const signCmd = `codesign --force --deep --sign - "${filePath}"`;
	console.log("Invoking command:", signCmd);
	if(!dryRun)
		await promisify(exec)(signCmd);
}
