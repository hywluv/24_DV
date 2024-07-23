// 本文件是一个子视图

import React from 'react';

import {store} from '../store';
import AssistChart from "./AssistView/AssistChart";
import TotalFromCSV from "./Overview/Total";

function AssistView() {
    return <div>
        <p>AssistView</p>
        <AssistChart csvFile={"/data/processed.csv"}/>
    </div>
}

export default AssistView;
