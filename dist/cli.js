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
    .boolean("in-place")
    .boolean("dry-run")
    .boolean("backup")
    .boolean("sign")
    .array("directories")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQkFBK0I7QUFDL0Isd0JBQXdDO0FBQ3hDLGtEQUEwQjtBQUMxQiwyQ0FBd0M7QUFDeEMsaURBQThDO0FBQzlDLDJCQUEwQjtBQUMxQixtQ0FBd0M7QUFFeEMsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLGlCQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZDLE9BQU8sQ0FBQyxVQUFVLENBQUM7S0FDbkIsT0FBTyxDQUFDLFNBQVMsQ0FBQztLQUNsQixPQUFPLENBQUMsUUFBUSxDQUFDO0tBQ2pCLE9BQU8sQ0FBQyxNQUFNLENBQUM7S0FDZixLQUFLLENBQUMsYUFBYSxDQUFDO0tBQ3BCLElBSUEsQ0FBQztBQUVILEtBQUssVUFBVSxZQUFZLENBQUMsZ0JBQXdCLEVBQUUsTUFBZSxFQUFFLE9BQWdCLEVBQUUsTUFBZSxFQUFFLElBQWE7SUFDdEgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sQ0FBQyxHQUFHLE1BQU0sWUFBUyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckUsSUFBSSxDQUFDLEVBQUU7UUFDTixJQUFJLElBQUk7WUFDUCxNQUFNLFdBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLGdCQUFnQixHQUFHLENBQUMsQ0FBQztRQUN2RCxPQUFPLENBQUMsR0FBRyxDQUNWLENBQUMsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDdkssQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxnQkFBZ0IsZUFBZSxDQUFDLENBQUM7UUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7S0FDdkQ7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixnQkFBZ0IsRUFBRSxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUVELENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDWCxJQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUM7UUFDbEMsT0FBTyxDQUFDLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1FBQzVFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7SUFFRCxJQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO0lBRXRGLFFBQVEsQ0FBQyxDQUFDLFVBQVU7UUFDbkIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFDO1lBQ3BCLEtBQUksTUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBQztnQkFDckMsS0FBSSxNQUFNLElBQUksSUFBSSxxQkFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUM7b0JBQ3ZFLE1BQU0sZ0JBQWdCLEdBQUcsY0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUNsRCxNQUFNLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNoRzthQUNEO1NBQ0Q7UUFDRCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDMUIsTUFBTSxnQkFBZ0IsR0FBRyxjQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDbEQsTUFBTSxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoRztJQUNGLENBQUM7SUFFRCxNQUFNLDJCQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsU0FBSSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcGF0Y2hGaWxlLCBzaWduRmlsZSB9IGZyb20gXCIuXCI7XG5pbXBvcnQgeWFyZ3MgZnJvbSBcInlhcmdzXCI7XG5pbXBvcnQgeyBoaWRlQmluIH0gZnJvbSBcInlhcmdzL2hlbHBlcnNcIjtcbmltcG9ydCB7IHBhcmFsbGVsaXplciB9IGZyb20gXCIuL3BhcmFsbGVsaXplclwiO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gXCJvc1wiO1xuaW1wb3J0IHsgd2Fsa0RpcmVjdG9yeSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmNvbnN0IGFyZ3YgPSB5YXJncyhoaWRlQmluKHByb2Nlc3MuYXJndikpXG5cdC5ib29sZWFuKFwiaW4tcGxhY2VcIilcblx0LmJvb2xlYW4oXCJkcnktcnVuXCIpXG5cdC5ib29sZWFuKFwiYmFja3VwXCIpXG5cdC5ib29sZWFuKFwic2lnblwiKVxuXHQuYXJyYXkoXCJkaXJlY3Rvcmllc1wiKVxuXHQuYXJndiBhcyB7XG5cdFx0JDA6IHN0cmluZyxcblx0XHRfOiAoc3RyaW5nfG51bWJlcilbXSxcblx0XHRbeDogc3RyaW5nXTogYW55XG5cdH07XG5cbmFzeW5jIGZ1bmN0aW9uIHBhdGNoUHJvbWlzZShvcmlnaW5hbEZpbGVQYXRoOiBzdHJpbmcsIGRyeVJ1bjogYm9vbGVhbiwgaW5QbGFjZTogYm9vbGVhbiwgYmFja3VwOiBib29sZWFuLCBzaWduOiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG5cdGNvbnNvbGUubG9nKGBBbmFseXppbmcgYW5kIHBhdGNoaW5nIGZpbGU6ICR7b3JpZ2luYWxGaWxlUGF0aH1gKTtcblx0Y29uc3QgcCA9IGF3YWl0IHBhdGNoRmlsZShvcmlnaW5hbEZpbGVQYXRoLCBkcnlSdW4sIGluUGxhY2UsIGJhY2t1cCk7XG5cdGlmIChwKSB7XG5cdFx0aWYgKHNpZ24pXG5cdFx0XHRhd2FpdCBzaWduRmlsZShwLnBhdGNoZWRQYXRoLCBhcmd2W1wiZHJ5LXJ1blwiXSk7XG5cdFx0Y29uc29sZS5sb2coYFJvdXRpbmVzIGZvdW5kIGZvciAke29yaWdpbmFsRmlsZVBhdGh9OmApO1xuXHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0cC5wYXRjaGVkUm91dGluZXMubWFwKHggPT4gYC0gPCR7eC5ieXRlcy50b1N0cmluZyhcImhleFwiKS50b1VwcGVyQ2FzZSgpLm1hdGNoKC8uezEsMn0vZykhLmpvaW4oXCIgXCIpfT4gYXQgb2Zmc2V0ICR7eC5vZmZzZXR9IChIZXg6ICR7eC5vZmZzZXQudG9TdHJpbmcoMTYpfSlgKS5qb2luKFwiXFxuXCIpXG5cdFx0KTtcblx0XHRjb25zb2xlLmxvZyhgRmlsZSAke29yaWdpbmFsRmlsZVBhdGh9IHdhcyBwYXRjaGVkLmApO1xuXHRcdGNvbnNvbGUubG9nKGBQYXRjaGVkIGZpbGUgbG9jYXRpb246ICR7cC5wYXRjaGVkUGF0aH1gKTtcblx0fVxuXHRjb25zb2xlLmxvZyhgRmluaXNoZWQgcHJvY2Vzc2luZyBmaWxlOiAke29yaWdpbmFsRmlsZVBhdGh9YCk7XG59XG5cbihhc3luYyAoKSA9PiB7XG5cdGlmKCFhcmd2Ll9bMF0gJiYgIWFyZ3YuZGlyZWN0b3JpZXMpe1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJZb3UgbXVzdCBzcGVjaWZ5IGF0IGxlYXN0IGEgcGF0aCB0byBhIGxpYnJhcnkgYXMgYXJndW1lbnQhXCIpO1xuXHRcdHByb2Nlc3MuZXhpdCgxKTtcblx0fVxuXG5cdGlmKGFyZ3ZbXCJkcnktcnVuXCJdKVxuXHRcdGNvbnNvbGUubG9nKFwiXFxuXFxuV2FybmluZyFcXG5EcnkgcnVuIGlzIGFjdGl2ZSEgTm8gZmlsZXMgd2lsbCBiZSBhY3R1YWxseSBwYXRjaGVkIVxcblwiKTtcblxuXHRmdW5jdGlvbiogcHJvbWlzZUdlbigpOiBHZW5lcmF0b3I8UHJvbWlzZTx2b2lkPj4ge1xuXHRcdGlmIChhcmd2LmRpcmVjdG9yaWVzKXtcblx0XHRcdGZvcihjb25zdCBkaXJQYXRoIG9mIGFyZ3YuZGlyZWN0b3JpZXMpe1xuXHRcdFx0XHRmb3IoY29uc3QgcGF0aCBvZiB3YWxrRGlyZWN0b3J5KGRpclBhdGgsIFtcIlwiLCBcIi5keWxpYlwiXSwgW1wiLkRTX1N0b3JlXCJdKSl7XG5cdFx0XHRcdFx0Y29uc3Qgb3JpZ2luYWxGaWxlUGF0aCA9IHJlc29sdmUocGF0aC50b1N0cmluZygpKTtcblx0XHRcdFx0XHR5aWVsZCBwYXRjaFByb21pc2Uob3JpZ2luYWxGaWxlUGF0aCwgYXJndltcImRyeS1ydW5cIl0sIGFyZ3ZbXCJpbi1wbGFjZVwiXSwgYXJndi5iYWNrdXAsIGFyZ3Yuc2lnbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0Zm9yIChjb25zdCBwYXRoIG9mIGFyZ3YuXykge1xuXHRcdFx0Y29uc3Qgb3JpZ2luYWxGaWxlUGF0aCA9IHJlc29sdmUocGF0aC50b1N0cmluZygpKTtcblx0XHRcdHlpZWxkIHBhdGNoUHJvbWlzZShvcmlnaW5hbEZpbGVQYXRoLCBhcmd2W1wiZHJ5LXJ1blwiXSwgYXJndltcImluLXBsYWNlXCJdLCBhcmd2LmJhY2t1cCwgYXJndi5zaWduKTtcblx0XHR9XG5cdH1cblxuXHRhd2FpdCBwYXJhbGxlbGl6ZXIocHJvbWlzZUdlbigpLCBjcHVzKCkubGVuZ3RoKTtcbn0pKCk7XG4iXX0=