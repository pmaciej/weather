import React, {useState, useEffect} from 'react';

const Weather = ({location, date, dayName, tempData, icon, description, windSpeed, index}) => {
  const {
    tempMinCelsius,
    tempMaxCelsius,
    tempMinFarenheit,
    tempMaxFarenheit,
  } = tempData;


  const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  const [temp, setTemp] = useState({});
  const [click, setClick] = useState(false);
  const {name, country, state} = location;
  useEffect(() => {
    setTemp({
      minDegrees: tempMinCelsius,
      maxDegrees: tempMaxCelsius,
      description: 'Celsius',
    });
    setClick(false);
  }, [tempMinCelsius, tempMaxCelsius]);
  const onClick = () => {
    if (click === false) {
      setTemp({
        minDegrees: tempMinFarenheit,
        maxDegrees: tempMaxFarenheit,
        description: 'Farenheit',
      });
      setClick(true);
    } else {
      setTemp({
        minDegrees: tempMinCelsius,
        maxDegrees: tempMaxCelsius,
        description: 'Celsius',
      });
      setClick(false);
    }
  };

  return (
    <div className="weather-data">
      <p className="weather__tagline">
        Weather forecast for{' '}
        <span className="weather-data__city">
          <b>
            {name} {country} {state} {dayName}
          </b>{' '}
          {date}
        </span>
      </p>
      <div className="weather-data__box">
        <button className="weather-data__button" onClick={onClick}>
          {temp.description}
        </button>
        <span className="weather-data__property">
          <p className="weather-data__title">Temperature Min</p>
          <p className="weather-data__value">{temp.minDegrees}</p>
        </span>
        <span className="weather-data__property">
          <p className="weather-data__title">Temperature Max</p>
          <p className="weather-data__value">{temp.maxDegrees}</p>
        </span>
        <span className="weather-data__property">
          <p className="weather-data__title">Weather State</p>
          <p className="weather-data__value">&nbsp;</p>
          <img className="weather-data__icon" alt={description} src={iconUrl} />
        </span>
        <span className="weather-data__property">
          <p  className="weather-data__title">Wind Speed</p>
          <p  data-testid={`resolved_windSpeed_${index}`}className="weather-data__value">{windSpeed}</p>
        </span>
      </div>
    </div>
  );
};

export default Weather;
