/**
 * Tests für die Datenvorverarbeitung
 */

import { BatteryData } from './dataProcessor';
import { 
  cleanData, 
  normalizeValues, 
  aggregateData, 
  prepareTimeSeriesData, 
  prepareGeoData, 
  identifyOutliers 
} from './dataCleanup';

/**
 * Führt grundlegende Tests für die Datenvorverarbeitungsfunktionen durch
 */
export function runDataPreprocessingTests() {
  try {
    console.log('Starte Datenvorverarbeitungstests...');
    
    // Mock-Daten für Tests
    const mockData: BatteryData[] = [
      { 
        battAlias: 'Batt_1', 
        country: 'Germany', 
        continent: 'Europe', 
        climate: 'normal', 
        iso_a3: 'DEU', 
        model_series: 'Series_1', 
        var: 'variable_1', 
        val: 100, 
        descr: 'Test', 
        cnt_vhcl: 10 
      },
      { 
        battAlias: 'Batt_2', 
        country: 'France', 
        continent: 'Europe', 
        climate: 'normal', 
        iso_a3: 'FRA', 
        model_series: 'Series_2', 
        var: 'variable_1', 
        val: 200, 
        descr: 'Test', 
        cnt_vhcl: 20 
      },
      { 
        battAlias: 'Batt_1', 
        country: 'USA', 
        continent: 'North America', 
        climate: 'normal', 
        iso_a3: 'USA', 
        model_series: 'Series_1', 
        var: 'variable_2', 
        val: 150, 
        descr: 'Test', 
        cnt_vhcl: 15 
      }
    ];
    
    // Teste cleanData
    const cleanedData = cleanData(mockData);
    console.log(`cleanData: ${cleanedData.length} gültige Datensätze`);
    
    // Teste normalizeValues
    const normalizedData = normalizeValues(mockData, 'val');
    console.log('normalizeValues: Normalisierte Daten erstellt');
    
    // Teste aggregateData
    const continentData = aggregateData(mockData, 'continent', 'val');
    console.log(`aggregateData: ${continentData.length} aggregierte Datensätze`);
    
    // Teste prepareTimeSeriesData
    const timeSeriesData = prepareTimeSeriesData(mockData, 'country');
    console.log('prepareTimeSeriesData: Zeitreihendaten erstellt');
    
    // Teste prepareGeoData
    const geoData = prepareGeoData(mockData);
    console.log('prepareGeoData: Geodaten erstellt');
    
    // Teste identifyOutliers
    const outliers = identifyOutliers(mockData, 'val');
    console.log(`identifyOutliers: ${outliers.length} Ausreißer identifiziert`);
    
    console.log('Alle Tests erfolgreich abgeschlossen');
    return true;
  } catch (error) {
    console.error('Fehler bei den Tests:', error);
    return false;
  }
}