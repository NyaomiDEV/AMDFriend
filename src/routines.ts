import { Match } from "./types";

export function replaceAll(string: string, find: RegExp, replace: string) {
	const matches = matchAll(string, find);

	console.log(`Found ${matches.length} matches`);

	for (const match of matches) {
		console.log(`Processing match <${Buffer.from(match.match, "binary").toString("hex").toUpperCase().match(/.{1,2}/g)!.join(" ")}> at offset ${match.index} (Hex: ${match.index.toString(16)})`);
		string = [
			string.slice(0, match.index),
			formatStringWithTokens(replace, match.groups),
			string.slice(match.end)
		].join("");
	}

	return string;
}

function matchAll(string: string, regex: RegExp): Array<Match> {
	return [...string.matchAll(regex)].map(x => x ? {
		match: x[0]!,
		index: x.index!,
		length: x[0].length,
		end: x.index! + x[0].length,
		groups: {...[...x], ...x.groups}
	} : undefined).filter(Boolean) as Array<Match>;
}

function formatStringWithTokens(string: string, tokens?: string[]) {
	if (tokens) {
		let match: Match | undefined;
		do{
			match = matchAll(string, /\{([0-9]+)\}/g)[0];
			if(match){
				string = [
					string.slice(0, match.index),
					tokens[match.groups[1]],
					string.slice(match.end)
				].join("");
			}
		}while(match);
	}

	return string;
}
