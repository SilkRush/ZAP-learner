import { loadJSON } from "../core/loader.js"
import { ContentIndex } from "../core/contentIndex.js"
import { Bookmarks } from "../app/bookmarks.js"
import { markdownToHTML, escapeHTML, truncate } from "../core/utils.js"

/**
 * Render labs list or lab detail.
 * @param {{params?: object}} ctx
 */
export async function labView(ctx = {}){
    const app = document.getElementById("app")
    if(!app) return

    const labId = ctx.params?.id
    if(!labId){
        await renderLabList(app)
        return
    }

    await renderLabDetail(app, labId)
}

async function renderLabList(app){
    app.innerHTML = `<p class="muted">Loading labs...</p>`
    const index = await ContentIndex.load()
    const labs = index.labs || []
    const categories = Array.from(new Set(labs.map(lab=>lab.category))).sort()

    app.innerHTML = `
        <section class="page-header">
            <div>
                <h1>Labs</h1>
                <p>Hands-on ZAP exercises to apply each workflow end to end.</p>
            </div>
        </section>
        <section class="filters">
            <input id="labSearch" placeholder="Search labs">
            <select id="labCategory">
                <option value="">All categories</option>
                ${categories.map(cat=>`<option value="${escapeHTML(cat)}">${escapeHTML(cat)}</option>`).join("")}
            </select>
        </section>
        <section id="labList" class="card-grid"></section>
    `

    const searchInput = document.getElementById("labSearch")
    const categoryFilter = document.getElementById("labCategory")

    const render = ()=>{
        const q = searchInput.value.trim().toLowerCase()
        const categoryValue = categoryFilter.value
        const filtered = labs.filter(lab=>{
            if(categoryValue && lab.category !== categoryValue) return false
            if(q){
                const haystack = `${lab.title} ${lab.summary || ""}`.toLowerCase()
                return haystack.includes(q)
            }
            return true
        })
        const container = document.getElementById("labList")
        container.innerHTML = filtered.map(lab=>`
            <article class="card">
                <div class="card-meta">${escapeHTML(lab.category)} · ${escapeHTML(lab.difficulty || "mixed")}</div>
                <h3>${escapeHTML(lab.title)}</h3>
                <p>${escapeHTML(truncate(lab.summary || "", 120))}</p>
                <div class="card-actions">
                    <a class="btn btn-secondary btn-small" href="#/labs/${lab.id}">Open</a>
                </div>
            </article>
        `).join("") || `<p class="muted">No labs match your filters.</p>`
    }

    render()
    searchInput.addEventListener("input", render)
    categoryFilter.addEventListener("change", render)
}

async function renderLabDetail(app, labId){
    app.innerHTML = `<p class="muted">Loading lab...</p>`
    const lab = await loadJSON(`../data/labs/${labId}.json`)
    if(!lab){
        app.innerHTML = `
            <h2>Lab not found</h2>
            <p>We could not load this lab.</p>
            <a class="btn btn-secondary" href="#/labs">Back to labs</a>
        `
        return
    }

    const isBookmarked = Bookmarks.isBookmarked("lab", labId)

    app.innerHTML = `
        <section class="page-header">
            <div>
                <div class="eyebrow">${escapeHTML(lab.category)} · ${escapeHTML(lab.difficulty || "mixed")}</div>
                <h1>${escapeHTML(lab.title)}</h1>
                <p>${escapeHTML(lab.summary || "")}</p>
            </div>
            <div class="header-actions">
                <button id="bookmarkLab" class="btn btn-secondary">
                    ${isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>
            </div>
        </section>
        <section class="content-block markdown">
            ${markdownToHTML(lab.overview)}
        </section>
        <section class="content-block">
            <h3>Objectives</h3>
            <ul>
                ${(lab.objectives || []).map(obj=>`<li>${escapeHTML(obj)}</li>`).join("")}
            </ul>
        </section>
        <section class="content-block">
            <h3>Steps</h3>
            <ol>
                ${(lab.steps || []).map(step=>`<li>${escapeHTML(step)}</li>`).join("")}
            </ol>
        </section>
        <section class="content-block">
            <h3>Starter</h3>
            <pre><code>${escapeHTML(lab.starter || "")}</code></pre>
        </section>
        <section class="content-block">
            <h3>Solution Outline</h3>
            <ul>
                ${(lab.solutionOutline || []).map(step=>`<li>${escapeHTML(step)}</li>`).join("")}
            </ul>
        </section>
    `

    const bookmarkBtn = document.getElementById("bookmarkLab")
    if(bookmarkBtn){
        bookmarkBtn.addEventListener("click", ()=>{
            const nowBookmarked = !Bookmarks.isBookmarked("lab", labId)
            if(nowBookmarked){
                Bookmarks.add("lab", labId)
            }
            else{
                Bookmarks.remove("lab", labId)
            }
            bookmarkBtn.textContent = nowBookmarked ? "Bookmarked" : "Bookmark"
        })
    }
}
