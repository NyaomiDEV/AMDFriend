import { exec } from "child_process";
import { promisify } from "util";
import { readFile, writeFile } from "fs/promises";
import { basename, dirname, extname, resolve } from "path";
import regexes from "./regexes";
import { replaceAll } from "./routines";

export async function patchFile(filePath: string): Promise<string> {
	const patchedFilePath = resolve(dirname(filePath), basename(filePath, extname(filePath)) + ".patched" + extname(filePath));

	let buffer = await readFile(filePath, "binary");

	console.log("Searching and replacing for instruction __mkl_intel_serving_cpu_true...");
	buffer = replaceAll(
		buffer,
		regexes.__mkl_serv_intel_cpu_true.find,
		regexes.__mkl_serv_intel_cpu_true.replace
	);

	console.log("Searching and replacing for instructions __intel_fast_memset.A and __intel_fast_memcpy.A...");
	buffer = replaceAll(
		buffer,
		regexes.__intel_fast_memset_or_memcpy_A.find,
		regexes.__intel_fast_memset_or_memcpy_A.replace
	);

	console.log("Writing resulting file...");
	await writeFile(patchedFilePath, buffer, "binary");

	console.log("Invoking command:", `xattr -cr "${patchedFilePath}"`);
	await promisify(exec)(`xattr -cr "${patchedFilePath}"`);

	return patchedFilePath;
}

export async function signFile(filePath){
	console.log("Invoking command:", `codesign --force --deep --sign - "${filePath}"`);
	await promisify(exec)(`codesign --force --deep --sign - "${filePath}"`);
}
