/**
 * Konfiguration für die Entwicklungsumgebung
 */

// Konstanten für die Anwendung
export const APP_CONFIG = {
  // Anwendungsname
  appName: 'World KPI Dashboard',
  
  // API-Endpunkte
  api: {
    dataUrl: '/api/data',
  },
  
  // Karteneinstellungen
  map: {
    defaultCenter: [20, 0],
    defaultZoom: 2,
    minZoom: 1,
    maxZoom: 10,
  },
  
  // Farbschema für Visualisierungen
  colors: {
    primary: '#0ea5e9',
    secondary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    
    // Farbskala für Karten und Diagramme
    scale: [
      '#cffafe',
      '#a5f3fc',
      '#67e8f9',
      '#22d3ee',
      '#06b6d4',
      '#0891b2',
      '#0e7490',
      '#155e75',
      '#164e63',
    ],
    
    // Kontinente Farbzuordnung
    continents: {
      'Europe': '#3b82f6',
      'Asia': '#ef4444',
      'Africa': '#f59e0b',
      'North America': '#10b981',
      'South America': '#6366f1',
      'Oceania': '#8b5cf6',
      'Antarctica': '#94a3b8',
    },
    
    // Klimazonen Farbzuordnung
    climate: {
      'normal': '#10b981',
      'coldland': '#3b82f6',
      'hotland': '#ef4444',
    },
  },
  
  // Filteroptionen
  filters: {
    defaultBatteryType: 'all',
    defaultContinent: 'all',
    defaultClimate: 'all',
    defaultVariable: 'variable_1',
  },
};

// Exportiere die Konfiguration als Standard
export default APP_CONFIG;
