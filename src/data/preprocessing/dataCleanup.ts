/**
 * Erweiterte Datenbereinigung und -vorverarbeitung für die Batterie-KPI-Daten
 */

import { BatteryData } from './dataProcessor';

/**
 * Bereinigt die Daten und behandelt fehlende Werte
 */
export function cleanData(data: BatteryData[]): BatteryData[] {
  return data.map(item => {
    // Kopie des Elements erstellen
    const cleanedItem = { ...item };
    
    // Fehlende Werte für Strings mit Standardwerten ersetzen
    if (!cleanedItem.country || cleanedItem.country === '') {
      cleanedItem.country = 'Unbekannt';
    }
    
    if (!cleanedItem.continent || cleanedItem.continent === '') {
      cleanedItem.continent = 'Unbekannt';
    }
    
    if (!cleanedItem.climate || cleanedItem.climate === '') {
      cleanedItem.climate = 'normal';
    }
    
    if (!cleanedItem.iso_a3 || cleanedItem.iso_a3 === '') {
      cleanedItem.iso_a3 = 'UNK';
    }
    
    // Numerische Werte behandeln
    if (typeof cleanedItem.val === 'string') {
      // Versuchen, String in Zahl zu konvertieren
      const numVal = parseFloat(cleanedItem.val);
      if (!isNaN(numVal)) {
        cleanedItem.val = numVal;
      } else {
        cleanedItem.val = 0;
      }
    } else if (cleanedItem.val === null || cleanedItem.val === undefined) {
      cleanedItem.val = 0;
    }
    
    // Fahrzeuganzahl behandeln
    if (typeof cleanedItem.cnt_vhcl !== 'number' || isNaN(cleanedItem.cnt_vhcl)) {
      cleanedItem.cnt_vhcl = 0;
    }
    
    return cleanedItem;
  });
}

/**
 * Normalisiert numerische Werte für die Visualisierung
 */
export function normalizeValues(data: BatteryData[], field: 'val' | 'cnt_vhcl'): BatteryData[] {
  // Finde Minimum und Maximum
  const values = data.map(item => {
    if (field === 'val' && typeof item[field] === 'number') {
      return item[field] as number;
    } else if (field === 'cnt_vhcl') {
      return item[field];
    }
    return 0;
  });
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  // Wenn alle Werte gleich sind, keine Normalisierung durchführen
  if (range === 0) {
    return data;
  }
  
  // Normalisierte Werte berechnen (0-1 Bereich)
  return data.map(item => {
    const normalizedItem = { ...item };
    
    if (field === 'val' && typeof normalizedItem[field] === 'number') {
      (normalizedItem as any).normalizedVal = ((normalizedItem[field] as number) - min) / range;
    } else if (field === 'cnt_vhcl') {
      (normalizedItem as any).normalizedCount = (normalizedItem[field] - min) / range;
    }
    
    return normalizedItem;
  });
}

/**
 * Aggregiert Daten für verschiedene Visualisierungstypen
 */
export function aggregateData(data: BatteryData[], groupBy: keyof BatteryData, valueField: 'val' | 'cnt_vhcl'): any[] {
  // Gruppiere Daten
  const groups: Record<string, BatteryData[]> = {};
  
  data.forEach(item => {
    const key = String(item[groupBy] || 'Unbekannt');
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  });
  
  // Aggregiere Werte für jede Gruppe
  return Object.entries(groups).map(([key, items]) => {
    // Berechne Summe und Durchschnitt
    const sum = items.reduce((acc, item) => {
      if (valueField === 'val' && typeof item[valueField] === 'number') {
        return acc + (item[valueField] as number);
      } else if (valueField === 'cnt_vhcl') {
        return acc + item[valueField];
      }
      return acc;
    }, 0);
    
    const avg = sum / items.length;
    
    // Erstelle aggregiertes Objekt
    return {
      [groupBy]: key,
      count: items.length,
      sum,
      avg,
      min: Math.min(...items.map(item => {
        if (valueField === 'val' && typeof item[valueField] === 'number') {
          return item[valueField] as number;
        } else if (valueField === 'cnt_vhcl') {
          return item[valueField];
        }
        return 0;
      })),
      max: Math.max(...items.map(item => {
        if (valueField === 'val' && typeof item[valueField] === 'number') {
          return item[valueField] as number;
        } else if (valueField === 'cnt_vhcl') {
          return item[valueField];
        }
        return 0;
      })),
    };
  });
}

/**
 * Bereitet Daten für Zeitreihenvisualisierungen vor
 */
export function prepareTimeSeriesData(data: BatteryData[], groupBy: keyof BatteryData): any[] {
  // Extrahiere alle eindeutigen Variablen (variable_1, variable_2, etc.)
  const variables = Array.from(new Set(data.map(item => item.var)));
  
  // Gruppiere nach dem angegebenen Feld
  const groups: Record<string, Record<string, number>> = {};
  
  data.forEach(item => {
    const key = String(item[groupBy] || 'Unbekannt');
    const varName = item.var;
    
    if (!groups[key]) {
      groups[key] = {};
    }
    
    // Wenn der Wert numerisch ist, füge ihn hinzu oder addiere ihn
    if (typeof item.val === 'number') {
      if (!groups[key][varName]) {
        groups[key][varName] = item.val;
      } else {
        groups[key][varName] += item.val;
      }
    }
  });
  
  // Konvertiere in das Format für Zeitreihendiagramme
  return Object.entries(groups).map(([key, values]) => {
    return {
      name: key,
      ...values
    };
  });
}

/**
 * Bereitet Daten für die Kartendarstellung vor
 */
export function prepareGeoData(data: BatteryData[]): any[] {
  // Bereinige die Daten zuerst
  const cleanedData = cleanData(data);
  
  // Gruppiere nach ISO-Code
  const countryGroups: Record<string, BatteryData[]> = {};
  
  cleanedData.forEach(item => {
    if (!item.iso_a3 || item.iso_a3 === 'UNK') return;
    
    if (!countryGroups[item.iso_a3]) {
      countryGroups[item.iso_a3] = [];
    }
    
    countryGroups[item.iso_a3].push(item);
  });
  
  // Aggregiere Daten für jedes Land
  return Object.entries(countryGroups).map(([iso, items]) => {
    // Berechne Durchschnitt und Summe der Werte
    const values = items.map(item => typeof item.val === 'number' ? item.val : 0);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = values.length > 0 ? sum / values.length : 0;
    
    // Berechne Summe der Fahrzeuge
    const vehicleCount = items.reduce((acc, item) => acc + item.cnt_vhcl, 0);
    
    // Erstelle Geo-Datenpunkt
    return {
      iso,
      country: items[0]?.country || 'Unbekannt',
      continent: items[0]?.continent || 'Unbekannt',
      climate: items[0]?.climate || 'normal',
      count: items.length,
      value: avg,
      sum,
      vehicleCount,
      // Speichere die Verteilung der Batterietypen
      batteryTypes: Array.from(new Set(items.map(item => item.battAlias))),
      // Speichere die Verteilung der Variablen
      variables: Array.from(new Set(items.map(item => item.var)))
    };
  });
}

/**
 * Identifiziert Ausreißer in den Daten
 */
export function identifyOutliers(data: BatteryData[], field: 'val' | 'cnt_vhcl'): BatteryData[] {
  // Extrahiere numerische Werte
  const values = data
    .map(item => {
      if (field === 'val' && typeof item[field] === 'number') {
        return item[field] as number;
      } else if (field === 'cnt_vhcl') {
        return item[field];
      }
      return null;
    })
    .filter(val => val !== null) as number[];
  
  // Berechne Quartile und IQR
  values.sort((a, b) => a - b);
  const q1Index = Math.floor(values.length * 0.25);
  const q3Index = Math.floor(values.length * 0.75);
  const q1 = values[q1Index];
  const q3 = values[q3Index];
  const iqr = q3 - q1;
  
  // Definiere Grenzen für Ausreißer
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  // Identifiziere Ausreißer
  return data.filter(item => {
    let value;
    if (field === 'val' && typeof item[field] === 'number') {
      value = item[field] as number;
    } else if (field === 'cnt_vhcl') {
      value = item[field];
    } else {
      return false;
    }
    
    return value < lowerBound || value > upperBound;
  });
}
