# World KPI Dashboard

## Projektübersicht
Dieses Projekt ist ein interaktives Dashboard zur Visualisierung von weltweiten Batterie-KPI-Daten. Es verwendet moderne Webtechnologien wie Next.js, Shad cn und Chakra UI für die Benutzeroberfläche sowie Leaflet.js für die interaktive Landkarte.

## Technologiestack
- **Frontend Framework**: Next.js mit TypeScript
- **UI-Bibliotheken**: Shad cn, Chakra UI
- **Styling**: Tailwind CSS
- **Datenvisualisierung**: Recharts, D3.js
- **Kartendarstellung**: Leaflet.js
- **Datenverarbeitung**: PapaParse für CSV-Parsing
- **Tabellendarstellung**: TanStack Table

## Projektstruktur
```
world-kpi-dashboard/
├── public/                  # Statische Dateien
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API-Routen
│   │   │   └── data/        # Daten-API
│   │   ├── globals.css      # Globale Styles
│   │   ├── layout.tsx       # Root Layout
│   │   └── page.tsx         # Hauptseite
│   ├── components/          # React-Komponenten
│   │   ├── charts/          # Diagramm-Komponenten
│   │   ├── map/             # Karten-Komponenten
│   │   ├── providers/       # Provider-Komponenten
│   │   └── ui/              # UI-Komponenten
│   ├── data/                # Daten und Datenverarbeitung
│   │   ├── api/             # API-Funktionen
│   │   ├── preprocessing/   # Datenvorverarbeitung
│   │   └── world_kpi_anonym.txt  # Rohdaten
│   └── lib/                 # Hilfsfunktionen und Konfiguration
│       ├── config.ts        # Anwendungskonfiguration
│       └── utils.ts         # Utility-Funktionen
├── .gitignore               # Git-Ignore-Datei
├── components.json          # Shadcn Komponenten-Konfiguration
├── next.config.ts           # Next.js-Konfiguration
├── package.json             # NPM-Paketdefinition
├── postcss.config.mjs       # PostCSS-Konfiguration
├── tailwind.config.js       # Tailwind-Konfiguration
└── tsconfig.json            # TypeScript-Konfiguration
```

## Datenstruktur
Die Anwendung verwendet Daten aus der Datei `world_kpi_anonym.txt`, die folgende Struktur hat:
- `battAlias`: Batterietyp-Alias
- `country`: Ländername
- `continent`: Kontinent
- `climate`: Klimazone (normal, coldland, hotland)
- `iso_a3`: ISO 3166-1 alpha-3 Ländercode
- `model_series`: Modellreihe
- `var`: Variablenname (z.B. variable_1, variable_2)
- `val`: Wert der Variable
- `descr`: Beschreibung
- `cnt_vhcl`: Fahrzeuganzahl

## Funktionen
- Interaktive Landkarte mit farblicher Hervorhebung von Ländern basierend auf Datenwerten
- Verschiedene Diagrammtypen zur Visualisierung der Daten
- Filterung der Daten nach Batterietyp, Land, Kontinent, Klimazone und Variablen
- Responsive Design für verschiedene Bildschirmgrößen
- Dunkelmodus und Themenwechsel

## Entwicklung
### Voraussetzungen
- Node.js (Version 18 oder höher)
- npm (Version 8 oder höher)

### Installation
1. Repository klonen
2. Abhängigkeiten installieren:
   ```
   npm install
   ```
3. Entwicklungsserver starten:
   ```
   npm run dev
   ```
4. Browser öffnen und http://localhost:3000 aufrufen

## Docker
Das Projekt kann in einem Docker-Container ausgeführt werden. Die Docker-Konfiguration wird in einem späteren Sprint implementiert.

## Lizenz
Dieses Projekt ist für interne Verwendung bestimmt.
