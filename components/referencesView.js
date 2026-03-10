import { ContentIndex } from "../core/contentIndex.js"
import { escapeHTML, truncate } from "../core/utils.js"

/**
 * Render references list.
 */
export async function referencesView(){
    const app = document.getElementById("app")
    if(!app) return

    const index = await ContentIndex.load()
    const references = index.references || []
    const categories = Array.from(new Set(references.map(ref=>ref.category))).sort()

    app.innerHTML = `
        <section class="page-header">
            <div>
                <h1>References</h1>
                <p>Curated resources grouped by category.</p>
            </div>
        </section>
        <section class="filters">
            <select id="referenceCategory">
                <option value="">All categories</option>
                ${categories.map(cat=>`<option value="${escapeHTML(cat)}">${escapeHTML(cat)}</option>`).join("")}
            </select>
        </section>
        <section id="referenceList" class="card-grid"></section>
    `

    const categoryFilter = document.getElementById("referenceCategory")

    const render = ()=>{
        const categoryValue = categoryFilter.value
        const filtered = references.filter(ref=>{
            if(categoryValue && ref.category !== categoryValue) return false
            return true
        })
        const container = document.getElementById("referenceList")
        container.innerHTML = filtered.map(ref=>`
            <article class="card">
                <div class="card-meta">${escapeHTML(ref.category)}</div>
                <h3>${escapeHTML(ref.title)}</h3>
                <p>${escapeHTML(truncate(ref.description || "", 120))}</p>
                <div class="card-actions">
                    <a class="btn btn-secondary btn-small" href="${escapeHTML(ref.url)}" target="_blank" rel="noopener">Open</a>
                </div>
            </article>
        `).join("") || `<p class="muted">No references found.</p>`
    }

    render()
    categoryFilter.addEventListener("change", render)
}
