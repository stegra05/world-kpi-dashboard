# Architektur - World KPI Dashboard

## Übersicht

Die Anwendung besteht aus zwei Hauptkomponenten: einem **Backend** (API-Server) und einem **Frontend** (Web-Benutzeroberfläche), die über eine REST-API kommunizieren.

## Backend (Python / FastAPI)

* **Verantwortlichkeit:** Bereitstellung der KPI-Daten aus der CSV-Datei über eine API.
* **Technologien:**
    * **FastAPI:** Modernes Python-Webframework zur Erstellung der REST-API. Bietet automatische Validierung und API-Dokumentation (Swagger UI unter `/docs`, ReDoc unter `/redoc`).
    * **Pandas:** Bibliothek zur effizienten Einlesung und Verarbeitung der CSV-Datei (`world_kpi_anonym.csv`).
    * **Uvicorn:** ASGI-Server zum Ausführen der FastAPI-Anwendung.
* **Datenverarbeitung:**
    * Liest die CSV-Datei `data/world_kpi_anonym.csv` mithilfe von Pandas (berücksichtigt Semikolon-Trennzeichen).
    * Behandelt potenziell das Caching der Daten, um nicht bei jeder Anfrage die Datei neu lesen zu müssen (initial: Lesen bei jedem Request).
    * Konvertiert den Pandas DataFrame in ein JSON-Format (`orient='records'`), das für das Frontend leicht verarbeitbar ist.
* **Kern-Endpunkt:**
    * `GET /api/data`: Liefert alle (oder gefilterte, falls erweitert) Daten aus der CSV als JSON-Array.
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
    * `App.jsx`: Haupt-Layout (Sidebar, AppBar, Content-Bereich), Routing (falls benötigt).
    * `FilterPanel.jsx`: Enthält die verschiedenen Filter (Dropdowns, Checkboxen etc.) für `battAlias`, `var` etc.
    * `WorldMap.jsx`: Zeigt die Plotly-Karte an, erhält gefilterte Daten als Props.
    * `InfoCard.jsx`: Zeigt Detailinformationen oder aggregierte Werte an (ähnlich den Karten im Beispielbild).
    * `DataTable.jsx`: (Optional) Zeigt Rohdaten in einer Tabelle an.
* **State Management:**
    * Initial: Verwendung von Reacts eingebauten Hooks (`useState`, `useEffect`, `useContext`) zur Verwaltung des Zustands (geladene Daten, Filterwerte).
    * Bei Bedarf Skalierung auf eine dedizierte State-Management-Bibliothek (z.B. Zustand, Redux Toolkit).
* **Styling:** Hauptsächlich über MUI-Komponenten und deren Theming/Styling-APIs (`sx` prop, `styled-components`).

## Datenfluss (Typischer Ablauf)

1.  Benutzer öffnet die App im Browser.
2.  React Frontend (`App.jsx`) wird geladen.
3.  `useEffect`-Hook im Frontend löst Datenabruf aus.
4.  Axios sendet `GET`-Request an Backend (`/api/data`).
5.  Backend (FastAPI) empfängt Request.
6.  Pandas liest `data/world_kpi_anonym.csv`.
7.  Backend sendet Daten als JSON-Antwort.
8.  Frontend empfängt JSON, speichert es im React-State (`useState`).
9.  Daten werden an die Kindkomponenten (`WorldMap`, `FilterPanel` etc.) weitergegeben.
10. Benutzer interagiert mit `FilterPanel`.
11. Filter-Komponente aktualisiert den Filter-Zustand im Frontend.
12. `WorldMap` und andere Komponenten erhalten aktualisierte (gefilterte) Daten und rendern neu.
