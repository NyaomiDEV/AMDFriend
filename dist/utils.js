"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walkDirectory = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
function walkDirectory(dir, fileTypes, exclude) {
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
exports.walkDirectory = walkDirectory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkJBQThEO0FBQzlELCtCQUFrRDtBQUVsRCxTQUFnQixhQUFhLENBQUMsR0FBVyxFQUFFLFNBQW1CLEVBQUUsT0FBaUI7SUFDaEYsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBRTVCLFNBQVMsTUFBTSxDQUFDLFdBQVc7UUFDMUIsTUFBTSxLQUFLLEdBQUcsZ0JBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNuQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLEtBQUssRUFBRTtZQUN0QixNQUFNLE9BQU8sR0FBRyxjQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sS0FBSyxHQUFHLGFBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QixJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxlQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2pHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ2pCLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRTtnQkFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pCO0lBQ0YsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLE9BQU8sTUFBTSxDQUFDO0FBQ2YsQ0FBQztBQWpCRCxzQ0FpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWFkZGlyU3luYyBhcyByZWFkZGlyLCBzdGF0U3luYyBhcyBzdGF0IH0gZnJvbSBcImZzXCI7XG5pbXBvcnQgeyByZXNvbHZlLCBleHRuYW1lLCBiYXNlbmFtZSB9IGZyb20gXCJwYXRoXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWxrRGlyZWN0b3J5KGRpcjogc3RyaW5nLCBmaWxlVHlwZXM6IHN0cmluZ1tdLCBleGNsdWRlOiBzdHJpbmdbXSk6IHN0cmluZ1tde1xuXHRjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG5cblx0ZnVuY3Rpb24gX193YWxrKGN1cnJlbnRQYXRoKSB7XG5cdFx0Y29uc3QgZmlsZXMgPSByZWFkZGlyKGN1cnJlbnRQYXRoKTtcblx0XHRmb3IgKGNvbnN0IGkgaW4gZmlsZXMpIHtcblx0XHRcdGNvbnN0IGN1ckZpbGUgPSByZXNvbHZlKGN1cnJlbnRQYXRoLCBmaWxlc1tpXSk7XG5cdFx0XHRjb25zdCBfc3RhdCA9IHN0YXQoY3VyRmlsZSk7XG5cdFx0XHRpZiAoX3N0YXQuaXNGaWxlKCkgJiYgZmlsZVR5cGVzLmluY2x1ZGVzKGV4dG5hbWUoY3VyRmlsZSkpICYmICFleGNsdWRlLmluY2x1ZGVzKGJhc2VuYW1lKGN1ckZpbGUpKSlcblx0XHRcdFx0cmVzdWx0LnB1c2goY3VyRmlsZSk7XG5cdFx0XHRlbHNlIGlmIChfc3RhdC5pc0RpcmVjdG9yeSgpKVxuXHRcdFx0XHRfX3dhbGsoY3VyRmlsZSk7XG5cdFx0fVxuXHR9XG5cblx0X193YWxrKGRpcik7XG5cdHJldHVybiByZXN1bHQ7XG59Il19