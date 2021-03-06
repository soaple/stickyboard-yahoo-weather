// src/YahooWeatherWidget.js

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Textfit } from 'react-textfit';
import Moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import ApiManager from './network/ApiManager';
import StatusCode from './network/StatusCode';
import YahooWeatherIconConst from './YahooWeatherIconConst';

// require('../static/css/weather-icons.min.css');

const Root = styled.div`
    height: 100%;
    background: #424242;
    border-radius: 16px;
`;

const WeatherIconTextfit = styled(Textfit)`
    width: 40%;
    height: 70%;
    position: absolute;
    left: 16px;
    top: 0;
    color: #FFFFFF;
    text-shadow: 2px 2px 30px #757575;
`;

const DateTextfit = styled(Textfit)`
    width: 60%;
    height: 30%;
    position: absolute;
    right: 16px;
    top: 16px;
    color: #FFFFFF;
    font-weight: 700;
    text-align: right;
`;

const LocationTextfit = styled(Textfit)`
    width: 10%;
    height: 10%;
    position: absolute;
    left: 16px;
    bottom: 8px;
    color: #FFFFFF;
    font-weight: 700;
`;

const TemperatureTextfit = styled(Textfit)`
    width: 60%;
    height: 40%;
    position: absolute;
    right: 16px;
    bottom: 8px;
    text-align: right;
    color: #FFFFFF;
    font-weight: 700;
    text-shadow: 2px 2px 30px #757575;
`;

const YahooAttribution = styled.a`
    position: absolute;
    right: 16px;
    bottom: 8px;
`;

class YahooWeatherWidget extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            weather: undefined,
        }
    }

    componentDidMount () {
        const { latitude, longitude } = this.props;
        this.getWeatherData(latitude, longitude);
    }

    getWeatherData = (latitude, longitude) => {
        ApiManager.getYahooWeather(latitude, longitude, this.getYahooWeatherCallback);
    }

    getYahooWeatherCallback = (statusCode, response) => {
        switch (statusCode) {
            case StatusCode.OK:
                let weather = response.current_observation.condition;
                weather.date = new Date(response.current_observation.pubDate * 1000);
                weather.location = response.location.city + ', ' + response.location.country;

                this.setState({
                    weather: weather,
                });
                break;
            default:
                break;
        }
    }

    render() {
        const { weather } = this.state;

        return (
            <Root>
                {/* Icon */}
                <WeatherIconTextfit
                    mode='single'
                    min={14}
                    max={200}
                    forceSingleModeWidth={false}>
                    <p>
                        <i className={weather !== undefined ? YahooWeatherIconConst[weather.code] : ''}/>
                    </p>
                </WeatherIconTextfit>

                {/* Date */}
                <DateTextfit
                    mode='multi'
                    min={14}
                    max={28}>
                    <p style={{marginBottom: 2}}>
                        {weather !== undefined ? Moment(weather.date).format('ddd') : '-'}
                    </p>
                    <p>
                        {weather !== undefined ? Moment(weather.date).format('YYYY/MM/DD') : '( - )'}
                    </p>
                </DateTextfit>

                {/* Location */}
                <LocationTextfit
                    mode='single'
                    min={14}
                    max={56}
                    forceSingleModeWidth={false}>
                    <FontAwesomeIcon style={{ marginRight: 8 }} icon={faMapMarkerAlt} />
                    {weather !== undefined ? weather.location : '-'}
                </LocationTextfit>

                {/* Temperature */}
                <TemperatureTextfit
                    mode='single'
                    min={28}
                    max={200}
                    forceSingleModeWidth={false}>
                    <p>
                        {weather !== undefined ? weather.temperature + '°C' : '-°C'}
                    </p>
                </TemperatureTextfit>

                <YahooAttribution href='https://www.yahoo.com/?ilc=401' target='_blank'>
                    <img
                        src='https://poweredby.yahoo.com/purple.png'
                        width='134'
                        height='29' />
                </YahooAttribution>
            </Root>
        )
    }
}

export default YahooWeatherWidget;
