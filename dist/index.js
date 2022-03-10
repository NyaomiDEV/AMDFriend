"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signFile = exports.patchFile = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const regexes_1 = __importDefault(require("./regexes"));
const routines_1 = require("./routines");
async function patchFile(filePath, dryRun, inPlace, backup) {
    const result = {
        patchedPath: path_1.resolve(path_1.dirname(filePath), path_1.basename(filePath, path_1.extname(filePath)) + ".patched" + path_1.extname(filePath)),
        patchedRoutines: []
    };
    if (inPlace)
        result.patchedPath = filePath;
    let buffer;
    try {
        buffer = await promises_1.readFile(filePath);
    }
    catch (err) {
        if (err.code === "EISDIR")
            console.log(`${filePath} is a directory. Skipping...`);
        else
            console.error(`Error while opening ${filePath}: ${err.message}`);
        return null;
    }
    result.patchedRoutines.push(...routines_1.replaceAll(buffer, regexes_1.default.__mkl_serv_intel_cpu_true.find, regexes_1.default.__mkl_serv_intel_cpu_true.replace));
    result.patchedRoutines.push(...routines_1.replaceAll(buffer, regexes_1.default.__intel_fast_memset_or_memcpy_A.find, regexes_1.default.__intel_fast_memset_or_memcpy_A.replace));
    if (result.patchedRoutines.length) {
        if (!dryRun) {
            if (inPlace && backup)
                await promises_1.copyFile(filePath, filePath + ".bak");
            await promises_1.writeFile(result.patchedPath, buffer);
        }
        const xattrCmd = `xattr -cr "${result.patchedPath}"`;
        if (!dryRun)
            await util_1.promisify(child_process_1.exec)(xattrCmd);
        return result;
    }
    return null;
}
exports.patchFile = patchFile;
async function signFile(filePath, dryRun) {
    const signCmd = `codesign --force --deep --sign - "${filePath}"`;
    if (!dryRun)
        await util_1.promisify(child_process_1.exec)(signCmd);
}
exports.signFile = signFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsaURBQXFDO0FBQ3JDLCtCQUFpQztBQUNqQywwQ0FBNEQ7QUFDNUQsK0JBQTJEO0FBQzNELHdEQUFnQztBQUNoQyx5Q0FBd0M7QUFHakMsS0FBSyxVQUFVLFNBQVMsQ0FBQyxRQUFnQixFQUFFLE1BQWUsRUFBRSxPQUFnQixFQUFFLE1BQWU7SUFDbkcsTUFBTSxNQUFNLEdBQW1CO1FBQzlCLFdBQVcsRUFBRSxjQUFPLENBQUMsY0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGVBQVEsQ0FBQyxRQUFRLEVBQUUsY0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLGNBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvRyxlQUFlLEVBQUUsRUFBRTtLQUNuQixDQUFDO0lBRUYsSUFBSSxPQUFPO1FBQ1YsTUFBTSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7SUFFL0IsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFHO1FBQ0YsTUFBTSxHQUFHLE1BQU0sbUJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNsQztJQUFBLE9BQU0sR0FBUSxFQUFDO1FBQ2YsSUFBRyxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVE7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsOEJBQThCLENBQUMsQ0FBQzs7WUFFdkQsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsUUFBUSxLQUFLLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRWxFLE9BQU8sSUFBSSxDQUFDO0tBQ1o7SUFFRCxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLHFCQUFVLENBQ3hDLE1BQU0sRUFDTixpQkFBTyxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFDdEMsaUJBQU8sQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLENBQ3pDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcscUJBQVUsQ0FDeEMsTUFBTSxFQUNOLGlCQUFPLENBQUMsK0JBQStCLENBQUMsSUFBSSxFQUM1QyxpQkFBTyxDQUFDLCtCQUErQixDQUFDLE9BQU8sQ0FDL0MsQ0FBQyxDQUFDO0lBRUgsSUFBRyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFDO1lBRVgsSUFBRyxPQUFPLElBQUksTUFBTTtnQkFDbkIsTUFBTSxtQkFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFFN0MsTUFBTSxvQkFBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDNUM7UUFFRCxNQUFNLFFBQVEsR0FBRyxjQUFjLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQztRQUNyRCxJQUFJLENBQUMsTUFBTTtZQUNWLE1BQU0sZ0JBQVMsQ0FBQyxvQkFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFakMsT0FBTyxNQUFNLENBQUM7S0FDZDtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2IsQ0FBQztBQWxERCw4QkFrREM7QUFFTSxLQUFLLFVBQVUsUUFBUSxDQUFDLFFBQWdCLEVBQUUsTUFBZTtJQUMvRCxNQUFNLE9BQU8sR0FBRyxxQ0FBcUMsUUFBUSxHQUFHLENBQUM7SUFDakUsSUFBRyxDQUFDLE1BQU07UUFDVCxNQUFNLGdCQUFTLENBQUMsb0JBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFKRCw0QkFJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4ZWMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSBcInV0aWxcIjtcbmltcG9ydCB7IGNvcHlGaWxlLCByZWFkRmlsZSwgd3JpdGVGaWxlIH0gZnJvbSBcImZzL3Byb21pc2VzXCI7XG5pbXBvcnQgeyBiYXNlbmFtZSwgZGlybmFtZSwgZXh0bmFtZSwgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgcmVnZXhlcyBmcm9tIFwiLi9yZWdleGVzXCI7XG5pbXBvcnQgeyByZXBsYWNlQWxsIH0gZnJvbSBcIi4vcm91dGluZXNcIjtcbmltcG9ydCB7IFBhdGNoaW5nUmVzdWx0IH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBhdGNoRmlsZShmaWxlUGF0aDogc3RyaW5nLCBkcnlSdW46IGJvb2xlYW4sIGluUGxhY2U6IGJvb2xlYW4sIGJhY2t1cDogYm9vbGVhbik6IFByb21pc2U8UGF0Y2hpbmdSZXN1bHR8bnVsbD4ge1xuXHRjb25zdCByZXN1bHQ6IFBhdGNoaW5nUmVzdWx0ID0ge1xuXHRcdHBhdGNoZWRQYXRoOiByZXNvbHZlKGRpcm5hbWUoZmlsZVBhdGgpLCBiYXNlbmFtZShmaWxlUGF0aCwgZXh0bmFtZShmaWxlUGF0aCkpICsgXCIucGF0Y2hlZFwiICsgZXh0bmFtZShmaWxlUGF0aCkpLFxuXHRcdHBhdGNoZWRSb3V0aW5lczogW11cblx0fTtcblxuXHRpZiAoaW5QbGFjZSlcblx0XHRyZXN1bHQucGF0Y2hlZFBhdGggPSBmaWxlUGF0aDtcblxuXHRsZXQgYnVmZmVyO1xuXHR0cnl7XG5cdFx0YnVmZmVyID0gYXdhaXQgcmVhZEZpbGUoZmlsZVBhdGgpO1xuXHR9Y2F0Y2goZXJyOiBhbnkpe1xuXHRcdGlmKGVyci5jb2RlID09PSBcIkVJU0RJUlwiKVxuXHRcdFx0Y29uc29sZS5sb2coYCR7ZmlsZVBhdGh9IGlzIGEgZGlyZWN0b3J5LiBTa2lwcGluZy4uLmApO1xuXHRcdGVsc2Vcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIHdoaWxlIG9wZW5pbmcgJHtmaWxlUGF0aH06ICR7ZXJyLm1lc3NhZ2V9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHJlc3VsdC5wYXRjaGVkUm91dGluZXMucHVzaCguLi5yZXBsYWNlQWxsKFxuXHRcdGJ1ZmZlcixcblx0XHRyZWdleGVzLl9fbWtsX3NlcnZfaW50ZWxfY3B1X3RydWUuZmluZCxcblx0XHRyZWdleGVzLl9fbWtsX3NlcnZfaW50ZWxfY3B1X3RydWUucmVwbGFjZVxuXHQpKTtcblxuXHRyZXN1bHQucGF0Y2hlZFJvdXRpbmVzLnB1c2goLi4ucmVwbGFjZUFsbChcblx0XHRidWZmZXIsXG5cdFx0cmVnZXhlcy5fX2ludGVsX2Zhc3RfbWVtc2V0X29yX21lbWNweV9BLmZpbmQsXG5cdFx0cmVnZXhlcy5fX2ludGVsX2Zhc3RfbWVtc2V0X29yX21lbWNweV9BLnJlcGxhY2Vcblx0KSk7XG5cblx0aWYocmVzdWx0LnBhdGNoZWRSb3V0aW5lcy5sZW5ndGgpe1xuXHRcdGlmICghZHJ5UnVuKXtcblxuXHRcdFx0aWYoaW5QbGFjZSAmJiBiYWNrdXApXG5cdFx0XHRcdGF3YWl0IGNvcHlGaWxlKGZpbGVQYXRoLCBmaWxlUGF0aCArIFwiLmJha1wiKTtcblxuXHRcdFx0YXdhaXQgd3JpdGVGaWxlKHJlc3VsdC5wYXRjaGVkUGF0aCwgYnVmZmVyKTtcblx0XHR9XG5cblx0XHRjb25zdCB4YXR0ckNtZCA9IGB4YXR0ciAtY3IgXCIke3Jlc3VsdC5wYXRjaGVkUGF0aH1cImA7XG5cdFx0aWYgKCFkcnlSdW4pXG5cdFx0XHRhd2FpdCBwcm9taXNpZnkoZXhlYykoeGF0dHJDbWQpO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnbkZpbGUoZmlsZVBhdGg6IHN0cmluZywgZHJ5UnVuOiBib29sZWFuKXtcblx0Y29uc3Qgc2lnbkNtZCA9IGBjb2Rlc2lnbiAtLWZvcmNlIC0tZGVlcCAtLXNpZ24gLSBcIiR7ZmlsZVBhdGh9XCJgO1xuXHRpZighZHJ5UnVuKVxuXHRcdGF3YWl0IHByb21pc2lmeShleGVjKShzaWduQ21kKTtcbn1cbiJdfQ==