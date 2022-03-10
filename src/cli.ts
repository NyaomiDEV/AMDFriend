#!/usr/bin/env node
import { resolve } from "path";
import { patchFile, signFile } from ".";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { parallelizer } from "./parallelizer";
import { cpus } from "os";

const argv = yargs(hideBin(process.argv))
	.boolean("in-place")
	.boolean("dry-run")
	.boolean("backup")
	.boolean("sign")
	.argv as {
		$0: string,
		_: (string|number)[],
		[x: string]: any
	};

async function patchPromise(originalFilePath: string, dryRun: boolean, inPlace: boolean, backup: boolean, sign: boolean) {
	console.log(`Analyzing and patching file: ${originalFilePath}`);
	const p = await patchFile(originalFilePath, dryRun, inPlace, backup);
	if (p) {
		if (sign)
			await signFile(p.patchedPath, argv["dry-run"]);
		console.log(`Routines found for ${originalFilePath}:`);
		console.log(
			p.patchedRoutines.map(x => `- <${x.bytes.toString("hex").toUpperCase().match(/.{1,2}/g)!.join(" ")}> at offset ${x.offset} (Hex: ${x.offset.toString(16)})`).join("\n")
		);
		console.log(`File ${originalFilePath} was patched.`);
		console.log(`Patched file location: ${p.patchedPath}`);
	}
	console.log(`Finished processing file: ${originalFilePath}`);
}

(async () => {
	if(!argv._[0]){
		console.error("You must specify at least a path to a library as argument!");
		process.exit(1);
	}

	if(argv["dry-run"])
		console.log("\n\nWarning!\nDry run is active! No files will be actually patched!\n");

	function* promiseGen(): Generator<Promise<any>> {
		for (const path of argv._) {
			const originalFilePath = resolve(path.toString());
			yield patchPromise(originalFilePath, argv["dry-run"], argv["in-place"], argv.backup, argv.sign);
		}
	}

	await parallelizer(promiseGen(), cpus().length);
})();
