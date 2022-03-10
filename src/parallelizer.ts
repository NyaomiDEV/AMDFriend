async function promiseState(promise: Promise<any>): Promise<"pending" | "resolved" | "rejected"> {
	try {
		const v = await Promise.race([promise, 0]);
		if(v === 0)
			return "pending";
		else
			return "resolved";
	}catch(_){
		return "rejected";
	}
}

export function parallelizer(generator: Generator<Promise<any>>, limit: number): Promise<any[]> {
	const promises: Promise<any>[] = [];
	let semaphore = 0;
	const results: any[] = [];

	return new Promise(resolve => {
		async function callback() {
			while (semaphore < limit) {
				const promise = generator.next();

				if (promise.done) {
					let allDone = true;
					for (const p of promises) {
						if (await promiseState(p) !== "resolved")
							allDone = false;
					}

					if (allDone)
						resolve(results);

					return;
				}

				semaphore++;
				promises.push(promise.value);
				promise.value
					.then(result => results.push(result))
					.catch(console.error)
					.finally(() => {
						semaphore--;
						callback();
					});
			}
		}
		callback();
	});
}