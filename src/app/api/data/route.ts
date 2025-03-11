import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Pfad zur Datendatei
    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'world_kpi_anonym.txt');
    
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
    return new NextResponse(JSON.stringify({ error: 'Fehler beim Laden der Daten' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
