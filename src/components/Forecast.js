// Libraries
import React, { Component } from 'react';
import Clock from 'react-clock';
import moment from 'moment-timezone';
import socketIOClient from "socket.io-client";

class Forecast extends Component {
  
  state = {
    date: new Date(),
    forecasts: [],
    endpoint: process.env.API_URL || "http://localhost:3030",
    clock_sincronized: false,
    interval: new Object(),
    clock_width: 150
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);

    socket.on("forecast", data => {
      data = JSON.parse(data);

      // When the request success
      if(data.success) {

        // I need to set the date
        if(!this.state.date) {
          this.setState({ date: data.timestamp });
        }

        // I just need to update the temperature because the time rests
        this.setState({ forecasts: data.forecasts });
        
        // When the interval exists, we clear
        if(this.state.interval) {
          clearInterval(this.state.interval);  
        }
        // We set the update each 1 second
        this.setState({ interval: setInterval(() => {
            this.setState({ forecasts: data.forecasts, date: moment(this.state.date).add(1, "second") });
          }, 1000) });
        
        // The request was failed, we need to try again
        } else {
        }
      
        this.setState({clock_width: document.getElementsByClassName("clock-container")[0].clientWidth/2.2});
    });
  }

  transformWeatherIcon(icon) {
    switch(icon) {
      case "clear-day":
        return "wi-day-sunny";
      case "clear-night":
        return "wi-night-clear";
      case "rain":
        return "wi-rain";
      case "snow":
        return "wi-snow";
      case "sleet":
        return "wi-sleet";
      case "wind":
        return "wi-windy";
      case "fog":
        return "wi-day-fog";
      case "cloudy":
        return "wi-cloudy";
      case "partly-cloudy-day":
        return "wi-day-cloudy";
      case "partly-cloudy-night":
        return "wi-night-cloudy"; 
      case "hail":
        return "wi-day-hail";
      case "thunderstorm":
        return "wi-day-thunderstorm";
      case "tornado":
      return "wi-tornado";
      default:
        return "";
    }
  }

  render() {
    var _this = this;
    return (
      <div>
        {this.state.forecasts.map(function(forecast, index){
          return <div className="clock-container" key={forecast.name}>
            <Clock renderNumbers={true} size={_this.state.clock_width} value={new Date(moment.tz(_this.state.date, 'UTC').tz(forecast.timezone).format('YYYY/MM/DD HH:mm:ss'))}/>
            <h2>{moment.tz(_this.state.date, 'UTC').tz(forecast.timezone).format('HH:mm:ss A')}</h2>
            <h3>{forecast.name}</h3>
            <h4><i className={`wi ${_this.transformWeatherIcon(forecast.icon)}`}></i> {Math.round(forecast.temperature.celcius)}º</h4>
          </div>;
        })}
      </div>
    );
  }
}

export default Forecast;
