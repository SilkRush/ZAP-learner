import { ContentIndex } from "../core/contentIndex.js"
import { searchContent } from "../core/search.js"
import { escapeHTML, truncate, parseTags } from "../core/utils.js"

/**
 * Render the search view with filters.
 */
export async function searchView(){
    const app = document.getElementById("app")
    if(!app) return

    const index = await ContentIndex.load()
    const searchIndex = index.search || []
    const categories = Array.from(new Set(searchIndex.map(item=>item.category).filter(Boolean))).sort()
    const types = Array.from(new Set(searchIndex.map(item=>item.type))).sort()

    app.innerHTML = `
        <section class="page-header">
            <div>
                <h1>Search</h1>
                <p>Find lessons, guides, glossary terms, and references.</p>
            </div>
        </section>
        <section class="filters search-filters">
            <input id="searchBox" placeholder="Search everything">
            <input id="tagBox" placeholder="Tags (comma-separated)">
            <select id="categoryFilter">
                <option value="">All categories</option>
                ${categories.map(cat=>`<option value="${escapeHTML(cat)}">${escapeHTML(cat)}</option>`).join("")}
            </select>
        </section>
        <section class="filter-pills" id="typeFilters">
            ${types.map(type=>`
                <label class="pill-toggle">
                    <input type="checkbox" value="${escapeHTML(type)}" checked>
                    <span>${escapeHTML(type)}</span>
                </label>
            `).join("")}
        </section>
        <section id="results" class="card-grid"></section>
    `

    const searchBox = document.getElementById("searchBox")
    const tagBox = document.getElementById("tagBox")
    const categoryFilter = document.getElementById("categoryFilter")

    const runSearch = ()=>{
        const query = searchBox.value.trim()
        const tags = parseTags(tagBox.value)
        const category = categoryFilter.value
        const selectedTypes = Array.from(document.querySelectorAll("#typeFilters input:checked"))
            .map(input=>input.value)

        const container = document.getElementById("results")
        if(query.length < 2 && tags.length === 0){
            container.innerHTML = `<p class="muted">Type at least two characters or add a tag.</p>`
            return
        }

        const results = searchContent(query, searchIndex, { types: selectedTypes, tags, category })
        container.innerHTML = results.map(result=>`
            <article class="card">
                <div class="card-meta">${escapeHTML(result.type)} · ${escapeHTML(result.category || "general")}</div>
                <h3>${escapeHTML(result.title || result.term)}</h3>
                <p>${escapeHTML(truncate(result.excerpt || result.definition || "", 140))}</p>
                <div class="card-actions">
                    <a class="btn btn-secondary btn-small" href="${escapeHTML(result.route)}">Open</a>
                </div>
            </article>
        `).join("") || `<p class="muted">No results found.</p>`
    }

    searchBox.addEventListener("input", runSearch)
    tagBox.addEventListener("input", runSearch)
    categoryFilter.addEventListener("change", runSearch)
    document.getElementById("typeFilters").addEventListener("change", runSearch)
    runSearch()
}
