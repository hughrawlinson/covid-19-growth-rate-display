import React from 'react';
import { useCovidData } from './hooks/useCovidData';
import { Line } from '@nivo/line';
function App() {
  const covidData = useCovidData();
  const lineConfig = {
    width: 900,
    height: 400,
    margin: { top: 20, right: 20, bottom: 60, left: 80},
    animate: true,
    enableSlices: 'x'
  }

  return (
    <div className="App">
      { covidData && (
        <Line
          curve="monotoneX"
          data={[{
            id: "US",
            data: covidData.US.map(({confirmed}, index) => ({
              x: index,
              y: confirmed
            }))
          }]}
          {...lineConfig}
        />
      )}
    </div>
  );
}

export default App;
