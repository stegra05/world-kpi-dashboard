import { useEffect, useState } from 'react';
import Head from 'next/head';
import MapChart from '../components/MapChart';
import CountryInfo from '../components/CountryInfo';
import DataFilter from '../components/DataFilter';
import { parseData, KPIData } from '../utils/dataParser';

// Sample data for testing
const SAMPLE_DATA = `battAlias;country;continent;climate;iso_a3;model_series;var;val;descr;cnt_vhcl
Batt_11;Sweden;Europe;coldland;SWE;295;variable_1;2517;Beschreibung_1;2517
Batt_11;Germany;Europe;normal;DEU;247;variable_1;26396;Beschreibung_1;26396
Batt_11;Romania;Europe;normal;ROU;247;variable_1;228;Beschreibung_1;228
Batt_11;China;Asia;normal;CHN;295;variable_1;15961;Beschreibung_1;15961
Batt_11;Belgium;Europe;normal;BEL;214;variable_1;387;Beschreibung_1;387
Batt_11;Argentina;South America;normal;ARG;253;variable_1;38;Beschreibung_1;38
Batt_11;Finland;Europe;coldland;FIN;205;variable_1;701;Beschreibung_1;701
Batt_11;Canada;North America;coldland;CAN;296;variable_1;1084;Beschreibung_1;1084
Batt_11;Finland;Europe;coldland;FIN;293;variable_1;465;Beschreibung_1;465
Batt_11;Korea (South);Asia;normal;KOR;297;variable_1;3073;Beschreibung_1;3073
Batt_11;USA;North America;normal;USA;167;variable_1;4862;Beschreibung_1;4862
Batt_11;United Kingdom of Great Britain and Northern Ireland;Europe;normal;GBR;167;variable_1;3814;Beschreibung_1;3814
Batt_11;France;Europe;normal;FRA;453;variable_1;11670;Beschreibung_1;11670`;

export default function Home() {
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<string>('variable_1');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        console.log('Fetching data...');
        let data;
        
        try {
          // First try to load from file
          const response = await fetch('/world_kpi_anonym.txt');
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
          }
          data = await response.text();
        } catch (fetchError) {
          console.warn('Error fetching from file, using sample data', fetchError);
          // Fall back to sample data
          data = SAMPLE_DATA;
        }
        
        console.log('Data fetched, parsing...');
        const parsedData = parseData(data);
        console.log(`Parsed ${parsedData.length} data points`);
        setKpiData(parsedData);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  const handleVariableChange = (variable: string) => {
    setSelectedVariable(variable);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading data...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>World KPI Dashboard</title>
        <meta name="description" content="World KPI Dashboard visualization" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold mb-6 text-center">World KPI Dashboard</h1>
      
      <DataFilter 
        selectedVariable={selectedVariable} 
        onVariableChange={handleVariableChange} 
      />
      
      <div className="mt-6 mb-8">
        {kpiData.length > 0 ? (
          <MapChart 
            data={kpiData} 
            selectedVariable={selectedVariable}
            onCountrySelect={handleCountrySelect} 
          />
        ) : (
          <div className="text-center text-red-500">No data available to display on the map</div>
        )}
      </div>

      {selectedCountry && (
        <CountryInfo 
          data={kpiData} 
          countryCode={selectedCountry} 
          selectedVariable={selectedVariable}
        />
      )}
    </div>
  );
} 