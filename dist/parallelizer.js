"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parallelizer = void 0;
async function promiseState(promise) {
    try {
        const v = await Promise.race([promise, 0]);
        if (v === 0)
            return "pending";
        else
            return "resolved";
    }
    catch (_) {
        return "rejected";
    }
}
function parallelizer(generator, limit) {
    const promises = [];
    let semaphore = 0;
    const results = [];
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
exports.parallelizer = parallelizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWxsZWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3BhcmFsbGVsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxLQUFLLFVBQVUsWUFBWSxDQUFDLE9BQXFCO0lBQ2hELElBQUk7UUFDSCxNQUFNLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxJQUFHLENBQUMsS0FBSyxDQUFDO1lBQ1QsT0FBTyxTQUFTLENBQUM7O1lBRWpCLE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBQUEsT0FBTSxDQUFDLEVBQUM7UUFDUixPQUFPLFVBQVUsQ0FBQztLQUNsQjtBQUNGLENBQUM7QUFFRCxTQUFnQixZQUFZLENBQUMsU0FBa0MsRUFBRSxLQUFhO0lBQzdFLE1BQU0sUUFBUSxHQUFtQixFQUFFLENBQUM7SUFDcEMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLE1BQU0sT0FBTyxHQUFVLEVBQUUsQ0FBQztJQUUxQixPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzVCLEtBQUssVUFBVSxRQUFRO1lBQ3RCLE9BQU8sU0FBUyxHQUFHLEtBQUssRUFBRTtnQkFDekIsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUVqQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7b0JBQ2pCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztvQkFDbkIsS0FBSyxNQUFNLENBQUMsSUFBSSxRQUFRLEVBQUU7d0JBQ3pCLElBQUksTUFBTSxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssVUFBVTs0QkFDdkMsT0FBTyxHQUFHLEtBQUssQ0FBQztxQkFDakI7b0JBRUQsSUFBSSxPQUFPO3dCQUNWLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFbEIsT0FBTztpQkFDUDtnQkFFRCxTQUFTLEVBQUUsQ0FBQztnQkFDWixRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDN0IsT0FBTyxDQUFDLEtBQUs7cUJBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDcEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQ3BCLE9BQU8sQ0FBQyxHQUFHLEVBQUU7b0JBQ2IsU0FBUyxFQUFFLENBQUM7b0JBQ1osUUFBUSxFQUFFLENBQUM7Z0JBQ1osQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUNGLENBQUM7UUFDRCxRQUFRLEVBQUUsQ0FBQztJQUNaLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQXBDRCxvQ0FvQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJhc3luYyBmdW5jdGlvbiBwcm9taXNlU3RhdGUocHJvbWlzZTogUHJvbWlzZTxhbnk+KTogUHJvbWlzZTxcInBlbmRpbmdcIiB8IFwicmVzb2x2ZWRcIiB8IFwicmVqZWN0ZWRcIj4ge1xuXHR0cnkge1xuXHRcdGNvbnN0IHYgPSBhd2FpdCBQcm9taXNlLnJhY2UoW3Byb21pc2UsIDBdKTtcblx0XHRpZih2ID09PSAwKVxuXHRcdFx0cmV0dXJuIFwicGVuZGluZ1wiO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBcInJlc29sdmVkXCI7XG5cdH1jYXRjaChfKXtcblx0XHRyZXR1cm4gXCJyZWplY3RlZFwiO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJhbGxlbGl6ZXIoZ2VuZXJhdG9yOiBHZW5lcmF0b3I8UHJvbWlzZTxhbnk+PiwgbGltaXQ6IG51bWJlcik6IFByb21pc2U8YW55W10+IHtcblx0Y29uc3QgcHJvbWlzZXM6IFByb21pc2U8YW55PltdID0gW107XG5cdGxldCBzZW1hcGhvcmUgPSAwO1xuXHRjb25zdCByZXN1bHRzOiBhbnlbXSA9IFtdO1xuXG5cdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHRhc3luYyBmdW5jdGlvbiBjYWxsYmFjaygpIHtcblx0XHRcdHdoaWxlIChzZW1hcGhvcmUgPCBsaW1pdCkge1xuXHRcdFx0XHRjb25zdCBwcm9taXNlID0gZ2VuZXJhdG9yLm5leHQoKTtcblxuXHRcdFx0XHRpZiAocHJvbWlzZS5kb25lKSB7XG5cdFx0XHRcdFx0bGV0IGFsbERvbmUgPSB0cnVlO1xuXHRcdFx0XHRcdGZvciAoY29uc3QgcCBvZiBwcm9taXNlcykge1xuXHRcdFx0XHRcdFx0aWYgKGF3YWl0IHByb21pc2VTdGF0ZShwKSAhPT0gXCJyZXNvbHZlZFwiKVxuXHRcdFx0XHRcdFx0XHRhbGxEb25lID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGFsbERvbmUpXG5cdFx0XHRcdFx0XHRyZXNvbHZlKHJlc3VsdHMpO1xuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2VtYXBob3JlKys7XG5cdFx0XHRcdHByb21pc2VzLnB1c2gocHJvbWlzZS52YWx1ZSk7XG5cdFx0XHRcdHByb21pc2UudmFsdWVcblx0XHRcdFx0XHQudGhlbihyZXN1bHQgPT4gcmVzdWx0cy5wdXNoKHJlc3VsdCkpXG5cdFx0XHRcdFx0LmNhdGNoKGNvbnNvbGUuZXJyb3IpXG5cdFx0XHRcdFx0LmZpbmFsbHkoKCkgPT4ge1xuXHRcdFx0XHRcdFx0c2VtYXBob3JlLS07XG5cdFx0XHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjYWxsYmFjaygpO1xuXHR9KTtcbn0iXX0=