import json
from pathlib import Path

ROOT = Path.cwd()
DATA_ROOT = ROOT / "data"


def read_json(path: Path):
    raw = path.read_text(encoding="utf-8")
    if raw.startswith("\ufeff"):
        raw = raw.lstrip("\ufeff")
    return json.loads(raw)


def write_json(path: Path, data):
    path.write_text(json.dumps(data, indent=4, ensure_ascii=False), encoding="utf-8")


def list_json(dir_path: Path):
    return sorted([p for p in dir_path.iterdir() if p.suffix == ".json"])


def slugify(value: str):
    value = (value or "").lower().strip()
    out = []
    prev_dash = False
    for ch in value:
        if ch.isalnum():
            out.append(ch)
            prev_dash = False
        else:
            if not prev_dash:
                out.append("-")
                prev_dash = True
    result = "".join(out).strip("-")
    return result or "general"


def category_from_item(item: dict):
    if item.get("category"):
        return item["category"]
    if item.get("module"):
        return slugify(item["module"])
    tags = item.get("tags") or []
    if tags:
        return tags[0]
    return "general"


lessons_dir = DATA_ROOT / "lessons"
guides_dir = DATA_ROOT / "guides"
labs_dir = DATA_ROOT / "labs"
quizzes_dir = DATA_ROOT / "quizzes"
glossary_dir = DATA_ROOT / "glossary"

lessons = []
for path in list_json(lessons_dir):
    data = read_json(path)
    lessons.append({
        "id": data.get("id"),
        "tags": data.get("tags") or [],
        "difficulty": data.get("difficulty", "beginner"),
        "path": f"../data/lessons/{path.name}",
        "module": data.get("module", "General"),
        "summary": data.get("summary", ""),
        "title": data.get("title", data.get("id"))
    })

guides = []
for path in list_json(guides_dir):
    data = read_json(path)
    guides.append({
        "id": data.get("id"),
        "tags": data.get("tags") or [],
        "path": f"../data/guides/{path.name}",
        "summary": data.get("summary", ""),
        "category": data.get("category") or category_from_item(data),
        "title": data.get("title", data.get("id"))
    })

labs = []
for path in list_json(labs_dir):
    data = read_json(path)
    labs.append({
        "id": data.get("id"),
        "tags": data.get("tags") or [],
        "difficulty": data.get("difficulty", "beginner"),
        "path": f"../data/labs/{path.name}",
        "summary": data.get("summary", ""),
        "category": data.get("category") or category_from_item(data),
        "title": data.get("title", data.get("id"))
    })

quizzes = []
for path in list_json(quizzes_dir):
    data = read_json(path)
    quizzes.append({
        "id": data.get("id"),
        "tags": data.get("tags") or [],
        "difficulty": data.get("difficulty", "beginner"),
        "path": f"../data/quizzes/{path.name}",
        "module": data.get("module", "General"),
        "summary": data.get("summary", ""),
        "title": data.get("title", data.get("id"))
    })

cheatsheets_path = DATA_ROOT / "cheatsheets" / "cheatsheets.json"
cheatsheets = read_json(cheatsheets_path) if cheatsheets_path.exists() else []

references_path = DATA_ROOT / "references" / "references.json"
references = read_json(references_path) if references_path.exists() else []

glossary = []
for path in list_json(glossary_dir):
    data = read_json(path)
    if not isinstance(data, list):
        continue
    for term in data:
        glossary.append({
            "term": term.get("term"),
            "category": term.get("category") or category_from_item(term),
            "path": f"../data/glossary/{path.name}",
            "id": term.get("id"),
            "definition": term.get("definition", "")
        })

paths_path = DATA_ROOT / "learning-paths.json"
paths = read_json(paths_path) if paths_path.exists() else []

search = []
for item in lessons:
    search.append({
        "id": item["id"],
        "tags": item["tags"],
        "route": f"#/lesson/{item['id']}",
        "type": "lesson",
        "category": category_from_item(item),
        "title": item["title"],
        "excerpt": item["summary"]
    })
for item in guides:
    search.append({
        "id": item["id"],
        "tags": item["tags"],
        "route": f"#/guide/{item['id']}",
        "type": "guide",
        "category": category_from_item(item),
        "title": item["title"],
        "excerpt": item["summary"]
    })
for item in labs:
    search.append({
        "id": item["id"],
        "tags": item["tags"],
        "route": f"#/labs/{item['id']}",
        "type": "lab",
        "category": category_from_item(item),
        "title": item["title"],
        "excerpt": item["summary"]
    })
for item in quizzes:
    search.append({
        "id": item["id"],
        "tags": item["tags"],
        "route": f"#/quiz/{item['id']}",
        "type": "quiz",
        "category": category_from_item(item),
        "title": item["title"],
        "excerpt": item["summary"]
    })
for item in glossary:
    search.append({
        "id": item["id"],
        "tags": [item["category"], "glossary"],
        "route": f"#/glossary/{item['id']}",
        "type": "glossary",
        "category": item["category"],
        "title": item["term"],
        "excerpt": item["definition"]
    })
for item in references:
    search.append({
        "id": item.get("id"),
        "tags": [item.get("category", "general"), "reference"],
        "route": item.get("url"),
        "type": "reference",
        "category": item.get("category", "general"),
        "title": item.get("title"),
        "excerpt": item.get("description", "")
    })
for item in cheatsheets:
    title = item.get("title", "")
    short = title.replace("Cheat Sheet", "").replace("cheat sheet", "").strip()
    search.append({
        "id": item.get("id"),
        "tags": [item.get("category", "general"), "cheatsheet"],
        "route": f"#/cheatsheets/{item.get('id')}",
        "type": "cheatsheet",
        "category": item.get("category", "general"),
        "title": title,
        "excerpt": f"Quick reference for {short or title}."
    })

content_index = {
    "lessons": lessons,
    "quizzes": quizzes,
    "guides": guides,
    "glossary": glossary,
    "references": references,
    "labs": labs,
    "cheatsheets": cheatsheets,
    "paths": paths,
    "search": search,
    "totals": {
        "lessons": len(lessons),
        "quizzes": len(quizzes),
        "guides": len(guides),
        "glossary": len(glossary),
        "references": len(references),
        "labs": len(labs),
        "cheatsheets": len(cheatsheets),
        "paths": len(paths)
    }
}

write_json(DATA_ROOT / "content-index.json", content_index)
print("content-index.json rebuilt")
