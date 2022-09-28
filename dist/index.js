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
            const _tempFile = path_1.resolve(_tempDir, path_1.basename(filePath));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMkJBQWlDO0FBQ2pDLDBDQUFvRTtBQUNwRSwrQkFBMkQ7QUFDM0Qsd0RBQWdDO0FBQ2hDLHlDQUF3QztBQUV4QyxtQ0FBdUM7QUFFdkMsTUFBTSxRQUFRLEdBQUcsZ0JBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUVuQyxLQUFLLFVBQVUsU0FBUyxDQUFDLFFBQWdCLEVBQUUsT0FBcUI7SUFDdEUsTUFBTSxNQUFNLEdBQW1CO1FBQzlCLFdBQVcsRUFBRSxjQUFPLENBQUMsY0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGVBQVEsQ0FBQyxRQUFRLEVBQUUsY0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLGNBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvRyxlQUFlLEVBQUUsRUFBRTtLQUNuQixDQUFDO0lBRUYsSUFBSSxPQUFPLENBQUMsT0FBTztRQUNsQixNQUFNLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztJQUUvQixJQUFJLE1BQU0sQ0FBQztJQUNYLElBQUc7UUFDRixNQUFNLEdBQUcsTUFBTSxtQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2xDO0lBQUEsT0FBTSxHQUFRLEVBQUM7UUFDZixJQUFHLEdBQUcsQ0FBQyxJQUFJLEtBQUssUUFBUTtZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSw4QkFBOEIsQ0FBQyxDQUFDOztZQUV2RCxPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixRQUFRLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFbEUsT0FBTyxJQUFJLENBQUM7S0FDWjtJQUVELE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcscUJBQVUsQ0FDeEMsTUFBTSxFQUNOLGlCQUFPLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUN0QyxpQkFBTyxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FDekMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxxQkFBVSxDQUN4QyxNQUFNLEVBQ04saUJBQU8sQ0FBQywrQkFBK0IsQ0FBQyxJQUFJLEVBQzVDLGlCQUFPLENBQUMsK0JBQStCLENBQUMsT0FBTyxDQUMvQyxDQUFDLENBQUM7SUFFSCxJQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDO1lBRW5CLElBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTTtnQkFDbkMsTUFBTSxtQkFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFFN0MsTUFBTSxTQUFTLEdBQUcsY0FBTyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN4RCxNQUFNLG9CQUFTLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRW5DLElBQUksT0FBTyxDQUFDLE9BQU87Z0JBQ2xCLE1BQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTlCLElBQUksT0FBTyxDQUFDLElBQUk7Z0JBQ2YsTUFBTSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFM0IsTUFBTSxpQkFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDNUM7UUFFRCxPQUFPLE1BQU0sQ0FBQztLQUNkO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDYixDQUFDO0FBdkRELDhCQXVEQztBQUVNLEtBQUssVUFBVSxXQUFXLENBQUMsUUFBZ0I7SUFDakQsT0FBTyxNQUFNLG9CQUFZLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBRkQsa0NBRUM7QUFFTSxLQUFLLFVBQVUsUUFBUSxDQUFDLFFBQWdCO0lBQzlDLE9BQU8sTUFBTSxvQkFBWSxDQUFDLG1CQUFtQixFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBRkQsNEJBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBta2R0ZW1wU3luYyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgY29weUZpbGUsIHJlYWRGaWxlLCByZW5hbWUsIHdyaXRlRmlsZSB9IGZyb20gXCJmcy9wcm9taXNlc1wiO1xuaW1wb3J0IHsgYmFzZW5hbWUsIGRpcm5hbWUsIGV4dG5hbWUsIHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHJlZ2V4ZXMgZnJvbSBcIi4vcmVnZXhlc1wiO1xuaW1wb3J0IHsgcmVwbGFjZUFsbCB9IGZyb20gXCIuL3JvdXRpbmVzXCI7XG5pbXBvcnQgeyBQYXRjaGluZ1Jlc3VsdCwgUGF0Y2hPcHRpb25zIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IHNwYXduUHJvY2VzcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmNvbnN0IF90ZW1wRGlyID0gbWtkdGVtcFN5bmMoXCJhbWRmcmllbmRcIik7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwYXRjaEZpbGUoZmlsZVBhdGg6IHN0cmluZywgb3B0aW9uczogUGF0Y2hPcHRpb25zKTogUHJvbWlzZTxQYXRjaGluZ1Jlc3VsdHxudWxsPiB7XG5cdGNvbnN0IHJlc3VsdDogUGF0Y2hpbmdSZXN1bHQgPSB7XG5cdFx0cGF0Y2hlZFBhdGg6IHJlc29sdmUoZGlybmFtZShmaWxlUGF0aCksIGJhc2VuYW1lKGZpbGVQYXRoLCBleHRuYW1lKGZpbGVQYXRoKSkgKyBcIi5wYXRjaGVkXCIgKyBleHRuYW1lKGZpbGVQYXRoKSksXG5cdFx0cGF0Y2hlZFJvdXRpbmVzOiBbXVxuXHR9O1xuXG5cdGlmIChvcHRpb25zLmluUGxhY2UpXG5cdFx0cmVzdWx0LnBhdGNoZWRQYXRoID0gZmlsZVBhdGg7XG5cblx0bGV0IGJ1ZmZlcjtcblx0dHJ5e1xuXHRcdGJ1ZmZlciA9IGF3YWl0IHJlYWRGaWxlKGZpbGVQYXRoKTtcblx0fWNhdGNoKGVycjogYW55KXtcblx0XHRpZihlcnIuY29kZSA9PT0gXCJFSVNESVJcIilcblx0XHRcdGNvbnNvbGUubG9nKGAke2ZpbGVQYXRofSBpcyBhIGRpcmVjdG9yeS4gU2tpcHBpbmcuLi5gKTtcblx0XHRlbHNlXG5cdFx0XHRjb25zb2xlLmVycm9yKGBFcnJvciB3aGlsZSBvcGVuaW5nICR7ZmlsZVBhdGh9OiAke2Vyci5tZXNzYWdlfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRyZXN1bHQucGF0Y2hlZFJvdXRpbmVzLnB1c2goLi4ucmVwbGFjZUFsbChcblx0XHRidWZmZXIsXG5cdFx0cmVnZXhlcy5fX21rbF9zZXJ2X2ludGVsX2NwdV90cnVlLmZpbmQsXG5cdFx0cmVnZXhlcy5fX21rbF9zZXJ2X2ludGVsX2NwdV90cnVlLnJlcGxhY2Vcblx0KSk7XG5cblx0cmVzdWx0LnBhdGNoZWRSb3V0aW5lcy5wdXNoKC4uLnJlcGxhY2VBbGwoXG5cdFx0YnVmZmVyLFxuXHRcdHJlZ2V4ZXMuX19pbnRlbF9mYXN0X21lbXNldF9vcl9tZW1jcHlfQS5maW5kLFxuXHRcdHJlZ2V4ZXMuX19pbnRlbF9mYXN0X21lbXNldF9vcl9tZW1jcHlfQS5yZXBsYWNlXG5cdCkpO1xuXG5cdGlmKHJlc3VsdC5wYXRjaGVkUm91dGluZXMubGVuZ3RoKXtcblx0XHRpZiAoIW9wdGlvbnMuZHJ5UnVuKXtcblxuXHRcdFx0aWYob3B0aW9ucy5pblBsYWNlICYmIG9wdGlvbnMuYmFja3VwKVxuXHRcdFx0XHRhd2FpdCBjb3B5RmlsZShmaWxlUGF0aCwgZmlsZVBhdGggKyBcIi5iYWtcIik7XG5cblx0XHRcdGNvbnN0IF90ZW1wRmlsZSA9IHJlc29sdmUoX3RlbXBEaXIsIGJhc2VuYW1lKGZpbGVQYXRoKSk7XG5cdFx0XHRhd2FpdCB3cml0ZUZpbGUoX3RlbXBGaWxlLCBidWZmZXIpO1xuXG5cdFx0XHRpZiAob3B0aW9ucy5jbGVhclhBKVxuXHRcdFx0XHRhd2FpdCBjbGVhclhBRmlsZShfdGVtcEZpbGUpO1xuXG5cdFx0XHRpZiAob3B0aW9ucy5zaWduKVxuXHRcdFx0XHRhd2FpdCBzaWduRmlsZShfdGVtcEZpbGUpO1xuXG5cdFx0XHRhd2FpdCByZW5hbWUoX3RlbXBGaWxlLCByZXN1bHQucGF0Y2hlZFBhdGgpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNsZWFyWEFGaWxlKGZpbGVQYXRoOiBzdHJpbmcpe1xuXHRyZXR1cm4gYXdhaXQgc3Bhd25Qcm9jZXNzKFwiL3Vzci9iaW4veGF0dHJcIiwgW1wiLWNcIiwgZmlsZVBhdGhdKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ25GaWxlKGZpbGVQYXRoOiBzdHJpbmcpe1xuXHRyZXR1cm4gYXdhaXQgc3Bhd25Qcm9jZXNzKFwiL3Vzci9iaW4vY29kZXNpZ25cIiwgW1wiLS1mb3JjZVwiLCBcIi0tc2lnblwiLCBcIi1cIiwgZmlsZVBhdGhdKTtcbn1cbiJdfQ==