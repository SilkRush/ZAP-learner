/**
 * Global error boundary to keep the app usable on failures.
 */
export function setupErrorBoundary(){
    window.onerror = function(message, source, line, col, error){
        console.error("Global Error:", error || message)
        renderFallback()
    }

    window.onunhandledrejection = function(event){
        console.error("Unhandled Promise:", event.reason)
        renderFallback()
    }
}

function renderFallback(){
    const app = document.getElementById("app")
    if(!app) return
    app.innerHTML = `
        <h2>Application Error</h2>
        <p>Please reload the page or choose another section.</p>
    `
}
