import { loadJSON } from "../core/loader.js"
import { ContentIndex } from "../core/contentIndex.js"
import { Bookmarks } from "../app/bookmarks.js"
import { escapeHTML, truncate } from "../core/utils.js"

/**
 * Render glossary list or term detail.
 * @param {{params?: object}} ctx
 */
export async function glossaryView(ctx = {}){
    const app = document.getElementById("app")
    if(!app) return

    const termId = ctx.params?.id
    if(!termId){
        await renderGlossaryList(app)
        return
    }

    await renderGlossaryDetail(app, termId)
}

async function renderGlossaryList(app){
    app.innerHTML = `<p class="muted">Loading glossary...</p>`
    const index = await ContentIndex.load()
    const terms = index.glossary || []
    const categories = Array.from(new Set(terms.map(t=>t.category))).sort()

    app.innerHTML = `
        <section class="page-header">
            <div>
                <h1>Glossary</h1>
                <p>Definitions, examples, and cross-links for ZAP concepts.</p>
            </div>
        </section>
        <section class="filters">
            <input id="glossarySearch" placeholder="Search terms">
            <select id="glossaryCategory">
                <option value="">All categories</option>
                ${categories.map(cat=>`<option value="${escapeHTML(cat)}">${escapeHTML(cat)}</option>`).join("")}
            </select>
        </section>
        <section id="glossaryList" class="card-grid"></section>
    `

    const searchInput = document.getElementById("glossarySearch")
    const categoryFilter = document.getElementById("glossaryCategory")

    const render = ()=>{
        const q = searchInput.value.trim().toLowerCase()
        const categoryValue = categoryFilter.value
        const filtered = terms.filter(term=>{
            if(categoryValue && term.category !== categoryValue) return false
            if(q){
                const haystack = `${term.term} ${term.definition}`.toLowerCase()
                return haystack.includes(q)
            }
            return true
        })
        const container = document.getElementById("glossaryList")
        container.innerHTML = filtered.map(term=>`
            <article class="card">
                <div class="card-meta">${escapeHTML(term.category)}</div>
                <h3>${escapeHTML(term.term)}</h3>
                <p>${escapeHTML(truncate(term.definition || "", 120))}</p>
                <div class="card-actions">
                    <a class="btn btn-secondary btn-small" href="#/glossary/${term.id}">Open</a>
                </div>
            </article>
        `).join("") || `<p class="muted">No terms match your filters.</p>`
    }

    render()
    searchInput.addEventListener("input", render)
    categoryFilter.addEventListener("change", render)
}

async function renderGlossaryDetail(app, termId){
    app.innerHTML = `<p class="muted">Loading term...</p>`
    const index = await ContentIndex.load()
    const glossaryList = index.glossary || []
    const termMeta = glossaryList.find(item=>item.id === termId)
    if(!termMeta){
        app.innerHTML = `
            <h2>Term not found</h2>
            <p>We could not load this term.</p>
            <a class="btn btn-secondary" href="#/glossary">Back to glossary</a>
        `
        return
    }

    const terms = await loadJSON(termMeta.path)
    const term = (terms || []).find(item=>item.id === termId)
    if(!term){
        app.innerHTML = `
            <h2>Term not found</h2>
            <p>We could not load this term.</p>
            <a class="btn btn-secondary" href="#/glossary">Back to glossary</a>
        `
        return
    }

    const isBookmarked = Bookmarks.isBookmarked("glossary", termId)

    const relatedLookup = new Map(glossaryList.map(item=>[item.id, item.term]))

    app.innerHTML = `
        <section class="page-header">
            <div>
                <div class="eyebrow">${escapeHTML(term.category)}</div>
                <h1>${escapeHTML(term.term)}</h1>
            </div>
            <div class="header-actions">
                <button id="bookmarkTerm" class="btn btn-secondary">
                    ${isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>
            </div>
        </section>
        <section class="content-block">
            <p>${escapeHTML(term.definition)}</p>
        </section>
        <section class="content-block">
            <h3>Examples</h3>
            <ul>
                ${(term.examples || []).map(ex=>`<li>${escapeHTML(ex)}</li>`).join("")}
            </ul>
        </section>
        <section class="content-block">
            <h3>Related Terms</h3>
            <div class="pill-row">
                ${(term.related_terms || []).map(rel=>`
                    <a class="pill" href="#/glossary/${rel}">
                        ${escapeHTML(relatedLookup.get(rel) || rel)}
                    </a>
                `).join("")}
            </div>
        </section>
    `

    const bookmarkBtn = document.getElementById("bookmarkTerm")
    if(bookmarkBtn){
        bookmarkBtn.addEventListener("click", ()=>{
            const nowBookmarked = !Bookmarks.isBookmarked("glossary", termId)
            if(nowBookmarked){
                Bookmarks.add("glossary", termId)
            }
            else{
                Bookmarks.remove("glossary", termId)
            }
            bookmarkBtn.textContent = nowBookmarked ? "Bookmarked" : "Bookmark"
        })
    }
}
