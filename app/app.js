import { Router } from "../core/router.js"
import { renderNavbar } from "../components/navbar.js"
import { renderSidebar } from "../components/sidebar.js"
import { lessonView } from "../components/lessonView.js"
import { quizView } from "../components/quizView.js"
import { searchView } from "../components/searchView.js"
import { glossaryView } from "../components/glossaryView.js"
import { guideView } from "../components/guideView.js"
import { labView } from "../components/labView.js"
import { bookmarkView } from "../components/bookmarkView.js"
import { progressView } from "../components/progressView.js"
import { pathView } from "../components/pathView.js"
import { referencesView } from "../components/referencesView.js"
import { cheatsheetView } from "../components/cheatsheetView.js"
import { homeView } from "../components/homeView.js"
import { setupErrorBoundary } from "../core/errorBoundary.js"

/**
 * Application bootstrap.
 */
renderNavbar()
renderSidebar()
setupErrorBoundary()

Router.register("/", homeView)
Router.register("/lesson", lessonView)
Router.register("/lesson/:id", lessonView)
Router.register("/quiz", quizView)
Router.register("/quiz/:id", quizView)
Router.register("/guide", guideView)
Router.register("/guide/:id", guideView)
Router.register("/glossary", glossaryView)
Router.register("/glossary/:id", glossaryView)
Router.register("/labs", labView)
Router.register("/labs/:id", labView)
Router.register("/bookmarks", bookmarkView)
Router.register("/search", searchView)
Router.register("/progress", progressView)
Router.register("/paths", pathView)
Router.register("/references", referencesView)
Router.register("/cheatsheets", cheatsheetView)
Router.register("/cheatsheets/:id", cheatsheetView)

Router.setNotFound(()=>{
    const app = document.getElementById("app")
    if(app){
        app.innerHTML = `
            <h2>Page not found</h2>
            <p>Check the navigation to continue.</p>
        `
    }
})

Router.start()

if("serviceWorker" in navigator){
    const swUrl = new URL("../service-worker.js", import.meta.url)
    navigator.serviceWorker.register(swUrl)

}

window.addEventListener("hashchange", ()=>{
    renderSidebar()
})
