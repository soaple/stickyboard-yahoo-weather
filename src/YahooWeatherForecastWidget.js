// src/YahooWeatherForecastWidget.js

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Moment from 'moment-timezone';
import { Textfit } from 'react-textfit';

import { BarChart } from '@stickyboard/recharts';

import ApiManager from './network/ApiManager';
import StatusCode from './network/StatusCode';
import YahooWeatherIconConst from './YahooWeatherIconConst';

const Root = styled.div`
    height: 100%;
    padding: 16px 8px;
`;

const TitleTextfit = styled(Textfit)`
    margin: 'auto';
    text-align: 'center';
`;

class YahooWeatherForecastWidget extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            location: undefined,
            weatherForecastList: [],
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
                let location = response.location.city + ', ' + response.location.country;

                let weatherForecastList = response.forecasts;
                weatherForecastList.forEach((weatherForecast) => {
                    weatherForecast.low = parseInt(weatherForecast.low)
                    weatherForecast.high = parseInt(weatherForecast.high)
                    // weatherForecast.date = Moment(weatherForecast.date * 1000, 'DD MMM YYYY').valueOf();
                    weatherForecast.date = Moment(new Date(weatherForecast.date * 1000)).format('YYYY/MM/DD');
                });

                this.setState({
                    location: location,
                    weatherForecastList: weatherForecastList,
                });
                break;
            default:
                break;
        }
    }

    render() {
        const { weatherForecastList } = this.state;

        return (
            <Root>
                <TitleTextfit
                    mode='single'
                    min={16}
                    max={28}
                    forceSingleModeWidth={false}>
                    {'Yahoo Weather Forecast'}
                </TitleTextfit>

                <BarChart
                    data={weatherForecastList}
                    xAxisDataKey={'date'}
                    barDataKey={'high'}
                    barName={'High'}
                    barColor={'#ff4242'} />

                {
                    // <ResponsiveContainer>
                    //     {weatherForecastList &&
                    //         <BarChart
                    //             data={weatherForecastList}
                    //             margin={{top: 20, right: 20, left: -20, bottom: 40}}>
                    //             <XAxis
                    //                 dataKey='date'
                    //                 tickCount={10}
                    //                 tick={<SimpleDateAxisTick />}/>
                    //             <YAxis/>
                    //             <CartesianGrid strokeDasharray='3 3'/>
                    //             <Tooltip
                    //                 labelFormatter={(label) => { return Moment(new Date(label)).format('MM-DD') }}
                    //                 formatter={(value) => { return value }}/>
                    //             <Legend />
                    //             <ReferenceLine y={0} stroke='#000'/>
                    //             <Bar
                    //                 dataKey='high'
                    //                 name='High'
                    //                 unit={'°C'}
                    //                 fill={red['A200']}/>
                    //             <Bar
                    //                 dataKey='low'
                    //                 name='Low'
                    //                 unit={'°C'}
                    //                 fill={lightBlue['A200']}/>
                    //         </BarChart>}
                    // </ResponsiveContainer>
                }
            </Root>
        )
    }
}

export default YahooWeatherForecastWidget;
