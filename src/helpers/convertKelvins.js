const convertKelvinTemp = (min, max) => {
  const tempMinCelsius = parseInt(min - 273.15);
  const tempMaxCelsius = parseInt(max - 273.15);
  const tempMinFarenheit = (tempMinCelsius * 9) / 5 + 32;
  const tempMaxFarenheit = (tempMaxCelsius * 9) / 5 + 32;
  return {tempMinCelsius: tempMinCelsius, tempMaxCelsius, tempMinFarenheit, tempMaxFarenheit};
};

export default convertKelvinTemp;