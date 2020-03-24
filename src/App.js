import React, { useState, useEffect } from 'react';
import { useCovidData } from './hooks/useCovidData';
import { CountrySelector } from './components/CountrySelector';
import Select from 'react-select';
import { Line } from '@nivo/line';

const TALLY_TYPES = [{
  value: "confirmed",
  label: "Confirmed"
},{
  value: "deaths",
  label: "Deaths"
},{
  value: "recovered",
  label: "Recovered"
}]

function App() {
  const [covidData, covidCountries] = useCovidData();
  const [selectedCountry, setSelectedCountry] = useState('Afghanistan');
  const [selectedTallyType, setSelectedTallyType] = useState('confirmed');
  const [zeroDayMode, setZeroDayMode] = useState(false);

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
            data: covidData[selectedCountry].map((datum, index) => ({
              x: datum.date,
              y: datum[selectedTallyType]
            })).filter(({y}) => !zeroDayMode || y > 0)
          }]}
          {...lineConfig}
        />
        <CountrySelector
          countries={covidCountries}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
        <Select
          options={TALLY_TYPES}
          value={TALLY_TYPES.find(tallyType => tallyType.value === selectedTallyType)}
          onChange={tallyType => setSelectedTallyType(tallyType.value)}
        />
        <input
          type="checkbox"
          onChange={event => {
            setZeroDayMode(event.target.value)
          }}
          value={zeroDayMode}
        />
        </>
      )}
    </div>
  );
}

export default App;
