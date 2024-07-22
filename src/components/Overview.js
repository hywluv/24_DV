import React, { useContext } from 'react';
import ReactEcharts from 'echarts-for-react';

import { store } from '../store';
import { useLabel } from './Overview/ChartContext';
import { LabelProvider } from './Overview/ChartContext';
import TotalFromCSV from './Overview/Total';
import DetailViewChart from "./Overview/detailchart";

function Overview() {
    const {state, dispatch} = useContext(store);

    const getOption = () => {
        return {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }]
        };
    };

    return <div>
        <p>Overview</p>
        {/*<ReactEcharts option={getOption()} />*/}
        {/*<TotalFromCSV csvFile="/data/processed.csv" />*/}
        <TotalFromCSV csvFile="/data/processed.csv" />
    </div>
}

export default Overview;
