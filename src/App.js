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
  const [selectedCountry, setSelectedCountry] = useState('Worldwide');
  const [selectedTallyType, setSelectedTallyType] = useState('confirmed');
  const [zeroDayMode, setZeroDayMode] = useState(false);
  const [logarithmicMode, setLogarithmicMode] = useState(false);
  const [growthRateMode, setGrowthRateMode] = useState(false);

  useEffect(() => {
    if (covidCountries && !selectedCountry) setSelectedCountry(covidCountries[0]);
  }, [selectedCountry, covidCountries]);

  const lineConfig = {
    width: window.innerWidth - 20,
    height: 400,
    margin: { top: 20, right: 20, bottom: 60, left: 80},
    animate: true,
    enableSlices: 'x',
    enableArea: true,
    xScale: {
      type: 'time',
      format: '%Y-%m-%d',
      precision: 'day'
    },
    yScale: logarithmicMode ? {
      type: 'log',
      base: 10,
    } : { type: 'linear' },
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
          data={prepareData({
            data: covidData,
            selectedCountry,
            selectedTallyType,
            zeroDayMode,
            growthRateMode
          })}
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
        Zero Day Mode
        <input
          type="checkbox"
          onChange={event => {
            !event.target.checked && setLogarithmicMode(false);
            setZeroDayMode(event.target.checked)
          }}
          value={zeroDayMode}
        />
        Logarithmic
        <input
          type="checkbox"
          disabled={!zeroDayMode}
          onChange={event => {
            setLogarithmicMode(event.target.checked)
          }}
          value={logarithmicMode}
        />
        Growth Rate
        <input
          type="checkbox"
          onChange={event => {
            setGrowthRateMode(event.target.checked)
          }}
          value={growthRateMode}
        />
        </>
      )}
    </div>
  );
}

function prepareData({data, selectedCountry, selectedTallyType, zeroDayMode, growthRateMode}) {
  function getY(datum, index) {
    if (!growthRateMode) {
      return datum[selectedTallyType];
    }

    if (index < 1) {
      return 0;
    }

    const previousDay = data[selectedCountry][index - 1];

    if (!previousDay) {
      return datum[selectedTallyType];
    }

    return (datum[selectedTallyType] - (previousDay[selectedTallyType] || 0)) / (previousDay[selectedTallyType] || 1);
  }

  return [{
    id: selectedCountry,
    data: data[selectedCountry].map((datum, index) => ({
      x: datum.date,
      y: getY(datum, index)
    })).filter(({y}) => !zeroDayMode || y > 0)
  }]}

export default App;
