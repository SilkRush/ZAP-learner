import { ContentIndex } from "../core/contentIndex.js"
import { XP } from "../app/xp.js"
import { Streak } from "../app/streak.js"
import { Progress } from "../app/progress.js"

/**
 * Render the sidebar with modules and quick stats.
 */
export async function renderSidebar(){
    const sidebar = document.getElementById("sidebar")
    if(!sidebar) return

    const index = await ContentIndex.load()
    const modules = Array.from(new Set((index.lessons || []).map(l=>l.module))).sort()
    const completed = Progress.getCompletedLessonIds().length
    const totalLessons = index.totals?.lessons || index.lessons?.length || 0
    const activeModule = getActiveModule()

    sidebar.innerHTML = `
        <div class="sidebar-section">
            <h3>Quick Stats</h3>
            <div class="stat">
                <span class="stat-label">XP</span>
                <span class="stat-value">${XP.get()}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Streak</span>
                <span class="stat-value">${Streak.get()} days</span>
            </div>
            <div class="stat">
                <span class="stat-label">Lessons</span>
                <span class="stat-value">${completed}/${totalLessons}</span>
            </div>
        </div>
        <div class="sidebar-section">
            <h3>Modules</h3>
            <ul class="sidebar-links">
                ${modules.map(module=>`
                    <li><a class="${module === activeModule ? "active" : ""}" href="#/lesson?module=${encodeURIComponent(module)}">${module}</a></li>
                `).join("")}
            </ul>
        </div>
        <div class="sidebar-section">
            <h3>Explore</h3>
            <ul class="sidebar-links">
                <li><a href="#/paths">Learning Paths</a></li>
                <li><a href="#/cheatsheets">Cheat Sheets</a></li>
                <li><a href="#/references">References</a></li>
            </ul>
        </div>
    `
}

function getActiveModule(){
    const hash = location.hash.replace(/^#/, "")
    const [, queryString] = hash.split("?")
    if(!queryString) return ""
    const params = new URLSearchParams(queryString)
    return params.get("module") || ""
}
