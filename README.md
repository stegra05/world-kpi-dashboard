# World KPI Dashboard

## Beschreibung

Eine Webanwendung zur Visualisierung von Key Performance Indicators (KPIs) aus einer CSV-Datei auf einer interaktiven Weltkarte. Die Anwendung ermöglicht das Filtern der Daten nach verschiedenen Dimensionen wie `battAlias` (Batterie-Alias) und `var` (KPI-Variable) und fokussiert sich auf den Vergleich von KPIs über geografische Regionen hinweg.

## Tech Stack

* **Backend:** Python, FastAPI, Pandas
* **Frontend:** React (mit Vite), **Material UI (MUI)**, Plotly.js (für Karten/Charts), Chart.js (optional), Axios
* **Entwicklungsumgebung:** Cursor AI, Git

## Features

* Interaktive Weltkarte zur Darstellung von Länderdaten (ähnlich dem Beispielbild).
* Einfärbung der Länder basierend auf ausgewählten Metriken (`val` eines `var` oder `cnt_vhcl`).
* Auswahlmöglichkeit für den Benutzer, welche Metrik (`var`) auf der Karte angezeigt wird.
* Filterung der Daten nach `battAlias`, `var`, `model_series`, `continent`, `climate`.
* Hervorhebung von Ländern und Anzeige von Detailinformationen bei Interaktion (Hover/Klick).
* Fokus auf den Vergleich von KPIs pro `battAlias`.
* Modernes Dashboard-Layout inspiriert vom Beispielbild (Sidebar, Hauptbereich, Info-Karten).

## Datenquelle

Details siehe `DATA.md`. Die Quelldatei ist `data/world_kpi_anonym.csv`.

## Projektstruktur

Details siehe `ARCHITECTURE.md`. Hauptordner sind `backend/`, `frontend/`, `data/`.

## Setup

1.  **Repository klonen:**
    ```bash
    # git clone <Deine Repository URL>
    # cd world-kpi-dashboard 
    ```
2.  **Backend Setup:**
    ```bash
    cd backend
    python -m venv venv  # Oder python3
    # Virtual Environment aktivieren:
    # Linux/macOS: source venv/bin/activate
    # Windows: .\\venv\\Scripts\\activate
    pip install fastapi uvicorn pandas "python-multipart" 
    # (Optional: pip freeze > requirements.txt)
    cd .. 
    ```
3.  **Frontend Setup:**
    ```bash
    cd frontend
    # WICHTIG: Frontend-Projekt hier initialisieren (wird NICHT vom Skript gemacht!)
    # Beispiel: npm create vite@latest . --template react 
    # (Der Punkt '.' installiert im aktuellen Ordner)
    npm install
    # MUI und Abhängigkeiten installieren
    npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
    cd ..
    ```
    *(Hinweis: MUI benötigt ggf. die Roboto Font. Siehe MUI Docs für Details, falls nicht standardmäßig geladen).*

## Ausführung

1.  **Backend starten:**
    ```bash
    cd backend
    # Sicherstellen, dass venv aktiviert ist
    uvicorn main:app --reload 
    ```
    *Backend läuft auf `http://127.0.0.1:8000`.*

2.  **Frontend starten:**
    ```bash
    cd frontend
    npm run dev
    ```
    *Frontend läuft auf `http://localhost:5173` (oder ähnlich).*

## API Endpunkte

Details siehe `ARCHITECTURE.md`. Hauptendpunkt: `GET /api/data`.
