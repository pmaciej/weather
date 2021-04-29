import React, {useState, useReducer, useEffect} from 'react';
import {debounce} from 'lodash';
import Context from '../Context';
import Header from './Layout/Header';
import Content from './Layout/Content';
import Tagline from './Tagline';
import WeatherSearch from './WeatherSearch';
import WeatherData from './WeatherData';
import Error from './Error';
import Footer from './Layout/Footer';
import {getWeatherFromCoords, getLocationFromCoords, getLocationListFromInput} from '../helpers/fetchData';
import {NUMBER_OF_DAYS_TO_DISPLAY} from '../helpers/keys.js';
import getValueFromLocation from '../helpers/getValueFromLocation';

const localStorageName = 'Last Session Coordinates';

const Main = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [locationList, setLocationList] = useState(null);
  const [location, setLocation] = useState(null);


  useEffect(() => {
    if (localStorage.getItem(localStorageName) === null) {
      navigator.geolocation.getCurrentPosition((position) => {
        getWeatherFromCoords(
          position.coords.latitude,
          position.coords.longitude
        ).then((response) => setWeather(response.data.daily));
        getLocationFromCoords(
          position.coords.latitude,
          position.coords.longitude
        ).then((response) => setLocation(response.data[0]));
      });
    } else {
      const lastSession = JSON.parse(
        localStorage.getItem(localStorageName)
      );
      getWeatherFromCoords(
        lastSession.latitude,
        lastSession.longitude
      ).then((response) => setWeather(response.data.daily));
      setLocation(lastSession);
    }
  }, []);

  const selectOption = debounce((input) => {
    if (!locationList) {
      getLocationListFromInput(input).then((response) => {
        if (response.data.length){
         setLocationList(response.data)
         setError(null)
        } else {
          setError('Could not find location');
          setLocationList(null)
        } 
      }).catch(() => setError('Could not find location')); 
    }
    
    if (locationList) {
      const newLocation = locationList.find(
        (location) => input === getValueFromLocation(location)
      );

      if (newLocation) {
        getWeatherFromCoords(
          newLocation.lat,
          newLocation.lon
        ).then((response) => setWeather(response.data.daily));
        setLocation(newLocation);
        localStorage.setItem(
          localStorageName,
          JSON.stringify({
            latitude: newLocation.lat,
            longitude: newLocation.lon,
            name: newLocation.name,
            country: newLocation.country,
            state: newLocation.state,
          })
        );
      }
      setLocationList(null);
    }
  }, 1000);





  return (
    <div className="main">
      <Header />
      <Content>
        <Context.Provider
          value={{
            location,
            weather,
            locationList,
            selectOption
          }}
        >
          <Tagline />
          <WeatherSearch />
          <Error error={error} />
          {!weather &&  <h1 data-testid="loading">Loading Data...</h1>}
          {weather &&
            location !== null &&
            location !== undefined && 
            weather.slice(0, NUMBER_OF_DAYS_TO_DISPLAY).map((item, index) => {
              return <WeatherData key={index} day={item} index={index} />;
            })}
        </Context.Provider>
        <Footer />
      </Content>
    </div>
  );
};

export default Main;

