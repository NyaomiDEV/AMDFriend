import { Dirent, readdirSync, statSync } from "fs";
import { resolve, extname, basename } from "path";
import { spawn } from "child_process";
import { createHash } from "crypto";

export function walkDirectoryOld(dir: string, fileTypes: string[], exclude: string[]): string[]{
	const result: string[] = [];

	function __walk(currentPath) {
		const files = readdirSync(currentPath);
		for (const i in files) {
			const curFile = resolve(currentPath, files[i]);
			const _stat = statSync(curFile);
			if (_stat.isFile() && fileTypes.includes(extname(curFile)) && !exclude.includes(basename(curFile)))
				result.push(curFile);
			else if (_stat.isDirectory())
				__walk(curFile);
		}
	}

	__walk(dir);
	return result;
}

export function walkDirectory(dir: string, fileTypes: string[], exclude: string[]): Dirent[] {
	const result: Dirent[] = [];
	const files = readdirSync(dir, { withFileTypes: true });

	for (const dirent of files) {
		dirent.name = resolve(dir, dirent.name);

		if (dirent.isFile() && fileTypes.includes(extname(dirent.name)) && !exclude.includes(basename(dirent.name)))
			result.push(dirent);
		else if (dirent.isDirectory())
			result.push(...walkDirectory(dirent.name, fileTypes, exclude));
	}

	return result;
}

export function spawnProcess(command: string, args: string[]): Promise<number | null> {
	return new Promise((resolve, reject) => {
		const spawnedProcess = spawn(
			command,
			args,
			{ stdio: "inherit" }
		);

		spawnedProcess.on("exit", code => {
			if (code)
				reject(code);

			resolve(code);
		});
	});
}

export function md5(data: string): string {
	return createHash("md5").update(data).digest("hex");
}