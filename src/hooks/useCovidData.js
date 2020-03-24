import { useState, useEffect } from 'react';

function transpose(array) {
  return array[0].map((col, i) => array.map(row => row[i]));
}

function aggregateDay(day) {
  return day.reduce((acc, el) => ({
    ...acc,
    confirmed: acc.confirmed + el.confirmed,
    deaths: acc.deaths + el.deaths,
    recovered: acc.recovered + el.recovered,
  }), {
    date: day[0].date,
    confirmed: 0,
    deaths: 0,
    recovered: 0,
  });
}

export function useCovidData() {
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

  if (!covidData) {
    return [null, null];
  }

  const Worldwide = transpose(Object.values(covidData))
    .map(aggregateDay);

  return [
    {
      Worldwide,
      ...covidData,
    },
    covidData ? ['Worldwide', ...Object.keys(covidData).sort()] : null
  ];
}

