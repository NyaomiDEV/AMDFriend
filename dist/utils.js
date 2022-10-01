"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = exports.spawnProcess = exports.walkDirectory = exports.walkDirectoryOld = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const child_process_1 = require("child_process");
const crypto_1 = require("crypto");
function walkDirectoryOld(dir, fileTypes, exclude) {
    const result = [];
    function __walk(currentPath) {
        const files = fs_1.readdirSync(currentPath);
        for (const i in files) {
            const curFile = path_1.resolve(currentPath, files[i]);
            const _stat = fs_1.statSync(curFile);
            if (_stat.isFile() && fileTypes.includes(path_1.extname(curFile)) && !exclude.includes(path_1.basename(curFile)))
                result.push(curFile);
            else if (_stat.isDirectory())
                __walk(curFile);
        }
    }
    __walk(dir);
    return result;
}
exports.walkDirectoryOld = walkDirectoryOld;
function walkDirectory(dir, fileTypes, exclude) {
    const result = [];
    const files = fs_1.readdirSync(dir, { withFileTypes: true });
    for (const dirent of files) {
        dirent.name = path_1.resolve(dir, dirent.name);
        if (dirent.isFile() && fileTypes.includes(path_1.extname(dirent.name)) && !exclude.includes(path_1.basename(dirent.name)))
            result.push(dirent);
        else if (dirent.isDirectory())
            result.push(...walkDirectory(dirent.name, fileTypes, exclude));
    }
    return result;
}
exports.walkDirectory = walkDirectory;
function spawnProcess(command, args) {
    return new Promise((resolve, reject) => {
        const spawnedProcess = child_process_1.spawn(command, args, { stdio: "inherit" });
        spawnedProcess.on("exit", code => {
            if (code)
                reject(code);
            resolve(code);
        });
    });
}
exports.spawnProcess = spawnProcess;
function md5(data) {
    return crypto_1.createHash("md5").update(data).digest("hex");
}
exports.md5 = md5;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkJBQW1EO0FBQ25ELCtCQUFrRDtBQUNsRCxpREFBc0M7QUFDdEMsbUNBQW9DO0FBRXBDLFNBQWdCLGdCQUFnQixDQUFDLEdBQVcsRUFBRSxTQUFtQixFQUFFLE9BQWlCO0lBQ25GLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUU1QixTQUFTLE1BQU0sQ0FBQyxXQUFXO1FBQzFCLE1BQU0sS0FBSyxHQUFHLGdCQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkMsS0FBSyxNQUFNLENBQUMsSUFBSSxLQUFLLEVBQUU7WUFDdEIsTUFBTSxPQUFPLEdBQUcsY0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxNQUFNLEtBQUssR0FBRyxhQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDaEMsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNqQixJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7Z0JBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNqQjtJQUNGLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixPQUFPLE1BQU0sQ0FBQztBQUNmLENBQUM7QUFqQkQsNENBaUJDO0FBRUQsU0FBZ0IsYUFBYSxDQUFDLEdBQVcsRUFBRSxTQUFtQixFQUFFLE9BQWlCO0lBQ2hGLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUM1QixNQUFNLEtBQUssR0FBRyxnQkFBVyxDQUFDLEdBQUcsRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRXhELEtBQUssTUFBTSxNQUFNLElBQUksS0FBSyxFQUFFO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsY0FBTyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGVBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNoQixJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUU7WUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ2hFO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDZixDQUFDO0FBZEQsc0NBY0M7QUFFRCxTQUFnQixZQUFZLENBQUMsT0FBZSxFQUFFLElBQWM7SUFDM0QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUN0QyxNQUFNLGNBQWMsR0FBRyxxQkFBSyxDQUMzQixPQUFPLEVBQ1AsSUFBSSxFQUNKLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUNwQixDQUFDO1FBRUYsY0FBYyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDaEMsSUFBSSxJQUFJO2dCQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVkLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBZkQsb0NBZUM7QUFFRCxTQUFnQixHQUFHLENBQUMsSUFBWTtJQUMvQixPQUFPLG1CQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRkQsa0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlbnQsIHJlYWRkaXJTeW5jLCBzdGF0U3luYyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgcmVzb2x2ZSwgZXh0bmFtZSwgYmFzZW5hbWUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgc3Bhd24gfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgY3JlYXRlSGFzaCB9IGZyb20gXCJjcnlwdG9cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHdhbGtEaXJlY3RvcnlPbGQoZGlyOiBzdHJpbmcsIGZpbGVUeXBlczogc3RyaW5nW10sIGV4Y2x1ZGU6IHN0cmluZ1tdKTogc3RyaW5nW117XG5cdGNvbnN0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblxuXHRmdW5jdGlvbiBfX3dhbGsoY3VycmVudFBhdGgpIHtcblx0XHRjb25zdCBmaWxlcyA9IHJlYWRkaXJTeW5jKGN1cnJlbnRQYXRoKTtcblx0XHRmb3IgKGNvbnN0IGkgaW4gZmlsZXMpIHtcblx0XHRcdGNvbnN0IGN1ckZpbGUgPSByZXNvbHZlKGN1cnJlbnRQYXRoLCBmaWxlc1tpXSk7XG5cdFx0XHRjb25zdCBfc3RhdCA9IHN0YXRTeW5jKGN1ckZpbGUpO1xuXHRcdFx0aWYgKF9zdGF0LmlzRmlsZSgpICYmIGZpbGVUeXBlcy5pbmNsdWRlcyhleHRuYW1lKGN1ckZpbGUpKSAmJiAhZXhjbHVkZS5pbmNsdWRlcyhiYXNlbmFtZShjdXJGaWxlKSkpXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGN1ckZpbGUpO1xuXHRcdFx0ZWxzZSBpZiAoX3N0YXQuaXNEaXJlY3RvcnkoKSlcblx0XHRcdFx0X193YWxrKGN1ckZpbGUpO1xuXHRcdH1cblx0fVxuXG5cdF9fd2FsayhkaXIpO1xuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2Fsa0RpcmVjdG9yeShkaXI6IHN0cmluZywgZmlsZVR5cGVzOiBzdHJpbmdbXSwgZXhjbHVkZTogc3RyaW5nW10pOiBEaXJlbnRbXSB7XG5cdGNvbnN0IHJlc3VsdDogRGlyZW50W10gPSBbXTtcblx0Y29uc3QgZmlsZXMgPSByZWFkZGlyU3luYyhkaXIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcblxuXHRmb3IgKGNvbnN0IGRpcmVudCBvZiBmaWxlcykge1xuXHRcdGRpcmVudC5uYW1lID0gcmVzb2x2ZShkaXIsIGRpcmVudC5uYW1lKTtcblxuXHRcdGlmIChkaXJlbnQuaXNGaWxlKCkgJiYgZmlsZVR5cGVzLmluY2x1ZGVzKGV4dG5hbWUoZGlyZW50Lm5hbWUpKSAmJiAhZXhjbHVkZS5pbmNsdWRlcyhiYXNlbmFtZShkaXJlbnQubmFtZSkpKVxuXHRcdFx0cmVzdWx0LnB1c2goZGlyZW50KTtcblx0XHRlbHNlIGlmIChkaXJlbnQuaXNEaXJlY3RvcnkoKSlcblx0XHRcdHJlc3VsdC5wdXNoKC4uLndhbGtEaXJlY3RvcnkoZGlyZW50Lm5hbWUsIGZpbGVUeXBlcywgZXhjbHVkZSkpO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwYXduUHJvY2Vzcyhjb21tYW5kOiBzdHJpbmcsIGFyZ3M6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXIgfCBudWxsPiB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0Y29uc3Qgc3Bhd25lZFByb2Nlc3MgPSBzcGF3bihcblx0XHRcdGNvbW1hbmQsXG5cdFx0XHRhcmdzLFxuXHRcdFx0eyBzdGRpbzogXCJpbmhlcml0XCIgfVxuXHRcdCk7XG5cblx0XHRzcGF3bmVkUHJvY2Vzcy5vbihcImV4aXRcIiwgY29kZSA9PiB7XG5cdFx0XHRpZiAoY29kZSlcblx0XHRcdFx0cmVqZWN0KGNvZGUpO1xuXG5cdFx0XHRyZXNvbHZlKGNvZGUpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1kNShkYXRhOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gY3JlYXRlSGFzaChcIm1kNVwiKS51cGRhdGUoZGF0YSkuZGlnZXN0KFwiaGV4XCIpO1xufSJdfQ==