"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAll = void 0;
function replaceAll(string, find, replace) {
    let matchCount = 0;
    let match;
    while ((match = find.exec(string)) !== null) {
        console.log(`Processing match <${Buffer.from(match[0], "binary").toString("hex").toUpperCase().match(/.{1,2}/g).join(" ")}> at offset ${match.index} (Hex: ${match.index.toString(16)})`);
        string = [
            string.slice(0, match.index),
            formatStringWithTokens(replace, [...match]),
            string.slice(match.index + match[0].length)
        ].join("");
        matchCount++;
    }
    console.log(`Found ${matchCount} matches`);
    return string;
}
exports.replaceAll = replaceAll;
function formatStringWithTokens(string, tokens) {
    if (tokens) {
        let match;
        while ((match = /\{([0-9]+)\}/g.exec(string)) !== null) {
            string = [
                string.slice(0, match.index),
                tokens[match[1]],
                string.slice(match.index + match[0].length)
            ].join("");
        }
    }
    return string;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGluZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGluZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsU0FBZ0IsVUFBVSxDQUFDLE1BQWMsRUFBRSxJQUFZLEVBQUUsT0FBZTtJQUN2RSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFFbkIsSUFBSSxLQUE2QixDQUFDO0lBQ2xDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxLQUFLLENBQUMsS0FBSyxVQUFVLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzTCxNQUFNLEdBQUc7WUFDUixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQzVCLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7U0FDM0MsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDWCxVQUFVLEVBQUUsQ0FBQztLQUNiO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLFVBQVUsVUFBVSxDQUFDLENBQUM7SUFDM0MsT0FBTyxNQUFNLENBQUM7QUFDZixDQUFDO0FBaEJELGdDQWdCQztBQUVELFNBQVMsc0JBQXNCLENBQUMsTUFBYyxFQUFFLE1BQWlCO0lBQ2hFLElBQUksTUFBTSxFQUFFO1FBQ1gsSUFBSSxLQUE2QixDQUFDO1FBQ2xDLE9BQU0sQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBQztZQUNyRCxNQUFNLEdBQUc7Z0JBQ1IsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7YUFDM0MsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDWDtLQUNEO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VBbGwoc3RyaW5nOiBzdHJpbmcsIGZpbmQ6IFJlZ0V4cCwgcmVwbGFjZTogc3RyaW5nKTogc3RyaW5nIHtcblx0bGV0IG1hdGNoQ291bnQgPSAwO1xuXG5cdGxldCBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcblx0d2hpbGUgKChtYXRjaCA9IGZpbmQuZXhlYyhzdHJpbmcpKSAhPT0gbnVsbCkge1xuXHRcdGNvbnNvbGUubG9nKGBQcm9jZXNzaW5nIG1hdGNoIDwke0J1ZmZlci5mcm9tKG1hdGNoWzBdLCBcImJpbmFyeVwiKS50b1N0cmluZyhcImhleFwiKS50b1VwcGVyQ2FzZSgpLm1hdGNoKC8uezEsMn0vZykhLmpvaW4oXCIgXCIpfT4gYXQgb2Zmc2V0ICR7bWF0Y2guaW5kZXh9IChIZXg6ICR7bWF0Y2guaW5kZXgudG9TdHJpbmcoMTYpfSlgKTtcblx0XHRzdHJpbmcgPSBbXG5cdFx0XHRzdHJpbmcuc2xpY2UoMCwgbWF0Y2guaW5kZXgpLFxuXHRcdFx0Zm9ybWF0U3RyaW5nV2l0aFRva2VucyhyZXBsYWNlLCBbLi4ubWF0Y2hdKSxcblx0XHRcdHN0cmluZy5zbGljZShtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aClcblx0XHRdLmpvaW4oXCJcIik7XG5cdFx0bWF0Y2hDb3VudCsrO1xuXHR9XG5cblx0Y29uc29sZS5sb2coYEZvdW5kICR7bWF0Y2hDb3VudH0gbWF0Y2hlc2ApO1xuXHRyZXR1cm4gc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRTdHJpbmdXaXRoVG9rZW5zKHN0cmluZzogc3RyaW5nLCB0b2tlbnM/OiBzdHJpbmdbXSk6IHN0cmluZyB7XG5cdGlmICh0b2tlbnMpIHtcblx0XHRsZXQgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XG5cdFx0d2hpbGUoKG1hdGNoID0gL1xceyhbMC05XSspXFx9L2cuZXhlYyhzdHJpbmcpKSAhPT0gbnVsbCl7XG5cdFx0XHRzdHJpbmcgPSBbXG5cdFx0XHRcdHN0cmluZy5zbGljZSgwLCBtYXRjaC5pbmRleCksXG5cdFx0XHRcdHRva2Vuc1ttYXRjaFsxXV0sXG5cdFx0XHRcdHN0cmluZy5zbGljZShtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aClcblx0XHRcdF0uam9pbihcIlwiKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gc3RyaW5nO1xufVxuIl19