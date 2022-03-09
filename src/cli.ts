#!/usr/bin/env node
import { resolve } from "path";
import { patchFile, signFile } from ".";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv)).argv as {
	$0: string,
	_: (string|number)[],
	[x: string]: any
};

(async () => {
	console.log(argv);
	if(!argv._[0]){
		console.error("You must specify at least a path to a library as argument!");
		process.exit(1);
	}

	if(argv["dry-run"])
		console.log("\n\nWarning!\nDry run is active! No files will be actually patched!\n");
	
	for(const path of argv._){
		const originalFilePath = resolve(path.toString());
		console.log(`Analyzing and patching file: ${originalFilePath}`);
		const patchedFilePath = await patchFile(originalFilePath, argv["dry-run"]);
		if(patchedFilePath){
			console.log(`Patched file is in: ${patchedFilePath}`);
			if(argv.sign)
				await signFile(patchedFilePath, argv["dry-run"]);
		}
	}
})();
