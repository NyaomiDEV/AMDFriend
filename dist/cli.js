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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQkFBK0I7QUFDL0Isd0JBQThCO0FBQzlCLGtEQUEwQjtBQUMxQiwyQ0FBd0M7QUFDeEMsaURBQThDO0FBQzlDLDJCQUEwQjtBQUMxQixtQ0FBd0M7QUFJeEMsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLGlCQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZDLFVBQVUsQ0FBQyxXQUFXLENBQUM7S0FDdkIsS0FBSyxDQUFDLDJEQUEyRCxDQUFDO0tBQ2xFLE1BQU0sQ0FBQyxVQUFVLEVBQUU7SUFDbkIsS0FBSyxFQUFFLEdBQUc7SUFDVixRQUFRLEVBQUUsaUhBQWlIO0lBQzNILFlBQVksRUFBRSxLQUFLO0lBQ25CLElBQUksRUFBRSxTQUFTO0lBQ2YsT0FBTyxFQUFFLEtBQUs7Q0FDZCxDQUFDO0tBQ0QsTUFBTSxDQUFDLFNBQVMsRUFBRTtJQUNsQixLQUFLLEVBQUUsR0FBRztJQUNWLFFBQVEsRUFBRSxrRUFBa0U7SUFDNUUsWUFBWSxFQUFFLEtBQUs7SUFDbkIsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsS0FBSztDQUNkLENBQUM7S0FDRCxNQUFNLENBQUMsUUFBUSxFQUFFO0lBQ2pCLEtBQUssRUFBRSxHQUFHO0lBQ1YsUUFBUSxFQUFFLG9JQUFvSTtJQUM5SSxZQUFZLEVBQUUsS0FBSztJQUNuQixJQUFJLEVBQUUsU0FBUztJQUNmLE9BQU8sRUFBRSxLQUFLO0lBQ2QsT0FBTyxFQUFFLFVBQVU7Q0FDbkIsQ0FBQztLQUNELE1BQU0sQ0FBQyxNQUFNLEVBQUU7SUFDZixLQUFLLEVBQUUsR0FBRztJQUNWLFFBQVEsRUFBRSx1REFBdUQ7SUFDakUsWUFBWSxFQUFFLEtBQUs7SUFDbkIsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsS0FBSztDQUNkLENBQUM7S0FDRCxN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LFlBQVksQ0FDakIsZ0JBQWdCLEVBQ2hCO1lBQ0MsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDdkIsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDekIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3pCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNmLENBQ0QsQ0FBQztLQUNGO0FBQ0YsQ0FBQztBQUVELENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDWCxJQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBQztRQUM3QyxPQUFPLENBQUMsS0FBSyxDQUFDLDREQUE0RCxDQUFDLENBQUM7UUFDNUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtJQUVELElBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUM7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQywyRUFBMkUsQ0FBQyxDQUFDO1FBQzNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7SUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO0lBRXRGLE1BQU0sMkJBQVksQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcGF0Y2hGaWxlIH0gZnJvbSBcIi5cIjtcbmltcG9ydCB5YXJncyBmcm9tIFwieWFyZ3NcIjtcbmltcG9ydCB7IGhpZGVCaW4gfSBmcm9tIFwieWFyZ3MvaGVscGVyc1wiO1xuaW1wb3J0IHsgcGFyYWxsZWxpemVyIH0gZnJvbSBcIi4vcGFyYWxsZWxpemVyXCI7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSBcIm9zXCI7XG5pbXBvcnQgeyB3YWxrRGlyZWN0b3J5IH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFBhdGNoT3B0aW9ucyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8vIEFyZ3VtZW50IGRlZmluaWl0b24gYW5kIHBhcnNpbmdcbmNvbnN0IGFyZ3YgPSB5YXJncyhoaWRlQmluKHByb2Nlc3MuYXJndikpXG5cdC5zY3JpcHROYW1lKFwiYW1kZnJpZW5kXCIpXG5cdC51c2FnZShcIiQwIFthcmdzXSA8cGF0aC90by9saWJyYXJ5PiBbLi4uL3BhdGgvdG8vb3RoZXIvbGlicmFyaWVzXVwiKVxuXHQub3B0aW9uKFwiaW4tcGxhY2VcIiwge1xuXHRcdGFsaWFzOiBcImlcIixcblx0XHRkZXNjcmliZTogXCJEaXJlY3RseSBwYXRjaCB0aGUgbGlicmFyeSwgYXMgb3Bwb3NlZCB0byBjcmVhdGluZyBhIHBhdGNoZWQgbGlicmFyeSB3aXRoIGAucGF0Y2hlZGAgYXBwZW5kZWQgdG8gdGhlIGZpbGUgbmFtZS5cIixcblx0XHRkZW1hbmRPcHRpb246IGZhbHNlLFxuXHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdGRlZmF1bHQ6IGZhbHNlXG5cdH0pXG5cdC5vcHRpb24oXCJkcnktcnVuXCIsIHtcblx0XHRhbGlhczogXCJkXCIsXG5cdFx0ZGVzY3JpYmU6IFwiRG8gYWxsIGNoZWNraW5nIGFuZCBwYXRjaGluZywgYnV0IERPIE5PVCB3cml0ZSBhbnl0aGluZyB0byBkaXNrLlwiLFxuXHRcdGRlbWFuZE9wdGlvbjogZmFsc2UsXG5cdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0ZGVmYXVsdDogZmFsc2Vcblx0fSlcblx0Lm9wdGlvbihcImJhY2t1cFwiLCB7XG5cdFx0YWxpYXM6IFwiYlwiLFxuXHRcdGRlc2NyaWJlOiBcIk9ubHkgd29ya3MgaW4gY29uanVuY3Rpb24gd2l0aCBgLS1pbi1wbGFjZWA7IGl0IGJhY2tzIHVwIHRoZSBvcmlnaW5hbCBsaWJyYXJ5IGJ5IGNvcHlpbmcgaXQgYW5kIGFwcGVuZGluZyBgLmJha2Agb24gaXRzIGV4dGVuc2lvbi5cIixcblx0XHRkZW1hbmRPcHRpb246IGZhbHNlLFxuXHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdGRlZmF1bHQ6IGZhbHNlLFxuXHRcdGltcGxpZXM6IFwiaW4tcGxhY2VcIlxuXHR9KVxuXHQub3B0aW9uKFwic2lnblwiLCB7XG5cdFx0YWxpYXM6IFwic1wiLFxuXHRcdGRlc2NyaWJlOiBcIkF1dG9tYXRpY2FsbHkgaW52b2tlIGBjb2Rlc2lnbmAgb24gcGF0Y2hlZCBsaWJyYXJpZXMuXCIsXG5cdFx0ZGVtYW5kT3B0aW9uOiBmYWxzZSxcblx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRkZWZhdWx0OiBmYWxzZVxuXHR9KVxuXHQub3B0aW9uKFwiY2xlYXIteGFcIiwge1xuXHRcdGFsaWFzOiBcImNcIixcblx0XHRkZXNjcmliZTogXCJBdXRvbWF0aWNhbGx5IGNsZWFyIGV4dGVuZGVkIGF0dHJpYnV0ZXMgb24gcGF0Y2hlZCBsaWJyYXJpZXMuXCIsXG5cdFx0ZGVtYW5kT3B0aW9uOiBmYWxzZSxcblx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRkZWZhdWx0OiB0cnVlXG5cdH0pXG5cdC5vcHRpb24oXCJkaXJlY3Rvcmllc1wiLCB7XG5cdFx0YWxpYXM6IFwiRFwiLFxuXHRcdGRlc2NyaWJlOiBcIlNjYW4gZGlyZWN0b3JpZXMgYWxvbmdzaWRlIGZpbGVzLiBJdCB3aWxsIHNlYXJjaCBmb3IgYW55IGZpbGUgd2l0aCBubyBleHRlbnNpb24gYW5kIHdpdGggZXh0ZW5zaW9uIGAuZHlsaWJgLCBhcyB0aGV5IGFyZSB0aGUgY29tbW9uIG9uZXMgdG8gcGF0Y2guXCIsXG5cdFx0ZGVtYW5kT3B0aW9uOiBmYWxzZSxcblx0XHR0eXBlOiBcImFycmF5XCIsXG5cdFx0ZGVmYXVsdDogW11cblx0fSlcblx0Lm9wdGlvbihcImpvYnNcIiwge1xuXHRcdGFsaWFzOiBcImpcIixcblx0XHRkZXNjcmliZTogXCJUaGUgbnVtYmVyIG9mIGpvYnMgdGhhdCB3aWxsIGJlIHNwYXduZWQgdG8gcHJvY2VzcyB0aGUgbGlicmFyaWVzLlwiLFxuXHRcdGRlbWFuZE9wdGlvbjogZmFsc2UsXG5cdFx0dHlwZTogXCJudW1iZXJcIixcblx0XHRkZWZhdWx0OiBjcHVzKCkubGVuZ3RoXG5cdH0pXG5cdC5oZWxwKClcblx0LmFyZ3YgYXMge1xuXHRcdCQwOiBzdHJpbmcsXG5cdFx0XzogKHN0cmluZ3xudW1iZXIpW10sXG5cdFx0W3g6IHN0cmluZ106IGFueVxuXHR9O1xuXG4vLyBDTEkgQ09ERVxuYXN5bmMgZnVuY3Rpb24gcGF0Y2hQcm9taXNlKG9yaWdpbmFsRmlsZVBhdGg6IHN0cmluZywgb3B0aW9uczogUGF0Y2hPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG5cdGNvbnNvbGUubG9nKGBBbmFseXppbmcgYW5kIHBhdGNoaW5nIGZpbGU6ICR7b3JpZ2luYWxGaWxlUGF0aH1gKTtcblx0Y29uc3QgcCA9IGF3YWl0IHBhdGNoRmlsZShvcmlnaW5hbEZpbGVQYXRoLCBvcHRpb25zKTtcblxuXHRpZiAocCkge1xuXG5cdFx0Y29uc29sZS5sb2coYFJvdXRpbmVzIGZvdW5kIGZvciAke29yaWdpbmFsRmlsZVBhdGh9OmApO1xuXHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0cC5wYXRjaGVkUm91dGluZXNcblx0XHRcdFx0Lm1hcCh4ID0+IGAtIDwke3guYnl0ZXMudG9TdHJpbmcoXCJoZXhcIikudG9VcHBlckNhc2UoKS5tYXRjaCgvLnsxLDJ9L2cpIS5qb2luKFwiIFwiKX0+IGF0IG9mZnNldCAke3gub2Zmc2V0fSAoSGV4OiAke3gub2Zmc2V0LnRvU3RyaW5nKDE2KX0pYClcblx0XHRcdFx0LmpvaW4oXCJcXG5cIilcblx0XHQpO1xuXG5cdFx0Y29uc29sZS5sb2coYEZpbGUgJHtvcmlnaW5hbEZpbGVQYXRofSB3YXMgcGF0Y2hlZC5gKTtcblx0XHRjb25zb2xlLmxvZyhgUGF0Y2hlZCBmaWxlIGxvY2F0aW9uOiAke3AucGF0Y2hlZFBhdGh9YCk7XG5cblx0fVxuXG5cdGNvbnNvbGUubG9nKGBGaW5pc2hlZCBwcm9jZXNzaW5nIGZpbGU6ICR7b3JpZ2luYWxGaWxlUGF0aH1gKTtcbn1cblxuZnVuY3Rpb24qIHByb21pc2VHZW4oKTogR2VuZXJhdG9yPFByb21pc2U8dm9pZD4+IHtcblx0aWYgKGFyZ3YuZGlyZWN0b3JpZXMpIHtcblx0XHRmb3IgKGNvbnN0IGRpclBhdGggb2YgYXJndi5kaXJlY3Rvcmllcykge1xuXHRcdFx0Zm9yIChjb25zdCBkaXJlbnQgb2Ygd2Fsa0RpcmVjdG9yeShkaXJQYXRoLCBbXCJcIiwgXCIuZHlsaWJcIl0sIFtcIi5EU19TdG9yZVwiXSkpIHtcblx0XHRcdFx0Y29uc3Qgb3JpZ2luYWxGaWxlUGF0aCA9IHJlc29sdmUoZGlyZW50Lm5hbWUpO1xuXHRcdFx0XHR5aWVsZCBwYXRjaFByb21pc2UoXG5cdFx0XHRcdFx0b3JpZ2luYWxGaWxlUGF0aCxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRkcnlSdW46IGFyZ3ZbXCJkcnktcnVuXCJdLFxuXHRcdFx0XHRcdFx0aW5QbGFjZTogYXJndltcImluLXBsYWNlXCJdLFxuXHRcdFx0XHRcdFx0YmFja3VwOiBhcmd2LmJhY2t1cCxcblx0XHRcdFx0XHRcdGNsZWFyWEE6IGFyZ3ZbXCJjbGVhci14YVwiXSxcblx0XHRcdFx0XHRcdHNpZ246IGFyZ3Yuc2lnblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Zm9yIChjb25zdCBwYXRoIG9mIGFyZ3YuXykge1xuXHRcdGNvbnN0IG9yaWdpbmFsRmlsZVBhdGggPSByZXNvbHZlKHBhdGgudG9TdHJpbmcoKSk7XG5cdFx0eWllbGQgcGF0Y2hQcm9taXNlKFxuXHRcdFx0b3JpZ2luYWxGaWxlUGF0aCxcblx0XHRcdHtcblx0XHRcdFx0ZHJ5UnVuOiBhcmd2W1wiZHJ5LXJ1blwiXSxcblx0XHRcdFx0aW5QbGFjZTogYXJndltcImluLXBsYWNlXCJdLFxuXHRcdFx0XHRiYWNrdXA6IGFyZ3YuYmFja3VwLFxuXHRcdFx0XHRjbGVhclhBOiBhcmd2W1wiY2xlYXIteGFcIl0sXG5cdFx0XHRcdHNpZ246IGFyZ3Yuc2lnblxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cbn1cblxuKGFzeW5jICgpID0+IHtcblx0aWYoIWFyZ3YuXy5sZW5ndGggJiYgIWFyZ3YuZGlyZWN0b3JpZXMubGVuZ3RoKXtcblx0XHRjb25zb2xlLmVycm9yKFwiWW91IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBhIHBhdGggdG8gYSBsaWJyYXJ5IGFzIGFyZ3VtZW50IVwiKTtcblx0XHRwcm9jZXNzLmV4aXQoMSk7XG5cdH1cblxuXHRpZihhcmd2LmpvYnMgPD0gMCl7XG5cdFx0Y29uc29sZS5lcnJvcihcIlRoZSBudW1iZXIgb2Ygam9icyB0byBzcGF3biBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlciBncmVhdGVyIHRoYW4gemVybyFcIik7XG5cdFx0cHJvY2Vzcy5leGl0KDEpO1xuXHR9XG5cblx0aWYgKGFyZ3ZbXCJkcnktcnVuXCJdKVxuXHRcdGNvbnNvbGUubG9nKFwiXFxuXFxuV2FybmluZyFcXG5EcnkgcnVuIGlzIGFjdGl2ZSEgTm8gZmlsZXMgd2lsbCBiZSBhY3R1YWxseSBwYXRjaGVkIVxcblwiKTtcblxuXHRhd2FpdCBwYXJhbGxlbGl6ZXIocHJvbWlzZUdlbigpLCBhcmd2LmpvYnMpO1xufSkoKTtcbiJdfQ==