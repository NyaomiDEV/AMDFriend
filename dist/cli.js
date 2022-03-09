#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const _1 = require(".");
(async () => {
    if (!process.argv[2]) {
        console.error("You must specify a path to a library as argument!");
        process.exit(1);
    }
    const originalFilePath = path_1.resolve(process.argv[2]);
    const patchedFilePath = await _1.patchFile(originalFilePath);
    console.log(`Patched file is in: ${patchedFilePath}`);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQkFBK0I7QUFDL0Isd0JBQThCO0FBRTlCLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDWCxJQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQztRQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLG1EQUFtRCxDQUFDLENBQUM7UUFDbkUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtJQUVELE1BQU0sZ0JBQWdCLEdBQUcsY0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxNQUFNLGVBQWUsR0FBRyxNQUFNLFlBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLGVBQWUsRUFBRSxDQUFDLENBQUM7QUFDdkQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcGF0Y2hGaWxlIH0gZnJvbSBcIi5cIjtcblxuKGFzeW5jICgpID0+IHtcblx0aWYoIXByb2Nlc3MuYXJndlsyXSl7XG5cdFx0Y29uc29sZS5lcnJvcihcIllvdSBtdXN0IHNwZWNpZnkgYSBwYXRoIHRvIGEgbGlicmFyeSBhcyBhcmd1bWVudCFcIik7XG5cdFx0cHJvY2Vzcy5leGl0KDEpO1xuXHR9XG5cdFxuXHRjb25zdCBvcmlnaW5hbEZpbGVQYXRoID0gcmVzb2x2ZShwcm9jZXNzLmFyZ3ZbMl0pO1xuXHRjb25zdCBwYXRjaGVkRmlsZVBhdGggPSBhd2FpdCBwYXRjaEZpbGUob3JpZ2luYWxGaWxlUGF0aCk7XG5cdGNvbnNvbGUubG9nKGBQYXRjaGVkIGZpbGUgaXMgaW46ICR7cGF0Y2hlZEZpbGVQYXRofWApO1xufSkoKTtcbiJdfQ==