/**
 * Render the top navigation bar.
 */
export function renderNavbar(){
    const nav = document.getElementById("navbar")
    if(!nav) return

    nav.innerHTML = `
        <div class="nav-brand">
            <span class="brand-mark">Z</span>
            <span class="brand-text">ZAP Master Ultimate</span>
        </div>
        <nav class="nav-links">
            <a href="#/">Home</a>
            <a href="#/lesson">Learn</a>
            <a href="#/quiz">Quizzes</a>
            <a href="#/guide">Guides</a>
            <a href="#/glossary">Glossary</a>
            <a href="#/labs">Labs</a>
            <a href="#/bookmarks">Bookmarks</a>
            <a href="#/progress">Progress</a>
        </nav>
        <div class="nav-actions">
            <a class="btn btn-primary btn-small" href="#/search">Search</a>
        </div>
    `

    highlightActiveLinks()
    window.addEventListener("hashchange", highlightActiveLinks)
}

function highlightActiveLinks(){
    const links = document.querySelectorAll(".nav-links a")
    const hash = location.hash.replace(/^#/, "")
    links.forEach(link=>{
        const target = link.getAttribute("href")?.replace(/^#/, "") || ""
        const isActive = hash === target || (hash.startsWith(target) && target.length > 1)
        link.classList.toggle("active", isActive)
    })
}
