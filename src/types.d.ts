export type Routine = {
	offset: number,
	bytes: Uint8Array<ArrayBufferLike>
}

export type PatchingResult = {
	patchedPath: string,
	patchedRoutines: Routine[]
}

export type PatchOptions = {
	dryRun: boolean
	inPlace: boolean
	backup: boolean
	clearXA: boolean
	sign: boolean
}