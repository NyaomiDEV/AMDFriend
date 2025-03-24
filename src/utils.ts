import { walkSync, WalkEntry } from "@std/fs";
import { resolve, extname, basename } from "@std/path";
import { crypto } from "@std/crypto";
import { encodeHex } from "@std/encoding/hex";

export function walkDirectory(dir: string, fileTypes: string[], exclude: string[]): WalkEntry[] {
	const result: WalkEntry[] = [];
	const files = walkSync(dir);

	for (const entry of files) {
		entry.name = resolve(dir, entry.name);

		if (entry.isFile && fileTypes.includes(extname(entry.name)) && !exclude.includes(basename(entry.name)))
			result.push(entry);
		else if (entry.isDirectory)
			result.push(...walkDirectory(entry.name, fileTypes, exclude));
	}

	return result;
}

export function spawnProcess(command: string, args: string[]): Promise<number | null> {
	return new Promise((resolve, reject) => {
		const spawnedProcess = new Deno.Command(
			command,
			{ args }
		).spawn();

		spawnedProcess.status.then(status => {
			if (!status.success)
				reject(status.code);

			resolve(status.code);
		})
	});
}

export function md5(data: string): string {
	const messageBuffer = new TextEncoder().encode(data);
	return encodeHex(crypto.subtle.digestSync("MD5", messageBuffer));
}