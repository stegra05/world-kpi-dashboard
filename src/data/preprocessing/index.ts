/**
 * Hauptmodul für die Datenvorverarbeitung
 * Kombiniert alle Datenverarbeitungsfunktionen
 */

import { loadBatteryData } from './dataProcessor';
import type { BatteryData } from './dataProcessor';
import { 
  cleanData, 
  normalizeValues, 
  aggregateData, 
  prepareTimeSeriesData, 
  prepareGeoData, 
  identifyOutliers 
} from './dataCleanup';
import { runDataPreprocessingTests } from './dataTests';

/**
 * Hauptfunktion für die Datenvorverarbeitung
 * Lädt, bereinigt und bereitet Daten für verschiedene Visualisierungen vor
 */
export async function preprocessData() {
  try {
    // Daten laden
    const rawData = await loadBatteryData();
    console.log(`${rawData.length} Datensätze geladen`);
    
    // Daten bereinigen
    const cleanedData = cleanData(rawData);
    console.log(`Daten bereinigt: ${cleanedData.length} gültige Datensätze`);
    
    // Ausreißer identifizieren
    const outliers = identifyOutliers(cleanedData, 'val');
    console.log(`${outliers.length} Ausreißer identifiziert`);
    
    // Daten für verschiedene Visualisierungen vorbereiten
    const normalizedData = normalizeValues(cleanedData, 'val');
    const continentData = aggregateData(cleanedData, 'continent', 'val');
    const climateData = aggregateData(cleanedData, 'climate', 'val');
    const batteryTypeData = aggregateData(cleanedData, 'battAlias', 'val');
    const timeSeriesData = prepareTimeSeriesData(cleanedData, 'country');
    const geoData = prepareGeoData(cleanedData);
    
    // Ergebnisse zurückgeben
    return {
      rawData,
      cleanedData,
      normalizedData,
      continentData,
      climateData,
      batteryTypeData,
      timeSeriesData,
      geoData,
      outliers
    };
  } catch (error) {
    console.error('Fehler bei der Datenvorverarbeitung:', error);
    throw error;
  }
}

/**
 * Führt Tests für die Datenvorverarbeitung durch
 */
export function testDataPreprocessing() {
  return runDataPreprocessingTests();
}

// Exportiere alle Funktionen für die Verwendung in anderen Modulen
export {
  type BatteryData,
  loadBatteryData,
  cleanData,
  normalizeValues,
  aggregateData,
  prepareTimeSeriesData,
  prepareGeoData,
  identifyOutliers
};
