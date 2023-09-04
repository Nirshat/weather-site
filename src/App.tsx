import { useState, useEffect } from "react";
import "./App.css";

interface LocDataRef {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

interface WeatherDataRef {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
    }
  ];
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  wind: {
    speed: number;
  };
  timezone: number;
  name: string;
}

const App = () => {
  // const defaultLoc = [
  //   {
  //     name: "Manila",
  //     lat: 14.5948914,
  //     lon: 120.9782618,
  //     country: "PH",
  //   },
  // ];

  const [input, setInput] = useState("");
  const [location, setLocation] = useState<LocDataRef[]>([]);
  const [theweather, setTheWeather] = useState<WeatherDataRef | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Define a function to fetch weather data
  const fetchWeatherData = (lat: number, lon: number) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e7df953505cf0a9d0a1f201bf5fdb9c2`
    )
      .then((res) => res.json())
      .then((weatherData: WeatherDataRef) => {
        setTheWeather(weatherData);
      })
      .catch((error) => {
        console.error("Failed fetching weather data: ", error);
      });
  };

  useEffect(() => {
    // Make an initial API request when the component mounts
    fetch(
      "https://api.openweathermap.org/geo/1.0/direct?q=Manila&limit=1&appid=e7df953505cf0a9d0a1f201bf5fdb9c2"
    )
      .then((response) => response.json())
      .then((data: LocDataRef[]) => {
        if (data.length > 0) {
          setLocation(data);

          let lat = 0;
          let lon = 0;
          data.map((loc) => ((lat = loc.lat), (lon = loc.lon)));
          fetchWeatherData(lat, lon);
        } else {
          setLocation([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed fetching data.", error);
        setIsLoading(false);
      });
  }, []);

  // Make an API request when the button is clicked

  const getWeather = (lat: number, lon: number) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e7df953505cf0a9d0a1f201bf5fdb9c2`
    )
      .then((res) => res.json())
      .then((weatherData: WeatherDataRef) => {
        setTheWeather(weatherData);
        console.log(theweather);
      })
      .catch((error) => {
        console.error("Failed fetching weather data: ", error);
      });
  };

  const getLocation = () => {
    try {
      if (input !== "") {
        setIsLoading(true);
        setTimeout(() => {
          fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=e7df953505cf0a9d0a1f201bf5fdb9c2`
          )
            .then((response) => response.json())
            .then((data: LocDataRef[]) => {
              if (data.length > 0) {
                setLocation(data);

                let lat = 0;
                let lon = 0;
                data.map((loc) => ((lat = loc.lat), (lon = loc.lon)));
                getWeather(lat, lon);
              } else {
                setLocation([]);
              }
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Failed fetching data.", error);
            });
        }, 2000);
      } else {
        alert("Please input a location.");
      }
    } catch (error) {
      console.error("Failed fetching api");
    }
  };

  // const specLocation = location.filter((loc) => loc.name === input);

  return (
    <>
      <div className="app-body">
        <div className="headerline">
          <h2>Minimal <span id="wthr">Weather Site</span></h2>
        </div>
        <br />
        <div className="searchbox">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Enter Location..."
          />
          <button onClick={getLocation}>Search</button>
        </div>

        {isLoading == true ? (
          <div className="is-loading"> Loading... </div>
        ) : (
          <div className="data-box">
            {location.length > 0 ? (
              location.map((loc, index) => (
                <div key={index}>
                  <div className="main-info-box">
                    <div className="loc-stat-box">
                      <div className="locbox">
                        <div className="location">{loc.name}</div>
                        <span className="country">{loc.country}</span>
                      </div>
                      {theweather?.weather.map((weather, index) => (
                        <div className="status" key={index}>
                          <span id="">{weather.main+" "}</span>
                          <span style={{fontSize:'14px', color:'#999', fontWeight:'100'}}>({weather.description}) </span>
                        </div>
                      ))}
                    </div>

                    <div id="gapline"></div>

                    <div id="main-temp">
                      {theweather?.main.temp
                        ? (theweather.main.temp - 273.15).toFixed() + "°C"
                        : "N/A"}
                    </div>
                  </div>
                  <br />
                  <div className="temps">
                    <div>
                      <span id="minmax-label">Min Temp.  : </span> <br />
                      <span id="min-max-temp">
                        {theweather?.main.temp_min
                          ? (theweather.main.temp_min - 273.15).toFixed(1) + "°C"
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span id="minmax-label">Max Temp.  : </span> <br />
                      <span id="min-max-temp">
                        {theweather?.main.temp_max
                          ? (theweather.main.temp_max - 273.15).toFixed(1) + "°C"
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="zero-found"> No Location found. </div>
            )}
          </div>
        )}

        <br />
        <div className="footerline">
          <span id="credits"> Made with 💚 by Aron Paul Gonzales </span>
          <span id="techs"> React + TypeScript + Vanilla CSS </span>
        </div>
      </div>
    </>
  );
};

export default App;
