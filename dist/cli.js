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
async function patchPromise(originalFilePath, dryRun, inPlace, backup, sign) {
    console.log(`Analyzing and patching file: ${originalFilePath}`);
    const p = await _1.patchFile(originalFilePath, dryRun, inPlace, backup);
    if (p) {
        if (sign)
            await _1.signFile(p.patchedPath, argv["dry-run"]);
        console.log(`Routines found for ${originalFilePath}:`);
        console.log(p.patchedRoutines.map(x => `- <${x.bytes.toString("hex").toUpperCase().match(/.{1,2}/g).join(" ")}> at offset ${x.offset} (Hex: ${x.offset.toString(16)})`).join("\n"));
        console.log(`File ${originalFilePath} was patched.`);
        console.log(`Patched file location: ${p.patchedPath}`);
    }
    console.log(`Finished processing file: ${originalFilePath}`);
}
function* promiseGen() {
    if (argv.directories) {
        for (const dirPath of argv.directories) {
            for (const path of utils_1.walkDirectory(dirPath, ["", ".dylib"], [".DS_Store"])) {
                const originalFilePath = path_1.resolve(path.toString());
                yield patchPromise(originalFilePath, argv["dry-run"], argv["in-place"], argv.backup, argv.sign);
            }
        }
    }
    for (const path of argv._) {
        const originalFilePath = path_1.resolve(path.toString());
        yield patchPromise(originalFilePath, argv["dry-run"], argv["in-place"], argv.backup, argv.sign);
    }
}
(async () => {
    if (!argv._[0] && !argv.directories) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQkFBK0I7QUFDL0Isd0JBQXdDO0FBQ3hDLGtEQUEwQjtBQUMxQiwyQ0FBd0M7QUFDeEMsaURBQThDO0FBQzlDLDJCQUEwQjtBQUMxQixtQ0FBd0M7QUFHeEMsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLGlCQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZDLFVBQVUsQ0FBQyxXQUFXLENBQUM7S0FDdkIsS0FBSyxDQUFDLDJEQUEyRCxDQUFDO0tBQ2xFLE1BQU0sQ0FBQyxVQUFVLEVBQUU7SUFDbkIsS0FBSyxFQUFFLEdBQUc7SUFDVixRQUFRLEVBQUUsaUhBQWlIO0lBQzNILFlBQVksRUFBRSxLQUFLO0lBQ25CLElBQUksRUFBRSxTQUFTO0lBQ2YsT0FBTyxFQUFFLEtBQUs7Q0FDZCxDQUFDO0tBQ0QsTUFBTSxDQUFDLFNBQVMsRUFBRTtJQUNsQixLQUFLLEVBQUUsR0FBRztJQUNWLFFBQVEsRUFBRSxrRUFBa0U7SUFDNUUsWUFBWSxFQUFFLEtBQUs7SUFDbkIsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsS0FBSztDQUNkLENBQUM7S0FDRCxNQUFNLENBQUMsUUFBUSxFQUFFO0lBQ2pCLEtBQUssRUFBRSxHQUFHO0lBQ1YsUUFBUSxFQUFFLG9JQUFvSTtJQUM5SSxZQUFZLEVBQUUsS0FBSztJQUNuQixJQUFJLEVBQUUsU0FBUztJQUNmLE9BQU8sRUFBRSxLQUFLO0lBQ2QsT0FBTyxFQUFFLFVBQVU7Q0FDbkIsQ0FBQztLQUNELE1BQU0sQ0FBQyxNQUFNLEVBQUU7SUFDZixLQUFLLEVBQUUsR0FBRztJQUNWLFFBQVEsRUFBRSx1REFBdUQ7SUFDakUsWUFBWSxFQUFFLEtBQUs7SUFDbkIsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsS0FBSztDQUNkLENBQUM7S0FDRCxN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QUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNoRztBQUNGLENBQUM7QUFFRCxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ1gsSUFBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFDO1FBQ2xDLE9BQU8sQ0FBQyxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQztRQUM1RSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0lBRUQsSUFBRyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBQztRQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLDJFQUEyRSxDQUFDLENBQUM7UUFDM0YsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtJQUVELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7SUFFdEYsTUFBTSwyQkFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxDQUFDLENBQUMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBwYXRjaEZpbGUsIHNpZ25GaWxlIH0gZnJvbSBcIi5cIjtcbmltcG9ydCB5YXJncyBmcm9tIFwieWFyZ3NcIjtcbmltcG9ydCB7IGhpZGVCaW4gfSBmcm9tIFwieWFyZ3MvaGVscGVyc1wiO1xuaW1wb3J0IHsgcGFyYWxsZWxpemVyIH0gZnJvbSBcIi4vcGFyYWxsZWxpemVyXCI7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSBcIm9zXCI7XG5pbXBvcnQgeyB3YWxrRGlyZWN0b3J5IH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuLy8gQXJndW1lbnQgZGVmaW5paXRvbiBhbmQgcGFyc2luZ1xuY29uc3QgYXJndiA9IHlhcmdzKGhpZGVCaW4ocHJvY2Vzcy5hcmd2KSlcblx0LnNjcmlwdE5hbWUoXCJhbWRmcmllbmRcIilcblx0LnVzYWdlKFwiJDAgW2FyZ3NdIDxwYXRoL3RvL2xpYnJhcnk+IFsuLi4vcGF0aC90by9vdGhlci9saWJyYXJpZXNdXCIpXG5cdC5vcHRpb24oXCJpbi1wbGFjZVwiLCB7XG5cdFx0YWxpYXM6IFwiaVwiLFxuXHRcdGRlc2NyaWJlOiBcIkRpcmVjdGx5IHBhdGNoIHRoZSBsaWJyYXJ5LCBhcyBvcHBvc2VkIHRvIGNyZWF0aW5nIGEgcGF0Y2hlZCBsaWJyYXJ5IHdpdGggYC5wYXRjaGVkYCBhcHBlbmRlZCB0byB0aGUgZmlsZSBuYW1lLlwiLFxuXHRcdGRlbWFuZE9wdGlvbjogZmFsc2UsXG5cdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0ZGVmYXVsdDogZmFsc2Vcblx0fSlcblx0Lm9wdGlvbihcImRyeS1ydW5cIiwge1xuXHRcdGFsaWFzOiBcImRcIixcblx0XHRkZXNjcmliZTogXCJEbyBhbGwgY2hlY2tpbmcgYW5kIHBhdGNoaW5nLCBidXQgRE8gTk9UIHdyaXRlIGFueXRoaW5nIHRvIGRpc2suXCIsXG5cdFx0ZGVtYW5kT3B0aW9uOiBmYWxzZSxcblx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRkZWZhdWx0OiBmYWxzZVxuXHR9KVxuXHQub3B0aW9uKFwiYmFja3VwXCIsIHtcblx0XHRhbGlhczogXCJiXCIsXG5cdFx0ZGVzY3JpYmU6IFwiT25seSB3b3JrcyBpbiBjb25qdW5jdGlvbiB3aXRoIGAtLWluLXBsYWNlYDsgaXQgYmFja3MgdXAgdGhlIG9yaWdpbmFsIGxpYnJhcnkgYnkgY29weWluZyBpdCBhbmQgYXBwZW5kaW5nIGAuYmFrYCBvbiBpdHMgZXh0ZW5zaW9uLlwiLFxuXHRcdGRlbWFuZE9wdGlvbjogZmFsc2UsXG5cdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0ZGVmYXVsdDogZmFsc2UsXG5cdFx0aW1wbGllczogXCJpbi1wbGFjZVwiXG5cdH0pXG5cdC5vcHRpb24oXCJzaWduXCIsIHtcblx0XHRhbGlhczogXCJzXCIsXG5cdFx0ZGVzY3JpYmU6IFwiQXV0b21hdGljYWxseSBpbnZva2UgYGNvZGVzaWduYCBvbiBwYXRjaGVkIGxpYnJhcmllcy5cIixcblx0XHRkZW1hbmRPcHRpb246IGZhbHNlLFxuXHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdGRlZmF1bHQ6IGZhbHNlXG5cdH0pXG5cdC5vcHRpb24oXCJkaXJlY3Rvcmllc1wiLCB7XG5cdFx0YWxpYXM6IFwiRFwiLFxuXHRcdGRlc2NyaWJlOiBcIlNjYW4gZGlyZWN0b3JpZXMgYWxvbmdzaWRlIGZpbGVzLiBJdCB3aWxsIHNlYXJjaCBmb3IgYW55IGZpbGUgd2l0aCBubyBleHRlbnNpb24gYW5kIHdpdGggZXh0ZW5zaW9uIGAuZHlsaWJgLCBhcyB0aGV5IGFyZSB0aGUgY29tbW9uIG9uZXMgdG8gcGF0Y2guXCIsXG5cdFx0ZGVtYW5kT3B0aW9uOiBmYWxzZSxcblx0XHR0eXBlOiBcImFycmF5XCIsXG5cdFx0ZGVmYXVsdDogW11cblx0fSlcblx0Lm9wdGlvbihcImpvYnNcIiwge1xuXHRcdGFsaWFzOiBcImpcIixcblx0XHRkZXNjcmliZTogXCJUaGUgbnVtYmVyIG9mIGpvYnMgdGhhdCB3aWxsIGJlIHNwYXduZWQgdG8gcHJvY2VzcyB0aGUgbGlicmFyaWVzLlwiLFxuXHRcdGRlbWFuZE9wdGlvbjogZmFsc2UsXG5cdFx0dHlwZTogXCJudW1iZXJcIixcblx0XHRkZWZhdWx0OiBjcHVzKCkubGVuZ3RoXG5cdH0pXG5cdC5oZWxwKClcblx0LmFyZ3YgYXMge1xuXHRcdCQwOiBzdHJpbmcsXG5cdFx0XzogKHN0cmluZ3xudW1iZXIpW10sXG5cdFx0W3g6IHN0cmluZ106IGFueVxuXHR9O1xuXG4vLyBDTEkgQ09ERVxuYXN5bmMgZnVuY3Rpb24gcGF0Y2hQcm9taXNlKG9yaWdpbmFsRmlsZVBhdGg6IHN0cmluZywgZHJ5UnVuOiBib29sZWFuLCBpblBsYWNlOiBib29sZWFuLCBiYWNrdXA6IGJvb2xlYW4sIHNpZ246IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcblx0Y29uc29sZS5sb2coYEFuYWx5emluZyBhbmQgcGF0Y2hpbmcgZmlsZTogJHtvcmlnaW5hbEZpbGVQYXRofWApO1xuXHRjb25zdCBwID0gYXdhaXQgcGF0Y2hGaWxlKG9yaWdpbmFsRmlsZVBhdGgsIGRyeVJ1biwgaW5QbGFjZSwgYmFja3VwKTtcblx0aWYgKHApIHtcblx0XHRpZiAoc2lnbilcblx0XHRcdGF3YWl0IHNpZ25GaWxlKHAucGF0Y2hlZFBhdGgsIGFyZ3ZbXCJkcnktcnVuXCJdKTtcblx0XHRjb25zb2xlLmxvZyhgUm91dGluZXMgZm91bmQgZm9yICR7b3JpZ2luYWxGaWxlUGF0aH06YCk7XG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHRwLnBhdGNoZWRSb3V0aW5lcy5tYXAoeCA9PiBgLSA8JHt4LmJ5dGVzLnRvU3RyaW5nKFwiaGV4XCIpLnRvVXBwZXJDYXNlKCkubWF0Y2goLy57MSwyfS9nKSEuam9pbihcIiBcIil9PiBhdCBvZmZzZXQgJHt4Lm9mZnNldH0gKEhleDogJHt4Lm9mZnNldC50b1N0cmluZygxNil9KWApLmpvaW4oXCJcXG5cIilcblx0XHQpO1xuXHRcdGNvbnNvbGUubG9nKGBGaWxlICR7b3JpZ2luYWxGaWxlUGF0aH0gd2FzIHBhdGNoZWQuYCk7XG5cdFx0Y29uc29sZS5sb2coYFBhdGNoZWQgZmlsZSBsb2NhdGlvbjogJHtwLnBhdGNoZWRQYXRofWApO1xuXHR9XG5cdGNvbnNvbGUubG9nKGBGaW5pc2hlZCBwcm9jZXNzaW5nIGZpbGU6ICR7b3JpZ2luYWxGaWxlUGF0aH1gKTtcbn1cblxuZnVuY3Rpb24qIHByb21pc2VHZW4oKTogR2VuZXJhdG9yPFByb21pc2U8dm9pZD4+IHtcblx0aWYgKGFyZ3YuZGlyZWN0b3JpZXMpIHtcblx0XHRmb3IgKGNvbnN0IGRpclBhdGggb2YgYXJndi5kaXJlY3Rvcmllcykge1xuXHRcdFx0Zm9yIChjb25zdCBwYXRoIG9mIHdhbGtEaXJlY3RvcnkoZGlyUGF0aCwgW1wiXCIsIFwiLmR5bGliXCJdLCBbXCIuRFNfU3RvcmVcIl0pKSB7XG5cdFx0XHRcdGNvbnN0IG9yaWdpbmFsRmlsZVBhdGggPSByZXNvbHZlKHBhdGgudG9TdHJpbmcoKSk7XG5cdFx0XHRcdHlpZWxkIHBhdGNoUHJvbWlzZShvcmlnaW5hbEZpbGVQYXRoLCBhcmd2W1wiZHJ5LXJ1blwiXSwgYXJndltcImluLXBsYWNlXCJdLCBhcmd2LmJhY2t1cCwgYXJndi5zaWduKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Zm9yIChjb25zdCBwYXRoIG9mIGFyZ3YuXykge1xuXHRcdGNvbnN0IG9yaWdpbmFsRmlsZVBhdGggPSByZXNvbHZlKHBhdGgudG9TdHJpbmcoKSk7XG5cdFx0eWllbGQgcGF0Y2hQcm9taXNlKG9yaWdpbmFsRmlsZVBhdGgsIGFyZ3ZbXCJkcnktcnVuXCJdLCBhcmd2W1wiaW4tcGxhY2VcIl0sIGFyZ3YuYmFja3VwLCBhcmd2LnNpZ24pO1xuXHR9XG59XG5cbihhc3luYyAoKSA9PiB7XG5cdGlmKCFhcmd2Ll9bMF0gJiYgIWFyZ3YuZGlyZWN0b3JpZXMpe1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJZb3UgbXVzdCBzcGVjaWZ5IGF0IGxlYXN0IGEgcGF0aCB0byBhIGxpYnJhcnkgYXMgYXJndW1lbnQhXCIpO1xuXHRcdHByb2Nlc3MuZXhpdCgxKTtcblx0fVxuXG5cdGlmKGFyZ3Yuam9icyA8PSAwKXtcblx0XHRjb25zb2xlLmVycm9yKFwiVGhlIG51bWJlciBvZiBqb2JzIHRvIHNwYXduIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiB6ZXJvIVwiKTtcblx0XHRwcm9jZXNzLmV4aXQoMSk7XG5cdH1cblxuXHRpZiAoYXJndltcImRyeS1ydW5cIl0pXG5cdFx0Y29uc29sZS5sb2coXCJcXG5cXG5XYXJuaW5nIVxcbkRyeSBydW4gaXMgYWN0aXZlISBObyBmaWxlcyB3aWxsIGJlIGFjdHVhbGx5IHBhdGNoZWQhXFxuXCIpO1xuXG5cdGF3YWl0IHBhcmFsbGVsaXplcihwcm9taXNlR2VuKCksIGFyZ3Yuam9icyk7XG59KSgpO1xuIl19