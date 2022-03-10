export function replaceAll(buffer: Buffer, find: RegExp, replace: string): [Buffer, number] {
	let matchCount = 0;

	const chunkSize = 128 * 1024 * 1024; // 128MiB in bytes
	let chunkQueued: Buffer | undefined;
	let currentOffset = 0;
	let output = Buffer.alloc(0);

	while (currentOffset < buffer.length) {
		let chunk = buffer.slice(currentOffset, currentOffset + chunkSize);
		let chunkString;
		if(chunkQueued)
			chunkString = chunkQueued.toString("binary") + chunk.toString("binary");
		else
			chunkString = chunk.toString("binary");

		let match: RegExpExecArray | null;
		while ((match = find.exec(chunkString)) !== null) {
			const index = currentOffset + (match.index - (chunkQueued ? chunkQueued.length : 0));
			console.log(`Processing match <${Buffer.from(match[0], "binary").toString("hex").toUpperCase().match(/.{1,2}/g)!.join(" ")}> at offset ${index} (Hex: ${index.toString(16)})`);
			chunkString = [
				chunkString.slice(0, match.index),
				formatStringWithTokens(replace, [...match]),
				chunkString.slice(match.index + match[0].length)
			].join("");
			matchCount++;
		}

		output = Buffer.concat([output, Buffer.from(chunkString.slice(0, chunkSize), "binary")]);
		chunk = Buffer.from(chunkString.slice(chunkSize), "binary");

		if(chunk.length)
			chunkQueued = chunk;

		currentOffset += chunkSize;
	}
	output = Buffer.concat([output, chunkQueued || Buffer.alloc(0)]);

	console.log(`Found ${matchCount} matches`);
	return [output, matchCount];
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
