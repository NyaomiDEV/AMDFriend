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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUErQjtBQUMvQix3QkFBOEI7QUFFOUIsQ0FBQyxLQUFLLElBQUksRUFBRTtJQUNYLElBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDO1FBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztRQUNuRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0lBRUQsTUFBTSxnQkFBZ0IsR0FBRyxjQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sZUFBZSxHQUFHLE1BQU0sWUFBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsZUFBZSxFQUFFLENBQUMsQ0FBQztBQUN2RCxDQUFDLENBQUMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBwYXRjaEZpbGUgfSBmcm9tIFwiLlwiO1xuXG4oYXN5bmMgKCkgPT4ge1xuXHRpZighcHJvY2Vzcy5hcmd2WzJdKXtcblx0XHRjb25zb2xlLmVycm9yKFwiWW91IG11c3Qgc3BlY2lmeSBhIHBhdGggdG8gYSBsaWJyYXJ5IGFzIGFyZ3VtZW50IVwiKTtcblx0XHRwcm9jZXNzLmV4aXQoMSk7XG5cdH1cblx0XG5cdGNvbnN0IG9yaWdpbmFsRmlsZVBhdGggPSByZXNvbHZlKHByb2Nlc3MuYXJndlsyXSk7XG5cdGNvbnN0IHBhdGNoZWRGaWxlUGF0aCA9IGF3YWl0IHBhdGNoRmlsZShvcmlnaW5hbEZpbGVQYXRoKTtcblx0Y29uc29sZS5sb2coYFBhdGNoZWQgZmlsZSBpcyBpbjogJHtwYXRjaGVkRmlsZVBhdGh9YCk7XG59KSgpO1xuIl19