import React, {useContext} from 'react';
import Context from '../Context';
import getValueFromLocation from '../helpers/getValueFromLocation';

const WeatherSearch = () => {
  const {selectOption, locationList} = useContext(Context);

  return (
    <div className="weather-search">
      <div className="weather-search__form">
        <input
          onChange={(event) => selectOption(event.target.value)}
          autoComplete="off"
          name="city"
          className="weather-search__input"
          type="text"
          list="cityname"
        />
        <datalist id="cityname">
          {locationList
            ? locationList.map((item, index) => {
                return (
                  <option
                    key={index}
                    value={getValueFromLocation(item)}
                  ></option>
                );
              })
            : null}
        </datalist>
        <div className="weather-search__submit"></div>
      </div>
    </div>
  );
};

export default WeatherSearch;
