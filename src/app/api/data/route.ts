import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Pfad zur Datendatei (jetzt im public Verzeichnis)
    const dataFilePath = path.join(process.cwd(), 'public', 'data', 'world_kpi_anonym.txt');
    
    // Alternativ: Fallback zu einem Beispieldatensatz, falls die Datei nicht existiert
    if (!fs.existsSync(dataFilePath)) {
      // Rückgabe von Beispieldaten
      return new NextResponse(JSON.stringify({
        message: 'Using sample data. Please place world_kpi_anonym.txt in the public/data directory.'
      }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Datei lesen
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    
    // Daten als Text zurückgeben
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Fehler beim Lesen der Datendatei:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Fehler beim Laden der Daten',
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
