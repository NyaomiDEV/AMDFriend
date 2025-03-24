import type { Routine } from "./types.d.ts";

export function encodeArr(str: string) {
	const length = str.length;
	const byteArray = new Uint8Array(length);
	for (let i = 0; i < length; ++i) {
		byteArray[i] = str.charCodeAt(i) & 255;
	}
	return byteArray;
}

export function encodeStr(arr: Uint8Array) {
	let str = "";
	for(const n of arr)
		str += (String.fromCharCode(n));
	return str;
}

export function replaceAll(buffer: Uint8Array<ArrayBufferLike>, find: RegExp, replace: string): Routine[] {
	const result: Routine[] = [];

	const chunkSize = 128 * 1024 * 1024; // 128MiB in bytes
	const chunkQueued: { buffer?: Uint8Array<ArrayBufferLike>, offset: number } = {
		buffer: undefined,
		offset: 0
	};
	let currentOffset = 0;

	while (currentOffset < buffer.length) {
		let chunk: Uint8Array<ArrayBufferLike> = buffer.slice(currentOffset, currentOffset + chunkSize);
		let chunkString: string;
		if(chunkQueued.buffer)
			chunkString = encodeStr(chunkQueued.buffer) + encodeStr(chunk);
		else
			chunkString = encodeStr(chunk);

		let match: RegExpExecArray | null;
		while ((match = find.exec(chunkString)) !== null) {
			result.push({
				bytes: encodeArr(match[0]),
				offset: currentOffset + (match.index - (chunkQueued.buffer ? chunkQueued.buffer.length : 0))
			});
			chunkString = [
				chunkString.slice(0, match.index),
				formatStringWithTokens(replace, [...match]),
				chunkString.slice(match.index + match[0].length)
			].join("");
		}

		if(chunkQueued.buffer){
			writeWithTail(buffer, chunkQueued.buffer, chunkQueued.offset);
			chunk = encodeArr(chunkString.slice(chunkQueued.buffer.length));
		}else
			chunk = encodeArr(chunkString);

		if(chunk.length){
			chunkQueued.buffer = chunk;
			chunkQueued.offset = currentOffset;
		}

		if (chunkQueued.buffer)
			currentOffset += chunkQueued.buffer.length;
	}

	if(chunkQueued.buffer)
		writeWithTail(buffer, chunkQueued.buffer, chunkQueued.offset);

	return result;
}

function writeWithTail(buffer: Uint8Array<ArrayBufferLike>, otherBuffer: Uint8Array<ArrayBufferLike>, offset: number){
	const safeWrite = otherBuffer.slice(0, buffer.length - (offset || 0));
	buffer.set(safeWrite, offset);
	if (safeWrite.length !== otherBuffer.length) {
		const _otherBuffer = otherBuffer.slice(safeWrite.length);
		const mergedArray = new Uint8Array(buffer.length + _otherBuffer.length);
		mergedArray.set(buffer);
		mergedArray.set(_otherBuffer, buffer.length);
		buffer = mergedArray;
	}
}

function formatStringWithTokens(string: string, tokens?: string[]): string {
	if (tokens) {
		let match: RegExpExecArray | null;
		while((match = /\{([0-9]+)\}/g.exec(string)) !== null){
			string = [
				string.slice(0, match.index),
				tokens[match[1]],
				string.slice(match.index + match[0].length)
			].join("");
		}
	}

	return string;
}
