/**
 * Search across indexed content with simple scoring and filtering.
 * @param {string} query
 * @param {Array<object>} items
 * @param {{types?: string[], tags?: string[], category?: string}} [filters]
 */
export function searchContent(query, items, filters = {}){
    const normalizedQuery = (query || "").trim().toLowerCase()
    if(!normalizedQuery){
        return []
    }

    const tokens = normalizedQuery.split(/\s+/).filter(Boolean)
    const typeFilter = (filters.types || []).map(t=>t.toLowerCase())
    const tagFilter = (filters.tags || []).map(t=>t.toLowerCase())
    const categoryFilter = (filters.category || "").toLowerCase()

    const results = []

    for(const item of items || []){
        const type = (item.type || "").toLowerCase()
        const category = (item.category || "").toLowerCase()
        const rawTags = Array.isArray(item.tags) ? item.tags : []
        const tags = rawTags.map(t=>t.toLowerCase())

        if(typeFilter.length && !typeFilter.includes(type)){
            continue
        }
        if(categoryFilter && category !== categoryFilter){
            continue
        }
        if(tagFilter.length && !tags.some(tag=>tagFilter.includes(tag))){
            continue
        }

        const haystack = [
            item.title,
            item.term,
            item.name,
            item.summary,
            item.definition,
            item.excerpt,
            rawTags.join(" "),
            item.category
        ].filter(Boolean).join(" ").toLowerCase()

        let score = 0
        for(const token of tokens){
            if(haystack.includes(token)){
                score += 1
            }
            if(item.title && item.title.toLowerCase().includes(token)){
                score += 2
            }
        }

        if(score > 0){
            results.push({ ...item, score })
        }
    }

    return results.sort((a,b)=>b.score - a.score)
}
