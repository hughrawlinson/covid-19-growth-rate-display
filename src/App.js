import React, {useState, useEffect} from 'react';

function useCovidData() {
  const COVID_DATA_URL = "https://pomber.github.io/covid19/timeseries.json";
  const [covidData, setCovidData] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    fetch(COVID_DATA_URL).then(res => res.json()).then(data => {
      if (isCurrent) setCovidData(data);
    });
    return () => {
      isCurrent = false;
    };
  }, []);

  return covidData
}

function App() {
  const covidData = useCovidData();

  console.log(covidData);

  return (
    <div className="App">
    </div>
  );
}

export default App;
