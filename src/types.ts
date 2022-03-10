export type Routine = {
	offset: number,
	bytes: Buffer
}

export type PatchingResult = {
	patchedPath: string,
	patchedRoutines: Routine[]
}
