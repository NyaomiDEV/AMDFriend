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
const argv = yargs_1.default(helpers_1.hideBin(process.argv)).argv;
(async () => {
    if (!argv._[0]) {
        console.error("You must specify at least a path to a library as argument!");
        process.exit(1);
    }
    if (argv["dry-run"])
        console.log("\n\nWarning!\nDry run is active! No files will be actually patched!\n");
    for (const path of argv._) {
        const originalFilePath = path_1.resolve(path.toString());
        console.log(`Analyzing and patching file: ${originalFilePath}`);
        const patchedFilePath = await _1.patchFile(originalFilePath, argv["dry-run"], argv["in-place"]);
        if (patchedFilePath) {
            console.log(`Patched file is in: ${patchedFilePath}`);
            if (argv.sign)
                await _1.signFile(patchedFilePath, argv["dry-run"]);
        }
    }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQkFBK0I7QUFDL0Isd0JBQXdDO0FBQ3hDLGtEQUEwQjtBQUMxQiwyQ0FBd0M7QUFFeEMsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLGlCQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFJekMsQ0FBQztBQUVGLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDWCxJQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQztRQUM1RSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0lBRUQsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUVBQXVFLENBQUMsQ0FBQztJQUV0RixLQUFJLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUM7UUFDeEIsTUFBTSxnQkFBZ0IsR0FBRyxjQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sZUFBZSxHQUFHLE1BQU0sWUFBUyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUM3RixJQUFHLGVBQWUsRUFBQztZQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixlQUFlLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELElBQUcsSUFBSSxDQUFDLElBQUk7Z0JBQ1gsTUFBTSxXQUFRLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO0tBQ0Q7QUFDRixDQUFDLENBQUMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBwYXRjaEZpbGUsIHNpZ25GaWxlIH0gZnJvbSBcIi5cIjtcbmltcG9ydCB5YXJncyBmcm9tIFwieWFyZ3NcIjtcbmltcG9ydCB7IGhpZGVCaW4gfSBmcm9tIFwieWFyZ3MvaGVscGVyc1wiO1xuXG5jb25zdCBhcmd2ID0geWFyZ3MoaGlkZUJpbihwcm9jZXNzLmFyZ3YpKS5hcmd2IGFzIHtcblx0JDA6IHN0cmluZyxcblx0XzogKHN0cmluZ3xudW1iZXIpW10sXG5cdFt4OiBzdHJpbmddOiBhbnlcbn07XG5cbihhc3luYyAoKSA9PiB7XG5cdGlmKCFhcmd2Ll9bMF0pe1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJZb3UgbXVzdCBzcGVjaWZ5IGF0IGxlYXN0IGEgcGF0aCB0byBhIGxpYnJhcnkgYXMgYXJndW1lbnQhXCIpO1xuXHRcdHByb2Nlc3MuZXhpdCgxKTtcblx0fVxuXG5cdGlmKGFyZ3ZbXCJkcnktcnVuXCJdKVxuXHRcdGNvbnNvbGUubG9nKFwiXFxuXFxuV2FybmluZyFcXG5EcnkgcnVuIGlzIGFjdGl2ZSEgTm8gZmlsZXMgd2lsbCBiZSBhY3R1YWxseSBwYXRjaGVkIVxcblwiKTtcblx0XG5cdGZvcihjb25zdCBwYXRoIG9mIGFyZ3YuXyl7XG5cdFx0Y29uc3Qgb3JpZ2luYWxGaWxlUGF0aCA9IHJlc29sdmUocGF0aC50b1N0cmluZygpKTtcblx0XHRjb25zb2xlLmxvZyhgQW5hbHl6aW5nIGFuZCBwYXRjaGluZyBmaWxlOiAke29yaWdpbmFsRmlsZVBhdGh9YCk7XG5cdFx0Y29uc3QgcGF0Y2hlZEZpbGVQYXRoID0gYXdhaXQgcGF0Y2hGaWxlKG9yaWdpbmFsRmlsZVBhdGgsIGFyZ3ZbXCJkcnktcnVuXCJdLCBhcmd2W1wiaW4tcGxhY2VcIl0pO1xuXHRcdGlmKHBhdGNoZWRGaWxlUGF0aCl7XG5cdFx0XHRjb25zb2xlLmxvZyhgUGF0Y2hlZCBmaWxlIGlzIGluOiAke3BhdGNoZWRGaWxlUGF0aH1gKTtcblx0XHRcdGlmKGFyZ3Yuc2lnbilcblx0XHRcdFx0YXdhaXQgc2lnbkZpbGUocGF0Y2hlZEZpbGVQYXRoLCBhcmd2W1wiZHJ5LXJ1blwiXSk7XG5cdFx0fVxuXHR9XG59KSgpO1xuIl19