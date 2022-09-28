"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signFile = exports.clearXAFile = exports.patchFile = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const regexes_1 = __importDefault(require("./regexes"));
const routines_1 = require("./routines");
const utils_1 = require("./utils");
async function patchFile(filePath, options) {
    const result = {
        patchedPath: path_1.resolve(path_1.dirname(filePath), path_1.basename(filePath, path_1.extname(filePath)) + ".patched" + path_1.extname(filePath)),
        patchedRoutines: []
    };
    if (options.inPlace)
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
        if (!options.dryRun) {
            if (options.inPlace && options.backup)
                await promises_1.copyFile(filePath, filePath + ".bak");
            await promises_1.writeFile(result.patchedPath, buffer);
        }
        return result;
    }
    return null;
}
exports.patchFile = patchFile;
async function clearXAFile(filePath, dryRun) {
    if (!dryRun)
        await utils_1.spawnProcess("/usr/bin/xattr", ["-c", filePath]);
}
exports.clearXAFile = clearXAFile;
async function signFile(filePath, dryRun) {
    if (!dryRun)
        await utils_1.spawnProcess("/usr/bin/codesign", ["--force", "--sign", "-", filePath]);
}
exports.signFile = signFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMENBQTREO0FBQzVELCtCQUEyRDtBQUMzRCx3REFBZ0M7QUFDaEMseUNBQXdDO0FBRXhDLG1DQUF1QztBQUVoQyxLQUFLLFVBQVUsU0FBUyxDQUFDLFFBQWdCLEVBQUUsT0FBcUI7SUFDdEUsTUFBTSxNQUFNLEdBQW1CO1FBQzlCLFdBQVcsRUFBRSxjQUFPLENBQUMsY0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGVBQVEsQ0FBQyxRQUFRLEVBQUUsY0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLGNBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvRyxlQUFlLEVBQUUsRUFBRTtLQUNuQixDQUFDO0lBRUYsSUFBSSxPQUFPLENBQUMsT0FBTztRQUNsQixNQUFNLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztJQUUvQixJQUFJLE1BQU0sQ0FBQztJQUNYLElBQUc7UUFDRixNQUFNLEdBQUcsTUFBTSxtQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2xDO0lBQUEsT0FBTSxHQUFRLEVBQUM7UUFDZixJQUFHLEdBQUcsQ0FBQyxJQUFJLEtBQUssUUFBUTtZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSw4QkFBOEIsQ0FBQyxDQUFDOztZQUV2RCxPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixRQUFRLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFbEUsT0FBTyxJQUFJLENBQUM7S0FDWjtJQUVELE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcscUJBQVUsQ0FDeEMsTUFBTSxFQUNOLGlCQUFPLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUN0QyxpQkFBTyxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FDekMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxxQkFBVSxDQUN4QyxNQUFNLEVBQ04saUJBQU8sQ0FBQywrQkFBK0IsQ0FBQyxJQUFJLEVBQzVDLGlCQUFPLENBQUMsK0JBQStCLENBQUMsT0FBTyxDQUMvQyxDQUFDLENBQUM7SUFFSCxJQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDO1lBRW5CLElBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTTtnQkFDbkMsTUFBTSxtQkFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFFN0MsTUFBTSxvQkFBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDNUM7UUFFRCxPQUFPLE1BQU0sQ0FBQztLQUNkO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDYixDQUFDO0FBOUNELDhCQThDQztBQUVNLEtBQUssVUFBVSxXQUFXLENBQUMsUUFBZ0IsRUFBRSxNQUFlO0lBQ2xFLElBQUksQ0FBQyxNQUFNO1FBQ1YsTUFBTSxvQkFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUhELGtDQUdDO0FBRU0sS0FBSyxVQUFVLFFBQVEsQ0FBQyxRQUFnQixFQUFFLE1BQWU7SUFDL0QsSUFBRyxDQUFDLE1BQU07UUFDVCxNQUFNLG9CQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLENBQUM7QUFIRCw0QkFHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvcHlGaWxlLCByZWFkRmlsZSwgd3JpdGVGaWxlIH0gZnJvbSBcImZzL3Byb21pc2VzXCI7XG5pbXBvcnQgeyBiYXNlbmFtZSwgZGlybmFtZSwgZXh0bmFtZSwgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgcmVnZXhlcyBmcm9tIFwiLi9yZWdleGVzXCI7XG5pbXBvcnQgeyByZXBsYWNlQWxsIH0gZnJvbSBcIi4vcm91dGluZXNcIjtcbmltcG9ydCB7IFBhdGNoaW5nUmVzdWx0LCBQYXRjaE9wdGlvbnMgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgc3Bhd25Qcm9jZXNzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBhdGNoRmlsZShmaWxlUGF0aDogc3RyaW5nLCBvcHRpb25zOiBQYXRjaE9wdGlvbnMpOiBQcm9taXNlPFBhdGNoaW5nUmVzdWx0fG51bGw+IHtcblx0Y29uc3QgcmVzdWx0OiBQYXRjaGluZ1Jlc3VsdCA9IHtcblx0XHRwYXRjaGVkUGF0aDogcmVzb2x2ZShkaXJuYW1lKGZpbGVQYXRoKSwgYmFzZW5hbWUoZmlsZVBhdGgsIGV4dG5hbWUoZmlsZVBhdGgpKSArIFwiLnBhdGNoZWRcIiArIGV4dG5hbWUoZmlsZVBhdGgpKSxcblx0XHRwYXRjaGVkUm91dGluZXM6IFtdXG5cdH07XG5cblx0aWYgKG9wdGlvbnMuaW5QbGFjZSlcblx0XHRyZXN1bHQucGF0Y2hlZFBhdGggPSBmaWxlUGF0aDtcblxuXHRsZXQgYnVmZmVyO1xuXHR0cnl7XG5cdFx0YnVmZmVyID0gYXdhaXQgcmVhZEZpbGUoZmlsZVBhdGgpO1xuXHR9Y2F0Y2goZXJyOiBhbnkpe1xuXHRcdGlmKGVyci5jb2RlID09PSBcIkVJU0RJUlwiKVxuXHRcdFx0Y29uc29sZS5sb2coYCR7ZmlsZVBhdGh9IGlzIGEgZGlyZWN0b3J5LiBTa2lwcGluZy4uLmApO1xuXHRcdGVsc2Vcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIHdoaWxlIG9wZW5pbmcgJHtmaWxlUGF0aH06ICR7ZXJyLm1lc3NhZ2V9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHJlc3VsdC5wYXRjaGVkUm91dGluZXMucHVzaCguLi5yZXBsYWNlQWxsKFxuXHRcdGJ1ZmZlcixcblx0XHRyZWdleGVzLl9fbWtsX3NlcnZfaW50ZWxfY3B1X3RydWUuZmluZCxcblx0XHRyZWdleGVzLl9fbWtsX3NlcnZfaW50ZWxfY3B1X3RydWUucmVwbGFjZVxuXHQpKTtcblxuXHRyZXN1bHQucGF0Y2hlZFJvdXRpbmVzLnB1c2goLi4ucmVwbGFjZUFsbChcblx0XHRidWZmZXIsXG5cdFx0cmVnZXhlcy5fX2ludGVsX2Zhc3RfbWVtc2V0X29yX21lbWNweV9BLmZpbmQsXG5cdFx0cmVnZXhlcy5fX2ludGVsX2Zhc3RfbWVtc2V0X29yX21lbWNweV9BLnJlcGxhY2Vcblx0KSk7XG5cblx0aWYocmVzdWx0LnBhdGNoZWRSb3V0aW5lcy5sZW5ndGgpe1xuXHRcdGlmICghb3B0aW9ucy5kcnlSdW4pe1xuXG5cdFx0XHRpZihvcHRpb25zLmluUGxhY2UgJiYgb3B0aW9ucy5iYWNrdXApXG5cdFx0XHRcdGF3YWl0IGNvcHlGaWxlKGZpbGVQYXRoLCBmaWxlUGF0aCArIFwiLmJha1wiKTtcblxuXHRcdFx0YXdhaXQgd3JpdGVGaWxlKHJlc3VsdC5wYXRjaGVkUGF0aCwgYnVmZmVyKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0cmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbGVhclhBRmlsZShmaWxlUGF0aDogc3RyaW5nLCBkcnlSdW46IGJvb2xlYW4pe1xuXHRpZiAoIWRyeVJ1bilcblx0XHRhd2FpdCBzcGF3blByb2Nlc3MoXCIvdXNyL2Jpbi94YXR0clwiLCBbXCItY1wiLCBmaWxlUGF0aF0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnbkZpbGUoZmlsZVBhdGg6IHN0cmluZywgZHJ5UnVuOiBib29sZWFuKXtcblx0aWYoIWRyeVJ1bilcblx0XHRhd2FpdCBzcGF3blByb2Nlc3MoXCIvdXNyL2Jpbi9jb2Rlc2lnblwiLCBbXCItLWZvcmNlXCIsIFwiLS1zaWduXCIsIFwiLVwiLCBmaWxlUGF0aF0pO1xufVxuIl19