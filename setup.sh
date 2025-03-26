#!/bin/bash

echo "Erstelle Projektstruktur für World KPI Dashboard..."

# Hauptverzeichnisse erstellen
mkdir -p backend
mkdir -p frontend
mkdir -p data

echo "Verzeichnisse backend/, frontend/, data/ erstellt."

# .gitignore erstellen
echo "Erstelle .gitignore..."
cat <<EOF > .gitignore
# Python
venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.env
*.env.*
!*.env.example

# Node.js
node_modules/
dist/
build/
.npm/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# IDE/Editor spezifisch
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# OS spezifisch
.DS_Store
Thumbs.db

# Build Artefakte etc.
*.local

# Cursor AI specific (falls vorhanden)
.cursor/
EOF

# README.md erstellen (mit korrigiertem Dateinamen)
echo "Erstelle README.md..."
cat <<EOF > README.md
# World KPI Dashboard

## Beschreibung

Eine Webanwendung zur Visualisierung von Key Performance Indicators (KPIs) aus einer CSV-Datei auf einer interaktiven Weltkarte. Die Anwendung ermöglicht das Filtern der Daten nach verschiedenen Dimensionen wie \`battAlias\` (Batterie-Alias) und \`var\` (KPI-Variable) und fokussiert sich auf den Vergleich von KPIs über geografische Regionen hinweg.

## Tech Stack

* **Backend:** Python, FastAPI, Pandas
* **Frontend:** React (mit Vite), **Material UI (MUI)**, Plotly.js (für Karten/Charts), Chart.js (optional), Axios
* **Entwicklungsumgebung:** Cursor AI, Git

## Features

* Interaktive Weltkarte zur Darstellung von Länderdaten (ähnlich dem Beispielbild).
* Einfärbung der Länder basierend auf ausgewählten Metriken (\`val\` eines \`var\` oder \`cnt_vhcl\`).
* Auswahlmöglichkeit für den Benutzer, welche Metrik (\`var\`) auf der Karte angezeigt wird.
* Filterung der Daten nach \`battAlias\`, \`var\`, \`model_series\`, \`continent\`, \`climate\`.
* Hervorhebung von Ländern und Anzeige von Detailinformationen bei Interaktion (Hover/Klick).
* Fokus auf den Vergleich von KPIs pro \`battAlias\`.
* Modernes Dashboard-Layout inspiriert vom Beispielbild (Sidebar, Hauptbereich, Info-Karten).

## Datenquelle

Details siehe \`DATA.md\`. Die Quelldatei ist \`data/world_kpi_anonym.csv\`.

## Projektstruktur

Details siehe \`ARCHITECTURE.md\`. Hauptordner sind \`backend/\`, \`frontend/\`, \`data/\`.

## Setup

1.  **Repository klonen:**
    \`\`\`bash
    # git clone <Deine Repository URL>
    # cd world-kpi-dashboard 
    \`\`\`
2.  **Backend Setup:**
    \`\`\`bash
    cd backend
    python -m venv venv  # Oder python3
    # Virtual Environment aktivieren:
    # Linux/macOS: source venv/bin/activate
    # Windows: .\\\venv\\\Scripts\\\activate
    pip install fastapi uvicorn pandas "python-multipart" 
    # (Optional: pip freeze > requirements.txt)
    cd .. 
    \`\`\`
3.  **Frontend Setup:**
    \`\`\`bash
    cd frontend
    # WICHTIG: Frontend-Projekt hier initialisieren (wird NICHT vom Skript gemacht!)
    # Beispiel: npm create vite@latest . --template react 
    # (Der Punkt '.' installiert im aktuellen Ordner)
    npm install
    # MUI und Abhängigkeiten installieren
    npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
    cd ..
    \`\`\`
    *(Hinweis: MUI benötigt ggf. die Roboto Font. Siehe MUI Docs für Details, falls nicht standardmäßig geladen).*

## Ausführung

1.  **Backend starten:**
    \`\`\`bash
    cd backend
    # Sicherstellen, dass venv aktiviert ist
    uvicorn main:app --reload 
    \`\`\`
    *Backend läuft auf \`http://127.0.0.1:8000\`.*

2.  **Frontend starten:**
    \`\`\`bash
    cd frontend
    npm run dev
    \`\`\`
    *Frontend läuft auf \`http://localhost:5173\` (oder ähnlich).*

## API Endpunkte

Details siehe \`ARCHITECTURE.md\`. Hauptendpunkt: \`GET /api/data\`.
EOF

# DATA.md erstellen (mit korrigiertem Dateinamen)
echo "Erstelle DATA.md..."
cat <<EOF > DATA.md
# Datenbeschreibung: world_kpi_anonym.csv

## Übersicht

* **Dateiname:** \`data/world_kpi_anonym.csv\`
* **Format:** CSV (Comma Separated Values - hier aber Semikolon-getrennt)
* **Trennzeichen:** Semikolon (\`;\`)
* **Zeichenkodierung:** Vermutlich UTF-8 (Standard)

## Spaltenbeschreibung

| Spaltenname    | Datentyp | Beschreibung                                                                                                | Anmerkungen                                    |
| :------------- | :------- | :---------------------------------------------------------------------------------------------------------- | :--------------------------------------------- |
| \`battAlias\`    | String   | Ein Alias oder eine Kennung für einen Batterietyp oder eine Produktgruppe (z.B. "Batt_11", "Batt_20").          | Zentrales Filterkriterium.                   |
| \`country\`      | String   | Name des Landes.                                                                                            |                                                |
| \`continent\`    | String   | Name des Kontinents.                                                                                        | Kann als Filter verwendet werden.              |
| \`climate\`      | String   | Klimaklassifizierung für die Region (z.B. "normal", "coldland", "hotland").                                   | Kann als Filter verwendet werden.              |
| \`iso_a3\`       | String   | ISO 3166-1 Alpha-3 Ländercode (z.B. "SWE", "DEU", "CHN").                                                     | Wichtig für die Kartendarstellung (Plotly).    |
| \`model_series\` | String   | Eine Kennung für eine Modellserie (z.B. "295", "247", "all").                                                  | Kann als Filter verwendet werden.              |
| \`var\`          | String   | Name der Variable oder des KPIs (z.B. "variable_1", "variable_10"). Jede Zeile repräsentiert einen KPI-Wert. | Zentral für die Auswahl der darzustellenden Metrik. |
| \`val\`          | Numeric  | Der numerische Wert für die entsprechende \`var\` in dieser Zeile/diesem Kontext.                               | Hauptmetrik zur Visualisierung.             |
| \`descr\`        | String   | Eine Beschreibung, vermutlich bezogen auf die \`var\` (z.B. "Beschreibung_1", "Beschreibung_10").                |                                                |
| \`cnt_vhcl\`     | Integer  | Vermutlich die Anzahl der Fahrzeuge ("Count Vehicles") in diesem Kontext/dieser Zeile.                        | Alternative Metrik zur Visualisierung.         |

## Bekannte Probleme / Besonderheiten

* **Fehlende Werte:** Einige Zeilen enthalten fehlende Informationen, insbesondere bei \`continent\`, \`climate\`, \`iso_a3\` (z.B. für Länder wie "Malta", "Singapore" oder den Eintrag "Unknown" bei \`country\`). Dies muss bei der Datenverarbeitung und Visualisierung berücksichtigt werden (z.B. durch Herausfiltern oder spezielle Behandlung).
* **Datenformat ("Long Format"):** Die Daten liegen im "Long Format" vor, d.h., verschiedene KPIs für dieselbe Entität (z.B. Land + battAlias) stehen in separaten Zeilen mit unterschiedlichen \`var\`-Werten. Dies ist gut für die Filterung nach \`var\`, erfordert aber ggf. Aggregation oder Selektion im Frontend/Backend für bestimmte Ansichten.
EOF

# ARCHITECTURE.md erstellen (mit korrigiertem Dateinamen)
echo "Erstelle ARCHITECTURE.md..."
cat <<EOF > ARCHITECTURE.md
# Architektur - World KPI Dashboard

## Übersicht

Die Anwendung besteht aus zwei Hauptkomponenten: einem **Backend** (API-Server) und einem **Frontend** (Web-Benutzeroberfläche), die über eine REST-API kommunizieren.

## Backend (Python / FastAPI)

* **Verantwortlichkeit:** Bereitstellung der KPI-Daten aus der CSV-Datei über eine API.
* **Technologien:**
    * **FastAPI:** Modernes Python-Webframework zur Erstellung der REST-API. Bietet automatische Validierung und API-Dokumentation (Swagger UI unter \`/docs\`, ReDoc unter \`/redoc\`).
    * **Pandas:** Bibliothek zur effizienten Einlesung und Verarbeitung der CSV-Datei (\`world_kpi_anonym.csv\`).
    * **Uvicorn:** ASGI-Server zum Ausführen der FastAPI-Anwendung.
* **Datenverarbeitung:**
    * Liest die CSV-Datei \`data/world_kpi_anonym.csv\` mithilfe von Pandas (berücksichtigt Semikolon-Trennzeichen).
    * Behandelt potenziell das Caching der Daten, um nicht bei jeder Anfrage die Datei neu lesen zu müssen (initial: Lesen bei jedem Request).
    * Konvertiert den Pandas DataFrame in ein JSON-Format (\`orient='records'\`), das für das Frontend leicht verarbeitbar ist.
* **Kern-Endpunkt:**
    * \`GET /api/data\`: Liefert alle (oder gefilterte, falls erweitert) Daten aus der CSV als JSON-Array.
* **CORS:** Middleware ist konfiguriert, um Anfragen vom Frontend (anderer Port/Ursprung) während der Entwicklung zu erlauben.

## Frontend (React / MUI / Plotly)

* **Verantwortlichkeit:** Darstellung der Daten auf einer interaktiven Karte und anderen UI-Elementen, Ermöglichung von Benutzerinteraktionen (Filtern, Zoomen etc.).
* **Technologien:**
    * **React:** JavaScript-Bibliothek zur Erstellung der Benutzeroberfläche mithilfe von Komponenten.
    * **Vite:** Schnelles Build-Tool und Entwicklungsserver für das Frontend-Projekt.
    * **Material UI (MUI):** Komponentenbibliothek für das UI-Design (Layout, Buttons, Filter-Elemente, Karten etc.), um ein modernes Dashboard-Look&Feel zu erreichen.
    * **Plotly.js (react-plotly.js):** Bibliothek zur Erstellung interaktiver Datenvisualisierungen, insbesondere der Choropleth-Weltkarte.
    * **Axios:** Bibliothek zum Senden von HTTP-Anfragen an das Backend (API).
    * **(Optional) Chart.js (react-chartjs-2):** Für zusätzliche, einfachere Diagramme.
* **Kernkomponenten (Beispiele):**
    * \`App.jsx\`: Haupt-Layout (Sidebar, AppBar, Content-Bereich), Routing (falls benötigt).
    * \`FilterPanel.jsx\`: Enthält die verschiedenen Filter (Dropdowns, Checkboxen etc.) für \`battAlias\`, \`var\` etc.
    * \`WorldMap.jsx\`: Zeigt die Plotly-Karte an, erhält gefilterte Daten als Props.
    * \`InfoCard.jsx\`: Zeigt Detailinformationen oder aggregierte Werte an (ähnlich den Karten im Beispielbild).
    * \`DataTable.jsx\`: (Optional) Zeigt Rohdaten in einer Tabelle an.
* **State Management:**
    * Initial: Verwendung von Reacts eingebauten Hooks (\`useState\`, \`useEffect\`, \`useContext\`) zur Verwaltung des Zustands (geladene Daten, Filterwerte).
    * Bei Bedarf Skalierung auf eine dedizierte State-Management-Bibliothek (z.B. Zustand, Redux Toolkit).
* **Styling:** Hauptsächlich über MUI-Komponenten und deren Theming/Styling-APIs (\`sx\` prop, \`styled-components\`).

## Datenfluss (Typischer Ablauf)

1.  Benutzer öffnet die App im Browser.
2.  React Frontend (\`App.jsx\`) wird geladen.
3.  \`useEffect\`-Hook im Frontend löst Datenabruf aus.
4.  Axios sendet \`GET\`-Request an Backend (\`/api/data\`).
5.  Backend (FastAPI) empfängt Request.
6.  Pandas liest \`data/world_kpi_anonym.csv\`.
7.  Backend sendet Daten als JSON-Antwort.
8.  Frontend empfängt JSON, speichert es im React-State (\`useState\`).
9.  Daten werden an die Kindkomponenten (\`WorldMap\`, \`FilterPanel\` etc.) weitergegeben.
10. Benutzer interagiert mit \`FilterPanel\`.
11. Filter-Komponente aktualisiert den Filter-Zustand im Frontend.
12. \`WorldMap\` und andere Komponenten erhalten aktualisierte (gefilterte) Daten und rendern neu.
EOF

# .cursorrules erstellen (mit korrigiertem Dateinamen)
echo "Erstelle .cursorrules..."
cat <<EOF > .cursorrules
## Project Context: World KPI Dashboard

**1. Projektziel:**
   - Web-Dashboard zur Visualisierung von KPIs aus \`data/world_kpi_anonym.csv\`.
   - Kernstück ist eine interaktive Choropleth-Weltkarte.
   - Fokus auf Vergleich von KPIs (\`val\`) pro \`battAlias\` über Länder hinweg.
   - Benutzer sollen Metrik (\`var\`) und Filter (\`battAlias\`, \`continent\` etc.) auswählen können.
   - Modernes Dashboard-Layout mit Sidebar und Hauptbereich (inspiriert vom Beispielbild), umgesetzt mit Material UI.

**2. Technologie-Stack:**
   - **Backend:** Python 3, FastAPI, Pandas, Uvicorn.
   - **Frontend:** React (mit Vite), JavaScript, Material UI (MUI) für Komponenten/Layout, Plotly.js (\`react-plotly.js\`) für Karten/Charts, Axios für API-Calls.
   - **Datenquelle:** \`data/world_kpi_anonym.csv\` (CSV, **Semikolon-Trennzeichen**). Wichtige Spalten: \`iso_a3\`, \`country\`, \`battAlias\`, \`var\`, \`val\`, \`cnt_vhcl\`. Daten im 'Long Format'.

**3. Frontend-Richtlinien:**
   - React: Funktionale Komponenten, Hooks (\`useState\`, \`useEffect\` etc.).
   - MUI: Komponenten wie \`<Box>\`, \`<Grid>\`, \`<AppBar>\`, \`<Drawer>\`, \`<Card>\`, \`<Select>\`, \`<Button>\` verwenden. Styling primär über \`sx\`-Prop oder \`styled()\`.
   - Plotly: \`react-plotly.js\` für die Weltkarte nutzen (Typ: \`choropleth\`, \`locations\` an \`iso_a3\` binden).
   - API-Calls: Mit Axios in \`useEffect\`, Lade- & Fehlerzustände behandeln.
   - Struktur: Logische Komponententrennung (z.B. \`src/components/Map\`, \`src/components/Filters\`).

**4. Backend-Richtlinien:**
   - FastAPI: Standard-Pattern verwenden. Automatische Docs (\`/docs\`) nutzen.
   - Pandas: \`pd.read_csv(..., delimiter=';')\` zum Einlesen verwenden. Fehlerbehandlung für Dateizugriff.
   - API: \`/api/data\` Endpunkt soll JSON-Liste liefern (\`df.to_dict(orient='records')\`).
   - Code-Style: PEP 8 für Python, Type Hints sind erwünscht.
   - CORS: Middleware für Entwicklung aktivieren.

**5. Wichtige Dateien & Ordner:**
   - Backend: \`backend/main.py\`
   - Frontend: \`frontend/src/App.jsx\`, \`frontend/src/components/\`
   - Daten: \`data/world_kpi_anonym.csv\`

**6. Allgemeine Hinweise für die AI:**
   - Priorisiere klaren, wartbaren Code.
   * Füge Kommentare für komplexe Logik hinzu.
   * Berücksichtige Fehlerbehandlung (API-Fehler, Datenfehler, fehlende Werte im CSV).
   * Beachte das Semikolon-Trennzeichen beim Generieren von Code, der die CSV liest.
   * Halte dich bei Code-Generierung und -Änderung an den definierten Tech-Stack.
EOF

echo "--------------------------------------------------"
echo "Projekt-Grundstruktur und Dokumentationsdateien erstellt."
echo "NÄCHSTE SCHRITTE (manuell ausführen):"
echo "1. Kopiere deine 'world_kpi_anonym.csv' Datei in den Ordner 'data/'."
echo "2. Wechsle in den 'frontend/' Ordner und initialisiere das React-Projekt (z.B. mit 'npm create vite@latest . --template react' oder ähnlich)."
echo "3. Führe die Setup-Schritte für Backend (venv, pip install) und Frontend (npm install, MUI etc.) aus, wie im README.md beschrieben."
echo "--------------------------------------------------"