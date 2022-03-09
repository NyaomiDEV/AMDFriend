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
    console.log(argv);
    if (!argv._[0]) {
        console.error("You must specify at least a path to a library as argument!");
        process.exit(1);
    }
    if (argv["dry-run"])
        console.log("\n\nWarning!\nDry run is active! No files will be actually patched!\n");
    for (const path of argv._) {
        const originalFilePath = path_1.resolve(path.toString());
        console.log(`Analyzing and patching file: ${originalFilePath}`);
        const patchedFilePath = await _1.patchFile(originalFilePath, argv["dry-run"]);
        if (patchedFilePath) {
            console.log(`Patched file is in: ${patchedFilePath}`);
            if (argv.sign)
                await _1.signFile(patchedFilePath, argv["dry-run"]);
        }
    }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQkFBK0I7QUFDL0Isd0JBQXdDO0FBQ3hDLGtEQUEwQjtBQUMxQiwyQ0FBd0M7QUFFeEMsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLGlCQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFJekMsQ0FBQztBQUVGLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLElBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1FBQzVFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7SUFFRCxJQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO0lBRXRGLEtBQUksTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsRUFBQztRQUN4QixNQUFNLGdCQUFnQixHQUFHLGNBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDaEUsTUFBTSxlQUFlLEdBQUcsTUFBTSxZQUFTLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsSUFBRyxlQUFlLEVBQUM7WUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsZUFBZSxFQUFFLENBQUMsQ0FBQztZQUN0RCxJQUFHLElBQUksQ0FBQyxJQUFJO2dCQUNYLE1BQU0sV0FBUSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUNsRDtLQUNEO0FBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcGF0Y2hGaWxlLCBzaWduRmlsZSB9IGZyb20gXCIuXCI7XG5pbXBvcnQgeWFyZ3MgZnJvbSBcInlhcmdzXCI7XG5pbXBvcnQgeyBoaWRlQmluIH0gZnJvbSBcInlhcmdzL2hlbHBlcnNcIjtcblxuY29uc3QgYXJndiA9IHlhcmdzKGhpZGVCaW4ocHJvY2Vzcy5hcmd2KSkuYXJndiBhcyB7XG5cdCQwOiBzdHJpbmcsXG5cdF86IChzdHJpbmd8bnVtYmVyKVtdLFxuXHRbeDogc3RyaW5nXTogYW55XG59O1xuXG4oYXN5bmMgKCkgPT4ge1xuXHRjb25zb2xlLmxvZyhhcmd2KTtcblx0aWYoIWFyZ3YuX1swXSl7XG5cdFx0Y29uc29sZS5lcnJvcihcIllvdSBtdXN0IHNwZWNpZnkgYXQgbGVhc3QgYSBwYXRoIHRvIGEgbGlicmFyeSBhcyBhcmd1bWVudCFcIik7XG5cdFx0cHJvY2Vzcy5leGl0KDEpO1xuXHR9XG5cblx0aWYoYXJndltcImRyeS1ydW5cIl0pXG5cdFx0Y29uc29sZS5sb2coXCJcXG5cXG5XYXJuaW5nIVxcbkRyeSBydW4gaXMgYWN0aXZlISBObyBmaWxlcyB3aWxsIGJlIGFjdHVhbGx5IHBhdGNoZWQhXFxuXCIpO1xuXHRcblx0Zm9yKGNvbnN0IHBhdGggb2YgYXJndi5fKXtcblx0XHRjb25zdCBvcmlnaW5hbEZpbGVQYXRoID0gcmVzb2x2ZShwYXRoLnRvU3RyaW5nKCkpO1xuXHRcdGNvbnNvbGUubG9nKGBBbmFseXppbmcgYW5kIHBhdGNoaW5nIGZpbGU6ICR7b3JpZ2luYWxGaWxlUGF0aH1gKTtcblx0XHRjb25zdCBwYXRjaGVkRmlsZVBhdGggPSBhd2FpdCBwYXRjaEZpbGUob3JpZ2luYWxGaWxlUGF0aCwgYXJndltcImRyeS1ydW5cIl0pO1xuXHRcdGlmKHBhdGNoZWRGaWxlUGF0aCl7XG5cdFx0XHRjb25zb2xlLmxvZyhgUGF0Y2hlZCBmaWxlIGlzIGluOiAke3BhdGNoZWRGaWxlUGF0aH1gKTtcblx0XHRcdGlmKGFyZ3Yuc2lnbilcblx0XHRcdFx0YXdhaXQgc2lnbkZpbGUocGF0Y2hlZEZpbGVQYXRoLCBhcmd2W1wiZHJ5LXJ1blwiXSk7XG5cdFx0fVxuXHR9XG59KSgpO1xuIl19