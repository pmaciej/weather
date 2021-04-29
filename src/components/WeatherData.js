import React, {useContext} from 'react';
import convertKelvinTemp from '../helpers/convertKelvins';
import Context from '../Context';
import Weather from './Weather';

const WeatherData = (day) => {

  const {location} = useContext(Context);
  const {
    temp: {min: tempMin, max: tempMax},
    weather: [{icon, description}],
    dt,
    wind_speed,
  } = day.day;


  const convertedDate = new Date(dt * 1000);
  const date = convertedDate.toISOString().slice(0, 10);
  const dayName = convertedDate.toLocaleString('en-us', {weekday: 'long'});
  const tempData = convertKelvinTemp(tempMin, tempMax);

  return (
    <Weather
      tempData={tempData}
      windSpeed={wind_speed}
      icon={icon}
      description={description}
      date={date}
      dayName={dayName}
      location={location}
      index={day.index}
    />
  );
};

export default WeatherData;
