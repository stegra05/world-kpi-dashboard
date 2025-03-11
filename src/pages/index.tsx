import { useEffect, useState } from 'react';
import Head from 'next/head';
import MapChart from '../components/MapChart';
import CountryInfo from '../components/CountryInfo';
import DataFilter from '../components/DataFilter';
import { parseData, KPIData } from '../utils/dataParser';

export default function Home() {
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<string>('variable_1');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/world_kpi_anonym.txt');
        const text = await response.text();
        const parsedData = parseData(text);
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
        <MapChart 
          data={kpiData} 
          selectedVariable={selectedVariable}
          onCountrySelect={handleCountrySelect} 
        />
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