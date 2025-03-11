/**
 * Datenverarbeitungsmodul für die Batterie-KPI-Daten
 */

import Papa from 'papaparse';

export interface BatteryData {
  battAlias: string;
  country: string;
  continent: string;
  climate: string;
  iso_a3: string;
  model_series: string;
  var: string;
  val: number | string;
  descr: string;
  cnt_vhcl: number;
}

/**
 * Lädt und verarbeitet die Batterie-KPI-Daten aus der CSV-Datei
 */
export async function loadBatteryData(): Promise<BatteryData[]> {
  try {
    const response = await fetch('/api/data');
    const text = await response.text();
    
    const result = Papa.parse<BatteryData>(text, {
      header: true,
      delimiter: ';',
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    if (result.errors && result.errors.length > 0) {
      console.error('Fehler beim Parsen der Daten:', result.errors);
    }

    return result.data.filter(item => item.battAlias && item.country);
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
    return [];
  }
}

/**
 * Gruppiert die Daten nach einem bestimmten Feld
 */
export function groupDataBy<T extends keyof BatteryData>(
  data: BatteryData[],
  field: T
): Record<string, BatteryData[]> {
  return data.reduce((groups, item) => {
    const key = String(item[field] || 'Unbekannt');
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, BatteryData[]>);
}

/**
 * Filtert die Daten nach verschiedenen Kriterien
 */
export function filterData(
  data: BatteryData[],
  filters: Partial<BatteryData>
): BatteryData[] {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      return item[key as keyof BatteryData] === value;
    });
  });
}

/**
 * Berechnet Statistiken für die Daten
 */
export function calculateStats(data: BatteryData[]) {
  const numericValues = data
    .map(item => typeof item.val === 'number' ? item.val : NaN)
    .filter(val => !isNaN(val));

  if (numericValues.length === 0) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      sum: 0,
      count: 0
    };
  }

  return {
    min: Math.min(...numericValues),
    max: Math.max(...numericValues),
    avg: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length,
    sum: numericValues.reduce((sum, val) => sum + val, 0),
    count: numericValues.length
  };
}

/**
 * Bereitet Daten für die Kartendarstellung vor
 */
export function prepareMapData(data: BatteryData[]) {
  const countryData = groupDataBy(data, 'iso_a3');
  
  return Object.entries(countryData).map(([iso, items]) => {
    const stats = calculateStats(items);
    return {
      iso,
      country: items[0]?.country || 'Unbekannt',
      continent: items[0]?.continent || 'Unbekannt',
      climate: items[0]?.climate || 'Unbekannt',
      count: items.length,
      value: stats.avg,
      total: stats.sum
    };
  });
}
