$ErrorActionPreference = "Stop"

function Write-JsonFile {
    param(
        [string]$Path,
        [object]$Data
    )
    $json = $Data | ConvertTo-Json -Depth 12
    $json | Set-Content -Path $Path -Encoding UTF8
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$dataRoot = Join-Path $projectRoot "data"

$folders = @("lessons","quizzes","guides","glossary","references","labs","cheatsheets")
foreach($folder in $folders){
    $path = Join-Path $dataRoot $folder
    New-Item -ItemType Directory -Path $path -Force | Out-Null
}

$modules = @(
    @{ Name="Algorithms"; Slug="algorithms"; Category="algorithms"; Topics=@("Searching","Sorting","Greedy","Graphs","Dynamic Programming") },
    @{ Name="Data Structures"; Slug="data-structures"; Category="data-structures"; Topics=@("Arrays","Trees","Heaps","Hashing","Graphs") },
    @{ Name="Programming Fundamentals"; Slug="programming-fundamentals"; Category="fundamentals"; Topics=@("Variables","Control Flow","Functions","Debugging","Testing") },
    @{ Name="Operating Systems"; Slug="operating-systems"; Category="operating-systems"; Topics=@("Processes","Threads","Memory","Scheduling","Filesystems") },
    @{ Name="Databases"; Slug="databases"; Category="databases"; Topics=@("SQL","Indexes","Transactions","Modeling","Scaling") },
    @{ Name="Networking"; Slug="networking"; Category="networking"; Topics=@("TCP","HTTP","DNS","Security","Performance") },
    @{ Name="System Design"; Slug="system-design"; Category="system-design"; Topics=@("Scalability","Reliability","Caching","Queues","Observability") },
    @{ Name="Web Development"; Slug="web-development"; Category="web"; Topics=@("HTML","CSS","Accessibility","APIs","Deployment") },
    @{ Name="Backend Engineering"; Slug="backend-engineering"; Category="backend"; Topics=@("APIs","Authentication","Caching","Queues","Testing") },
    @{ Name="Frontend Engineering"; Slug="frontend-engineering"; Category="frontend"; Topics=@("UI Systems","State","Performance","Design Systems","Testing") },
    @{ Name="Data Science"; Slug="data-science"; Category="data-science"; Topics=@("Pandas","Visualization","Statistics","EDA","Feature Engineering") },
    @{ Name="Machine Learning"; Slug="machine-learning"; Category="machine-learning"; Topics=@("Models","Training","Evaluation","Deployment","Ethics") },
    @{ Name="Security"; Slug="security"; Category="security"; Topics=@("Threats","Auth","Encryption","Hardening","Monitoring") }
)

$lessonsPerModule = 40
$quizCount = 210
$guideCount = 320
$glossaryCount = 320
$referenceCount = 240
$labCount = 36
$cheatsheetCount = 24

$lessonsIndex = @()
$quizzesIndex = @()
$guidesIndex = @()
$glossaryIndex = @()
$referencesIndex = @()
$labsIndex = @()
$cheatsheetsIndex = @()
$searchIndex = @()
$lessonsByModule = @{}
$lessonIds = @()

function Get-Difficulty {
    param([int]$Index)
    if($Index -le 14){ return "beginner" }
    if($Index -le 28){ return "intermediate" }
    return "advanced"
}

$globalLesson = 0
foreach($module in $modules){
    $moduleLessons = @()
    for($i = 1; $i -le $lessonsPerModule; $i++){
        $globalLesson++
        $lessonId = "{0}-lesson-{1:D2}" -f $module.Slug, $i
        $topic = "{0} Topic {1}" -f $module.Name, $i
        $difficulty = Get-Difficulty -Index $i
        $quizId = "quiz-{0:D3}" -f ((($globalLesson - 1) % $quizCount) + 1)
        $title = "{0} Lesson {1}" -f $module.Name, $i
        $summary = "Master {0} with focused objectives, examples, and practice tasks." -f $topic
        $objectives = @(
            "Explain key concepts in {0}." -f $topic,
            "Apply {0} techniques to common problems." -f $topic,
            "Evaluate tradeoffs and best practices."
        )
        $content = @"
# $title

## Overview
$summary

- Identify core terminology
- Walk through a guided example
- Practice with a short task list
"@
        $examples = @(
            "Worked example using $topic.",
            "Edge case analysis for $topic."
        )
        $codeSamples = @(
            @{
                language = "plaintext"
                code = "Step 1: Define the problem\nStep 2: Apply $topic\nStep 3: Verify results"
            }
        )
        $practice = @(
            "Describe the main steps of $topic.",
            "Solve a small exercise using $topic.",
            "List two pitfalls and how to avoid them."
        )
        $references = @(
            "Guide: $topic Essentials",
            "Cheat Sheet: $($module.Name) Basics"
        )
        $lesson = @{
            id = $lessonId
            title = $title
            module = $module.Name
            topic = $topic
            difficulty = $difficulty
            objectives = $objectives
            content = $content
            examples = $examples
            codeSamples = $codeSamples
            practice = $practice
            summary = $summary
            references = $references
            quizzes = @($quizId)
            tags = @($module.Category, "lesson")
        }

        Write-JsonFile -Path (Join-Path $dataRoot "lessons\$lessonId.json") -Data $lesson
        $lessonsIndex += @{
            id = $lessonId
            title = $title
            module = $module.Name
            difficulty = $difficulty
            summary = $summary
            tags = $lesson.tags
            path = "../data/lessons/$lessonId.json"
        }
        $searchIndex += @{
            type = "lesson"
            id = $lessonId
            title = $title
            category = $module.Category
            tags = $lesson.tags
            excerpt = $summary
            route = "#/lesson/$lessonId"
        }
        $moduleLessons += $lessonId
        $lessonIds += $lessonId
    }
    $lessonsByModule[$module.Slug] = $moduleLessons
}

for($i = 1; $i -le $quizCount; $i++){
    $quizId = "quiz-{0:D3}" -f $i
    $module = $modules[($i - 1) % $modules.Count]
    $difficulty = Get-Difficulty -Index (($i - 1) % $lessonsPerModule + 1)
    $questions = @()
    for($q = 1; $q -le 10; $q++){
        $choices = @(
            "Option A",
            "Option B",
            "Option C",
            "Option D"
        )
        $correct = $choices[($q - 1) % $choices.Count]
        $questions += @{
            question = "Question $q on $($module.Name) fundamentals."
            choices = $choices
            correct_answer = $correct
            explanation = "Review the key steps for $($module.Name) to validate this answer."
            difficulty = $difficulty
            tags = @($module.Category)
        }
    }
    $summary = "Check your understanding of $($module.Name) concepts."
    $quiz = @{
        id = $quizId
        title = "$($module.Name) Quiz $i"
        module = $module.Name
        difficulty = $difficulty
        tags = @($module.Category)
        summary = $summary
        questions = $questions
    }
    Write-JsonFile -Path (Join-Path $dataRoot "quizzes\$quizId.json") -Data $quiz
    $quizzesIndex += @{
        id = $quizId
        title = $quiz.title
        module = $module.Name
        difficulty = $difficulty
        tags = $quiz.tags
        summary = $summary
        path = "../data/quizzes/$quizId.json"
    }
    $searchIndex += @{
        type = "quiz"
        id = $quizId
        title = $quiz.title
        category = $module.Category
        tags = $quiz.tags
        excerpt = $summary
        route = "#/quiz/$quizId"
    }
}

for($i = 1; $i -le $guideCount; $i++){
    $guideId = "guide-{0:D3}" -f $i
    $module = $modules[($i - 1) % $modules.Count]
    $title = "Guide ${i}: $($module.Topics[($i - 1) % $module.Topics.Count]) Essentials"
    $summary = "Step-by-step guide for $($module.Name) topic $i."
    $guide = @{
        id = $guideId
        title = $title
        category = $module.Category
        summary = $summary
        content = "## Overview`n$summary`n`nUse this guide to move from concepts to practical implementation."
        steps = @(
            "Clarify the goal and constraints.",
            "Break the problem into smaller steps.",
            "Apply $($module.Name) patterns.",
            "Validate with tests or examples."
        )
        diagrams = @(
            "High-level architecture diagram.",
            "Flow diagram with key checkpoints."
        )
        examples = @(
            "Example workflow for $($module.Name).",
            "Checklist for common pitfalls."
        )
        references = @(
            "$($module.Name) Field Notes",
            "Checklist: $($module.Name) Review"
        )
        tags = @($module.Category, "guide")
    }
    Write-JsonFile -Path (Join-Path $dataRoot "guides\$guideId.json") -Data $guide
    $guidesIndex += @{
        id = $guideId
        title = $title
        category = $module.Category
        summary = $summary
        tags = $guide.tags
        path = "../data/guides/$guideId.json"
    }
    $searchIndex += @{
        type = "guide"
        id = $guideId
        title = $title
        category = $module.Category
        tags = $guide.tags
        excerpt = $summary
        route = "#/guide/$guideId"
    }
}

$termWords = @(
    "Algorithm","Buffer","Cache","Data","Encoding","Function","Gateway","Heap","Index","Join",
    "Kernel","Latency","Module","Node","Opcode","Packet","Queue","Runtime","Stack","Thread",
    "Upload","Vector","Workflow","Xor","Yield","Zero"
)
$glossaryItems = @()
$glossaryBuckets = @{}

for($i = 1; $i -le $glossaryCount; $i++){
    $termId = "term-{0:D3}" -f $i
    $word = $termWords[($i - 1) % $termWords.Count]
    $module = $modules[($i - 1) % $modules.Count]
    $term = "$word Concept $i"
    $definition = "Definition for $term within the $($module.Name) domain."
    $item = @{
        id = $termId
        term = $term
        definition = $definition
        examples = @(
            "Example use of $term.",
            "Common scenario for $term."
        )
        related_terms = @()
        category = $module.Category
    }
    $glossaryItems += $item
    $letter = $word.Substring(0,1).ToUpper()
    if(-not $glossaryBuckets.ContainsKey($letter)){
        $glossaryBuckets[$letter] = @()
    }
    $glossaryBuckets[$letter] += $item
}

for($i = 0; $i -lt $glossaryItems.Count; $i++){
    $prev = $glossaryItems[($i - 1 + $glossaryItems.Count) % $glossaryItems.Count].id
    $next = $glossaryItems[($i + 1) % $glossaryItems.Count].id
    $glossaryItems[$i].related_terms = @($prev, $next)
}

foreach($letter in $glossaryBuckets.Keys){
    Write-JsonFile -Path (Join-Path $dataRoot "glossary\$letter.json") -Data $glossaryBuckets[$letter]
}

foreach($item in $glossaryItems){
    $letter = $item.term.Substring(0,1).ToUpper()
    $glossaryIndex += @{
        id = $item.id
        term = $item.term
        category = $item.category
        definition = $item.definition
        path = "../data/glossary/$letter.json"
    }
    $searchIndex += @{
        type = "glossary"
        id = $item.id
        title = $item.term
        category = $item.category
        tags = @($item.category, "glossary")
        excerpt = $item.definition
        route = "#/glossary/$($item.id)"
    }
}

for($i = 1; $i -le $referenceCount; $i++){
    $module = $modules[($i - 1) % $modules.Count]
    $ref = @{
        id = "ref-{0:D3}" -f $i
        title = "$($module.Name) Resource $i"
        category = $module.Category
        url = "https://example.com/$($module.Slug)/resource-$i"
        description = "Curated resource for $($module.Name) topic $i."
    }
    $referencesIndex += $ref
    $searchIndex += @{
        type = "reference"
        id = $ref.id
        title = $ref.title
        category = $ref.category
        tags = @($ref.category, "reference")
        excerpt = $ref.description
        route = $ref.url
    }
}
Write-JsonFile -Path (Join-Path $dataRoot "references\references.json") -Data $referencesIndex

for($i = 1; $i -le $labCount; $i++){
    $labId = "lab-{0:D3}" -f $i
    $module = $modules[($i - 1) % $modules.Count]
    $difficulty = Get-Difficulty -Index (($i - 1) % $lessonsPerModule + 1)
    $summary = "Hands-on lab for $($module.Name) topic $i."
    $lab = @{
        id = $labId
        title = "Lab ${i}: $($module.Topics[($i - 1) % $module.Topics.Count])"
        category = $module.Category
        difficulty = $difficulty
        summary = $summary
        overview = "## Goal`n$summary`n`nComplete the steps to build a working solution."
        objectives = @(
            "Set up the lab environment.",
            "Implement the required functionality.",
            "Validate the results."
        )
        steps = @(
            "Review the requirements and constraints.",
            "Sketch a plan for the implementation.",
            "Build and test the solution."
        )
        starter = "/* Starter template for $($module.Name) lab */"
        solutionOutline = @(
            "Implement core data structures.",
            "Handle edge cases and errors.",
            "Write a quick verification script."
        )
        tags = @($module.Category, "lab")
    }
    Write-JsonFile -Path (Join-Path $dataRoot "labs\$labId.json") -Data $lab
    $labsIndex += @{
        id = $labId
        title = $lab.title
        category = $module.Category
        difficulty = $difficulty
        summary = $summary
        tags = $lab.tags
        path = "../data/labs/$labId.json"
    }
    $searchIndex += @{
        type = "lab"
        id = $labId
        title = $lab.title
        category = $module.Category
        tags = $lab.tags
        excerpt = $summary
        route = "#/labs/$labId"
    }
}

for($i = 1; $i -le $cheatsheetCount; $i++){
    $sheetId = "cheatsheet-{0:D3}" -f $i
    $module = $modules[($i - 1) % $modules.Count]
    $sheet = @{
        id = $sheetId
        title = "$($module.Name) Cheat Sheet $i"
        category = $module.Category
        items = @(
            "Key concept 1 for $($module.Name)",
            "Key concept 2 for $($module.Name)",
            "Key concept 3 for $($module.Name)",
            "Key concept 4 for $($module.Name)"
        )
    }
    $cheatsheetsIndex += $sheet
    $searchIndex += @{
        type = "cheatsheet"
        id = $sheetId
        title = $sheet.title
        category = $sheet.category
        tags = @($sheet.category, "cheatsheet")
        excerpt = "Quick reference for $($module.Name)."
        route = "#/cheatsheets/$sheetId"
    }
}
Write-JsonFile -Path (Join-Path $dataRoot "cheatsheets\cheatsheets.json") -Data $cheatsheetsIndex

$paths = @(
    @{
        id = "cs-foundations"
        title = "Computer Science Foundations"
        category = "foundations"
        description = "Core programming, data structures, and algorithms."
        lessons = @(
            $lessonsByModule["programming-fundamentals"],
            $lessonsByModule["data-structures"],
            $lessonsByModule["algorithms"]
        ) | ForEach-Object { $_ } | Select-Object -First 120
    },
    @{
        id = "backend-engineering"
        title = "Backend Engineering"
        category = "backend"
        description = "APIs, databases, and reliable backend systems."
        lessons = @(
            $lessonsByModule["backend-engineering"],
            $lessonsByModule["databases"],
            $lessonsByModule["networking"]
        ) | ForEach-Object { $_ } | Select-Object -First 120
    },
    @{
        id = "frontend-engineering"
        title = "Frontend Engineering"
        category = "frontend"
        description = "Modern UI engineering and performance."
        lessons = @(
            $lessonsByModule["web-development"],
            $lessonsByModule["frontend-engineering"]
        ) | ForEach-Object { $_ } | Select-Object -First 80
    },
    @{
        id = "data-science"
        title = "Data Science"
        category = "data-science"
        description = "Analytics, visualization, and data preparation."
        lessons = @(
            $lessonsByModule["data-science"],
            $lessonsByModule["databases"]
        ) | ForEach-Object { $_ } | Select-Object -First 80
    },
    @{
        id = "machine-learning"
        title = "Machine Learning"
        category = "machine-learning"
        description = "Model training, evaluation, and deployment."
        lessons = @(
            $lessonsByModule["machine-learning"],
            $lessonsByModule["data-science"]
        ) | ForEach-Object { $_ } | Select-Object -First 80
    },
    @{
        id = "system-design"
        title = "System Design"
        category = "system-design"
        description = "Architect scalable, reliable systems."
        lessons = @(
            $lessonsByModule["system-design"],
            $lessonsByModule["operating-systems"],
            $lessonsByModule["networking"]
        ) | ForEach-Object { $_ } | Select-Object -First 120
    }
)

$contentIndex = @{
    lessons = $lessonsIndex
    quizzes = $quizzesIndex
    guides = $guidesIndex
    glossary = $glossaryIndex
    references = $referencesIndex
    labs = $labsIndex
    cheatsheets = $cheatsheetsIndex
    paths = $paths
    search = $searchIndex
    totals = @{
        lessons = $lessonsIndex.Count
        quizzes = $quizzesIndex.Count
        guides = $guidesIndex.Count
        glossary = $glossaryIndex.Count
        references = $referencesIndex.Count
        labs = $labsIndex.Count
        cheatsheets = $cheatsheetsIndex.Count
        paths = $paths.Count
    }
}

Write-JsonFile -Path (Join-Path $dataRoot "content-index.json") -Data $contentIndex
Write-JsonFile -Path (Join-Path $dataRoot "learning-paths.json") -Data $paths

Write-Host "Data generation complete."
