export function replaceAll(string: string, find: RegExp, replace: string): string {
	let matchCount = 0;

	let match = find.exec(string);
	while (match) {
		console.log(`Processing match <${Buffer.from(match[0], "binary").toString("hex").toUpperCase().match(/.{1,2}/g)!.join(" ")}> at offset ${match.index} (Hex: ${match.index.toString(16)})`);
		string = [
			string.slice(0, match.index),
			formatStringWithTokens(replace, [...match]),
			string.slice(match.index + match[0].length)
		].join("");
		matchCount++;
		match = find.exec(string);
	}

	console.log(`Found ${matchCount} matches`);
	return string;
}

function formatStringWithTokens(string: string, tokens?: string[]): string {
	if (tokens) {
		let match = /\{([0-9]+)\}/g.exec(string);
		while(match){
			string = [
				string.slice(0, match.index),
				tokens[match[1]],
				string.slice(match.index + match[0].length)
			].join("");
			match = /\{([0-9]+)\}/g.exec(string);
		}
	}

	return string;
}
