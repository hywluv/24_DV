// 本文件是一个子视图

import React from 'react';

import {store} from '../store';
import AssistChart from "./AssistView/AssistChart";
import TotalFromCSV from "./Overview/Total";
import '../index.css';

function AssistView() {
    return <div>
        <div className='title-container'>
            <p className='title'>Assist View</p>
        </div>
        <AssistChart csvFile={"/data/processed.csv"}/>
    </div>
}

export default AssistView;
