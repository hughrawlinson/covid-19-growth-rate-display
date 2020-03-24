import React from 'react';
import { useCovidData } from './hooks/useCovidData';

function App() {
  const covidData = useCovidData();

  console.log(covidData);

  return (
    <div className="App">
    </div>
  );
}

export default App;
