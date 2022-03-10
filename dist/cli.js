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
(async () => {
    if (!argv._[0] && !argv.directories) {
        console.error("You must specify at least a path to a library as argument!");
        process.exit(1);
    }
    if (argv["dry-run"])
        console.log("\n\nWarning!\nDry run is active! No files will be actually patched!\n");
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
    await parallelizer_1.parallelizer(promiseGen(), os_1.cpus().length);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQkFBK0I7QUFDL0Isd0JBQXdDO0FBQ3hDLGtEQUEwQjtBQUMxQiwyQ0FBd0M7QUFDeEMsaURBQThDO0FBQzlDLDJCQUEwQjtBQUMxQixtQ0FBd0M7QUFHeEMsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLGlCQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZDLFVBQVUsQ0FBQyxXQUFXLENBQUM7S0FDdkIsS0FBSyxDQUFDLDJEQUEyRCxDQUFDO0tBQ2xFLE1BQU0sQ0FBQyxVQUFVLEVBQUU7SUFDbkIsS0FBSyxFQUFFLEdBQUc7SUFDVixRQUFRLEVBQUUsaUhBQWlIO0lBQzNILFlBQVksRUFBRSxLQUFLO0lBQ25CLElBQUksRUFBRSxTQUFTO0lBQ2YsT0FBTyxFQUFFLEtBQUs7Q0FDZCxDQUFDO0tBQ0QsTUFBTSxDQUFDLFNBQVMsRUFBRTtJQUNsQixLQUFLLEVBQUUsR0FBRztJQUNWLFFBQVEsRUFBRSxrRUFBa0U7SUFDNUUsWUFBWSxFQUFFLEtBQUs7SUFDbkIsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsS0FBSztDQUNkLENBQUM7S0FDRCxNQUFNLENBQUMsUUFBUSxFQUFFO0lBQ2pCLEtBQUssRUFBRSxHQUFHO0lBQ1YsUUFBUSxFQUFFLG9JQUFvSTtJQUM5SSxZQUFZLEVBQUUsS0FBSztJQUNuQixJQUFJLEVBQUUsU0FBUztJQUNmLE9BQU8sRUFBRSxLQUFLO0lBQ2QsT0FBTyxFQUFFLFVBQVU7Q0FDbkIsQ0FBQztLQUNELE1BQU0sQ0FBQyxNQUFNLEVBQUU7SUFDZixLQUFLLEVBQUUsR0FBRztJQUNWLFFBQVEsRUFBRSx1REFBdUQ7SUFDakUsWUFBWSxFQUFFLEtBQUs7SUFDbkIsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsS0FBSztDQUNkLENBQUM7S0FDRCxN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LENBQUM7WUFDbEQsTUFBTSxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoRztJQUNGLENBQUM7SUFFRCxNQUFNLDJCQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsU0FBSSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcGF0Y2hGaWxlLCBzaWduRmlsZSB9IGZyb20gXCIuXCI7XG5pbXBvcnQgeWFyZ3MgZnJvbSBcInlhcmdzXCI7XG5pbXBvcnQgeyBoaWRlQmluIH0gZnJvbSBcInlhcmdzL2hlbHBlcnNcIjtcbmltcG9ydCB7IHBhcmFsbGVsaXplciB9IGZyb20gXCIuL3BhcmFsbGVsaXplclwiO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gXCJvc1wiO1xuaW1wb3J0IHsgd2Fsa0RpcmVjdG9yeSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbi8vIEFyZ3VtZW50IGRlZmluaWl0b24gYW5kIHBhcnNpbmdcbmNvbnN0IGFyZ3YgPSB5YXJncyhoaWRlQmluKHByb2Nlc3MuYXJndikpXG5cdC5zY3JpcHROYW1lKFwiYW1kZnJpZW5kXCIpXG5cdC51c2FnZShcIiQwIFthcmdzXSA8cGF0aC90by9saWJyYXJ5PiBbLi4uL3BhdGgvdG8vb3RoZXIvbGlicmFyaWVzXVwiKVxuXHQub3B0aW9uKFwiaW4tcGxhY2VcIiwge1xuXHRcdGFsaWFzOiBcImlcIixcblx0XHRkZXNjcmliZTogXCJEaXJlY3RseSBwYXRjaCB0aGUgbGlicmFyeSwgYXMgb3Bwb3NlZCB0byBjcmVhdGluZyBhIHBhdGNoZWQgbGlicmFyeSB3aXRoIGAucGF0Y2hlZGAgYXBwZW5kZWQgdG8gdGhlIGZpbGUgbmFtZS5cIixcblx0XHRkZW1hbmRPcHRpb246IGZhbHNlLFxuXHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdGRlZmF1bHQ6IGZhbHNlXG5cdH0pXG5cdC5vcHRpb24oXCJkcnktcnVuXCIsIHtcblx0XHRhbGlhczogXCJkXCIsXG5cdFx0ZGVzY3JpYmU6IFwiRG8gYWxsIGNoZWNraW5nIGFuZCBwYXRjaGluZywgYnV0IERPIE5PVCB3cml0ZSBhbnl0aGluZyB0byBkaXNrLlwiLFxuXHRcdGRlbWFuZE9wdGlvbjogZmFsc2UsXG5cdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0ZGVmYXVsdDogZmFsc2Vcblx0fSlcblx0Lm9wdGlvbihcImJhY2t1cFwiLCB7XG5cdFx0YWxpYXM6IFwiYlwiLFxuXHRcdGRlc2NyaWJlOiBcIk9ubHkgd29ya3MgaW4gY29uanVuY3Rpb24gd2l0aCBgLS1pbi1wbGFjZWA7IGl0IGJhY2tzIHVwIHRoZSBvcmlnaW5hbCBsaWJyYXJ5IGJ5IGNvcHlpbmcgaXQgYW5kIGFwcGVuZGluZyBgLmJha2Agb24gaXRzIGV4dGVuc2lvbi5cIixcblx0XHRkZW1hbmRPcHRpb246IGZhbHNlLFxuXHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdGRlZmF1bHQ6IGZhbHNlLFxuXHRcdGltcGxpZXM6IFwiaW4tcGxhY2VcIlxuXHR9KVxuXHQub3B0aW9uKFwic2lnblwiLCB7XG5cdFx0YWxpYXM6IFwic1wiLFxuXHRcdGRlc2NyaWJlOiBcIkF1dG9tYXRpY2FsbHkgaW52b2tlIGBjb2Rlc2lnbmAgb24gcGF0Y2hlZCBsaWJyYXJpZXMuXCIsXG5cdFx0ZGVtYW5kT3B0aW9uOiBmYWxzZSxcblx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRkZWZhdWx0OiBmYWxzZVxuXHR9KVxuXHQub3B0aW9uKFwiZGlyZWN0b3JpZXNcIiwge1xuXHRcdGFsaWFzOiBcIkRcIixcblx0XHRkZXNjcmliZTogXCJTY2FuIGRpcmVjdG9yaWVzIGFsb25nc2lkZSBmaWxlcy4gSXQgd2lsbCBzZWFyY2ggZm9yIGFueSBmaWxlIHdpdGggbm8gZXh0ZW5zaW9uIGFuZCB3aXRoIGV4dGVuc2lvbiBgLmR5bGliYCwgYXMgdGhleSBhcmUgdGhlIGNvbW1vbiBvbmVzIHRvIHBhdGNoLlwiLFxuXHRcdGRlbWFuZE9wdGlvbjogZmFsc2UsXG5cdFx0dHlwZTogXCJhcnJheVwiLFxuXHRcdGRlZmF1bHQ6IFtdXG5cdH0pXG5cdC5oZWxwKClcblx0LmFyZ3YgYXMge1xuXHRcdCQwOiBzdHJpbmcsXG5cdFx0XzogKHN0cmluZ3xudW1iZXIpW10sXG5cdFx0W3g6IHN0cmluZ106IGFueVxuXHR9O1xuXG4vLyBDTEkgQ09ERVxuYXN5bmMgZnVuY3Rpb24gcGF0Y2hQcm9taXNlKG9yaWdpbmFsRmlsZVBhdGg6IHN0cmluZywgZHJ5UnVuOiBib29sZWFuLCBpblBsYWNlOiBib29sZWFuLCBiYWNrdXA6IGJvb2xlYW4sIHNpZ246IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcblx0Y29uc29sZS5sb2coYEFuYWx5emluZyBhbmQgcGF0Y2hpbmcgZmlsZTogJHtvcmlnaW5hbEZpbGVQYXRofWApO1xuXHRjb25zdCBwID0gYXdhaXQgcGF0Y2hGaWxlKG9yaWdpbmFsRmlsZVBhdGgsIGRyeVJ1biwgaW5QbGFjZSwgYmFja3VwKTtcblx0aWYgKHApIHtcblx0XHRpZiAoc2lnbilcblx0XHRcdGF3YWl0IHNpZ25GaWxlKHAucGF0Y2hlZFBhdGgsIGFyZ3ZbXCJkcnktcnVuXCJdKTtcblx0XHRjb25zb2xlLmxvZyhgUm91dGluZXMgZm91bmQgZm9yICR7b3JpZ2luYWxGaWxlUGF0aH06YCk7XG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHRwLnBhdGNoZWRSb3V0aW5lcy5tYXAoeCA9PiBgLSA8JHt4LmJ5dGVzLnRvU3RyaW5nKFwiaGV4XCIpLnRvVXBwZXJDYXNlKCkubWF0Y2goLy57MSwyfS9nKSEuam9pbihcIiBcIil9PiBhdCBvZmZzZXQgJHt4Lm9mZnNldH0gKEhleDogJHt4Lm9mZnNldC50b1N0cmluZygxNil9KWApLmpvaW4oXCJcXG5cIilcblx0XHQpO1xuXHRcdGNvbnNvbGUubG9nKGBGaWxlICR7b3JpZ2luYWxGaWxlUGF0aH0gd2FzIHBhdGNoZWQuYCk7XG5cdFx0Y29uc29sZS5sb2coYFBhdGNoZWQgZmlsZSBsb2NhdGlvbjogJHtwLnBhdGNoZWRQYXRofWApO1xuXHR9XG5cdGNvbnNvbGUubG9nKGBGaW5pc2hlZCBwcm9jZXNzaW5nIGZpbGU6ICR7b3JpZ2luYWxGaWxlUGF0aH1gKTtcbn1cblxuKGFzeW5jICgpID0+IHtcblx0aWYoIWFyZ3YuX1swXSAmJiAhYXJndi5kaXJlY3Rvcmllcyl7XG5cdFx0Y29uc29sZS5lcnJvcihcIllvdSBtdXN0IHNwZWNpZnkgYXQgbGVhc3QgYSBwYXRoIHRvIGEgbGlicmFyeSBhcyBhcmd1bWVudCFcIik7XG5cdFx0cHJvY2Vzcy5leGl0KDEpO1xuXHR9XG5cblx0aWYoYXJndltcImRyeS1ydW5cIl0pXG5cdFx0Y29uc29sZS5sb2coXCJcXG5cXG5XYXJuaW5nIVxcbkRyeSBydW4gaXMgYWN0aXZlISBObyBmaWxlcyB3aWxsIGJlIGFjdHVhbGx5IHBhdGNoZWQhXFxuXCIpO1xuXG5cdGZ1bmN0aW9uKiBwcm9taXNlR2VuKCk6IEdlbmVyYXRvcjxQcm9taXNlPHZvaWQ+PiB7XG5cdFx0aWYgKGFyZ3YuZGlyZWN0b3JpZXMpe1xuXHRcdFx0Zm9yKGNvbnN0IGRpclBhdGggb2YgYXJndi5kaXJlY3Rvcmllcyl7XG5cdFx0XHRcdGZvcihjb25zdCBwYXRoIG9mIHdhbGtEaXJlY3RvcnkoZGlyUGF0aCwgW1wiXCIsIFwiLmR5bGliXCJdLCBbXCIuRFNfU3RvcmVcIl0pKXtcblx0XHRcdFx0XHRjb25zdCBvcmlnaW5hbEZpbGVQYXRoID0gcmVzb2x2ZShwYXRoLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHRcdHlpZWxkIHBhdGNoUHJvbWlzZShvcmlnaW5hbEZpbGVQYXRoLCBhcmd2W1wiZHJ5LXJ1blwiXSwgYXJndltcImluLXBsYWNlXCJdLCBhcmd2LmJhY2t1cCwgYXJndi5zaWduKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKGNvbnN0IHBhdGggb2YgYXJndi5fKSB7XG5cdFx0XHRjb25zdCBvcmlnaW5hbEZpbGVQYXRoID0gcmVzb2x2ZShwYXRoLnRvU3RyaW5nKCkpO1xuXHRcdFx0eWllbGQgcGF0Y2hQcm9taXNlKG9yaWdpbmFsRmlsZVBhdGgsIGFyZ3ZbXCJkcnktcnVuXCJdLCBhcmd2W1wiaW4tcGxhY2VcIl0sIGFyZ3YuYmFja3VwLCBhcmd2LnNpZ24pO1xuXHRcdH1cblx0fVxuXG5cdGF3YWl0IHBhcmFsbGVsaXplcihwcm9taXNlR2VuKCksIGNwdXMoKS5sZW5ndGgpO1xufSkoKTtcbiJdfQ==