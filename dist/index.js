"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signFile = exports.clearXAFile = exports.patchFile = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const regexes_1 = __importDefault(require("./regexes"));
const routines_1 = require("./routines");
const utils_1 = require("./utils");
const _tempDir = fs_1.mkdtempSync("amdfriend");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMkJBQWlDO0FBQ2pDLDBDQUFvRTtBQUNwRSwrQkFBMkQ7QUFDM0Qsd0RBQWdDO0FBQ2hDLHlDQUF3QztBQUV4QyxtQ0FBNEM7QUFFNUMsTUFBTSxRQUFRLEdBQUcsZ0JBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUVuQyxLQUFLLFVBQVUsU0FBUyxDQUFDLFFBQWdCLEVBQUUsT0FBcUI7SUFDdEUsTUFBTSxNQUFNLEdBQW1CO1FBQzlCLFdBQVcsRUFBRSxjQUFPLENBQUMsY0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGVBQVEsQ0FBQyxRQUFRLEVBQUUsY0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLGNBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvRyxlQUFlLEVBQUUsRUFBRTtLQUNuQixDQUFDO0lBRUYsSUFBSSxPQUFPLENBQUMsT0FBTztRQUNsQixNQUFNLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztJQUUvQixJQUFJLE1BQU0sQ0FBQztJQUNYLElBQUc7UUFDRixNQUFNLEdBQUcsTUFBTSxtQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2xDO0lBQUEsT0FBTSxHQUFRLEVBQUM7UUFDZixJQUFHLEdBQUcsQ0FBQyxJQUFJLEtBQUssUUFBUTtZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSw4QkFBOEIsQ0FBQyxDQUFDOztZQUV2RCxPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixRQUFRLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFbEUsT0FBTyxJQUFJLENBQUM7S0FDWjtJQUVELE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcscUJBQVUsQ0FDeEMsTUFBTSxFQUNOLGlCQUFPLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUN0QyxpQkFBTyxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FDekMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxxQkFBVSxDQUN4QyxNQUFNLEVBQ04saUJBQU8sQ0FBQywrQkFBK0IsQ0FBQyxJQUFJLEVBQzVDLGlCQUFPLENBQUMsK0JBQStCLENBQUMsT0FBTyxDQUMvQyxDQUFDLENBQUM7SUFFSCxJQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDO1lBRW5CLElBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTTtnQkFDbkMsTUFBTSxtQkFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFFN0MsTUFBTSxTQUFTLEdBQUcsY0FBTyxDQUFDLFFBQVEsRUFBRSxXQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0UsTUFBTSxvQkFBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVuQyxJQUFJLE9BQU8sQ0FBQyxPQUFPO2dCQUNsQixNQUFNLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUU5QixJQUFJLE9BQU8sQ0FBQyxJQUFJO2dCQUNmLE1BQU0sUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTNCLE1BQU0saUJBQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzVDO1FBRUQsT0FBTyxNQUFNLENBQUM7S0FDZDtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2IsQ0FBQztBQXZERCw4QkF1REM7QUFFTSxLQUFLLFVBQVUsV0FBVyxDQUFDLFFBQWdCO0lBQ2pELE9BQU8sTUFBTSxvQkFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUZELGtDQUVDO0FBRU0sS0FBSyxVQUFVLFFBQVEsQ0FBQyxRQUFnQjtJQUM5QyxPQUFPLE1BQU0sb0JBQVksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDdEYsQ0FBQztBQUZELDRCQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWtkdGVtcFN5bmMgfSBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IGNvcHlGaWxlLCByZWFkRmlsZSwgcmVuYW1lLCB3cml0ZUZpbGUgfSBmcm9tIFwiZnMvcHJvbWlzZXNcIjtcbmltcG9ydCB7IGJhc2VuYW1lLCBkaXJuYW1lLCBleHRuYW1lLCByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCByZWdleGVzIGZyb20gXCIuL3JlZ2V4ZXNcIjtcbmltcG9ydCB7IHJlcGxhY2VBbGwgfSBmcm9tIFwiLi9yb3V0aW5lc1wiO1xuaW1wb3J0IHsgUGF0Y2hpbmdSZXN1bHQsIFBhdGNoT3B0aW9ucyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBtZDUsIHNwYXduUHJvY2VzcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmNvbnN0IF90ZW1wRGlyID0gbWtkdGVtcFN5bmMoXCJhbWRmcmllbmRcIik7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwYXRjaEZpbGUoZmlsZVBhdGg6IHN0cmluZywgb3B0aW9uczogUGF0Y2hPcHRpb25zKTogUHJvbWlzZTxQYXRjaGluZ1Jlc3VsdHxudWxsPiB7XG5cdGNvbnN0IHJlc3VsdDogUGF0Y2hpbmdSZXN1bHQgPSB7XG5cdFx0cGF0Y2hlZFBhdGg6IHJlc29sdmUoZGlybmFtZShmaWxlUGF0aCksIGJhc2VuYW1lKGZpbGVQYXRoLCBleHRuYW1lKGZpbGVQYXRoKSkgKyBcIi5wYXRjaGVkXCIgKyBleHRuYW1lKGZpbGVQYXRoKSksXG5cdFx0cGF0Y2hlZFJvdXRpbmVzOiBbXVxuXHR9O1xuXG5cdGlmIChvcHRpb25zLmluUGxhY2UpXG5cdFx0cmVzdWx0LnBhdGNoZWRQYXRoID0gZmlsZVBhdGg7XG5cblx0bGV0IGJ1ZmZlcjtcblx0dHJ5e1xuXHRcdGJ1ZmZlciA9IGF3YWl0IHJlYWRGaWxlKGZpbGVQYXRoKTtcblx0fWNhdGNoKGVycjogYW55KXtcblx0XHRpZihlcnIuY29kZSA9PT0gXCJFSVNESVJcIilcblx0XHRcdGNvbnNvbGUubG9nKGAke2ZpbGVQYXRofSBpcyBhIGRpcmVjdG9yeS4gU2tpcHBpbmcuLi5gKTtcblx0XHRlbHNlXG5cdFx0XHRjb25zb2xlLmVycm9yKGBFcnJvciB3aGlsZSBvcGVuaW5nICR7ZmlsZVBhdGh9OiAke2Vyci5tZXNzYWdlfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRyZXN1bHQucGF0Y2hlZFJvdXRpbmVzLnB1c2goLi4ucmVwbGFjZUFsbChcblx0XHRidWZmZXIsXG5cdFx0cmVnZXhlcy5fX21rbF9zZXJ2X2ludGVsX2NwdV90cnVlLmZpbmQsXG5cdFx0cmVnZXhlcy5fX21rbF9zZXJ2X2ludGVsX2NwdV90cnVlLnJlcGxhY2Vcblx0KSk7XG5cblx0cmVzdWx0LnBhdGNoZWRSb3V0aW5lcy5wdXNoKC4uLnJlcGxhY2VBbGwoXG5cdFx0YnVmZmVyLFxuXHRcdHJlZ2V4ZXMuX19pbnRlbF9mYXN0X21lbXNldF9vcl9tZW1jcHlfQS5maW5kLFxuXHRcdHJlZ2V4ZXMuX19pbnRlbF9mYXN0X21lbXNldF9vcl9tZW1jcHlfQS5yZXBsYWNlXG5cdCkpO1xuXG5cdGlmKHJlc3VsdC5wYXRjaGVkUm91dGluZXMubGVuZ3RoKXtcblx0XHRpZiAoIW9wdGlvbnMuZHJ5UnVuKXtcblxuXHRcdFx0aWYob3B0aW9ucy5pblBsYWNlICYmIG9wdGlvbnMuYmFja3VwKVxuXHRcdFx0XHRhd2FpdCBjb3B5RmlsZShmaWxlUGF0aCwgZmlsZVBhdGggKyBcIi5iYWtcIik7XG5cblx0XHRcdGNvbnN0IF90ZW1wRmlsZSA9IHJlc29sdmUoX3RlbXBEaXIsIG1kNShmaWxlUGF0aCArIERhdGUubm93KCkudG9TdHJpbmcoKSkpO1xuXHRcdFx0YXdhaXQgd3JpdGVGaWxlKF90ZW1wRmlsZSwgYnVmZmVyKTtcblxuXHRcdFx0aWYgKG9wdGlvbnMuY2xlYXJYQSlcblx0XHRcdFx0YXdhaXQgY2xlYXJYQUZpbGUoX3RlbXBGaWxlKTtcblxuXHRcdFx0aWYgKG9wdGlvbnMuc2lnbilcblx0XHRcdFx0YXdhaXQgc2lnbkZpbGUoX3RlbXBGaWxlKTtcblxuXHRcdFx0YXdhaXQgcmVuYW1lKF90ZW1wRmlsZSwgcmVzdWx0LnBhdGNoZWRQYXRoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0cmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbGVhclhBRmlsZShmaWxlUGF0aDogc3RyaW5nKXtcblx0cmV0dXJuIGF3YWl0IHNwYXduUHJvY2VzcyhcIi91c3IvYmluL3hhdHRyXCIsIFtcIi1jXCIsIGZpbGVQYXRoXSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaWduRmlsZShmaWxlUGF0aDogc3RyaW5nKXtcblx0cmV0dXJuIGF3YWl0IHNwYXduUHJvY2VzcyhcIi91c3IvYmluL2NvZGVzaWduXCIsIFtcIi0tZm9yY2VcIiwgXCItLXNpZ25cIiwgXCItXCIsIGZpbGVQYXRoXSk7XG59XG4iXX0=