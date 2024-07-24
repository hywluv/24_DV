import React, { useContext } from 'react';
import ReactEcharts from 'echarts-for-react';

import { store } from '../store';
import { useLabel } from './Overview/ChartContext';
import { LabelProvider } from './Overview/ChartContext';
import TotalFromCSV from './Overview/Total';
import DetailViewChart from "./Overview/detailchart";
import '../index.css';

function Overview() {
    const {state, dispatch} = useContext(store);

    return <div>
        <div className='title-container'>
            <span className='title'>Overview</span><span className='subtitle'>by Model and Sampling Features</span>
        </div>
        {/*<ReactEcharts option={getOption()} />*/}
        {/*<TotalFromCSV csvFile="/data/processed.csv" />*/}
        <TotalFromCSV csvFile="/data/processed.csv" />
    </div>
}

export default Overview;
