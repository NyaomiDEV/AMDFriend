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
const argv = yargs_1.default(helpers_1.hideBin(process.argv))
    .boolean("in-place")
    .boolean("dry-run")
    .boolean("backup")
    .boolean("sign")
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
    if (!argv._[0]) {
        console.error("You must specify at least a path to a library as argument!");
        process.exit(1);
    }
    if (argv["dry-run"])
        console.log("\n\nWarning!\nDry run is active! No files will be actually patched!\n");
    function* promiseGen() {
        for (const path of argv._) {
            const originalFilePath = path_1.resolve(path.toString());
            yield patchPromise(originalFilePath, argv["dry-run"], argv["in-place"], argv.backup, argv.sign);
        }
    }
    await parallelizer_1.parallelizer(promiseGen(), os_1.cpus().length);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQkFBK0I7QUFDL0Isd0JBQXdDO0FBQ3hDLGtEQUEwQjtBQUMxQiwyQ0FBd0M7QUFDeEMsaURBQThDO0FBQzlDLDJCQUEwQjtBQUUxQixNQUFNLElBQUksR0FBRyxlQUFLLENBQUMsaUJBQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdkMsT0FBTyxDQUFDLFVBQVUsQ0FBQztLQUNuQixPQUFPLENBQUMsU0FBUyxDQUFDO0tBQ2xCLE9BQU8sQ0FBQyxRQUFRLENBQUM7S0FDakIsT0FBTyxDQUFDLE1BQU0sQ0FBQztLQUNmLElBSUEsQ0FBQztBQUVILEtBQUssVUFBVSxZQUFZLENBQUMsZ0JBQXdCLEVBQUUsTUFBZSxFQUFFLE9BQWdCLEVBQUUsTUFBZSxFQUFFLElBQWE7SUFDdEgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sQ0FBQyxHQUFHLE1BQU0sWUFBUyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckUsSUFBSSxDQUFDLEVBQUU7UUFDTixJQUFJLElBQUk7WUFDUCxNQUFNLFdBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLGdCQUFnQixHQUFHLENBQUMsQ0FBQztRQUN2RCxPQUFPLENBQUMsR0FBRyxDQUNWLENBQUMsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDdkssQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxnQkFBZ0IsZUFBZSxDQUFDLENBQUM7UUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7S0FDdkQ7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixnQkFBZ0IsRUFBRSxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUVELENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDWCxJQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQztRQUM1RSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0lBRUQsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUVBQXVFLENBQUMsQ0FBQztJQUV0RixRQUFRLENBQUMsQ0FBQyxVQUFVO1FBQ25CLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRTtZQUMxQixNQUFNLGdCQUFnQixHQUFHLGNBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNsRCxNQUFNLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hHO0lBQ0YsQ0FBQztJQUVELE1BQU0sMkJBQVksQ0FBQyxVQUFVLEVBQUUsRUFBRSxTQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqRCxDQUFDLENBQUMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBwYXRjaEZpbGUsIHNpZ25GaWxlIH0gZnJvbSBcIi5cIjtcbmltcG9ydCB5YXJncyBmcm9tIFwieWFyZ3NcIjtcbmltcG9ydCB7IGhpZGVCaW4gfSBmcm9tIFwieWFyZ3MvaGVscGVyc1wiO1xuaW1wb3J0IHsgcGFyYWxsZWxpemVyIH0gZnJvbSBcIi4vcGFyYWxsZWxpemVyXCI7XG5pbXBvcnQgeyBjcHVzIH0gZnJvbSBcIm9zXCI7XG5cbmNvbnN0IGFyZ3YgPSB5YXJncyhoaWRlQmluKHByb2Nlc3MuYXJndikpXG5cdC5ib29sZWFuKFwiaW4tcGxhY2VcIilcblx0LmJvb2xlYW4oXCJkcnktcnVuXCIpXG5cdC5ib29sZWFuKFwiYmFja3VwXCIpXG5cdC5ib29sZWFuKFwic2lnblwiKVxuXHQuYXJndiBhcyB7XG5cdFx0JDA6IHN0cmluZyxcblx0XHRfOiAoc3RyaW5nfG51bWJlcilbXSxcblx0XHRbeDogc3RyaW5nXTogYW55XG5cdH07XG5cbmFzeW5jIGZ1bmN0aW9uIHBhdGNoUHJvbWlzZShvcmlnaW5hbEZpbGVQYXRoOiBzdHJpbmcsIGRyeVJ1bjogYm9vbGVhbiwgaW5QbGFjZTogYm9vbGVhbiwgYmFja3VwOiBib29sZWFuLCBzaWduOiBib29sZWFuKSB7XG5cdGNvbnNvbGUubG9nKGBBbmFseXppbmcgYW5kIHBhdGNoaW5nIGZpbGU6ICR7b3JpZ2luYWxGaWxlUGF0aH1gKTtcblx0Y29uc3QgcCA9IGF3YWl0IHBhdGNoRmlsZShvcmlnaW5hbEZpbGVQYXRoLCBkcnlSdW4sIGluUGxhY2UsIGJhY2t1cCk7XG5cdGlmIChwKSB7XG5cdFx0aWYgKHNpZ24pXG5cdFx0XHRhd2FpdCBzaWduRmlsZShwLnBhdGNoZWRQYXRoLCBhcmd2W1wiZHJ5LXJ1blwiXSk7XG5cdFx0Y29uc29sZS5sb2coYFJvdXRpbmVzIGZvdW5kIGZvciAke29yaWdpbmFsRmlsZVBhdGh9OmApO1xuXHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0cC5wYXRjaGVkUm91dGluZXMubWFwKHggPT4gYC0gPCR7eC5ieXRlcy50b1N0cmluZyhcImhleFwiKS50b1VwcGVyQ2FzZSgpLm1hdGNoKC8uezEsMn0vZykhLmpvaW4oXCIgXCIpfT4gYXQgb2Zmc2V0ICR7eC5vZmZzZXR9IChIZXg6ICR7eC5vZmZzZXQudG9TdHJpbmcoMTYpfSlgKS5qb2luKFwiXFxuXCIpXG5cdFx0KTtcblx0XHRjb25zb2xlLmxvZyhgRmlsZSAke29yaWdpbmFsRmlsZVBhdGh9IHdhcyBwYXRjaGVkLmApO1xuXHRcdGNvbnNvbGUubG9nKGBQYXRjaGVkIGZpbGUgbG9jYXRpb246ICR7cC5wYXRjaGVkUGF0aH1gKTtcblx0fVxuXHRjb25zb2xlLmxvZyhgRmluaXNoZWQgcHJvY2Vzc2luZyBmaWxlOiAke29yaWdpbmFsRmlsZVBhdGh9YCk7XG59XG5cbihhc3luYyAoKSA9PiB7XG5cdGlmKCFhcmd2Ll9bMF0pe1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJZb3UgbXVzdCBzcGVjaWZ5IGF0IGxlYXN0IGEgcGF0aCB0byBhIGxpYnJhcnkgYXMgYXJndW1lbnQhXCIpO1xuXHRcdHByb2Nlc3MuZXhpdCgxKTtcblx0fVxuXG5cdGlmKGFyZ3ZbXCJkcnktcnVuXCJdKVxuXHRcdGNvbnNvbGUubG9nKFwiXFxuXFxuV2FybmluZyFcXG5EcnkgcnVuIGlzIGFjdGl2ZSEgTm8gZmlsZXMgd2lsbCBiZSBhY3R1YWxseSBwYXRjaGVkIVxcblwiKTtcblxuXHRmdW5jdGlvbiogcHJvbWlzZUdlbigpOiBHZW5lcmF0b3I8UHJvbWlzZTxhbnk+PiB7XG5cdFx0Zm9yIChjb25zdCBwYXRoIG9mIGFyZ3YuXykge1xuXHRcdFx0Y29uc3Qgb3JpZ2luYWxGaWxlUGF0aCA9IHJlc29sdmUocGF0aC50b1N0cmluZygpKTtcblx0XHRcdHlpZWxkIHBhdGNoUHJvbWlzZShvcmlnaW5hbEZpbGVQYXRoLCBhcmd2W1wiZHJ5LXJ1blwiXSwgYXJndltcImluLXBsYWNlXCJdLCBhcmd2LmJhY2t1cCwgYXJndi5zaWduKTtcblx0XHR9XG5cdH1cblxuXHRhd2FpdCBwYXJhbGxlbGl6ZXIocHJvbWlzZUdlbigpLCBjcHVzKCkubGVuZ3RoKTtcbn0pKCk7XG4iXX0=