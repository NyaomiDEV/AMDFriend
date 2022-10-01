"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signFile = exports.clearXAFile = exports.patchFile = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const os_1 = require("os");
const path_1 = require("path");
const regexes_1 = __importDefault(require("./regexes"));
const routines_1 = require("./routines");
const utils_1 = require("./utils");
const _tempDir = fs_1.mkdtempSync(path_1.resolve(os_1.tmpdir(), "amdfriend-"));
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
            const _tempFile = path_1.resolve(_tempDir, utils_1.md5(filePath + Date.now().toString()));
            await promises_1.writeFile(_tempFile, buffer);
            if (options.clearXA)
                await clearXAFile(_tempFile);
            if (options.sign)
                await signFile(_tempFile);
            await promises_1.rename(_tempFile, result.patchedPath);
        }
        return result;
    }
    return null;
}
exports.patchFile = patchFile;
async function clearXAFile(filePath) {
    return await utils_1.spawnProcess("/usr/bin/xattr", ["-c", filePath]);
}
exports.clearXAFile = clearXAFile;
async function signFile(filePath) {
    return await utils_1.spawnProcess("/usr/bin/codesign", ["--force", "--sign", "-", filePath]);
}
exports.signFile = signFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMkJBQWlDO0FBQ2pDLDBDQUFvRTtBQUNwRSwyQkFBNEI7QUFDNUIsK0JBQTJEO0FBQzNELHdEQUFnQztBQUNoQyx5Q0FBd0M7QUFFeEMsbUNBQTRDO0FBRTVDLE1BQU0sUUFBUSxHQUFHLGdCQUFXLENBQUMsY0FBTyxDQUFDLFdBQU0sRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7QUFFdkQsS0FBSyxVQUFVLFNBQVMsQ0FBQyxRQUFnQixFQUFFLE9BQXFCO0lBQ3RFLE1BQU0sTUFBTSxHQUFtQjtRQUM5QixXQUFXLEVBQUUsY0FBTyxDQUFDLGNBQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFRLENBQUMsUUFBUSxFQUFFLGNBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxjQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0csZUFBZSxFQUFFLEVBQUU7S0FDbkIsQ0FBQztJQUVGLElBQUksT0FBTyxDQUFDLE9BQU87UUFDbEIsTUFBTSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7SUFFL0IsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFHO1FBQ0YsTUFBTSxHQUFHLE1BQU0sbUJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNsQztJQUFBLE9BQU0sR0FBUSxFQUFDO1FBQ2YsSUFBRyxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVE7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsOEJBQThCLENBQUMsQ0FBQzs7WUFFdkQsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsUUFBUSxLQUFLLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRWxFLE9BQU8sSUFBSSxDQUFDO0tBQ1o7SUFFRCxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLHFCQUFVLENBQ3hDLE1BQU0sRUFDTixpQkFBTyxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFDdEMsaUJBQU8sQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLENBQ3pDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcscUJBQVUsQ0FDeEMsTUFBTSxFQUNOLGlCQUFPLENBQUMsK0JBQStCLENBQUMsSUFBSSxFQUM1QyxpQkFBTyxDQUFDLCtCQUErQixDQUFDLE9BQU8sQ0FDL0MsQ0FBQyxDQUFDO0lBRUgsSUFBRyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBQztZQUVuQixJQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU07Z0JBQ25DLE1BQU0sbUJBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1lBRTdDLE1BQU0sU0FBUyxHQUFHLGNBQU8sQ0FBQyxRQUFRLEVBQUUsV0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNFLE1BQU0sb0JBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFbkMsSUFBSSxPQUFPLENBQUMsT0FBTztnQkFDbEIsTUFBTSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFOUIsSUFBSSxPQUFPLENBQUMsSUFBSTtnQkFDZixNQUFNLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUUzQixNQUFNLGlCQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUM1QztRQUVELE9BQU8sTUFBTSxDQUFDO0tBQ2Q7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNiLENBQUM7QUF2REQsOEJBdURDO0FBRU0sS0FBSyxVQUFVLFdBQVcsQ0FBQyxRQUFnQjtJQUNqRCxPQUFPLE1BQU0sb0JBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFGRCxrQ0FFQztBQUVNLEtBQUssVUFBVSxRQUFRLENBQUMsUUFBZ0I7SUFDOUMsT0FBTyxNQUFNLG9CQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ3RGLENBQUM7QUFGRCw0QkFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1rZHRlbXBTeW5jIH0gZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBjb3B5RmlsZSwgcmVhZEZpbGUsIHJlbmFtZSwgd3JpdGVGaWxlIH0gZnJvbSBcImZzL3Byb21pc2VzXCI7XG5pbXBvcnQgeyB0bXBkaXIgfSBmcm9tIFwib3NcIjtcbmltcG9ydCB7IGJhc2VuYW1lLCBkaXJuYW1lLCBleHRuYW1lLCByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCByZWdleGVzIGZyb20gXCIuL3JlZ2V4ZXNcIjtcbmltcG9ydCB7IHJlcGxhY2VBbGwgfSBmcm9tIFwiLi9yb3V0aW5lc1wiO1xuaW1wb3J0IHsgUGF0Y2hpbmdSZXN1bHQsIFBhdGNoT3B0aW9ucyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBtZDUsIHNwYXduUHJvY2VzcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmNvbnN0IF90ZW1wRGlyID0gbWtkdGVtcFN5bmMocmVzb2x2ZSh0bXBkaXIoKSwgXCJhbWRmcmllbmQtXCIpKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBhdGNoRmlsZShmaWxlUGF0aDogc3RyaW5nLCBvcHRpb25zOiBQYXRjaE9wdGlvbnMpOiBQcm9taXNlPFBhdGNoaW5nUmVzdWx0fG51bGw+IHtcblx0Y29uc3QgcmVzdWx0OiBQYXRjaGluZ1Jlc3VsdCA9IHtcblx0XHRwYXRjaGVkUGF0aDogcmVzb2x2ZShkaXJuYW1lKGZpbGVQYXRoKSwgYmFzZW5hbWUoZmlsZVBhdGgsIGV4dG5hbWUoZmlsZVBhdGgpKSArIFwiLnBhdGNoZWRcIiArIGV4dG5hbWUoZmlsZVBhdGgpKSxcblx0XHRwYXRjaGVkUm91dGluZXM6IFtdXG5cdH07XG5cblx0aWYgKG9wdGlvbnMuaW5QbGFjZSlcblx0XHRyZXN1bHQucGF0Y2hlZFBhdGggPSBmaWxlUGF0aDtcblxuXHRsZXQgYnVmZmVyO1xuXHR0cnl7XG5cdFx0YnVmZmVyID0gYXdhaXQgcmVhZEZpbGUoZmlsZVBhdGgpO1xuXHR9Y2F0Y2goZXJyOiBhbnkpe1xuXHRcdGlmKGVyci5jb2RlID09PSBcIkVJU0RJUlwiKVxuXHRcdFx0Y29uc29sZS5sb2coYCR7ZmlsZVBhdGh9IGlzIGEgZGlyZWN0b3J5LiBTa2lwcGluZy4uLmApO1xuXHRcdGVsc2Vcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIHdoaWxlIG9wZW5pbmcgJHtmaWxlUGF0aH06ICR7ZXJyLm1lc3NhZ2V9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHJlc3VsdC5wYXRjaGVkUm91dGluZXMucHVzaCguLi5yZXBsYWNlQWxsKFxuXHRcdGJ1ZmZlcixcblx0XHRyZWdleGVzLl9fbWtsX3NlcnZfaW50ZWxfY3B1X3RydWUuZmluZCxcblx0XHRyZWdleGVzLl9fbWtsX3NlcnZfaW50ZWxfY3B1X3RydWUucmVwbGFjZVxuXHQpKTtcblxuXHRyZXN1bHQucGF0Y2hlZFJvdXRpbmVzLnB1c2goLi4ucmVwbGFjZUFsbChcblx0XHRidWZmZXIsXG5cdFx0cmVnZXhlcy5fX2ludGVsX2Zhc3RfbWVtc2V0X29yX21lbWNweV9BLmZpbmQsXG5cdFx0cmVnZXhlcy5fX2ludGVsX2Zhc3RfbWVtc2V0X29yX21lbWNweV9BLnJlcGxhY2Vcblx0KSk7XG5cblx0aWYocmVzdWx0LnBhdGNoZWRSb3V0aW5lcy5sZW5ndGgpe1xuXHRcdGlmICghb3B0aW9ucy5kcnlSdW4pe1xuXG5cdFx0XHRpZihvcHRpb25zLmluUGxhY2UgJiYgb3B0aW9ucy5iYWNrdXApXG5cdFx0XHRcdGF3YWl0IGNvcHlGaWxlKGZpbGVQYXRoLCBmaWxlUGF0aCArIFwiLmJha1wiKTtcblxuXHRcdFx0Y29uc3QgX3RlbXBGaWxlID0gcmVzb2x2ZShfdGVtcERpciwgbWQ1KGZpbGVQYXRoICsgRGF0ZS5ub3coKS50b1N0cmluZygpKSk7XG5cdFx0XHRhd2FpdCB3cml0ZUZpbGUoX3RlbXBGaWxlLCBidWZmZXIpO1xuXG5cdFx0XHRpZiAob3B0aW9ucy5jbGVhclhBKVxuXHRcdFx0XHRhd2FpdCBjbGVhclhBRmlsZShfdGVtcEZpbGUpO1xuXG5cdFx0XHRpZiAob3B0aW9ucy5zaWduKVxuXHRcdFx0XHRhd2FpdCBzaWduRmlsZShfdGVtcEZpbGUpO1xuXG5cdFx0XHRhd2FpdCByZW5hbWUoX3RlbXBGaWxlLCByZXN1bHQucGF0Y2hlZFBhdGgpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNsZWFyWEFGaWxlKGZpbGVQYXRoOiBzdHJpbmcpe1xuXHRyZXR1cm4gYXdhaXQgc3Bhd25Qcm9jZXNzKFwiL3Vzci9iaW4veGF0dHJcIiwgW1wiLWNcIiwgZmlsZVBhdGhdKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ25GaWxlKGZpbGVQYXRoOiBzdHJpbmcpe1xuXHRyZXR1cm4gYXdhaXQgc3Bhd25Qcm9jZXNzKFwiL3Vzci9iaW4vY29kZXNpZ25cIiwgW1wiLS1mb3JjZVwiLCBcIi0tc2lnblwiLCBcIi1cIiwgZmlsZVBhdGhdKTtcbn1cbiJdfQ==