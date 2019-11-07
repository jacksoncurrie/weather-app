import React from "react";
import Unsplash from "unsplash-js";
import "./App.css";

const unsplash = new Unsplash({
  applicationId: "b564c9e1c812ab8af76d47abe7031f1acf82c87adfb486025fecb84f6252ea14",
  secret: "2094838e590ea5496f25152e86dce356e7f498aa63f33218768bf002b48ee9ba"
});

const WeatherApiKey = "c3f026dd0dd061ca6e0316792f68400e";

class App extends React.Component {
  state = {
    city: "",
    country: "",
    icon: "",
    temp: "",
    weather: "",
    dateTime: "",
    cityImage: "",
    imgUrl: "",
    userReference: "",
    userReferenceUrl: ""
  };

  refreshData = async () => {
    let value = this.state.city;
    await this.searchCity(value);
  };

  searchData = async () => {
    let value = document.querySelector("#search").value;
    await this.searchCity(value);
  };

  fetchWeatherData = async value => {
    let res = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&APPID=${WeatherApiKey}`
    );
    return await res.json();
  };

  fetchImageData = async value => {
    let image = await unsplash.search.photos(value, 1);
    image = await image.json();
    let randomNumber = Math.floor(Math.random() * 10);
    return image.results[randomNumber];
  };

  searchCity = async value => {
    try {
      let weather = await this.fetchWeatherData(value);
      let image = await this.fetchImageData(value);
      this.setState({
        city: weather.name,
        country: weather.sys.country,
        icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
        temp: weather.main.temp,
        weather: weather.weather[0].description,
        dateTime: new Date(parseInt(weather.dt) * 1000).toString(),
        cityImage: image.urls.full,
        imgUrl: image.links.html,
        userReference: image.user.name,
        userReferenceUrl: image.user.links.html + "?utm_source=location%26weather&utm_medium=referral"
      });
    } catch {
      // City does not exist - ignore
    }
  };

  openUnsplashUrl = url => {
    try {
      // For electron
      window.shell.openExternal(url);
    }
    catch {
      // For browsers
      window.open(url);
    }
  }

  componentDidMount() {
    // When app starts load "Tauranga"
    this.searchCity("Tauranga");
  }

  render() {
    return (
      <div className="App">
        <header>
          <div>
            <label htmlFor="search">Start typing your city</label>
          </div>
          <div>
            <input
              type="text"
              name="search"
              id="search"
              onChange={this.searchData}
            />
          </div>
        </header>

        <h2>
          Weather in <span className="city-title">{this.state.city}, </span>
          <span className="country-title">{this.state.country}.</span>
        </h2>

        <div className="weather">
          <img src={this.state.icon} alt="weather icon" />
          <h3>{this.state.temp} °C</h3>
        </div>

        <p className="description">{this.state.weather}</p>

        <div className="cityImage">
          <img src={this.state.cityImage} alt="City" />
          <p className="unsplash-reference">
            Photo by&nbsp;
            <span
              className="links"
              onClick={() => this.openUnsplashUrl(this.state.userReferenceUrl)}
            >
              {this.state.userReference}
            </span>
            &nbsp;on&nbsp;
            <span
              className="links"
              onClick={() =>
                this.openUnsplashUrl(
                  "https://unsplash.com/?utm_source=location%26weather&utm_medium=referral"
                )
              }
            >
              Unsplash
            </span>
            .
          </p>
        </div>

        <footer>
          <p>
            <strong>Last updated:</strong> {this.state.dateTime}
          </p>
          <button onClick={this.refreshData}>Refresh</button>
        </footer>
      </div>
    );
  }
}

export default App;
