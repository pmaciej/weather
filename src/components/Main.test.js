import React from "react";
import { render, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axiosMock from "axios";
import Main from "./Main";


it("fetchuje i wyswietla dane wewnatrz useEffect", async () => {
  // Mockuje geolokacje
const mockGeolocation = {
  getCurrentPosition: jest.fn()
    .mockImplementationOnce((success) => Promise.resolve(success({
      coords: {
        latitude: 51.1,
        longitude: 45.3
      }
    })))
};
global.navigator.geolocation = mockGeolocation;
  // Co ma zwrocic axios gdy 'get' jest wykonany
  axiosMock.get.mockResolvedValueOnce({data:{daily:{test:"some fetched weather data"}}});
  axiosMock.get.mockResolvedValueOnce({ data: {} });

  // Renderuje moj komponent main i destrukturyzuje funkcje getTestId zeby znalezc poszczegolne elementy
  const { getByTestId } = render(<Main />);

// prawidlowe urle ktore zawieraja koordynaty zmockowane w geolokacji 
const weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=51.1&lon=45.3&exclude={part}&appid=73c0982abf0e86dcf74fc6c59c74b8f0";
const locationUrl = "https://api.openweathermap.org/geo/1.0/reverse?lat=51.1&lon=45.3&limit=1&appid=73c0982abf0e86dcf74fc6c59c74b8f0"


  // Podczas pierwszego rendera oczekujemy "Loading testing data..."
  expect(getByTestId("loading")).toHaveTextContent("Loading testing data...");

  //  po pierwszym renderze wykonuje sie axios w useEffect wiec czekamy na ten element ktory ma zostac nastepnie wyrenderowany
  const resolvedSpan = await waitForElement(() => getByTestId("resolved"));

  // sprawdzamy czy resolvedSpan zawiera odpowiednie dane
  expect(resolvedSpan).toHaveTextContent("some fetched weather data");
  // sprawdzamy czy axios odpalil sie odpowiednia liczbe razy
  expect(axiosMock.get).toHaveBeenCalledTimes(2);
  // sprawdzamy czy odpalil sie tez z odpowiednimi urlami
  expect(axiosMock.get).toHaveBeenCalledWith(weatherUrl)
  expect(axiosMock.get).toHaveBeenCalledWith(locationUrl)
});