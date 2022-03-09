import { resolve } from "path";
import { patchFile } from ".";

(async () => {
	const originalFilePath = resolve(process.argv[2]);
	const patchedFilePath = await patchFile(originalFilePath);
	console.log(`Patched file is in: ${patchedFilePath}`);
})();
