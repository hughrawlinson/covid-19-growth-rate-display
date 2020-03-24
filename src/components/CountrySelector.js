import React from 'react';
import Select from 'react-select';

export function CountrySelector({countries, selectedCountry, setSelectedCountry}) {
  return <Select
    options={countries.map(country => ({value: country, label: country}))}
    onChange={value => {
      setSelectedCountry(value.value)
    }}
    value={{
      value: selectedCountry,
      label: selectedCountry,
    }}
  />;
}
