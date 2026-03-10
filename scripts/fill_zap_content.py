import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"

LESSONS_DIR = DATA_DIR / "lessons"
GUIDES_DIR = DATA_DIR / "guides"
QUIZZES_DIR = DATA_DIR / "quizzes"
LABS_DIR = DATA_DIR / "labs"
GLOSSARY_DIR = DATA_DIR / "glossary"
REFERENCES_FILE = DATA_DIR / "references" / "references.json"
CHEATSHEETS_FILE = DATA_DIR / "cheatsheets" / "cheatsheets.json"
LEARNING_PATHS_FILE = DATA_DIR / "learning-paths.json"


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def write_json(path: Path, data):
    path.write_text(json.dumps(data, indent=4, ensure_ascii=True), encoding="utf-8")


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


CODE_SAMPLES = [
    {
        "language": "bash",
        "code": "./zap.sh -cmd -autogenmin zap-plan.yaml\n./zap.sh -cmd -autorun zap-plan.yaml",
    },
    {
        "language": "bash",
        "code": "-zapit https://www.example1.com -zapit http://example2.com/ -cmd",
    },
    {
        "language": "bash",
        "code": "docker run -t ghcr.io/zaproxy/zaproxy:stable zap-full-scan.py -t https://www.example.com",
    },
    {
        "language": "bash",
        "code": "docker run -v $(pwd):/zap/wrk/:rw -t ghcr.io/zaproxy/zaproxy:stable \\\n  zap-full-scan.py -t https://www.example.com -g gen.conf -r report.html",
    },
    {
        "language": "yaml",
        "code": "env:\n  contexts:\n    - name: target\n      urls:\n        - https://www.example.com\n      includePaths: []\n      excludePaths: []\n      authentication:\n        method: manual\n  vars:\n    env: dev\njobs:\n  - type: spider\n  - type: activeScan",
    },
]

LESSON_MODULES = {
    "programming-fundamentals": {
        "module": "ZAP Foundations",
        "topics": [
            "What ZAP Is and When to Use It",
            "Installing ZAP Desktop",
            "First Launch and UI Tour",
            "Quick Start Automated Scan",
            "Safe, Protected, Standard, and Attack Modes",
            "Passive Scanning Basics",
            "Active Scanning Basics",
            "Spider and AJAX Spider Overview",
            "Alerts, Risk, and Confidence",
            "Managing Add-ons and Updates",
            "Using the Sites Tree and History",
            "Preparing a Test Target and Scope",
        ],
        "tags": ["zap", "foundations"],
        "references": [
            "ZAP Desktop User Guide",
            "Getting Started Guide",
            "ZAP Modes",
            "Quick Start Add-on",
        ],
    },
    "data-structures": {
        "module": "ZAP Interface & Workflow",
        "topics": [
            "Navigating the Sites Tree",
            "Working with Requests and Responses",
            "Using the History Tab",
            "Managing Sessions and Contexts",
            "Filtering and Searching Results",
            "Breakpoints and Interception",
            "Organizing Targets and Nodes",
            "Reviewing Alerts in the UI",
            "Using the Toolbar and Menus",
            "Saving and Restoring Sessions",
        ],
        "tags": ["zap", "ui"],
        "references": [
            "Desktop UI Overview",
            "Top Level Toolbar",
            "Contexts",
            "Alerts",
        ],
    },
    "algorithms": {
        "module": "ZAP Scanning Core",
        "topics": [
            "Defining Scope with Contexts",
            "Include and Exclude Patterns",
            "Traditional Spider Strategy",
            "AJAX Spider Strategy",
            "Passive Scan Rules",
            "Active Scan Rules",
            "Scan Policies and Tuning",
            "Reading Scan Progress",
            "Validating Alerts",
            "Retesting After Fixes",
        ],
        "tags": ["zap", "scanning"],
        "references": [
            "Scope",
            "Contexts",
            "Quick Start Add-on",
            "Scan Policy",
        ],
    },
    "backend-engineering": {
        "module": "ZAP Automation & CI",
        "topics": [
            "Automation Framework Overview",
            "Generating Automation Plans",
            "Defining Environment Contexts",
            "Automation Jobs: Spider",
            "Automation Jobs: Active Scan",
            "Running Plans with -autorun",
            "Interpreting Automation Exit Codes",
            "Automation in Docker",
            "Automation GUI Workflow",
            "Troubleshooting Automation Runs",
        ],
        "tags": ["zap", "automation"],
        "references": [
            "Automation Framework",
            "Automation Framework - Environment",
            "Automation Framework - GUI",
            "ZAP Docker Documentation",
        ],
    },
    "databases": {
        "module": "ZAP Auth & Sessions",
        "topics": [
            "Why Authenticated Scans Matter",
            "Defining Users in Contexts",
            "Authentication Methods Overview",
            "Session Management Basics",
            "User Credentials and Session Refresh",
            "Verification Strategies",
            "Testing Authenticated Areas",
            "Handling Logout and Expired Sessions",
            "Multi-User Scanning",
            "Troubleshooting Authentication",
        ],
        "tags": ["zap", "auth"],
        "references": [
            "Users",
            "Contexts",
            "Scope",
            "Automation Framework - Environment",
        ],
    },
    "frontend-engineering": {
        "module": "ZAP Scripting & Extensions",
        "topics": [
            "Using the Add-ons Marketplace",
            "Managing Add-on Versions",
            "Working with Scan Rule Packs",
            "Customizing Scan Policies",
            "Extending ZAP with Add-ons",
            "Understanding Add-on Release Channels",
            "Reviewing Alert Filters",
            "Using Automation-friendly Add-ons",
            "Keeping Add-ons Updated",
            "Organizing Extension Settings",
        ],
        "tags": ["zap", "extensions"],
        "references": [
            "Quick Start Add-on",
            "Passive Scan Rules",
            "Scan Policy",
            "Automation Framework",
        ],
    },
    "data-science": {
        "module": "ZAP Alerts & Reporting",
        "topics": [
            "Understanding Alert Fields",
            "Risk and Confidence Levels",
            "Alert Evidence and Context",
            "Filtering and Prioritizing Alerts",
            "Summarizing Findings",
            "Building Remediation Notes",
            "Tracking Regression Results",
            "Alert Trends Over Time",
            "Reporting to Stakeholders",
            "Validating Fixes",
        ],
        "tags": ["zap", "alerts"],
        "references": [
            "Alerts",
            "ZAP Desktop User Guide",
            "Scan Policy",
            "Quick Start Add-on",
        ],
    },
    "machine-learning": {
        "module": "ZAP Advanced Scanning",
        "topics": [
            "Attack Mode Considerations",
            "Scan Policy Depth Control",
            "Handling Modern Web Apps",
            "AJAX Spider Coverage",
            "Large Target Performance",
            "Rate Limiting and Safety",
            "Combining Passive and Active Results",
            "Using Packaged Scans",
            "Tuning Full Scan Scripts",
            "Automated Retesting",
        ],
        "tags": ["zap", "advanced"],
        "references": [
            "Modes",
            "Scan Policy",
            "ZAP - Full Scan",
            "ZAP Docker User Guide",
        ],
    },
    "networking": {
        "module": "ZAP Proxying & Networking",
        "topics": [
            "Proxying Browser Traffic",
            "Capturing Requests in History",
            "Handling HTTPS Traffic",
            "Breakpoints and Interception",
            "Upstream Proxy Settings",
            "Local Proxy Ports",
            "Scoped Proxying with Contexts",
            "Using Manual Explore",
            "Browser Launch from Quick Start",
            "Troubleshooting Proxy Issues",
        ],
        "tags": ["zap", "proxy"],
        "references": [
            "Quick Start Add-on",
            "Contexts",
            "Desktop UI Overview",
            "Getting Started Guide",
        ],
    },
    "operating-systems": {
        "module": "ZAP Installation & Environments",
        "topics": [
            "Installing ZAP Desktop",
            "Updating ZAP and Add-ons",
            "Using ZAP in Docker",
            "Running ZAP with Webswing",
            "Headless ZAP Execution",
            "Managing Config Files",
            "Running Packaged Scans",
            "Automation Framework in CI",
            "Environment Variables and Ports",
            "Troubleshooting Startup",
        ],
        "tags": ["zap", "environment"],
        "references": [
            "ZAP Docker Documentation",
            "ZAP Docker User Guide",
            "Automation Framework",
            "Getting Started Guide",
        ],
    },
    "web-development": {
        "module": "ZAP Web App Testing",
        "topics": [
            "Planning a Web App Scan",
            "Quick Start for Web Apps",
            "Defining Scope and Contexts",
            "Spidering and Discovery",
            "Active Scanning and Validation",
            "Manual Explore with Proxy",
            "Handling Modern Frontends",
            "Reporting Findings",
            "Retesting After Fixes",
            "Combining Manual and Automated",
        ],
        "tags": ["zap", "web"],
        "references": [
            "Quick Start Add-on",
            "Scope",
            "Alerts",
            "Scan Policy",
        ],
    },
    "security": {
        "module": "ZAP Security Practice",
        "topics": [
            "Legal and Ethical Scanning",
            "Defining Rules of Engagement",
            "Interpreting Risk and Confidence",
            "Documenting Evidence",
            "Coordinating Remediation",
            "Retesting and Verification",
            "Reporting and Communication",
            "Integrating with Dev Workflows",
            "Building Scan Checklists",
            "Measuring Coverage",
        ],
        "tags": ["zap", "security"],
        "references": [
            "ZAP Desktop User Guide",
            "Alerts",
            "Scan Policy",
            "Getting Started Guide",
        ],
    },
    "system-design": {
        "module": "ZAP Program & Governance",
        "topics": [
            "Designing a ZAP Testing Program",
            "Standardizing Scan Policies",
            "Automation Framework Governance",
            "Defining Success Metrics",
            "CI/CD Integration Strategy",
            "Managing Scan Capacity",
            "Reporting Standards",
            "Access Control for Testing",
            "Continuous Improvement Loop",
            "Risk-based Scheduling",
        ],
        "tags": ["zap", "governance"],
        "references": [
            "Automation Framework",
            "ZAP Docker Documentation",
            "Scan Policy",
            "Alerts",
        ],
    },
}


GUIDE_TOPICS = [
    {
        "title": "Quick Start Automated Scan",
        "category": "quick-start",
        "summary": "Run an automated scan quickly and safely with ZAP Quick Start.",
        "steps": [
            "Open the Quick Start tab and choose Automated Scan.",
            "Enter the target URL and verify you have permission.",
            "Pick traditional spider or AJAX spider based on the app.",
            "Launch the scan and monitor progress in the toolbar.",
            "Review alerts and capture evidence for follow-up.",
        ],
        "examples": [
            "Scan a staging site to validate headers and low-risk findings.",
            "Compare results between traditional and AJAX spider runs.",
        ],
        "diagrams": [
            "Quick Start flow: URL -> Spider -> Active Scan -> Alerts",
            "Decision tree for traditional vs AJAX spider",
        ],
        "references": ["Quick Start Add-on"],
    },
    {
        "title": "Manual Explore with Proxy",
        "category": "proxy",
        "summary": "Proxy a browser through ZAP to explore and collect real traffic.",
        "steps": [
            "Launch the Quick Start Manual Explore browser.",
            "Navigate through core user journeys.",
            "Capture traffic in the History tab.",
            "Add important URLs to scope and contexts.",
            "Trigger follow-up scans on discovered paths.",
        ],
        "examples": [
            "Record a login flow for authenticated testing later.",
            "Use manual explore to hit hidden navigation paths.",
        ],
        "diagrams": [
            "Browser -> ZAP Proxy -> Target App",
            "Manual explore and follow-up scan loop",
        ],
        "references": ["Quick Start Add-on", "Desktop UI Overview"],
    },
    {
        "title": "Defining Scope with Contexts",
        "category": "scope",
        "summary": "Keep scans safe and focused by modeling scope with contexts.",
        "steps": [
            "Create a new context for your application.",
            "Define include and exclude regex patterns.",
            "Set the context in scope before scanning.",
            "Use Protected mode to enforce scope rules.",
            "Revisit scope as the app changes.",
        ],
        "examples": [
            "Exclude logout endpoints to keep sessions alive.",
            "Limit scans to /app/ paths during testing.",
        ],
        "diagrams": [
            "Context include/exclude boundary",
            "Scope enforcement in Protected mode",
        ],
        "references": ["Contexts", "Scope", "Modes"],
    },
    {
        "title": "Users and Authentication Setup",
        "category": "auth",
        "summary": "Model authenticated users and sessions for realistic scans.",
        "steps": [
            "Define authentication settings in the context.",
            "Create users with the right credentials.",
            "Verify session management behavior.",
            "Run scans as a specific user.",
            "Re-authenticate when sessions expire.",
        ],
        "examples": [
            "Create a read-only user for baseline scans.",
            "Test admin-only endpoints with an admin user.",
        ],
        "diagrams": [
            "Context -> Authentication -> Users",
            "Session refresh lifecycle",
        ],
        "references": ["Users", "Contexts"],
    },
    {
        "title": "Working Safely with Modes",
        "category": "modes",
        "summary": "Use ZAP modes to control scan safety and scope.",
        "steps": [
            "Start in Safe or Protected mode by default.",
            "Define scope before enabling active scans.",
            "Use Standard mode for manual exploration.",
            "Reserve Attack mode for controlled environments.",
            "Validate that actions stay in scope.",
        ],
        "examples": [
            "Use Protected mode during CI scanning.",
            "Switch to Safe mode for read-only analysis.",
        ],
        "diagrams": [
            "Mode matrix vs allowed actions",
            "Scope guardrails by mode",
        ],
        "references": ["Modes", "Scope"],
    },
    {
        "title": "Automation Framework Plan Basics",
        "category": "automation",
        "summary": "Automate repeatable ZAP scans with YAML plans.",
        "steps": [
            "Generate a minimal plan with -autogenmin.",
            "Define the environment and context URLs.",
            "Add spider and active scan jobs.",
            "Run the plan using -autorun.",
            "Check exit codes and warnings.",
        ],
        "examples": [
            "Run a plan in CI to block on failures.",
            "Iterate on a plan for a complex app.",
        ],
        "diagrams": [
            "Automation plan lifecycle",
            "Plan -> Jobs -> Results",
        ],
        "references": ["Automation Framework", "Automation Framework - Environment"],
    },
    {
        "title": "Automation Framework Environment",
        "category": "automation",
        "summary": "Model targets, contexts, and variables in the environment section.",
        "steps": [
            "Define context names and top-level URLs.",
            "Add include/exclude regex paths.",
            "Specify authentication configuration if needed.",
            "Set variables for hostnames and ports.",
            "Run a validation pass with -autocheck.",
        ],
        "examples": [
            "Keep default ports out of URLs when required.",
            "Reuse variables across multiple jobs.",
        ],
        "diagrams": [
            "Environment section structure",
            "Context binding to jobs",
        ],
        "references": ["Automation Framework - Environment"],
    },
    {
        "title": "Docker Full Scan Workflow",
        "category": "docker",
        "summary": "Run the packaged full scan script from official ZAP Docker images.",
        "steps": [
            "Pull the stable ZAP Docker image.",
            "Run zap-full-scan.py with a target URL.",
            "Mount a working directory for reports.",
            "Review HTML or JSON reports.",
            "Use exit codes to drive CI results.",
        ],
        "examples": [
            "Generate an HTML report from a nightly scan.",
            "Tune warnings with a configuration file.",
        ],
        "diagrams": [
            "Docker container -> Scan -> Report",
            "Full scan pipeline",
        ],
        "references": ["ZAP - Full Scan", "ZAP Docker User Guide"],
    },
    {
        "title": "Alerts and Prioritization",
        "category": "alerts",
        "summary": "Interpret alerts, assess risk, and plan remediation.",
        "steps": [
            "Review alert details and evidence.",
            "Check risk and confidence levels.",
            "Validate findings with manual requests.",
            "Document remediation guidance.",
            "Retest and close findings.",
        ],
        "examples": [
            "Tag recurring alerts for follow-up.",
            "Export alerts to share with engineering.",
        ],
        "diagrams": [
            "Alert lifecycle",
            "Risk vs confidence matrix",
        ],
        "references": ["Alerts"],
    },
    {
        "title": "Scan Policy Tuning",
        "category": "scanning",
        "summary": "Adjust scan policies to balance coverage and safety.",
        "steps": [
            "Select an appropriate scan policy.",
            "Review active scan rules included.",
            "Adjust rule strength and thresholds.",
            "Save a policy for reuse.",
            "Run a focused scan to validate.",
        ],
        "examples": [
            "Use a conservative policy for production scans.",
            "Increase strength for a deep-dive assessment.",
        ],
        "diagrams": [
            "Policy selection workflow",
            "Rule strength vs coverage",
        ],
        "references": ["Scan Policy"],
    },
    {
        "title": "ZAPit Recon Workflow",
        "category": "quick-start",
        "summary": "Run a lightweight reconnaissance scan from the command line.",
        "steps": [
            "Invoke the -zapit command line option.",
            "Verify that -cmd is included.",
            "Review summarized alerts and stats.",
            "Capture technologies detected.",
            "Use findings to plan deeper scans.",
        ],
        "examples": [
            "Quickly snapshot a new target for triage.",
            "Compare recon output across environments.",
        ],
        "diagrams": [
            "ZAPit quick recon pipeline",
            "Recon vs full scan workflow",
        ],
        "references": ["ZAPit"],
    },
    {
        "title": "API Access and Control",
        "category": "api",
        "summary": "Use the ZAP API to control scans and collect results.",
        "steps": [
            "Enable API access in Options if required.",
            "Confirm host and port for API access.",
            "Use API endpoints to trigger scans.",
            "Secure the API with keys and allowed hosts.",
            "Monitor API-driven activity in the UI.",
        ],
        "examples": [
            "Trigger an active scan from a build pipeline.",
            "Retrieve alerts via the API for dashboards.",
        ],
        "diagrams": [
            "API control flow",
            "Automation via API endpoints",
        ],
        "references": ["API"],
    },
]

LAB_TEMPLATES = [
    {
        "title": "Quick Start Automated Scan",
        "category": "quick-start",
        "difficulty": "beginner",
        "overview": "## Goal\nRun a Quick Start automated scan safely and review the alerts.",
        "objectives": [
            "Launch an automated scan from Quick Start.",
            "Choose the right spider option.",
            "Review alerts and capture evidence.",
        ],
        "steps": [
            "Open Quick Start and select Automated Scan.",
            "Enter the target URL you have permission to test.",
            "Select traditional or AJAX spider based on the app.",
            "Launch the scan and wait for completion.",
            "Review alerts and note top risks.",
        ],
        "starter": "# Use Quick Start UI to launch the scan\n# Record the URL, spider choice, and top alerts",
        "solutionOutline": [
            "Scan completed with the selected spider option.",
            "Alerts reviewed and summarized by risk.",
            "Evidence captured for key findings.",
        ],
    },
    {
        "title": "Context Scope Setup",
        "category": "scope",
        "difficulty": "beginner",
        "overview": "## Goal\nCreate a context and enforce scope with Protected mode.",
        "objectives": [
            "Define include and exclude patterns.",
            "Set the context in scope.",
            "Validate behavior in Protected mode.",
        ],
        "steps": [
            "Create a new context for the target app.",
            "Add include and exclude regex patterns.",
            "Set the context in scope.",
            "Switch to Protected mode.",
            "Attempt an out-of-scope action to verify protection.",
        ],
        "starter": "# Capture scope patterns and context name\n# Test actions inside and outside scope",
        "solutionOutline": [
            "Context includes only intended URLs.",
            "Protected mode blocks out-of-scope actions.",
            "Scope verified for safe scanning.",
        ],
    },
    {
        "title": "Spider Coverage Comparison",
        "category": "scanning",
        "difficulty": "intermediate",
        "overview": "## Goal\nCompare traditional spider and AJAX spider coverage.",
        "objectives": [
            "Run both spiders on the same target.",
            "Compare discovered URLs.",
            "Document coverage differences.",
        ],
        "steps": [
            "Run the traditional spider from the target URL.",
            "Run the AJAX spider with the same scope.",
            "Compare results in the Sites Tree.",
            "Note pages found only by one spider.",
            "Decide which spider to use for deeper scans.",
        ],
        "starter": "# Record spider configuration and output counts",
        "solutionOutline": [
            "Coverage differences documented.",
            "Spider choice justified for the target app.",
        ],
    },
    {
        "title": "Alert Triage and Evidence",
        "category": "alerts",
        "difficulty": "beginner",
        "overview": "## Goal\nReview alerts, validate evidence, and prioritize risks.",
        "objectives": [
            "Identify high and medium risk alerts.",
            "Capture evidence from request/response views.",
            "Summarize remediation guidance.",
        ],
        "steps": [
            "Open the Alerts tab and filter by risk.",
            "Select a high-risk alert and review evidence.",
            "Capture request and response details.",
            "Record recommended remediation steps.",
            "Repeat for one medium-risk alert.",
        ],
        "starter": "# Choose two alerts and document evidence",
        "solutionOutline": [
            "Evidence captured for each alert.",
            "Findings prioritized by risk and confidence.",
        ],
    },
    {
        "title": "Automation Plan Execution",
        "category": "automation",
        "difficulty": "intermediate",
        "overview": "## Goal\nGenerate and run an Automation Framework plan.",
        "objectives": [
            "Generate a template plan.",
            "Add a spider and active scan job.",
            "Run the plan with -autorun.",
        ],
        "steps": [
            "Generate a plan using -autogenmin.",
            "Add target URLs in the environment section.",
            "Insert spider and active scan jobs.",
            "Run the plan with -autorun and -cmd.",
            "Review exit code and output.",
        ],
        "starter": "./zap.sh -cmd -autogenmin zap-plan.yaml\n./zap.sh -cmd -autorun zap-plan.yaml",
        "solutionOutline": [
            "Automation plan completed successfully.",
            "Exit code interpreted correctly.",
        ],
    },
    {
        "title": "Docker Full Scan Run",
        "category": "docker",
        "difficulty": "intermediate",
        "overview": "## Goal\nRun the packaged full scan from ZAP Docker images.",
        "objectives": [
            "Run zap-full-scan.py with a target URL.",
            "Generate an HTML report.",
            "Capture the exit code.",
        ],
        "steps": [
            "Pull the stable ZAP Docker image.",
            "Run zap-full-scan.py with a target URL.",
            "Mount a working directory for reports.",
            "Open the HTML report and note alerts.",
            "Record the script exit code.",
        ],
        "starter": "docker run -t ghcr.io/zaproxy/zaproxy:stable zap-full-scan.py -t https://www.example.com",
        "solutionOutline": [
            "Report generated and saved to disk.",
            "Exit code documented for CI usage.",
        ],
    },
    {
        "title": "ZAPit Recon Run",
        "category": "quick-start",
        "difficulty": "beginner",
        "overview": "## Goal\nRun a ZAPit reconnaissance scan from the command line.",
        "objectives": [
            "Run the -zapit command correctly.",
            "Capture summary output.",
            "Identify reported technologies.",
        ],
        "steps": [
            "Run ZAP with the -zapit option.",
            "Ensure -cmd is included.",
            "Review the output for alerts and stats.",
            "Record technologies detected.",
        ],
        "starter": "-zapit https://www.example1.com -zapit http://example2.com/ -cmd",
        "solutionOutline": [
            "Recon output captured and summarized.",
            "Next steps identified for deeper scans.",
        ],
    },
    {
        "title": "Protected Mode Validation",
        "category": "modes",
        "difficulty": "beginner",
        "overview": "## Goal\nConfirm Protected mode blocks out-of-scope actions.",
        "objectives": [
            "Set a context in scope.",
            "Switch to Protected mode.",
            "Verify out-of-scope scanning is blocked.",
        ],
        "steps": [
            "Create or select a context with scope rules.",
            "Enable Protected mode from the toolbar.",
            "Attempt to run an active scan on out-of-scope URLs.",
            "Record the blocked action.",
        ],
        "starter": "# Use Protected mode before active scans",
        "solutionOutline": [
            "Protected mode prevents out-of-scope actions.",
            "Scope validated for safe testing.",
        ],
    },
    {
        "title": "Scan Policy Tuning",
        "category": "scanning",
        "difficulty": "advanced",
        "overview": "## Goal\nTune scan policies to balance coverage and safety.",
        "objectives": [
            "Select a scan policy.",
            "Adjust rule strength or thresholds.",
            "Run a targeted scan to validate impact.",
        ],
        "steps": [
            "Open the Scan Policy manager.",
            "Adjust rules for the target app.",
            "Run an active scan with the policy.",
            "Review alert differences.",
        ],
        "starter": "# Document rule changes and outcomes",
        "solutionOutline": [
            "Policy changes documented and validated.",
            "Coverage impact evaluated.",
        ],
    },
    {
        "title": "Alert Retest Workflow",
        "category": "alerts",
        "difficulty": "intermediate",
        "overview": "## Goal\nRetest a fixed issue and validate the alert status.",
        "objectives": [
            "Retest a previously flagged issue.",
            "Confirm alert no longer appears.",
            "Document the fix verification.",
        ],
        "steps": [
            "Identify a resolved alert.",
            "Re-run the relevant scan steps.",
            "Compare new results with prior evidence.",
            "Document validation outcome.",
        ],
        "starter": "# Record before/after evidence",
        "solutionOutline": [
            "Fix verified with retest evidence.",
            "Alert status updated appropriately.",
        ],
    },
    {
        "title": "Automation Exit Codes",
        "category": "automation",
        "difficulty": "intermediate",
        "overview": "## Goal\nInterpret Automation Framework exit codes for CI logic.",
        "objectives": [
            "Run a plan that produces warnings.",
            "Capture exit code output.",
            "Map exit codes to CI outcomes.",
        ],
        "steps": [
            "Run a plan with -autorun and -cmd.",
            "Note the exit code after completion.",
            "Document how code maps to pass/fail.",
        ],
        "starter": "./zap.sh -cmd -autorun zap-plan.yaml",
        "solutionOutline": [
            "Exit codes mapped to CI responses.",
            "Automation run documented.",
        ],
    },
]

QUESTION_BANK = [
    {
        "question": "Which ZAP mode only allows potentially dangerous actions on URLs in scope?",
        "choices": ["Protected", "Safe", "Standard", "Attack"],
        "correct": "Protected",
        "explanation": "Protected mode restricts potentially dangerous actions to in-scope URLs.",
        "difficulty": "beginner",
        "tags": ["modes"],
    },
    {
        "question": "Which ZAP mode actively scans new in-scope nodes as soon as they are discovered?",
        "choices": ["Attack", "Protected", "Safe", "Standard"],
        "correct": "Attack",
        "explanation": "Attack mode triggers active scanning automatically for new in-scope nodes.",
        "difficulty": "beginner",
        "tags": ["modes"],
    },
    {
        "question": "In ZAP, scope is defined primarily by what?",
        "choices": ["Contexts", "Users", "Alerts", "Policies"],
        "correct": "Contexts",
        "explanation": "Scope is defined by the contexts you set in ZAP.",
        "difficulty": "beginner",
        "tags": ["scope"],
    },
    {
        "question": "Contexts in ZAP are defined using what to match URLs?",
        "choices": ["Regular expressions", "Cookies", "Headers", "XPath"],
        "correct": "Regular expressions",
        "explanation": "Contexts use regex patterns that must match full URLs.",
        "difficulty": "intermediate",
        "tags": ["contexts"],
    },
    {
        "question": "Users in ZAP are closely tied to which features?",
        "choices": ["Authentication and Session Management", "Alerts and Reports", "Proxy and UI", "Spider and Scope"],
        "correct": "Authentication and Session Management",
        "explanation": "Users rely on the authentication and session management defined in a context.",
        "difficulty": "intermediate",
        "tags": ["users"],
    },
    {
        "question": "Quick Start Automated Scan requires you to enter what?",
        "choices": ["The target URL", "An API key", "A scan policy name", "A report template"],
        "correct": "The target URL",
        "explanation": "Automated Scan launches against the URL you specify.",
        "difficulty": "beginner",
        "tags": ["quick-start"],
    },
    {
        "question": "The traditional spider is fast but struggles with what type of applications?",
        "choices": ["Apps heavy in JavaScript", "Static HTML sites", "Localhost apps", "APIs"],
        "correct": "Apps heavy in JavaScript",
        "explanation": "Traditional spider finds links in HTML and does not handle heavy JavaScript well.",
        "difficulty": "intermediate",
        "tags": ["spider"],
    },
    {
        "question": "The AJAX spider explores applications by using what?",
        "choices": ["A browser", "A database", "A reverse proxy", "A static sitemap"],
        "correct": "A browser",
        "explanation": "AJAX spider launches a browser and clicks links to explore JS-driven apps.",
        "difficulty": "intermediate",
        "tags": ["spider"],
    },
    {
        "question": "When using -zapit, which option must be included or it will be ignored?",
        "choices": ["-cmd", "-daemon", "-quickout", "-config"],
        "correct": "-cmd",
        "explanation": "ZAPit requires -cmd or the option is ignored.",
        "difficulty": "beginner",
        "tags": ["zapit"],
    },
    {
        "question": "Which Automation Framework option runs a plan?",
        "choices": ["-autorun", "-autocheck", "-autogenmin", "-autogenconf"],
        "correct": "-autorun",
        "explanation": "-autorun runs the automation jobs from a plan file.",
        "difficulty": "beginner",
        "tags": ["automation"],
    },
    {
        "question": "Automation Framework exit code 2 means what?",
        "choices": ["Warnings with no errors", "Success", "Errors found", "Plan stopped"],
        "correct": "Warnings with no errors",
        "explanation": "Exit code 2 signals warnings without errors.",
        "difficulty": "intermediate",
        "tags": ["automation"],
    },
    {
        "question": "The ZAP full scan script runs a spider, optional AJAX spider, then what?",
        "choices": ["A full active scan", "Only passive scanning", "A report export", "A proxy replay"],
        "correct": "A full active scan",
        "explanation": "The full scan script finishes with a full active scan.",
        "difficulty": "beginner",
        "tags": ["docker"],
    },
    {
        "question": "In zap-full-scan.py usage, the target must include what?",
        "choices": ["The protocol, e.g. https://", "An API key", "A report path", "A context file"],
        "correct": "The protocol, e.g. https://",
        "explanation": "The target URL must include the protocol.",
        "difficulty": "beginner",
        "tags": ["docker"],
    },
    {
        "question": "An alert in ZAP is associated with what?",
        "choices": ["A specific request", "A user account", "A scan policy", "A context name"],
        "correct": "A specific request",
        "explanation": "Alerts are tied to specific requests and can have multiple per request.",
        "difficulty": "beginner",
        "tags": ["alerts"],
    },
    {
        "question": "Where is the ZAP API UI available when proxying via ZAP?",
        "choices": ["http://zap/", "http://api/", "http://localhost/api", "http://zap/ui"],
        "correct": "http://zap/",
        "explanation": "The API UI is accessible via http://zap/ when proxying through ZAP.",
        "difficulty": "intermediate",
        "tags": ["api"],
    },
]

QUIZ_MODULES = [
    "ZAP Foundations",
    "ZAP Scanning",
    "ZAP Automation",
    "ZAP Auth",
    "ZAP Docker",
    "ZAP Alerts",
    "ZAP Advanced",
    "ZAP UI",
]


CHEATSHEETS = [
    {
        "id": "cheatsheet-001",
        "title": "Quick Start Checklist",
        "category": "quick-start",
        "items": [
            "Confirm you have permission to test the target.",
            "Enter a full URL including http/https.",
            "Choose traditional or AJAX spider based on the app.",
            "Review alerts immediately after the scan completes.",
        ],
    },
    {
        "id": "cheatsheet-002",
        "title": "Modes At-a-Glance",
        "category": "modes",
        "items": [
            "Safe: no dangerous actions allowed.",
            "Protected: dangerous actions only in scope.",
            "Standard: no restrictions.",
            "Attack: active scan new nodes in scope automatically.",
        ],
    },
    {
        "id": "cheatsheet-003",
        "title": "Context & Scope Setup",
        "category": "scope",
        "items": [
            "Create one context per application.",
            "Use include/exclude regex patterns.",
            "Set the context in scope before scanning.",
            "Prefer Protected mode for safety.",
        ],
    },
    {
        "id": "cheatsheet-004",
        "title": "User & Auth Setup",
        "category": "auth",
        "items": [
            "Define authentication method in the context.",
            "Create users with credentials.",
            "Verify session management settings.",
            "Run scans as the desired user.",
        ],
    },
    {
        "id": "cheatsheet-005",
        "title": "Automation Framework",
        "category": "automation",
        "items": [
            "Generate plans with -autogenmin or -autogenmax.",
            "Run plans with -cmd -autorun plan.yaml.",
            "Check exit codes: 0 success, 1 error, 2 warnings.",
            "Define contexts and URLs in env section.",
        ],
    },
    {
        "id": "cheatsheet-006",
        "title": "Docker Full Scan",
        "category": "docker",
        "items": [
            "Use ghcr.io/zaproxy/zaproxy:stable image.",
            "Run zap-full-scan.py with a target URL.",
            "Mount a work dir for reports.",
            "Use exit codes to control CI.",
        ],
    },
    {
        "id": "cheatsheet-007",
        "title": "ZAPit Recon",
        "category": "quick-start",
        "items": [
            "Use -zapit with full URLs.",
            "Include -cmd or it will be ignored.",
            "Review tech detection and alert summary.",
            "Use findings to plan deeper scans.",
        ],
    },
    {
        "id": "cheatsheet-008",
        "title": "Alert Review",
        "category": "alerts",
        "items": [
            "Check risk and confidence levels.",
            "Capture evidence from request/response.",
            "Prioritize high and medium risks.",
            "Retest after fixes.",
        ],
    },
    {
        "id": "cheatsheet-009",
        "title": "Spider Choice",
        "category": "scanning",
        "items": [
            "Traditional spider is fast for HTML links.",
            "AJAX spider handles JS-driven apps.",
            "Run both for coverage comparison.",
            "Check Sites Tree for gaps.",
        ],
    },
    {
        "id": "cheatsheet-010",
        "title": "Scan Policy Basics",
        "category": "scanning",
        "items": [
            "Policies define active scan rules.",
            "Tune strength and thresholds per target.",
            "Save policies for reuse.",
            "Validate coverage changes with retests.",
        ],
    },
    {
        "id": "cheatsheet-011",
        "title": "API Access",
        "category": "api",
        "items": [
            "API UI available at http://zap/ when proxying.",
            "Configure API access in Options if needed.",
            "Restrict API access to trusted hosts.",
            "Use API for automation and reporting.",
        ],
    },
    {
        "id": "cheatsheet-012",
        "title": "UI Navigation",
        "category": "ui",
        "items": [
            "Sites Tree organizes discovered URLs.",
            "History tab shows proxied traffic.",
            "Alerts tab lists findings by risk.",
            "Toolbar controls modes and scans.",
        ],
    },
    {
        "id": "cheatsheet-013",
        "title": "Manual Explore",
        "category": "proxy",
        "items": [
            "Launch browser from Quick Start Manual Explore.",
            "Walk through critical user journeys.",
            "Capture traffic in History.",
            "Add discovered URLs to scope.",
        ],
    },
    {
        "id": "cheatsheet-014",
        "title": "Automation Environment",
        "category": "automation",
        "items": [
            "Define contexts with names and URLs.",
            "Use include/exclude regex paths.",
            "Avoid default ports in URLs when required.",
            "Use vars and configs for repeatability.",
        ],
    },
    {
        "id": "cheatsheet-015",
        "title": "Exit Codes",
        "category": "automation",
        "items": [
            "0: Plan completed with no errors or warnings.",
            "1: One or more errors.",
            "2: Warnings only.",
            "Override with exitStatus job if needed.",
        ],
    },
    {
        "id": "cheatsheet-016",
        "title": "Packaged Scans",
        "category": "docker",
        "items": [
            "Baseline: passive scan focused.",
            "Full scan: spider + optional AJAX + active scan.",
            "API scan: OpenAPI/GraphQL/SOAP definitions.",
            "Use reports and exit codes for CI.",
        ],
    },
    {
        "id": "cheatsheet-017",
        "title": "Scan Safety",
        "category": "security",
        "items": [
            "Only scan targets you have permission to test.",
            "Use Protected mode and defined scope.",
            "Document rules of engagement.",
            "Avoid aggressive scans in production.",
        ],
    },
    {
        "id": "cheatsheet-018",
        "title": "Evidence Capture",
        "category": "alerts",
        "items": [
            "Save request/response pairs.",
            "Capture timestamps and URLs.",
            "Record risk and confidence.",
            "Link to remediation guidance.",
        ],
    },
    {
        "id": "cheatsheet-019",
        "title": "CI/CD Integration",
        "category": "automation",
        "items": [
            "Use Automation Framework plans.",
            "Run in Docker for repeatability.",
            "Fail builds on errors or high-risk alerts.",
            "Archive reports as artifacts.",
        ],
    },
    {
        "id": "cheatsheet-020",
        "title": "Troubleshooting",
        "category": "operations",
        "items": [
            "Check scope and context patterns.",
            "Verify proxy settings in browser.",
            "Review automation logs and exit codes.",
            "Confirm target URL accessibility.",
        ],
    },
    {
        "id": "cheatsheet-021",
        "title": "Full Scan Options",
        "category": "docker",
        "items": [
            "-t target URL with protocol.",
            "-r report_html for HTML report.",
            "-J report_json for JSON output.",
            "-j to include AJAX spider.",
        ],
    },
    {
        "id": "cheatsheet-022",
        "title": "Automation Configs",
        "category": "automation",
        "items": [
            "Use configs section to set ZAP options.",
            "Prefer relative paths in plans.",
            "Keep configs in version control.",
            "Validate plans with -autocheck.",
        ],
    },
    {
        "id": "cheatsheet-023",
        "title": "Report Outputs",
        "category": "reporting",
        "items": [
            "HTML for human review.",
            "JSON for automation pipelines.",
            "Markdown for documentation.",
            "XML for integration needs.",
        ],
    },
    {
        "id": "cheatsheet-024",
        "title": "API UI Reminders",
        "category": "api",
        "items": [
            "API UI available at http://zap/ when proxying.",
            "Restrict API access to trusted hosts.",
            "Use API key for sensitive actions.",
            "Disable risky API options in shared environments.",
        ],
    },
]

REFERENCE_BASE = [
    {
        "title": "ZAP Desktop User Guide",
        "url": "https://www.zaproxy.org/docs/desktop/",
        "category": "core",
        "description": "Official ZAP Desktop User Guide and feature reference.",
    },
    {
        "title": "Getting Started",
        "url": "https://www.zaproxy.org/getting-started/",
        "category": "core",
        "description": "Overview of ZAP UI and safe usage guidance.",
    },
    {
        "title": "Quick Start Add-on",
        "url": "https://www.zaproxy.org/docs/desktop/addons/quick-start/",
        "category": "quick-start",
        "description": "Quick Start workflows, automated scan, and manual explore.",
    },
    {
        "title": "ZAPit",
        "url": "https://www.zaproxy.org/docs/desktop/addons/quick-start/zapit/",
        "category": "quick-start",
        "description": "Command line reconnaissance scan using -zapit.",
    },
    {
        "title": "Modes",
        "url": "https://www.zaproxy.org/docs/desktop/start/features/modes/",
        "category": "modes",
        "description": "Safe, Protected, Standard, and Attack modes explained.",
    },
    {
        "title": "Scope",
        "url": "https://www.zaproxy.org/docs/desktop/start/features/scope/",
        "category": "scope",
        "description": "How scope is defined and used within ZAP.",
    },
    {
        "title": "Contexts",
        "url": "https://www.zaproxy.org/docs/desktop/start/features/contexts/",
        "category": "scope",
        "description": "Define contexts with regex-based URL matching.",
    },
    {
        "title": "Users",
        "url": "https://www.zaproxy.org/docs/desktop/start/features/users/",
        "category": "auth",
        "description": "User configuration for authenticated scans.",
    },
    {
        "title": "Automation Framework",
        "url": "https://www.zaproxy.org/docs/desktop/addons/automation-framework/",
        "category": "automation",
        "description": "Automation plans, command line options, and jobs.",
    },
    {
        "title": "Automation Framework - Environment",
        "url": "https://www.zaproxy.org/docs/desktop/addons/automation-framework/environment/",
        "category": "automation",
        "description": "Define contexts, URLs, and vars in automation plans.",
    },
    {
        "title": "Automation Framework - GUI",
        "url": "https://www.zaproxy.org/docs/desktop/addons/automation-framework/gui/",
        "category": "automation",
        "description": "Automation GUI for creating and running plans.",
    },
    {
        "title": "ZAP Docker Documentation",
        "url": "https://www.zaproxy.org/docs/docker/",
        "category": "docker",
        "description": "Overview of ZAP Docker images and packaged scans.",
    },
    {
        "title": "ZAP Docker User Guide",
        "url": "https://www.zaproxy.org/docs/docker/about/",
        "category": "docker",
        "description": "Getting started with ZAP Docker images.",
    },
    {
        "title": "ZAP Full Scan",
        "url": "https://www.zaproxy.org/docs/docker/full-scan/",
        "category": "docker",
        "description": "Full scan script usage and options.",
    },
    {
        "title": "ZAP Baseline Scan",
        "url": "https://www.zaproxy.org/docs/docker/baseline-scan/",
        "category": "docker",
        "description": "Baseline scan script for passive-only scans.",
    },
    {
        "title": "ZAP API Scan",
        "url": "https://www.zaproxy.org/docs/docker/api-scan/",
        "category": "docker",
        "description": "API scan script for OpenAPI, SOAP, and GraphQL.",
    },
    {
        "title": "Scan Hooks",
        "url": "https://www.zaproxy.org/docs/docker/scan-hooks/",
        "category": "docker",
        "description": "Customize packaged scans with hooks.",
    },
    {
        "title": "Alerts",
        "url": "https://www.zaproxy.org/docs/desktop/start/features/alerts/",
        "category": "alerts",
        "description": "Alert definition and UI behavior.",
    },
    {
        "title": "Scan Policy",
        "url": "https://www.zaproxy.org/docs/desktop/start/features/scanpolicy/",
        "category": "scanning",
        "description": "How scan policies control active scan rules.",
    },
    {
        "title": "API",
        "url": "https://www.zaproxy.org/docs/desktop/start/features/api/",
        "category": "api",
        "description": "ZAP API usage and access control.",
    },
    {
        "title": "Desktop UI Overview",
        "url": "https://www.zaproxy.org/docs/desktop/ui/",
        "category": "ui",
        "description": "Overview of the ZAP desktop interface.",
    },
    {
        "title": "Top Level Toolbar",
        "url": "https://www.zaproxy.org/docs/desktop/ui/tltoolbar/",
        "category": "ui",
        "description": "Toolbar controls and mode selector.",
    },
    {
        "title": "Passive Scan Rules",
        "url": "https://www.zaproxy.org/docs/desktop/addons/passive-scan-rules/",
        "category": "scanning",
        "description": "Passive scan rules and configuration options.",
    },
    {
        "title": "Active Scan Rules",
        "url": "https://www.zaproxy.org/docs/desktop/addons/active-scan-rules/",
        "category": "scanning",
        "description": "Active scan rule add-on coverage.",
    },
    {
        "title": "Spider Add-on",
        "url": "https://www.zaproxy.org/docs/desktop/addons/spider/",
        "category": "scanning",
        "description": "Traditional spider add-on documentation.",
    },
    {
        "title": "AJAX Spider Add-on",
        "url": "https://www.zaproxy.org/docs/desktop/addons/ajax-spider/",
        "category": "scanning",
        "description": "AJAX spider add-on documentation.",
    },
    {
        "title": "ZAP Marketplace",
        "url": "https://www.zaproxy.org/docs/desktop/addons/marketplace/",
        "category": "extensions",
        "description": "Add-ons marketplace and update channels.",
    },
    {
        "title": "Webswing",
        "url": "https://www.zaproxy.org/docs/docker/webswing/",
        "category": "docker",
        "description": "Run ZAP with a web UI via Webswing in Docker.",
    },
    {
        "title": "OpenAPI Support",
        "url": "https://www.zaproxy.org/docs/desktop/addons/openapi-support/",
        "category": "api",
        "description": "Import and spider OpenAPI definitions.",
    },
    {
        "title": "GraphQL Support",
        "url": "https://www.zaproxy.org/docs/desktop/addons/graphql-support/",
        "category": "api",
        "description": "Import GraphQL definitions and generate queries.",
    },
    {
        "title": "SOAP Support",
        "url": "https://www.zaproxy.org/docs/desktop/addons/soap-support/",
        "category": "api",
        "description": "Import and scan SOAP WSDL definitions.",
    },
    {
        "title": "Scripts",
        "url": "https://www.zaproxy.org/docs/desktop/start/features/scripts/",
        "category": "extensions",
        "description": "Script types and scripting capabilities inside ZAP.",
    },
    {
        "title": "Script Console",
        "url": "https://www.zaproxy.org/docs/desktop/addons/script-console/",
        "category": "extensions",
        "description": "Script console add-on overview and usage.",
    },
    {
        "title": "Selenium Add-on",
        "url": "https://www.zaproxy.org/docs/desktop/addons/selenium/",
        "category": "extensions",
        "description": "Browser automation add-on used by AJAX spider and manual browsing.",
    },
    {
        "title": "OpenAPI Automation Support",
        "url": "https://www.zaproxy.org/docs/desktop/addons/openapi-support/automation/",
        "category": "automation",
        "description": "Automation job for importing OpenAPI definitions.",
    },
    {
        "title": "GraphQL Automation Support",
        "url": "https://www.zaproxy.org/docs/desktop/addons/graphql-support/automation/",
        "category": "automation",
        "description": "Automation job for importing GraphQL definitions.",
    },
]

GLOSSARY_TERMS = [
    ("Active Scan", "scanning"),
    ("Active Scan Rules", "scanning"),
    ("Add-on", "core"),
    ("Alert", "reporting"),
    ("Alert Evidence", "reporting"),
    ("Alert Filters", "reporting"),
    ("Alerts Tab", "ui"),
    ("API", "api"),
    ("API Key", "api"),
    ("Attack Mode", "modes"),
    ("Automation Framework", "automation"),
    ("Automation Plan", "automation"),
    ("AJAX Spider", "scanning"),
    ("Baseline Scan", "docker"),
    ("Breakpoints", "ui"),
    ("Browser Launch", "proxy"),
    ("Command Line", "cli"),
    ("Context", "scope"),
    ("Context Include Paths", "scope"),
    ("Context Exclude Paths", "scope"),
    ("Credentials", "auth"),
    ("Desktop UI", "ui"),
    ("Docker Image", "docker"),
    ("Exit Codes", "automation"),
    ("Full Scan", "docker"),
    ("History Tab", "ui"),
    ("Manual Explore", "proxy"),
    ("Modes", "modes"),
    ("Passive Scan", "scanning"),
    ("Passive Scan Rules", "scanning"),
    ("Protected Mode", "modes"),
    ("Quick Start", "quick-start"),
    ("Quick Start Automated Scan", "quick-start"),
    ("Report", "reporting"),
    ("Scan Policy", "scanning"),
    ("Scope", "scope"),
    ("Session Management", "auth"),
    ("Sites Tree", "ui"),
    ("Spider", "scanning"),
    ("Standard Mode", "modes"),
    ("Safe Mode", "modes"),
    ("User", "auth"),
    ("ZAPit", "quick-start"),
    ("Automation Environment", "automation"),
    ("Automation GUI", "automation"),
    ("Automation Jobs", "automation"),
    ("Automation Vars", "automation"),
    ("Attack Surface", "security"),
    ("Authentication Method", "auth"),
    ("Authentication Verification", "auth"),
    ("Alerts Count", "reporting"),
    ("Alert Risk", "reporting"),
    ("Alert Confidence", "reporting"),
    ("API UI", "api"),
    ("Automation -autorun", "automation"),
    ("Automation -autogenmin", "automation"),
    ("Automation -autocheck", "automation"),
    ("Automation -autogenmax", "automation"),
    ("Context Regex", "scope"),
    ("Default Ports", "automation"),
    ("Docker Packaged Scans", "docker"),
    ("Docker Scan Hooks", "docker"),
    ("Full Scan Report", "docker"),
    ("HTML Report", "reporting"),
    ("JSON Report", "reporting"),
    ("Markdown Report", "reporting"),
    ("XML Report", "reporting"),
    ("Manual Request Editor", "ui"),
    ("Options Dialog", "ui"),
    ("Proxy Settings", "proxy"),
    ("Request/Response", "ui"),
    ("Risk Level", "reporting"),
    ("Spider Coverage", "scanning"),
    ("Technology Detection", "scanning"),
    ("Toolbar", "ui"),
    ("URL to Attack", "quick-start"),
    ("Webswing", "docker"),
    ("ZAP API Format", "api"),
    ("ZAP Docker", "docker"),
    ("ZAP Desktop User Guide", "core"),
    ("GraphQL API Scan", "docker"),
    ("Include Paths", "scope"),
    ("Keyboard Shortcuts", "ui"),
    ("Login Verification", "auth"),
    ("Node", "ui"),
    ("Variables", "automation"),
    ("YAML Plan", "automation"),
    ("Active Scan Strength", "scanning"),
    ("Active Scan Threshold", "scanning"),
    ("Passive Scan Threshold", "scanning"),
    ("Scan Policy Manager", "scanning"),
    ("Attack Mode Toolbar", "ui"),
    ("Quick Start Tab", "ui"),
    ("Sites Tree Node", "ui"),
    ("History Filter", "ui"),
    ("Alerts Filter", "ui"),
    ("Spider Tab", "ui"),
    ("Active Scan Tab", "ui"),
    ("OpenAPI Import", "api"),
    ("GraphQL Import", "api"),
    ("SOAP Import", "api"),
    ("Automation Job: Spider", "automation"),
    ("Automation Job: Active Scan", "automation"),
    ("Automation Job: OpenAPI", "automation"),
    ("Automation Job: GraphQL", "automation"),
    ("Automation Job: SOAP", "automation"),
    ("Automation Configs", "automation"),
    ("Automation Params", "automation"),
    ("Automation Env Vars", "automation"),
    ("ZAP Marketplace", "extensions"),
    ("Add-on Updates", "extensions"),
    ("Release Channel", "extensions"),
    ("Beta Add-on", "extensions"),
    ("Alpha Add-on", "extensions"),
    ("Script Console", "extensions"),
    ("Script Type", "extensions"),
    ("Selenium WebDriver", "extensions"),
    ("Proxy History", "proxy"),
    ("Upstream Proxy", "proxy"),
    ("Exclude from Scope", "scope"),
    ("Include in Scope", "scope"),
    ("Regex Pattern", "scope"),
    ("Session Token", "auth"),
    ("Logged-in Indicator", "auth"),
    ("Logout Indicator", "auth"),
    ("Manual Request", "ui"),
    ("Request Breakpoint", "ui"),
    ("API Endpoint", "api"),
    ("API Response Format", "api"),
    ("Report Template", "reporting"),
    ("Risk Severity", "reporting"),
    ("Confidence Level", "reporting"),
    ("Alert Evidence Line", "reporting"),
    ("Technology List", "scanning"),
    ("Target URL", "quick-start"),
    ("Report Export", "reporting"),
    ("Automation Report", "reporting"),
    ("Docker Volume Mount", "docker"),
    ("Docker Working Directory", "docker"),
    ("Webswing Session", "docker"),
    ("ZAP CLI", "cli"),
    ("ZAP Command Line Options", "cli"),
    ("Automation Plan YAML", "automation"),
    ("ZAP Full Scan Script", "docker"),
    ("ZAP Baseline Script", "docker"),
]

CATEGORY_DEFINITIONS = {
    "scanning": "{term} is a ZAP scanning concept used to discover or test target behavior.",
    "core": "{term} is a core ZAP concept that supports the overall testing workflow.",
    "reporting": "{term} relates to how ZAP records, presents, or prioritizes findings.",
    "api": "{term} is part of the ZAP API used to automate or retrieve results.",
    "modes": "{term} is a ZAP mode that changes which actions are allowed.",
    "automation": "{term} is part of the Automation Framework for repeatable scans.",
    "docker": "{term} is related to running ZAP in Docker or using packaged scans.",
    "ui": "{term} is a desktop UI element used to inspect or control scans.",
    "auth": "{term} relates to authentication or session handling in ZAP.",
    "scope": "{term} helps define which URLs are in or out of scope.",
    "proxy": "{term} relates to proxying traffic through ZAP.",
    "quick-start": "{term} is part of the Quick Start workflow for fast scans.",
    "cli": "{term} is a command line capability for running ZAP.",
    "security": "{term} is a security testing concept used with ZAP.",
    "extensions": "{term} relates to ZAP add-ons, scripts, or extension capabilities.",
}


PATH_UPDATES = {
    "cs-foundations": {
        "title": "ZAP Foundations",
        "category": "zap-foundations",
        "description": "Core ZAP concepts, UI, and scanning fundamentals.",
    },
    "backend-engineering": {
        "title": "ZAP Automation & CI",
        "category": "zap-automation",
        "description": "Automation Framework, Docker workflows, and CI integration.",
    },
    "frontend-engineering": {
        "title": "ZAP Proxy & UI",
        "category": "zap-ui",
        "description": "Proxy workflows, desktop UI navigation, and manual exploration.",
    },
    "data-science": {
        "title": "ZAP Alerts & Reporting",
        "category": "zap-alerts",
        "description": "Alert triage, reporting, and remediation workflows.",
    },
    "machine-learning": {
        "title": "ZAP Advanced Scanning",
        "category": "zap-advanced",
        "description": "Advanced scanning, scan policies, and packaged scans.",
    },
    "system-design": {
        "title": "ZAP Program & Governance",
        "category": "zap-governance",
        "description": "Operationalizing ZAP across teams and environments.",
    },
}


def pick_code_sample(topic: str, idx: int):
    topic_lower = topic.lower()
    if "automation" in topic_lower or "plan" in topic_lower:
        return CODE_SAMPLES[0]
    if "zapit" in topic_lower:
        return CODE_SAMPLES[1]
    if "full scan" in topic_lower or "docker" in topic_lower:
        return CODE_SAMPLES[2]
    if "context" in topic_lower or "scope" in topic_lower:
        return CODE_SAMPLES[4]
    return CODE_SAMPLES[idx % len(CODE_SAMPLES)]


def build_lessons():
    for path in sorted(LESSONS_DIR.glob("*.json")):
        match = re.match(r"(.+)-lesson-(\d+)", path.stem)
        if not match:
            continue
        prefix, num = match.group(1), int(match.group(2))
        info = LESSON_MODULES.get(prefix)
        if not info:
            continue
        existing = read_json(path)
        topics = info["topics"]
        base_topic = topics[(num - 1) % len(topics)]
        cycle = (num - 1) // len(topics)
        suffix = f" (Part {cycle + 1})" if cycle > 0 else ""
        title = f"{base_topic}{suffix}"
        summary = f"Apply {base_topic.lower()} in real ZAP workflows with guided steps, examples, and practice."
        objectives = [
            f"Explain how {base_topic.lower()} fits into ZAP testing.",
            f"Configure {base_topic.lower()} safely for your target.",
            "Interpret results and validate findings.",
        ]
        content = (
            f"# {title}\n\n"
            "## Overview\n"
            f"{summary}\n\n"
            "## Key ideas\n"
            "- Keep scope explicit before running scans.\n"
            "- Prefer safe defaults when testing new targets.\n"
            "- Capture evidence for every significant finding.\n\n"
            "## Workflow\n"
            "1. Define scope and choose the right mode.\n"
            "2. Run the scan or action for this topic.\n"
            "3. Review alerts and validate results.\n\n"
            "## What to watch for\n"
            "- Out-of-scope requests or unexpected targets.\n"
            "- Missing coverage in dynamic sections.\n"
            "- False positives that need manual validation."
        )
        examples = [
            f"Run {base_topic.lower()} on a staging target and compare alerts.",
            "Document one alert with evidence and remediation notes.",
        ]
        practice = [
            "Define a context and set it in scope.",
            f"Execute a workflow focused on {base_topic.lower()}.",
            "Summarize the top three findings and next steps.",
        ]
        code_sample = pick_code_sample(base_topic, num - 1)
        references = info["references"]
        tags = info["tags"] + [slugify(info["module"])]
        quizzes = existing.get("quizzes", [])
        difficulty = "beginner"
        if num > 12:
            difficulty = "intermediate"
        if num > 28:
            difficulty = "advanced"

        updated = {
            "topic": base_topic,
            "id": existing.get("id", path.stem),
            "practice": practice,
            "quizzes": quizzes,
            "codeSamples": [code_sample],
            "module": info["module"],
            "title": title,
            "references": references,
            "summary": summary,
            "difficulty": difficulty,
            "content": content,
            "examples": examples,
            "tags": tags,
            "objectives": objectives,
        }
        write_json(path, updated)


def build_guides():
    for idx, path in enumerate(sorted(GUIDES_DIR.glob("*.json")), start=1):
        existing = read_json(path)
        base = GUIDE_TOPICS[(idx - 1) % len(GUIDE_TOPICS)]
        cycle = (idx - 1) // len(GUIDE_TOPICS)
        suffix = f" (Workflow {cycle + 1})" if cycle > 0 else ""
        title = f"{base['title']}{suffix}"
        summary = base["summary"]
        content = (
            f"## Overview\n{summary}\n\n"
            "### Why it matters\n"
            "This guide turns a ZAP feature into a repeatable workflow you can share across teams.\n\n"
            "### Preparation\n"
            "- Confirm scope and permissions.\n"
            "- Ensure required add-ons are installed.\n"
            "- Decide how you will capture evidence.\n"
        )
        updated = {
            "summary": summary,
            "id": existing.get("id", path.stem),
            "examples": base["examples"],
            "references": base["references"],
            "category": base["category"],
            "tags": ["zap", "guide", base["category"]],
            "diagrams": base["diagrams"],
            "content": content,
            "title": title,
            "steps": base["steps"],
        }
        write_json(path, updated)


def build_labs():
    for idx, path in enumerate(sorted(LABS_DIR.glob("*.json")), start=1):
        existing = read_json(path)
        base = LAB_TEMPLATES[(idx - 1) % len(LAB_TEMPLATES)]
        cycle = (idx - 1) // len(LAB_TEMPLATES)
        suffix = f" (Iteration {cycle + 1})" if cycle > 0 else ""
        title = f"Lab {idx}: {base['title']}{suffix}"
        updated = {
            "summary": base["overview"].split("\n", 2)[-1],
            "id": existing.get("id", path.stem),
            "category": base["category"],
            "tags": ["zap", "lab", base["category"]],
            "starter": base["starter"],
            "objectives": base["objectives"],
            "solutionOutline": base["solutionOutline"],
            "difficulty": base["difficulty"],
            "title": title,
            "steps": base["steps"],
            "overview": base["overview"],
        }
        write_json(path, updated)


def build_quizzes():
    bank = QUESTION_BANK
    for idx, path in enumerate(sorted(QUIZZES_DIR.glob("*.json")), start=1):
        existing = read_json(path)
        offset = (idx - 1) % len(bank)
        questions = []
        for i in range(10):
            q = bank[(offset + i) % len(bank)]
            questions.append({
                "question": q["question"],
                "tags": q["tags"],
                "difficulty": q["difficulty"],
                "explanation": q["explanation"],
                "correct_answer": q["correct"],
                "choices": q["choices"],
            })
        module = QUIZ_MODULES[(idx - 1) % len(QUIZ_MODULES)]
        difficulty = "beginner"
        if idx > 70:
            difficulty = "intermediate"
        if idx > 140:
            difficulty = "advanced"
        updated = {
            "id": existing.get("id", path.stem),
            "tags": ["zap", slugify(module)],
            "questions": questions,
            "difficulty": difficulty,
            "module": module,
            "summary": f"Check your understanding of {module.lower()} concepts.",
            "title": f"{module} Quiz {idx:03d}",
        }
        write_json(path, updated)


def build_glossary():
    terms = []
    for idx, (term, category) in enumerate(GLOSSARY_TERMS, start=1):
        definition_template = CATEGORY_DEFINITIONS.get(category, CATEGORY_DEFINITIONS["core"])
        definition = definition_template.format(term=term)
        examples = [
            f"Example: Document how {term.lower()} affects scan results.",
            f"Example: Review {term.lower()} settings before a run.",
        ]
        terms.append({
            "id": f"term-{idx:03d}",
            "term": term,
            "definition": definition,
            "category": category,
            "examples": examples,
        })

    # add related terms (previous/next)
    for i, term in enumerate(terms):
        related = []
        if i > 0:
            related.append(terms[i - 1]["id"])
        if i + 1 < len(terms):
            related.append(terms[i + 1]["id"])
        term["related_terms"] = related

    # group by letter
    grouped = {letter: [] for letter in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"}
    for term in terms:
        letter = term["term"][0].upper()
        if letter not in grouped:
            letter = "Z"
        grouped[letter].append(term)

    # ensure each letter has at least one term
    fallback = terms[-1]
    for letter in grouped:
        if not grouped[letter]:
            grouped[letter] = [{
                "id": f"term-{len(terms)+1:03d}",
                "term": f"{letter}-Series Term",
                "definition": "General ZAP index term used to keep the glossary complete.",
                "category": "core",
                "examples": ["Example: Use this term as an index entry."],
                "related_terms": [fallback["id"]],
            }]
            terms.append(grouped[letter][0])

    for letter, items in grouped.items():
        path = GLOSSARY_DIR / f"{letter}.json"
        write_json(path, items)


def build_references():
    references = []
    for idx, item in enumerate(REFERENCE_BASE, start=1):
        references.append({
            "url": item["url"],
            "title": item["title"],
            "category": item["category"],
            "description": item["description"],
            "id": f"ref-{idx:03d}",
        })
    write_json(REFERENCES_FILE, references)


def build_cheatsheets():
    write_json(CHEATSHEETS_FILE, CHEATSHEETS)


def build_learning_paths():
    data = read_json(LEARNING_PATHS_FILE)
    for path in data:
        update = PATH_UPDATES.get(path.get("id"))
        if update:
            path["title"] = update["title"]
            path["category"] = update["category"]
            path["description"] = update["description"]
    write_json(LEARNING_PATHS_FILE, data)


def main():
    build_lessons()
    build_guides()
    build_labs()
    build_quizzes()
    build_glossary()
    build_references()
    build_cheatsheets()
    build_learning_paths()


if __name__ == "__main__":
    main()
