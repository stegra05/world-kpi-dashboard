# Datenbeschreibung: world_kpi_anonym.csv

## Übersicht

* **Dateiname:** `data/world_kpi_anonym.csv`
* **Format:** CSV (Comma Separated Values - hier aber Semikolon-getrennt)
* **Trennzeichen:** Semikolon (`;`)
* **Zeichenkodierung:** Vermutlich UTF-8 (Standard)

## Spaltenbeschreibung

| Spaltenname    | Datentyp | Beschreibung                                                                                                | Anmerkungen                                    |
| :------------- | :------- | :---------------------------------------------------------------------------------------------------------- | :--------------------------------------------- |
| `battAlias`    | String   | Ein Alias oder eine Kennung für einen Batterietyp oder eine Produktgruppe (z.B. "Batt_11", "Batt_20").          | Zentrales Filterkriterium.                   |
| `country`      | String   | Name des Landes.                                                                                            |                                                |
| `continent`    | String   | Name des Kontinents.                                                                                        | Kann als Filter verwendet werden.              |
| `climate`      | String   | Klimaklassifizierung für die Region (z.B. "normal", "coldland", "hotland").                                   | Kann als Filter verwendet werden.              |
| `iso_a3`       | String   | ISO 3166-1 Alpha-3 Ländercode (z.B. "SWE", "DEU", "CHN").                                                     | Wichtig für die Kartendarstellung (Plotly).    |
| `model_series` | String   | Eine Kennung für eine Modellserie (z.B. "295", "247", "all").                                                  | Kann als Filter verwendet werden.              |
| `var`          | String   | Name der Variable oder des KPIs (z.B. "variable_1", "variable_10"). Jede Zeile repräsentiert einen KPI-Wert. | Zentral für die Auswahl der darzustellenden Metrik. |
| `val`          | Numeric  | Der numerische Wert für die entsprechende `var` in dieser Zeile/diesem Kontext.                               | Hauptmetrik zur Visualisierung.             |
| `descr`        | String   | Eine Beschreibung, vermutlich bezogen auf die `var` (z.B. "Beschreibung_1", "Beschreibung_10").                |                                                |
| `cnt_vhcl`     | Integer  | Vermutlich die Anzahl der Fahrzeuge ("Count Vehicles") in diesem Kontext/dieser Zeile.                        | Alternative Metrik zur Visualisierung.         |

## Bekannte Probleme / Besonderheiten

* **Fehlende Werte:** Einige Zeilen enthalten fehlende Informationen, insbesondere bei `continent`, `climate`, `iso_a3` (z.B. für Länder wie "Malta", "Singapore" oder den Eintrag "Unknown" bei `country`). Dies muss bei der Datenverarbeitung und Visualisierung berücksichtigt werden (z.B. durch Herausfiltern oder spezielle Behandlung).
* **Datenformat ("Long Format"):** Die Daten liegen im "Long Format" vor, d.h., verschiedene KPIs für dieselbe Entität (z.B. Land + battAlias) stehen in separaten Zeilen mit unterschiedlichen `var`-Werten. Dies ist gut für die Filterung nach `var`, erfordert aber ggf. Aggregation oder Selektion im Frontend/Backend für bestimmte Ansichten.
