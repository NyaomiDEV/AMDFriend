export type Routine = {
	offset: number,
	bytes: Buffer
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