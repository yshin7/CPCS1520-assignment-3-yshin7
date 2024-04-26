
export async function getRequest(url) {
	const res = await fetch(url)
	return await res.json()
}
