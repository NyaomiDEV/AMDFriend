import { resolve } from "path";
import { patchFile } from ".";

(async () => {
	if(!process.argv[2]){
		console.error("You must specify a path to a library as argument!");
		process.exit(1);
	}
	
	const originalFilePath = resolve(process.argv[2]);
	const patchedFilePath = await patchFile(originalFilePath);
	console.log(`Patched file is in: ${patchedFilePath}`);
})();
