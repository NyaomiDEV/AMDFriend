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
const argv = yargs_1.default(helpers_1.hideBin(process.argv))
    .boolean("in-place")
    .boolean("dry-run")
    .boolean("sign")
    .argv;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQkFBK0I7QUFDL0Isd0JBQXdDO0FBQ3hDLGtEQUEwQjtBQUMxQiwyQ0FBd0M7QUFFeEMsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLGlCQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZDLE9BQU8sQ0FBQyxVQUFVLENBQUM7S0FDbkIsT0FBTyxDQUFDLFNBQVMsQ0FBQztLQUNsQixPQUFPLENBQUMsTUFBTSxDQUFDO0tBQ2YsSUFJQSxDQUFDO0FBRUgsQ0FBQyxLQUFLLElBQUksRUFBRTtJQUNYLElBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1FBQzVFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7SUFFRCxJQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO0lBRXRGLEtBQUksTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsRUFBQztRQUN4QixNQUFNLGdCQUFnQixHQUFHLGNBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDaEUsTUFBTSxlQUFlLEdBQUcsTUFBTSxZQUFTLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzdGLElBQUcsZUFBZSxFQUFDO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFDdEQsSUFBRyxJQUFJLENBQUMsSUFBSTtnQkFDWCxNQUFNLFdBQVEsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDbEQ7S0FDRDtBQUNGLENBQUMsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHBhdGNoRmlsZSwgc2lnbkZpbGUgfSBmcm9tIFwiLlwiO1xuaW1wb3J0IHlhcmdzIGZyb20gXCJ5YXJnc1wiO1xuaW1wb3J0IHsgaGlkZUJpbiB9IGZyb20gXCJ5YXJncy9oZWxwZXJzXCI7XG5cbmNvbnN0IGFyZ3YgPSB5YXJncyhoaWRlQmluKHByb2Nlc3MuYXJndikpXG5cdC5ib29sZWFuKFwiaW4tcGxhY2VcIilcblx0LmJvb2xlYW4oXCJkcnktcnVuXCIpXG5cdC5ib29sZWFuKFwic2lnblwiKVxuXHQuYXJndiBhcyB7XG5cdFx0JDA6IHN0cmluZyxcblx0XHRfOiAoc3RyaW5nfG51bWJlcilbXSxcblx0XHRbeDogc3RyaW5nXTogYW55XG5cdH07XG5cbihhc3luYyAoKSA9PiB7XG5cdGlmKCFhcmd2Ll9bMF0pe1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJZb3UgbXVzdCBzcGVjaWZ5IGF0IGxlYXN0IGEgcGF0aCB0byBhIGxpYnJhcnkgYXMgYXJndW1lbnQhXCIpO1xuXHRcdHByb2Nlc3MuZXhpdCgxKTtcblx0fVxuXG5cdGlmKGFyZ3ZbXCJkcnktcnVuXCJdKVxuXHRcdGNvbnNvbGUubG9nKFwiXFxuXFxuV2FybmluZyFcXG5EcnkgcnVuIGlzIGFjdGl2ZSEgTm8gZmlsZXMgd2lsbCBiZSBhY3R1YWxseSBwYXRjaGVkIVxcblwiKTtcblx0XG5cdGZvcihjb25zdCBwYXRoIG9mIGFyZ3YuXyl7XG5cdFx0Y29uc3Qgb3JpZ2luYWxGaWxlUGF0aCA9IHJlc29sdmUocGF0aC50b1N0cmluZygpKTtcblx0XHRjb25zb2xlLmxvZyhgQW5hbHl6aW5nIGFuZCBwYXRjaGluZyBmaWxlOiAke29yaWdpbmFsRmlsZVBhdGh9YCk7XG5cdFx0Y29uc3QgcGF0Y2hlZEZpbGVQYXRoID0gYXdhaXQgcGF0Y2hGaWxlKG9yaWdpbmFsRmlsZVBhdGgsIGFyZ3ZbXCJkcnktcnVuXCJdLCBhcmd2W1wiaW4tcGxhY2VcIl0pO1xuXHRcdGlmKHBhdGNoZWRGaWxlUGF0aCl7XG5cdFx0XHRjb25zb2xlLmxvZyhgUGF0Y2hlZCBmaWxlIGlzIGluOiAke3BhdGNoZWRGaWxlUGF0aH1gKTtcblx0XHRcdGlmKGFyZ3Yuc2lnbilcblx0XHRcdFx0YXdhaXQgc2lnbkZpbGUocGF0Y2hlZEZpbGVQYXRoLCBhcmd2W1wiZHJ5LXJ1blwiXSk7XG5cdFx0fVxuXHR9XG59KSgpO1xuIl19