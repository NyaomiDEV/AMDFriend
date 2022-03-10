"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAll = void 0;
function replaceAll(buffer, find, replace) {
    const result = [];
    const chunkSize = 128 * 1024 * 1024;
    const chunkQueued = {
        buffer: undefined,
        offset: 0
    };
    let currentOffset = 0;
    while (currentOffset < buffer.length) {
        let chunk = buffer.slice(currentOffset, currentOffset + chunkSize);
        let chunkString;
        if (chunkQueued.buffer)
            chunkString = chunkQueued.buffer.toString("binary") + chunk.toString("binary");
        else
            chunkString = chunk.toString("binary");
        let match;
        while ((match = find.exec(chunkString)) !== null) {
            result.push({
                bytes: Buffer.from(match[0], "binary"),
                offset: currentOffset + (match.index - (chunkQueued.buffer ? chunkQueued.buffer.length : 0))
            });
            chunkString = [
                chunkString.slice(0, match.index),
                formatStringWithTokens(replace, [...match]),
                chunkString.slice(match.index + match[0].length)
            ].join("");
        }
        if (chunkQueued.buffer) {
            writeWithTail(buffer, chunkQueued.buffer, chunkQueued.offset);
            chunk = Buffer.from(chunkString.slice(chunkQueued.buffer.length), "binary");
        }
        else
            chunk = Buffer.from(chunkString, "binary");
        if (chunk.length) {
            chunkQueued.buffer = chunk;
            chunkQueued.offset = currentOffset;
        }
        if (chunkQueued.buffer)
            currentOffset += chunkQueued.buffer.length;
    }
    if (chunkQueued.buffer)
        writeWithTail(buffer, chunkQueued.buffer, chunkQueued.offset);
    return result;
}
exports.replaceAll = replaceAll;
function writeWithTail(buffer, otherBuffer, offset) {
    const bytesWritten = buffer.write(otherBuffer.toString("binary"), offset, otherBuffer.length, "binary");
    if (bytesWritten !== otherBuffer.length)
        buffer = Buffer.concat([buffer, otherBuffer.slice(bytesWritten)]);
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGluZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGluZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsU0FBZ0IsVUFBVSxDQUFDLE1BQWMsRUFBRSxJQUFZLEVBQUUsT0FBZTtJQUN2RSxNQUFNLE1BQU0sR0FBYyxFQUFFLENBQUM7SUFFN0IsTUFBTSxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7SUFDcEMsTUFBTSxXQUFXLEdBQXdDO1FBQ3hELE1BQU0sRUFBRSxTQUFTO1FBQ2pCLE1BQU0sRUFBRSxDQUFDO0tBQ1QsQ0FBQztJQUNGLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztJQUV0QixPQUFPLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ3JDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQztRQUNuRSxJQUFJLFdBQVcsQ0FBQztRQUNoQixJQUFHLFdBQVcsQ0FBQyxNQUFNO1lBQ3BCLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztZQUUvRSxXQUFXLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV4QyxJQUFJLEtBQTZCLENBQUM7UUFDbEMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQztnQkFDdEMsTUFBTSxFQUFFLGFBQWEsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDNUYsQ0FBQyxDQUFDO1lBQ0gsV0FBVyxHQUFHO2dCQUNiLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ2pDLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7Z0JBQzNDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2FBQ2hELENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ1g7UUFFRCxJQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUM7WUFDckIsYUFBYSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5RCxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDNUU7O1lBQ0EsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTVDLElBQUcsS0FBSyxDQUFDLE1BQU0sRUFBQztZQUNmLFdBQVcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQzNCLFdBQVcsQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDO1NBQ25DO1FBRUQsSUFBSSxXQUFXLENBQUMsTUFBTTtZQUNyQixhQUFhLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDNUM7SUFFRCxJQUFHLFdBQVcsQ0FBQyxNQUFNO1FBQ3BCLGFBQWEsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFL0QsT0FBTyxNQUFNLENBQUM7QUFDZixDQUFDO0FBbERELGdDQWtEQztBQUVELFNBQVMsYUFBYSxDQUFDLE1BQWMsRUFBRSxXQUFtQixFQUFFLE1BQWM7SUFDekUsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3hHLElBQUcsWUFBWSxLQUFLLFdBQVcsQ0FBQyxNQUFNO1FBQ3JDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLENBQUM7QUFFRCxTQUFTLHNCQUFzQixDQUFDLE1BQWMsRUFBRSxNQUFpQjtJQUNoRSxJQUFJLE1BQU0sRUFBRTtRQUNYLElBQUksS0FBNkIsQ0FBQztRQUNsQyxPQUFNLENBQUMsS0FBSyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUM7WUFDckQsTUFBTSxHQUFHO2dCQUNSLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2FBQzNDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ1g7S0FDRDtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRpbmUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVwbGFjZUFsbChidWZmZXI6IEJ1ZmZlciwgZmluZDogUmVnRXhwLCByZXBsYWNlOiBzdHJpbmcpOiBSb3V0aW5lW10ge1xuXHRjb25zdCByZXN1bHQ6IFJvdXRpbmVbXSA9IFtdO1xuXG5cdGNvbnN0IGNodW5rU2l6ZSA9IDEyOCAqIDEwMjQgKiAxMDI0OyAvLyAxMjhNaUIgaW4gYnl0ZXNcblx0Y29uc3QgY2h1bmtRdWV1ZWQ6IHsgYnVmZmVyPzogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciB9ID0ge1xuXHRcdGJ1ZmZlcjogdW5kZWZpbmVkLFxuXHRcdG9mZnNldDogMFxuXHR9O1xuXHRsZXQgY3VycmVudE9mZnNldCA9IDA7XG5cblx0d2hpbGUgKGN1cnJlbnRPZmZzZXQgPCBidWZmZXIubGVuZ3RoKSB7XG5cdFx0bGV0IGNodW5rID0gYnVmZmVyLnNsaWNlKGN1cnJlbnRPZmZzZXQsIGN1cnJlbnRPZmZzZXQgKyBjaHVua1NpemUpO1xuXHRcdGxldCBjaHVua1N0cmluZztcblx0XHRpZihjaHVua1F1ZXVlZC5idWZmZXIpXG5cdFx0XHRjaHVua1N0cmluZyA9IGNodW5rUXVldWVkLmJ1ZmZlci50b1N0cmluZyhcImJpbmFyeVwiKSArIGNodW5rLnRvU3RyaW5nKFwiYmluYXJ5XCIpO1xuXHRcdGVsc2Vcblx0XHRcdGNodW5rU3RyaW5nID0gY2h1bmsudG9TdHJpbmcoXCJiaW5hcnlcIik7XG5cblx0XHRsZXQgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XG5cdFx0d2hpbGUgKChtYXRjaCA9IGZpbmQuZXhlYyhjaHVua1N0cmluZykpICE9PSBudWxsKSB7XG5cdFx0XHRyZXN1bHQucHVzaCh7XG5cdFx0XHRcdGJ5dGVzOiBCdWZmZXIuZnJvbShtYXRjaFswXSwgXCJiaW5hcnlcIiksXG5cdFx0XHRcdG9mZnNldDogY3VycmVudE9mZnNldCArIChtYXRjaC5pbmRleCAtIChjaHVua1F1ZXVlZC5idWZmZXIgPyBjaHVua1F1ZXVlZC5idWZmZXIubGVuZ3RoIDogMCkpXG5cdFx0XHR9KTtcblx0XHRcdGNodW5rU3RyaW5nID0gW1xuXHRcdFx0XHRjaHVua1N0cmluZy5zbGljZSgwLCBtYXRjaC5pbmRleCksXG5cdFx0XHRcdGZvcm1hdFN0cmluZ1dpdGhUb2tlbnMocmVwbGFjZSwgWy4uLm1hdGNoXSksXG5cdFx0XHRcdGNodW5rU3RyaW5nLnNsaWNlKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKVxuXHRcdFx0XS5qb2luKFwiXCIpO1xuXHRcdH1cblxuXHRcdGlmKGNodW5rUXVldWVkLmJ1ZmZlcil7XG5cdFx0XHR3cml0ZVdpdGhUYWlsKGJ1ZmZlciwgY2h1bmtRdWV1ZWQuYnVmZmVyLCBjaHVua1F1ZXVlZC5vZmZzZXQpO1xuXHRcdFx0Y2h1bmsgPSBCdWZmZXIuZnJvbShjaHVua1N0cmluZy5zbGljZShjaHVua1F1ZXVlZC5idWZmZXIubGVuZ3RoKSwgXCJiaW5hcnlcIik7XG5cdFx0fWVsc2Vcblx0XHRcdGNodW5rID0gQnVmZmVyLmZyb20oY2h1bmtTdHJpbmcsIFwiYmluYXJ5XCIpO1xuXG5cdFx0aWYoY2h1bmsubGVuZ3RoKXtcblx0XHRcdGNodW5rUXVldWVkLmJ1ZmZlciA9IGNodW5rO1xuXHRcdFx0Y2h1bmtRdWV1ZWQub2Zmc2V0ID0gY3VycmVudE9mZnNldDtcblx0XHR9XG5cblx0XHRpZiAoY2h1bmtRdWV1ZWQuYnVmZmVyKVxuXHRcdFx0Y3VycmVudE9mZnNldCArPSBjaHVua1F1ZXVlZC5idWZmZXIubGVuZ3RoO1xuXHR9XG5cblx0aWYoY2h1bmtRdWV1ZWQuYnVmZmVyKVxuXHRcdHdyaXRlV2l0aFRhaWwoYnVmZmVyLCBjaHVua1F1ZXVlZC5idWZmZXIsIGNodW5rUXVldWVkLm9mZnNldCk7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gd3JpdGVXaXRoVGFpbChidWZmZXI6IEJ1ZmZlciwgb3RoZXJCdWZmZXI6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIpe1xuXHRjb25zdCBieXRlc1dyaXR0ZW4gPSBidWZmZXIud3JpdGUob3RoZXJCdWZmZXIudG9TdHJpbmcoXCJiaW5hcnlcIiksIG9mZnNldCwgb3RoZXJCdWZmZXIubGVuZ3RoLCBcImJpbmFyeVwiKTtcblx0aWYoYnl0ZXNXcml0dGVuICE9PSBvdGhlckJ1ZmZlci5sZW5ndGgpXG5cdFx0YnVmZmVyID0gQnVmZmVyLmNvbmNhdChbYnVmZmVyLCBvdGhlckJ1ZmZlci5zbGljZShieXRlc1dyaXR0ZW4pXSk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFN0cmluZ1dpdGhUb2tlbnMoc3RyaW5nOiBzdHJpbmcsIHRva2Vucz86IHN0cmluZ1tdKTogc3RyaW5nIHtcblx0aWYgKHRva2Vucykge1xuXHRcdGxldCBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcblx0XHR3aGlsZSgobWF0Y2ggPSAvXFx7KFswLTldKylcXH0vZy5leGVjKHN0cmluZykpICE9PSBudWxsKXtcblx0XHRcdHN0cmluZyA9IFtcblx0XHRcdFx0c3RyaW5nLnNsaWNlKDAsIG1hdGNoLmluZGV4KSxcblx0XHRcdFx0dG9rZW5zW21hdGNoWzFdXSxcblx0XHRcdFx0c3RyaW5nLnNsaWNlKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKVxuXHRcdFx0XS5qb2luKFwiXCIpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBzdHJpbmc7XG59XG4iXX0=