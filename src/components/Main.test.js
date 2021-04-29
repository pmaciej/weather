import React from 'react';
import {render, waitForElement} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axiosMock from 'axios';
import Main from './Main';

it('fetchuje wewnatrz useEffect i wyswietla poprawne dane w dokumencie', async () => {
  // Mockuje geolokacje
  const mockGeolocation = {
    getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
      Promise.resolve(
        success({
          coords: {
            latitude: 51.1,
            longitude: 45.3,
          },
        })
      )
    ),
  };
  global.navigator.geolocation = mockGeolocation;

  // Co ma zwrocic axios gdy 'get' jest wykonany

  // fake dane pogody z 3 dni
  axiosMock.get.mockResolvedValueOnce({
    data: {
      daily: [
        {
          dt: 1619694000,
          sunrise: 1619670947,
          sunset: 1619723979,
          moonrise: 1619737080,
          moonset: 1619675940,
          moon_phase: 0.59,
          temp: {
            day: 283.84,
            min: 276.22,
            max: 284.28,
            night: 279.13,
            eve: 283.9,
            morn: 276.22,
          },
          feels_like: {day: 282.04, night: 272.99, eve: 282.26, morn: 272.99},
          pressure: 1012,
          humidity: 41,
          dew_point: 271.37,
          wind_speed: 4.79,
          wind_deg: 3,
          wind_gust: 9.84,
          weather: [
            {id: 500, main: 'Rain', description: 'light rain', icon: '10d'},
          ],
          clouds: 72,
          pop: 0.32,
          rain: 0.59,
          uvi: 3.37,
        },
        {
          dt: 1619780400,
          sunrise: 1619757233,
          sunset: 1619810479,
          moonrise: 0,
          moonset: 1619764800,
          moon_phase: 0.63,
          temp: {
            day: 284.55,
            min: 276.06,
            max: 286.01,
            night: 280.7,
            eve: 285.24,
            morn: 276.06,
          },
          feels_like: {day: 282.74, night: 274.69, eve: 283.5, morn: 274.69},
          pressure: 1015,
          humidity: 38,
          dew_point: 270.89,
          wind_speed: 2.58,
          wind_deg: 29,
          wind_gust: 5.15,
          weather: [
            {
              id: 802,
              main: 'Clouds',
              description: 'scattered clouds',
              icon: '03d',
            },
          ],
          clouds: 39,
          pop: 0.58,
          uvi: 4.54,
        },
        {
          dt: 1619866800,
          sunrise: 1619843521,
          sunset: 1619896978,
          moonrise: 1619827980,
          moonset: 1619854440,
          moon_phase: 0.67,
          temp: {
            day: 286.27,
            min: 277.83,
            max: 287.08,
            night: 280.65,
            eve: 284.2,
            morn: 277.83,
          },
          feels_like: {day: 284.68, night: 277.83, eve: 283.08, morn: 277.83},
          pressure: 1015,
          humidity: 40,
          dew_point: 273.25,
          wind_speed: 2.11,
          wind_deg: 87,
          wind_gust: 3.02,
          weather: [
            {id: 500, main: 'Rain', description: 'light rain', icon: '10d'},
          ],
          clouds: 10,
          pop: 1,
          rain: 4.29,
          uvi: 4.64,
        },
      ],
    },
  });

  // fake dane lokalizacji
  axiosMock.get.mockResolvedValueOnce({
    data: [
      {
        name: 'London',
        local_names: {
          af: 'Londen',
          ar: 'لندن',
          ascii: 'London',
          az: 'London',
          bg: 'Лондон',
          ca: 'Londres',
          da: 'London',
          de: 'London',
          el: 'Λονδίνο',
          en: 'London',
          eu: 'Londres',
          fa: 'لندن',
          feature_name: 'London',
          fi: 'Lontoo',
          fr: 'Londres',
          gl: 'Londres',
          he: 'לונדון',
          hi: 'लंदन',
          hr: 'London',
          hu: 'London',
          id: 'London',
          it: 'Londra',
          ja: 'ロンドン',
          la: 'Londinium',
          lt: 'Londonas',
          mk: 'Лондон',
          nl: 'Londen',
          no: 'London',
          pl: 'Londyn',
          pt: 'Londres',
          ro: 'Londra',
          ru: 'Лондон',
          sk: 'Londýn',
          sl: 'London',
          sr: 'Лондон',
          th: 'ลอนดอน',
          tr: 'Londra',
          vi: 'Luân Đôn',
          zu: 'ILondon',
        },
        lat: 51.5085,
        lon: -0.1257,
        country: 'GB',
      },
    ],
  });

  // prawidlowe urle ktore zawieraja koordynaty zmockowane w geolokacji
  const weatherUrl =
    'https://api.openweathermap.org/data/2.5/onecall?lat=51.1&lon=45.3&exclude={part}&appid=73c0982abf0e86dcf74fc6c59c74b8f0';
  const locationUrl =
    'https://api.openweathermap.org/geo/1.0/reverse?lat=51.1&lon=45.3&limit=1&appid=73c0982abf0e86dcf74fc6c59c74b8f0';

  // renderuje moj komponent main i destrukturyzuje funkcje getTestId zeby znalezc moje testowe id
  const {getByTestId} = render(<Main />);

  // sprawdzam czy podczas pierwszego renderu pojawi sie div z teskstem loading
  expect(getByTestId('loading')).toHaveTextContent('Loading Data...');

  //  po pierwszym renderze w useEffect wykonuje sie axios wiec czekamy na elementy z testowymi id (predkosc wiatru w komponencie Weather) ktore maja zostac nastepnie wyrenderowane
  const wind_speed_first_value = await waitForElement(() =>
    getByTestId('resolved_windSpeed_0')
  );
  const wind_speed_second_value = await waitForElement(() =>
    getByTestId('resolved_windSpeed_1')
  );
  const wind_speed_third_value = await waitForElement(() =>
    getByTestId('resolved_windSpeed_2')
  );

  // sprawdzam czy axios odpalil sie odpowiednia liczbe razy
  expect(axiosMock.get).toHaveBeenCalledTimes(2);
  // sprawdzam czy odpalil sie tez z odpowiednimi urlami
  expect(axiosMock.get).toHaveBeenCalledWith(weatherUrl);
  expect(axiosMock.get).toHaveBeenCalledWith(locationUrl);

  // sprawdzam czy testowe idki zawieraja odpowiednie dane
  expect(wind_speed_first_value).toHaveTextContent('4.79');
  expect(wind_speed_second_value).toHaveTextContent('2.58');
  expect(wind_speed_third_value).toHaveTextContent('2.11');

  // sprawdzam czy dane z idkow pasuja do snapshotow
  expect(wind_speed_first_value).toMatchSnapshot();
  expect(wind_speed_second_value).toMatchSnapshot();
  expect(wind_speed_third_value).toMatchSnapshot();
});
