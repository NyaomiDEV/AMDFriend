import { resolve } from "@std/path";
import yargs from "yargs";
import { parallelizer } from "./parallelizer.ts";
import { walkDirectory } from "./utils.ts";
import type { PatchingResult } from "./types.d.ts";

// Argument definiiton and parsing
const argv = yargs(Deno.args)
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
	.option("clear-xa", {
		alias: "c",
		describe: "Automatically clear extended attributes on patched libraries.",
		demandOption: false,
		type: "boolean",
		default: true
	})
	.option("directories", {
		alias: "D",
		describe: "Scan directories alongside files. It will search for any file with no extension and with extension `.dylib`, as they are the common ones to patch.",
		demandOption: false,
		type: "array",
		default: []
	})
	.option("jobs", {
		alias: "j",
		describe: "The number of jobs that will be spawned to process the libraries.",
		demandOption: false,
		type: "number",
		default: navigator.hardwareConcurrency
	})
	.help()
	.parse();

// CLI CODE
function spawnWorker(originalFilePath, options): Promise<PatchingResult | undefined> {
	return new Promise(resolve => {
		const worker = new Worker(
			new URL("./worker.ts", import.meta.url).href,
			{ type: "module" }
		);
		worker.onmessage = (e) => {
			resolve(e.data);
		};
		worker.postMessage({
			originalFilePath,
			options
		});
	});
}

async function filePaths(): Promise<string[]> {
	const paths: string[] = [];
	if (argv.directories) {
		for (const dirPath of argv.directories) {
			for (const dirent of await walkDirectory(dirPath, ["", ".dylib", ".node"], [/^(?!\.DS_Store$).*$/])) {
				paths.push(dirent.path);
			}
		}
	}
	for (const path of argv._) {
		paths.push(resolve(path.toString()));
	}
	return paths;
}

function* workerDispatcher(paths: string[]): Generator<Promise<PatchingResult | undefined>>{
	for(const path of paths){
		yield spawnWorker(path, {
			dryRun: argv["dry-run"],
			inPlace: argv["in-place"],
			backup: argv.backup,
			clearXA: argv["clear-xa"],
			sign: argv.sign
		});
	}
}

if(!argv._.length && !argv.directories.length){
	console.error("You must specify at least a path to a library as argument!");
	Deno.exit(1);
}

if(argv.jobs <= 0){
	console.error("The number of jobs to spawn must be a positive integer greater than zero!");
	Deno.exit(1);
}

if (argv["dry-run"])
	console.log("Warning!\nDry run is active! No files will be actually patched!\n");

const paths = await filePaths();
await parallelizer(workerDispatcher(paths), argv.jobs);

