import React, { useState, useEffect } from 'react';
import { useCovidData } from './hooks/useCovidData';
import { CountrySelector } from './components/CountrySelector';
import { Line } from '@nivo/line';

function App() {
  const [covidData, covidCountries] = useCovidData();
  const [selectedCountry, setSelectedCountry] = useState('Afghanistan');

  useEffect(() => {
    if (covidCountries && !selectedCountry) setSelectedCountry(covidCountries[0]);
  }, [selectedCountry, covidCountries]);

  const lineConfig = {
    width: 900,
    height: 400,
    margin: { top: 20, right: 20, bottom: 60, left: 80},
    animate: true,
    enableSlices: 'x',
    xScale: {
      type: 'time',
      format: '%Y-%m-%d',
      precision: 'day'
    },
    axisBottom: {
      format: '%b %d',
      tickValues: 'every 7 days',
      legend: 'time scale',
      legendOffset: -12
    }
  }

  return (
    <div className="App">
      { covidData && (
        <>
        <Line
          curve="monotoneX"
          data={[{
            id: selectedCountry,
            data: covidData[selectedCountry].map(({date, confirmed}, index) => ({
              x: date,
              y: confirmed
            }))
          }]}
          {...lineConfig}
        />
        <CountrySelector
          countries={covidCountries}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
        </>
      )}
    </div>
  );
}

export default App;
