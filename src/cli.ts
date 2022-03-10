#!/usr/bin/env node
import { resolve } from "path";
import { patchFile, signFile } from ".";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { parallelizer } from "./parallelizer";
import { cpus } from "os";
import { walkDirectory } from "./utils";

// Argument definiiton and parsing
const argv = yargs(hideBin(process.argv))
	.scriptName("amdfriend")
	.usage("$0 [args] <path/to/library> [.../path/to/other/libraries]")
	.option("in-place", {
		alias: "i",
		describe: "Directly patch the library, as opposed to creating a patched library with `.patched` appended to the file name.",
		demandOption: false,
		type: "boolean",
		default: false
	})
	.option("dry-run", {
		alias: "d",
		describe: "Do all checking and patching, but DO NOT write anything to disk.",
		demandOption: false,
		type: "boolean",
		default: false
	})
	.option("backup", {
		alias: "b",
		describe: "Only works in conjunction with `--in-place`; it backs up the original library by copying it and appending `.bak` on its extension.",
		demandOption: false,
		type: "boolean",
		default: false,
		implies: "in-place"
	})
	.option("sign", {
		alias: "s",
		describe: "Automatically invoke `codesign` on patched libraries.",
		demandOption: false,
		type: "boolean",
		default: false
	})
	.option("directories", {
		alias: "D",
		describe: "Scan directories alongside files. It will search for any file with no extension and with extension `.dylib`, as they are the common ones to patch.",
		demandOption: false,
		type: "array",
		default: []
	})
	.help()
	.argv as {
		$0: string,
		_: (string|number)[],
		[x: string]: any
	};

// CLI CODE
async function patchPromise(originalFilePath: string, dryRun: boolean, inPlace: boolean, backup: boolean, sign: boolean): Promise<void> {
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
	if(!argv._[0] && !argv.directories){
		console.error("You must specify at least a path to a library as argument!");
		process.exit(1);
	}

	if(argv["dry-run"])
		console.log("\n\nWarning!\nDry run is active! No files will be actually patched!\n");

	function* promiseGen(): Generator<Promise<void>> {
		if (argv.directories){
			for(const dirPath of argv.directories){
				for(const path of walkDirectory(dirPath, ["", ".dylib"], [".DS_Store"])){
					const originalFilePath = resolve(path.toString());
					yield patchPromise(originalFilePath, argv["dry-run"], argv["in-place"], argv.backup, argv.sign);
				}
			}
		}
		for (const path of argv._) {
			const originalFilePath = resolve(path.toString());
			yield patchPromise(originalFilePath, argv["dry-run"], argv["in-place"], argv.backup, argv.sign);
		}
	}

	await parallelizer(promiseGen(), cpus().length);
})();
