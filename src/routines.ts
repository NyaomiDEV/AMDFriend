export function replaceAll(string: string, find: RegExp, replace: string): [string, number] {
	let matchCount = 0;

	let match: RegExpExecArray | null;
	while ((match = find.exec(string)) !== null) {
		console.log(`Processing match <${Buffer.from(match[0], "binary").toString("hex").toUpperCase().match(/.{1,2}/g)!.join(" ")}> at offset ${match.index} (Hex: ${match.index.toString(16)})`);
		string = [
			string.slice(0, match.index),
			formatStringWithTokens(replace, [...match]),
			string.slice(match.index + match[0].length)
		].join("");
		matchCount++;
	}

	console.log(`Found ${matchCount} matches`);
	return [string, matchCount];
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
