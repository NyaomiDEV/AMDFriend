import { Routine } from "./types";

export function replaceAll(buffer: Buffer, find: RegExp, replace: string): Routine[] {
	const result: Routine[] = [];

	const chunkSize = 128 * 1024 * 1024; // 128MiB in bytes
	const chunkQueued: { buffer?: Buffer, offset: number } = {
		buffer: undefined,
		offset: 0
	};
	let currentOffset = 0;

	while (currentOffset < buffer.length) {
		let chunk = buffer.slice(currentOffset, currentOffset + chunkSize);
		let chunkString;
		if(chunkQueued.buffer)
			chunkString = chunkQueued.buffer.toString("binary") + chunk.toString("binary");
		else
			chunkString = chunk.toString("binary");

		let match: RegExpExecArray | null;
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

		if(chunkQueued.buffer){
			writeWithTail(buffer, chunkQueued.buffer, chunkQueued.offset);
			chunk = Buffer.from(chunkString.slice(chunkQueued.buffer.length), "binary");
		}else
			chunk = Buffer.from(chunkString, "binary");

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

function writeWithTail(buffer: Buffer, otherBuffer: Buffer, offset: number){
	const bytesWritten = buffer.write(otherBuffer.toString("binary"), offset, otherBuffer.length, "binary");
	if(bytesWritten !== otherBuffer.length)
		buffer = Buffer.concat([buffer, otherBuffer.slice(bytesWritten)]);
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
