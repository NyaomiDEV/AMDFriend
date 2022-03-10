import { readdirSync as readdir, statSync as stat } from "fs";
import { resolve, extname, basename } from "path";

export function walkDirectory(dir: string, fileTypes: string[], exclude: string[]): string[]{
	const result: string[] = [];

	function __walk(currentPath) {
		const files = readdir(currentPath);
		for (const i in files) {
			const curFile = resolve(currentPath, files[i]);
			const _stat = stat(curFile);
			if (_stat.isFile() && fileTypes.includes(extname(curFile)) && !exclude.includes(basename(curFile)))
				result.push(curFile);
			else if (_stat.isDirectory())
				__walk(curFile);
		}
	}

	__walk(dir);
	return result;
}