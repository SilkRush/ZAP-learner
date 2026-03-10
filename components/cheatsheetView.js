import { loadJSON } from "../core/loader.js"
import { escapeHTML } from "../core/utils.js"

/**
 * Render cheat sheets list or detail.
 * @param {{params?: object}} ctx
 */
export async function cheatsheetView(ctx = {}){
    const app = document.getElementById("app")
    if(!app) return

    const sheetId = ctx.params?.id
    const data = await loadJSON("../data/cheatsheets/cheatsheets.json")
    if(!data){
        app.innerHTML = `<p class="muted">Cheat sheets failed to load.</p>`
        return
    }

    if(!sheetId){
        renderList(app, data)
        return
    }

    const sheet = data.find(item=>item.id === sheetId)
    if(!sheet){
        app.innerHTML = `
            <h2>Cheat sheet not found</h2>
            <a class="btn btn-secondary" href="#/cheatsheets">Back to cheat sheets</a>
        `
        return
    }

    app.innerHTML = `
        <section class="page-header">
            <div>
                <div class="eyebrow">${escapeHTML(sheet.category)}</div>
                <h1>${escapeHTML(sheet.title)}</h1>
            </div>
        </section>
        <section class="content-block">
            <ul>
                ${(sheet.items || []).map(item=>`<li>${escapeHTML(item)}</li>`).join("")}
            </ul>
        </section>
    `
}

function renderList(app, data){
    const categories = Array.from(new Set(data.map(item=>item.category))).sort()
    app.innerHTML = `
        <section class="page-header">
            <div>
                <h1>Cheat Sheets</h1>
                <p>Quick reference cards for fast recall.</p>
            </div>
        </section>
        <section class="filters">
            <select id="sheetCategory">
                <option value="">All categories</option>
                ${categories.map(cat=>`<option value="${escapeHTML(cat)}">${escapeHTML(cat)}</option>`).join("")}
            </select>
        </section>
        <section id="sheetList" class="card-grid"></section>
    `

    const categoryFilter = document.getElementById("sheetCategory")
    const render = ()=>{
        const categoryValue = categoryFilter.value
        const filtered = data.filter(item=>{
            if(categoryValue && item.category !== categoryValue) return false
            return true
        })
        const container = document.getElementById("sheetList")
        container.innerHTML = filtered.map(item=>`
            <article class="card">
                <div class="card-meta">${escapeHTML(item.category)}</div>
                <h3>${escapeHTML(item.title)}</h3>
                <div class="card-actions">
                    <a class="btn btn-secondary btn-small" href="#/cheatsheets/${item.id}">Open</a>
                </div>
            </article>
        `).join("") || `<p class="muted">No cheat sheets found.</p>`
    }

    render()
    categoryFilter.addEventListener("change", render)
}
