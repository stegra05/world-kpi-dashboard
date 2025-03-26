# World KPI Dashboard

## Beschreibung

Eine Webanwendung zur Visualisierung von Key Performance Indicators (KPIs) aus einer CSV-Datei auf einer interaktiven Weltkarte. Die Anwendung ermöglicht das Filtern der Daten nach verschiedenen Dimensionen wie `battAlias` (Batterie-Alias) und `var` (KPI-Variable) und fokussiert sich auf den Vergleich von KPIs über geografische Regionen hinweg.

## Tech Stack

* **Backend:** Python, FastAPI, Pandas
* **Frontend:** React (mit Vite), **Material UI (MUI)**, Plotly.js (für Karten/Charts), Chart.js (optional), Axios
* **Entwicklungsumgebung:** Cursor AI, Git
* **Produktion:** Gunicorn, Nginx, systemd

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

## Umgebungsvariablen

Das Frontend verwendet Umgebungsvariablen für die Konfiguration:

* `VITE_API_URL`: URL des Backend-Servers
  * Entwicklung: `http://localhost:8000` (`.env.development`)
  * Produktion: `https://api.example.com` (`.env.production`)

Die Umgebungsvariablen werden automatisch beim Build-Prozess eingefügt. Für lokale Entwicklung wird `.env.development` verwendet, für den Produktionsbuild `.env.production`.

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

## Deployment

### Voraussetzungen

* Ubuntu/Debian Server
* Python 3.8+
* Node.js 16+
* Nginx
* SSL-Zertifikate (für HTTPS)

### Installation der Server-Abhängigkeiten

```bash
# System-Pakete aktualisieren
sudo apt update && sudo apt upgrade -y

# Python und Node.js installieren
sudo apt install -y python3-venv python3-pip nodejs npm nginx

# SSL-Zertifikate installieren (optional)
sudo apt install -y certbot python3-certbot-nginx
```

### Deployment-Schritte

1. **Repository auf Server klonen:**
   ```bash
   sudo mkdir -p /var/www
   cd /var/www
   sudo git clone <repository-url> world-kpi-dashboard
   sudo chown -R $USER:$USER world-kpi-dashboard
   ```

2. **Umgebungsvariablen anpassen:**
   ```bash
   # Backend
   cd /var/www/world-kpi-dashboard/backend
   cp .env.production .env
   # .env Datei mit den korrekten Werten bearbeiten

   # Frontend
   cd /var/www/world-kpi-dashboard/frontend
   cp .env.production .env
   # .env Datei mit den korrekten Werten bearbeiten
   ```

3. **Deployment-Skript ausführen:**
   ```bash
   cd /var/www/world-kpi-dashboard
   chmod +x deploy/deploy.sh
   ./deploy/deploy.sh
   ```

4. **SSL-Zertifikate einrichten (optional):**
   ```bash
   sudo certbot --nginx -d your-frontend-domain.com -d your-api-domain.com
   ```

### Wartung

* **Logs überprüfen:**
  ```bash
  # Backend Logs
  sudo journalctl -u world-kpi-backend

  # Nginx Logs
  sudo tail -f /var/log/nginx/access.log
  sudo tail -f /var/log/nginx/error.log
  ```

* **Services neustarten:**
  ```bash
  sudo systemctl restart world-kpi-backend
  sudo systemctl restart nginx
  ```

* **Updates einspielen:**
  ```bash
  cd /var/www/world-kpi-dashboard
  sudo git pull
  ./deploy/deploy.sh
  ```

### Sicherheit

* Firewall-Konfiguration:
  ```bash
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  ```

* Regelmäßige Sicherheitsupdates:
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```

* SSL-Zertifikate erneuern (falls Let's Encrypt verwendet):
  ```bash
  sudo certbot renew
  ```
