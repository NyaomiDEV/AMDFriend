import { walk, type WalkEntry } from "@std/fs";
import { crypto } from "@std/crypto";
import { encodeHex } from "@std/encoding/hex";

export async function walkDirectory(dir: string, fileTypes: string[], match: RegExp[]): Promise<WalkEntry[]> {
	const result: WalkEntry[] = [];
	const files = walk(dir, { exts: fileTypes, match });
	for await (const entry of files) {
		if (entry.isFile)
			result.push(entry);
		else if (entry.isDirectory)
			result.push(...await walkDirectory(entry.path, fileTypes, match));
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