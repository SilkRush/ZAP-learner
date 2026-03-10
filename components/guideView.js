import { loadJSON } from "../core/loader.js"
import { ContentIndex } from "../core/contentIndex.js"
import { Bookmarks } from "../app/bookmarks.js"
import { markdownToHTML, escapeHTML, truncate } from "../core/utils.js"

/**
 * Render guides list or guide detail.
 * @param {{params?: object}} ctx
 */
export async function guideView(ctx = {}){
    const app = document.getElementById("app")
    if(!app) return

    const guideId = ctx.params?.id
    if(!guideId){
        await renderGuideList(app)
        return
    }

    await renderGuideDetail(app, guideId)
}

async function renderGuideList(app){
    app.innerHTML = `<p class="muted">Loading guides...</p>`
    const index = await ContentIndex.load()
    const guides = index.guides || []
    const categories = Array.from(new Set(guides.map(g=>g.category))).sort()

    app.innerHTML = `
        <section class="page-header">
            <div>
                <h1>Guides</h1>
                <p>Detailed walkthroughs, diagrams, and examples.</p>
            </div>
        </section>
        <section class="filters">
            <input id="guideSearch" placeholder="Search guides">
            <select id="guideCategory">
                <option value="">All categories</option>
                ${categories.map(cat=>`<option value="${escapeHTML(cat)}">${escapeHTML(cat)}</option>`).join("")}
            </select>
        </section>
        <section id="guideList" class="card-grid"></section>
    `

    const searchInput = document.getElementById("guideSearch")
    const categoryFilter = document.getElementById("guideCategory")

    const render = ()=>{
        const q = searchInput.value.trim().toLowerCase()
        const categoryValue = categoryFilter.value
        const filtered = guides.filter(guide=>{
            if(categoryValue && guide.category !== categoryValue) return false
            if(q){
                const haystack = `${guide.title} ${guide.summary || ""}`.toLowerCase()
                return haystack.includes(q)
            }
            return true
        })

        const container = document.getElementById("guideList")
        container.innerHTML = filtered.map(guide=>`
            <article class="card">
                <div class="card-meta">${escapeHTML(guide.category)}</div>
                <h3>${escapeHTML(guide.title)}</h3>
                <p>${escapeHTML(truncate(guide.summary || "", 120))}</p>
                <div class="card-actions">
                    <a class="btn btn-secondary btn-small" href="#/guide/${guide.id}">Open</a>
                </div>
            </article>
        `).join("") || `<p class="muted">No guides match your filters.</p>`
    }

    render()
    searchInput.addEventListener("input", render)
    categoryFilter.addEventListener("change", render)
}

async function renderGuideDetail(app, guideId){
    app.innerHTML = `<p class="muted">Loading guide...</p>`
    const guide = await loadJSON(`../data/guides/${guideId}.json`)
    if(!guide){
        app.innerHTML = `
            <h2>Guide not found</h2>
            <p>We could not load this guide.</p>
            <a class="btn btn-secondary" href="#/guide">Back to guides</a>
        `
        return
    }

    const isBookmarked = Bookmarks.isBookmarked("guide", guideId)

    app.innerHTML = `
        <section class="page-header">
            <div>
                <div class="eyebrow">${escapeHTML(guide.category)}</div>
                <h1>${escapeHTML(guide.title)}</h1>
                <p>${escapeHTML(guide.summary || "")}</p>
            </div>
            <div class="header-actions">
                <button id="bookmarkGuide" class="btn btn-secondary">
                    ${isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>
            </div>
        </section>
        <section class="content-block markdown">
            ${markdownToHTML(guide.content)}
        </section>
        <section class="content-block">
            <h3>Step-by-Step</h3>
            <ol>
                ${(guide.steps || []).map(step=>`<li>${escapeHTML(step)}</li>`).join("")}
            </ol>
        </section>
        <section class="content-block">
            <h3>Diagrams</h3>
            <ul>
                ${(guide.diagrams || []).map(diagram=>`<li>${escapeHTML(diagram)}</li>`).join("")}
            </ul>
        </section>
        <section class="content-block">
            <h3>Examples</h3>
            <ul>
                ${(guide.examples || []).map(ex=>`<li>${escapeHTML(ex)}</li>`).join("")}
            </ul>
        </section>
        <section class="content-block">
            <h3>References</h3>
            <ul>
                ${(guide.references || []).map(ref=>`<li>${escapeHTML(ref)}</li>`).join("")}
            </ul>
        </section>
    `

    const bookmarkBtn = document.getElementById("bookmarkGuide")
    if(bookmarkBtn){
        bookmarkBtn.addEventListener("click", ()=>{
            const nowBookmarked = !Bookmarks.isBookmarked("guide", guideId)
            if(nowBookmarked){
                Bookmarks.add("guide", guideId)
            }
            else{
                Bookmarks.remove("guide", guideId)
            }
            bookmarkBtn.textContent = nowBookmarked ? "Bookmarked" : "Bookmark"
        })
    }
}
