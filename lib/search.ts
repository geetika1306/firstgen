export async function serpSearch(query: string): Promise<string> {
  const apiKey = process.env.SERPAPI_API_KEY
  if (!apiKey) {
    return JSON.stringify({ results: [], note: 'Search unavailable - add SERPAPI_API_KEY' })
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      q: query,
      engine: 'google',
      num: '8',
    })
    const res = await fetch(`https://serpapi.com/search.json?${params}`)
    const data = await res.json()
    return JSON.stringify(data.organic_results ?? [])
  } catch {
    return JSON.stringify({ results: [], error: 'Search failed' })
  }
}