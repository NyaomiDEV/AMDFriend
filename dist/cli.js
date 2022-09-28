#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const _1 = require(".");
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const parallelizer_1 = require("./parallelizer");
const os_1 = require("os");
const utils_1 = require("./utils");
const argv = yargs_1.default(helpers_1.hideBin(process.argv))
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
    default: os_1.cpus().length
})
    .help()
    .argv;
async function patchPromise(originalFilePath, options) {
    console.log(`Analyzing and patching file: ${originalFilePath}`);
    const p = await _1.patchFile(originalFilePath, options);
    if (p) {
        if (options.clearXA)
            await _1.clearXAFile(p.patchedPath, argv["dry-run"]);
        if (options.sign)
            await _1.signFile(p.patchedPath, argv["dry-run"]);
        console.log(`Routines found for ${originalFilePath}:`);
        console.log(p.patchedRoutines
            .map(x => `- <${x.bytes.toString("hex").toUpperCase().match(/.{1,2}/g).join(" ")}> at offset ${x.offset} (Hex: ${x.offset.toString(16)})`)
            .join("\n"));
        console.log(`File ${originalFilePath} was patched.`);
        console.log(`Patched file location: ${p.patchedPath}`);
    }
    console.log(`Finished processing file: ${originalFilePath}`);
}
function* promiseGen() {
    if (argv.directories) {
        for (const dirPath of argv.directories) {
            for (const dirent of utils_1.walkDirectory(dirPath, ["", ".dylib"], [".DS_Store"])) {
                const originalFilePath = path_1.resolve(dirent.name);
                yield patchPromise(originalFilePath, {
                    dryRun: argv["dry-run"],
                    inPlace: argv["in-place"],
                    backup: argv.backup,
                    clearXA: argv["clear-xa"],
                    sign: argv.sign
                });
            }
        }
    }
    for (const path of argv._) {
        const originalFilePath = path_1.resolve(path.toString());
        yield patchPromise(originalFilePath, {
            dryRun: argv["dry-run"],
            inPlace: argv["in-place"],
            backup: argv.backup,
            clearXA: argv["clear-xa"],
            sign: argv.sign
        });
    }
}
(async () => {
    if (!argv._.length && !argv.directories.length) {
        console.error("You must specify at least a path to a library as argument!");
        process.exit(1);
    }
    if (argv.jobs <= 0) {
        console.error("The number of jobs to spawn must be a positive integer greater than zero!");
        process.exit(1);
    }
    if (argv["dry-run"])
        console.log("\n\nWarning!\nDry run is active! No files will be actually patched!\n");
    await parallelizer_1.parallelizer(promiseGen(), argv.jobs);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQkFBK0I7QUFDL0Isd0JBQXFEO0FBQ3JELGtEQUEwQjtBQUMxQiwyQ0FBd0M7QUFDeEMsaURBQThDO0FBQzlDLDJCQUEwQjtBQUMxQixtQ0FBd0M7QUFJeEMsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLGlCQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZDLFVBQVUsQ0FBQyxXQUFXLENBQUM7S0FDdkIsS0FBSyxDQUFDLDJEQUEyRCxDQUFDO0tBQ2xFLE1BQU0sQ0FBQyxVQUFVLEVBQUU7SUFDbkIsS0FBSyxFQUFFLEdBQUc7SUFDVixRQUFRLEVBQUUsaUhBQWlIO0lBQzNILFlBQVksRUFBRSxLQUFLO0lBQ25CLElBQUksRUFBRSxTQUFTO0lBQ2YsT0FBTyxFQUFFLEtBQUs7Q0FDZCxDQUFDO0tBQ0QsTUFBTSxDQUFDLFNBQVMsRUFBRTtJQUNsQixLQUFLLEVBQUUsR0FBRztJQUNWLFFBQVEsRUFBRSxrRUFBa0U7SUFDNUUsWUFBWSxFQUFFLEtBQUs7SUFDbkIsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsS0FBSztDQUNkLENBQUM7S0FDRCxNQUFNLENBQUMsUUFBUSxFQUFFO0lBQ2pCLEtBQUssRUFBRSxHQUFHO0lBQ1YsUUFBUSxFQUFFLG9JQUFvSTtJQUM5SSxZQUFZLEVBQUUsS0FBSztJQUNuQixJQUFJLEVBQUUsU0FBUztJQUNmLE9BQU8sRUFBRSxLQUFLO0lBQ2QsT0FBTyxFQUFFLFVBQVU7Q0FDbkIsQ0FBQztLQUNELE1BQU0sQ0FBQyxNQUFNLEVBQUU7SUFDZixLQUFLLEVBQUUsR0FBRztJQUNWLFFBQVEsRUFBRSx1REFBdUQ7SUFDakUsWUFBWSxFQUFFLEtBQUs7SUFDbkIsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsS0FBSztDQUNkLENBQUM7S0FDRCxN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QUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNsZWFyWEFGaWxlLCBwYXRjaEZpbGUsIHNpZ25GaWxlIH0gZnJvbSBcIi5cIjtcbmltcG9ydCB5YXJncyBmcm9tIFwieWFyZ3NcIjtcbmltcG9ydCB7IGhpZGVCaW4gfSBmcm9tIFwieWFyZ3MvaGVscGVyc1wiO1xuaW1wb3J0IHsgcGFyYWxsZWxpemVyIH0gZnJvbSBcIi4vcGFyYWxsZWxpemVyXCI7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSBcIm9zXCI7XG5pbXBvcnQgeyB3YWxrRGlyZWN0b3J5IH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFBhdGNoT3B0aW9ucyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8vIEFyZ3VtZW50IGRlZmluaWl0b24gYW5kIHBhcnNpbmdcbmNvbnN0IGFyZ3YgPSB5YXJncyhoaWRlQmluKHByb2Nlc3MuYXJndikpXG5cdC5zY3JpcHROYW1lKFwiYW1kZnJpZW5kXCIpXG5cdC51c2FnZShcIiQwIFthcmdzXSA8cGF0aC90by9saWJyYXJ5PiBbLi4uL3BhdGgvdG8vb3RoZXIvbGlicmFyaWVzXVwiKVxuXHQub3B0aW9uKFwiaW4tcGxhY2VcIiwge1xuXHRcdGFsaWFzOiBcImlcIixcblx0XHRkZXNjcmliZTogXCJEaXJlY3RseSBwYXRjaCB0aGUgbGlicmFyeSwgYXMgb3Bwb3NlZCB0byBjcmVhdGluZyBhIHBhdGNoZWQgbGlicmFyeSB3aXRoIGAucGF0Y2hlZGAgYXBwZW5kZWQgdG8gdGhlIGZpbGUgbmFtZS5cIixcblx0XHRkZW1hbmRPcHRpb246IGZhbHNlLFxuXHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdGRlZmF1bHQ6IGZhbHNlXG5cdH0pXG5cdC5vcHRpb24oXCJkcnktcnVuXCIsIHtcblx0XHRhbGlhczogXCJkXCIsXG5cdFx0ZGVzY3JpYmU6IFwiRG8gYWxsIGNoZWNraW5nIGFuZCBwYXRjaGluZywgYnV0IERPIE5PVCB3cml0ZSBhbnl0aGluZyB0byBkaXNrLlwiLFxuXHRcdGRlbWFuZE9wdGlvbjogZmFsc2UsXG5cdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0ZGVmYXVsdDogZmFsc2Vcblx0fSlcblx0Lm9wdGlvbihcImJhY2t1cFwiLCB7XG5cdFx0YWxpYXM6IFwiYlwiLFxuXHRcdGRlc2NyaWJlOiBcIk9ubHkgd29ya3MgaW4gY29uanVuY3Rpb24gd2l0aCBgLS1pbi1wbGFjZWA7IGl0IGJhY2tzIHVwIHRoZSBvcmlnaW5hbCBsaWJyYXJ5IGJ5IGNvcHlpbmcgaXQgYW5kIGFwcGVuZGluZyBgLmJha2Agb24gaXRzIGV4dGVuc2lvbi5cIixcblx0XHRkZW1hbmRPcHRpb246IGZhbHNlLFxuXHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdGRlZmF1bHQ6IGZhbHNlLFxuXHRcdGltcGxpZXM6IFwiaW4tcGxhY2VcIlxuXHR9KVxuXHQub3B0aW9uKFwic2lnblwiLCB7XG5cdFx0YWxpYXM6IFwic1wiLFxuXHRcdGRlc2NyaWJlOiBcIkF1dG9tYXRpY2FsbHkgaW52b2tlIGBjb2Rlc2lnbmAgb24gcGF0Y2hlZCBsaWJyYXJpZXMuXCIsXG5cdFx0ZGVtYW5kT3B0aW9uOiBmYWxzZSxcblx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRkZWZhdWx0OiBmYWxzZVxuXHR9KVxuXHQub3B0aW9uKFwiY2xlYXIteGFcIiwge1xuXHRcdGFsaWFzOiBcImNcIixcblx0XHRkZXNjcmliZTogXCJBdXRvbWF0aWNhbGx5IGNsZWFyIGV4dGVuZGVkIGF0dHJpYnV0ZXMgb24gcGF0Y2hlZCBsaWJyYXJpZXMuXCIsXG5cdFx0ZGVtYW5kT3B0aW9uOiBmYWxzZSxcblx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRkZWZhdWx0OiB0cnVlXG5cdH0pXG5cdC5vcHRpb24oXCJkaXJlY3Rvcmllc1wiLCB7XG5cdFx0YWxpYXM6IFwiRFwiLFxuXHRcdGRlc2NyaWJlOiBcIlNjYW4gZGlyZWN0b3JpZXMgYWxvbmdzaWRlIGZpbGVzLiBJdCB3aWxsIHNlYXJjaCBmb3IgYW55IGZpbGUgd2l0aCBubyBleHRlbnNpb24gYW5kIHdpdGggZXh0ZW5zaW9uIGAuZHlsaWJgLCBhcyB0aGV5IGFyZSB0aGUgY29tbW9uIG9uZXMgdG8gcGF0Y2guXCIsXG5cdFx0ZGVtYW5kT3B0aW9uOiBmYWxzZSxcblx0XHR0eXBlOiBcImFycmF5XCIsXG5cdFx0ZGVmYXVsdDogW11cblx0fSlcblx0Lm9wdGlvbihcImpvYnNcIiwge1xuXHRcdGFsaWFzOiBcImpcIixcblx0XHRkZXNjcmliZTogXCJUaGUgbnVtYmVyIG9mIGpvYnMgdGhhdCB3aWxsIGJlIHNwYXduZWQgdG8gcHJvY2VzcyB0aGUgbGlicmFyaWVzLlwiLFxuXHRcdGRlbWFuZE9wdGlvbjogZmFsc2UsXG5cdFx0dHlwZTogXCJudW1iZXJcIixcblx0XHRkZWZhdWx0OiBjcHVzKCkubGVuZ3RoXG5cdH0pXG5cdC5oZWxwKClcblx0LmFyZ3YgYXMge1xuXHRcdCQwOiBzdHJpbmcsXG5cdFx0XzogKHN0cmluZ3xudW1iZXIpW10sXG5cdFx0W3g6IHN0cmluZ106IGFueVxuXHR9O1xuXG4vLyBDTEkgQ09ERVxuYXN5bmMgZnVuY3Rpb24gcGF0Y2hQcm9taXNlKG9yaWdpbmFsRmlsZVBhdGg6IHN0cmluZywgb3B0aW9uczogUGF0Y2hPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG5cdGNvbnNvbGUubG9nKGBBbmFseXppbmcgYW5kIHBhdGNoaW5nIGZpbGU6ICR7b3JpZ2luYWxGaWxlUGF0aH1gKTtcblx0Y29uc3QgcCA9IGF3YWl0IHBhdGNoRmlsZShvcmlnaW5hbEZpbGVQYXRoLCBvcHRpb25zKTtcblxuXHRpZiAocCkge1xuXG5cdFx0aWYgKG9wdGlvbnMuY2xlYXJYQSlcblx0XHRcdGF3YWl0IGNsZWFyWEFGaWxlKHAucGF0Y2hlZFBhdGgsIGFyZ3ZbXCJkcnktcnVuXCJdKTtcblx0XG5cdFx0aWYgKG9wdGlvbnMuc2lnbilcblx0XHRcdGF3YWl0IHNpZ25GaWxlKHAucGF0Y2hlZFBhdGgsIGFyZ3ZbXCJkcnktcnVuXCJdKTtcblxuXHRcdGNvbnNvbGUubG9nKGBSb3V0aW5lcyBmb3VuZCBmb3IgJHtvcmlnaW5hbEZpbGVQYXRofTpgKTtcblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdHAucGF0Y2hlZFJvdXRpbmVzXG5cdFx0XHRcdC5tYXAoeCA9PiBgLSA8JHt4LmJ5dGVzLnRvU3RyaW5nKFwiaGV4XCIpLnRvVXBwZXJDYXNlKCkubWF0Y2goLy57MSwyfS9nKSEuam9pbihcIiBcIil9PiBhdCBvZmZzZXQgJHt4Lm9mZnNldH0gKEhleDogJHt4Lm9mZnNldC50b1N0cmluZygxNil9KWApXG5cdFx0XHRcdC5qb2luKFwiXFxuXCIpXG5cdFx0KTtcblxuXHRcdGNvbnNvbGUubG9nKGBGaWxlICR7b3JpZ2luYWxGaWxlUGF0aH0gd2FzIHBhdGNoZWQuYCk7XG5cdFx0Y29uc29sZS5sb2coYFBhdGNoZWQgZmlsZSBsb2NhdGlvbjogJHtwLnBhdGNoZWRQYXRofWApO1xuXG5cdH1cblxuXHRjb25zb2xlLmxvZyhgRmluaXNoZWQgcHJvY2Vzc2luZyBmaWxlOiAke29yaWdpbmFsRmlsZVBhdGh9YCk7XG59XG5cbmZ1bmN0aW9uKiBwcm9taXNlR2VuKCk6IEdlbmVyYXRvcjxQcm9taXNlPHZvaWQ+PiB7XG5cdGlmIChhcmd2LmRpcmVjdG9yaWVzKSB7XG5cdFx0Zm9yIChjb25zdCBkaXJQYXRoIG9mIGFyZ3YuZGlyZWN0b3JpZXMpIHtcblx0XHRcdGZvciAoY29uc3QgZGlyZW50IG9mIHdhbGtEaXJlY3RvcnkoZGlyUGF0aCwgW1wiXCIsIFwiLmR5bGliXCJdLCBbXCIuRFNfU3RvcmVcIl0pKSB7XG5cdFx0XHRcdGNvbnN0IG9yaWdpbmFsRmlsZVBhdGggPSByZXNvbHZlKGRpcmVudC5uYW1lKTtcblx0XHRcdFx0eWllbGQgcGF0Y2hQcm9taXNlKFxuXHRcdFx0XHRcdG9yaWdpbmFsRmlsZVBhdGgsXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZHJ5UnVuOiBhcmd2W1wiZHJ5LXJ1blwiXSxcblx0XHRcdFx0XHRcdGluUGxhY2U6IGFyZ3ZbXCJpbi1wbGFjZVwiXSxcblx0XHRcdFx0XHRcdGJhY2t1cDogYXJndi5iYWNrdXAsXG5cdFx0XHRcdFx0XHRjbGVhclhBOiBhcmd2W1wiY2xlYXIteGFcIl0sXG5cdFx0XHRcdFx0XHRzaWduOiBhcmd2LnNpZ25cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZvciAoY29uc3QgcGF0aCBvZiBhcmd2Ll8pIHtcblx0XHRjb25zdCBvcmlnaW5hbEZpbGVQYXRoID0gcmVzb2x2ZShwYXRoLnRvU3RyaW5nKCkpO1xuXHRcdHlpZWxkIHBhdGNoUHJvbWlzZShcblx0XHRcdG9yaWdpbmFsRmlsZVBhdGgsXG5cdFx0XHR7XG5cdFx0XHRcdGRyeVJ1bjogYXJndltcImRyeS1ydW5cIl0sXG5cdFx0XHRcdGluUGxhY2U6IGFyZ3ZbXCJpbi1wbGFjZVwiXSxcblx0XHRcdFx0YmFja3VwOiBhcmd2LmJhY2t1cCxcblx0XHRcdFx0Y2xlYXJYQTogYXJndltcImNsZWFyLXhhXCJdLFxuXHRcdFx0XHRzaWduOiBhcmd2LnNpZ25cblx0XHRcdH1cblx0XHQpO1xuXHR9XG59XG5cbihhc3luYyAoKSA9PiB7XG5cdGlmKCFhcmd2Ll8ubGVuZ3RoICYmICFhcmd2LmRpcmVjdG9yaWVzLmxlbmd0aCl7XG5cdFx0Y29uc29sZS5lcnJvcihcIllvdSBtdXN0IHNwZWNpZnkgYXQgbGVhc3QgYSBwYXRoIHRvIGEgbGlicmFyeSBhcyBhcmd1bWVudCFcIik7XG5cdFx0cHJvY2Vzcy5leGl0KDEpO1xuXHR9XG5cblx0aWYoYXJndi5qb2JzIDw9IDApe1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJUaGUgbnVtYmVyIG9mIGpvYnMgdG8gc3Bhd24gbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIgZ3JlYXRlciB0aGFuIHplcm8hXCIpO1xuXHRcdHByb2Nlc3MuZXhpdCgxKTtcblx0fVxuXG5cdGlmIChhcmd2W1wiZHJ5LXJ1blwiXSlcblx0XHRjb25zb2xlLmxvZyhcIlxcblxcbldhcm5pbmchXFxuRHJ5IHJ1biBpcyBhY3RpdmUhIE5vIGZpbGVzIHdpbGwgYmUgYWN0dWFsbHkgcGF0Y2hlZCFcXG5cIik7XG5cblx0YXdhaXQgcGFyYWxsZWxpemVyKHByb21pc2VHZW4oKSwgYXJndi5qb2JzKTtcbn0pKCk7XG4iXX0=