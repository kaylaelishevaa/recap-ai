# RecapAI

[![CI](https://github.com/kaylaelishevaa/recap-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/kaylaelishevaa/recap-ai/actions/workflows/ci.yml)

**[▶ Live demo](https://recapai-web-production.up.railway.app)** &nbsp;·&nbsp; runs in mock mode, no API keys required.

**Turn a meeting recording or transcript into a structured summary, key decisions, and action items, powered by an LLM and runnable with zero API keys.**

> Upload a recording, record from your mic, or paste a transcript. RecapAI transcribes the audio (OpenAI Whisper) and summarizes it into an executive summary, decisions, action items, and follow-ups (OpenAI GPT-4o). A built-in **mock mode** returns deterministic, fabricated notes so the whole app runs end-to-end without any keys or network.

![RecapAI demo: paste a transcript and generate structured notes](docs/demo.gif)

---

## TL;DR

- **What:** turns a meeting recording or transcript into a structured summary, key decisions, and action items.
- **Stack:** React / Vite, FastAPI, PostgreSQL, OpenAI (Whisper + GPT-4o).
- **Standout:** runs with zero API keys via a deterministic mock mode, so anyone can try the full flow offline; real OpenAI swaps in when a key is set.
- **Run it:** `docker compose up`, or open the [live demo](https://recapai-web-production.up.railway.app).

---

## Quickstart: runs with no API key

The default is `LLM_PROVIDER=mock`, so the demo flow works out of the box:

```bash
git clone https://github.com/kaylaelishevaa/recap-ai.git
cd recap-ai
cp .env.example .env          # defaults to mock mode, no keys needed
docker compose up --build     # brings up frontend + backend + Postgres
```

Open **http://localhost:5173**, go to **Paste Transcript**, click a sample, and **Generate Notes**. You'll get a fabricated-but-realistic summary, decisions, and action items, with no secrets or outbound calls. (Migrations run automatically on backend start.)

To use the real model, set the provider and your OpenAI key in `.env`:

```bash
LLM_PROVIDER=openai     # or `auto` → OpenAI if its key is set, else mock
OPENAI_API_KEY=sk-...   # Whisper transcription + GPT-4o summarization
```

---

## Features

- **Multi-input:** upload audio/video, record in-browser, or paste a transcript
- **Structured output:** summary, key decisions, action items (task/assignee/deadline/priority), and follow-ups
- **Pluggable LLM backend:** `mock` / `auto` / `openai`, selected by env; the frontend never knows which backend ran
- **Mock mode:** deterministic fabricated notes with no keys/network, for demos, CI, and offline development
- **Speech-to-text:** OpenAI Whisper with chunking for files over the 25 MB limit
- **Search & history:** browse, search, and revisit past meetings
- **Export:** copy/print as Markdown
- **Bilingual:** English, Bahasa Indonesia, and mixed (code-switching) prompts

---

## Architecture

```mermaid
flowchart LR
    UI["React SPA<br/>Vite + Tailwind"]

    subgraph API["FastAPI backend"]
        direction TB
        R["REST · /api/meetings"]
        FH["file_handler.py"]
        T["transcription.py"]
        S["summarization.py"]
        L["llm.py<br/>provider select + mock"]
        R --> FH
        R --> T --> L
        R --> S --> L
    end

    subgraph PROV["LLM backend · by LLM_PROVIDER"]
        direction TB
        W["Whisper · speech-to-text"]
        G["GPT-4o · summarization"]
        K["mock · deterministic, no network"]
    end

    DB[("PostgreSQL<br/>meetings · JSONB")]

    UI -->|"REST / JSON"| R
    L --> W
    L --> G
    L --> K
    R <--> DB
    DB -.->|"history · export"| UI
```

**Request flow (upload):** `POST /api/meetings/upload` → validate & save file → `transcribe_audio()` → `summarize_transcript()` → normalize to snake_case → persist `Meeting` row → return JSON. The paste flow (`/api/meetings/transcript`) skips transcription.

---

## Tech Stack

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-Whisper_+_GPT--4o-412991?logo=openai&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker&logoColor=white)

---

## Running locally (without Docker)

You'll need Python 3.11+, Node 18+, and a running PostgreSQL (or point `DATABASE_URL` at one).

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export LLM_PROVIDER=mock                       # no keys needed
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/recapai
alembic upgrade head
uvicorn app.main:app --reload                  # http://localhost:8000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev                                    # http://localhost:5173
```

---

## Deploy your own (Render)

The repo ships a [`render.yaml`](render.yaml) blueprint that provisions the whole stack (FastAPI backend, Postgres, and the static frontend) in **mock mode** (no API keys):

1. Push this repo to GitHub.
2. Render dashboard → **New → Blueprint** → select the repo.
3. Render builds all three services and wires `DATABASE_URL` / `VITE_API_URL` / `CORS_ORIGINS` automatically.

The blueprint assumes the `recapai-api` / `recapai-web` subdomains are free; if Render assigns different URLs, update `VITE_API_URL` and `CORS_ORIGINS` and redeploy. To run real summaries, set `LLM_PROVIDER=openai` and add `OPENAI_API_KEY` on the backend service. (Free instances sleep when idle, so the first request after a while takes ~50s.)

> Prefer Vercel/Netlify for the frontend? Point it at the `frontend/` directory with `VITE_API_URL` set to your backend's `/api` URL; the backend + DB still come from `render.yaml`.

---

## Tests & linting

```bash
# Backend: 44 tests
cd backend
pip install -r requirements-dev.txt
ruff check app tests
black --check app tests
pytest

# Frontend: 19 tests
cd frontend
npm install
npm run lint
npm test
npm run build
```

The same checks run in CI on every push/PR (`.github/workflows/ci.yml`).

---

## API Endpoints

| Method   | Endpoint                      | Description                          |
|----------|-------------------------------|--------------------------------------|
| `POST`   | `/api/meetings/upload`        | Upload audio/video for processing    |
| `POST`   | `/api/meetings/transcript`    | Submit text transcript               |
| `GET`    | `/api/meetings`               | List meetings (paginated, searchable)|
| `GET`    | `/api/meetings/{id}`          | Get meeting details                  |
| `DELETE` | `/api/meetings/{id}`          | Delete a meeting                     |
| `POST`   | `/api/meetings/{id}/export`   | Export as Markdown                   |
| `GET`    | `/api/health`                 | Health check (+ DB connectivity)     |

Interactive docs at **http://localhost:8000/docs** when the backend is running.

---

## Design decisions (the "why")

**Why FastAPI.** The core work is I/O-bound orchestration (await transcription, then summarization). FastAPI's async handlers keep request workers free during those calls, and Pydantic gives request/response validation and typed schemas (`schemas/meeting.py`) with near-zero boilerplate, plus generated OpenAPI docs that double as a free API console.

**Transcription → summarization pipeline.** The two stages are deliberately separate services with no knowledge of each other. `transcription.py` turns media into text; `summarization.py` turns text into structured notes. This means the paste-transcript path reuses the exact same summarization stage by skipping stage one, and either stage can be swapped (Whisper → Deepgram, GPT-4o → another model) without touching the other or the frontend.

**Provider abstraction + mock mode.** All provider selection lives in one place (`services/llm.py`): `resolve_provider()` maps `LLM_PROVIDER` to a concrete backend (`openai` or `mock`), and `auto` degrades to `mock` when no key is present so the app always boots. The OpenAI client is created **lazily** (`@lru_cache`) because the SDK raises if constructed with an empty key; lazy construction is what lets the app import and serve requests with zero secrets. Mock output is deterministic and shaped exactly like a real model response, so it flows through the same normalization path and the same tests as live output.

**Prompt + schema design.** The system prompt (`utils/prompts.py`) pins an exact JSON contract (`title`, `summary`, `keyDecisions`, `actionItems[{task, responsible, deadline, priority}]`, `followUpRecommendations`) with explicit priority rules and empty-case handling, and instructs the model to return JSON only. Because models drift in their key casing/naming, the backend defensively normalizes: `_parse_json_response()` strips stray markdown fences, and `_normalize_result()` / `_normalize_action_item()` accept both camelCase and snake_case (and both `responsible`/`assignee`) and fill defaults, so a slightly-off response never breaks the API. There are three prompt variants (EN / ID / mixed code-switching) selected by language.

**Error handling.** Each stage fails independently and is reported honestly to the client: file validation issues return `400`; a failed transcription returns `502` ("Transcription service failed") and cleans up the saved upload; a failed summarization returns `502` and (for uploads) deletes the file so no orphaned media is left. Summarization tries the primary provider and falls back to GPT-4o only when its key is configured, raising a single `RuntimeError` if every backend fails. The frontend surfaces `detail` messages and wraps the results view in an error boundary.

**Persistence.** Meetings are stored in Postgres with `JSONB` columns for the list-shaped fields (decisions, action items, follow-ups), a pragmatic fit since they're always read/written as whole documents, with indexes on `created_at` and `language` for the history list. Schema changes go through Alembic migrations.

---

## Roadmap

- [ ] Speaker diarization (who said what)
- [ ] Real-time transcription streaming
- [ ] Slack / Microsoft Teams integration
- [ ] RAG-powered search across all meetings
- [ ] Meeting templates (standup, retrospective, 1:1)
- [ ] User authentication and team workspaces

---

## Author

**Kayla Elisheva Siwi** · [GitHub](https://github.com/kaylaelishevaa)

<sub>Built with React, FastAPI, and OpenAI (Whisper + GPT-4o).</sub>
