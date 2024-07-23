import React, { useContext } from 'react';
import ReactEcharts from 'echarts-for-react';

import { store } from '../store';
import { useLabel } from './Overview/ChartContext';
import { LabelProvider } from './Overview/ChartContext';
import TotalFromCSV from './Overview/Total';
import DetailViewChart from "./Overview/detailchart";

function Overview() {
    const {state, dispatch} = useContext(store);

    return <div>
        <p style={{fontSize: '25px', fontWeight: 'bold', color: '#666666', fontFamily: 'Times New Roman', textAlign: 'left', marginLeft:8}}>Overview</p>
        {/*<ReactEcharts option={getOption()} />*/}
        {/*<TotalFromCSV csvFile="/data/processed.csv" />*/}
        <TotalFromCSV csvFile="/data/processed.csv" />
    </div>
}

export default Overview;
