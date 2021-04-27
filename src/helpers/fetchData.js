import axios from 'axios';
import {WEATHER_API_KEY, BASE_URL} from './keys';

const makeRequest = async (url) => {
  const request = axios.get(url);
  const response = await request;
  return response;
}

export const getWeatherFromCoords = (lat, lon) => {
  const url = `${BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${WEATHER_API_KEY}`;
  return makeRequest(url);
}

export const  getLocationFromCoords = async (lat, lon) => {
  const url = `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`;
  return makeRequest(url);
};

export const getLocationListFromInput = async (input) => {
  const url = `${BASE_URL}/geo/1.0/direct?q=${input}&limit=5&appid=${WEATHER_API_KEY}`;
  return makeRequest(url);
};
