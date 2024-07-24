// 本文件是一个子视图

import React from 'react';

import {store} from '../store';
import AssistChart from "./AssistView/AssistChart";
import TotalFromCSV from "./Overview/Total";
import '../index.css';
import QuestionAnswer from "./question_answer/q_a";

function AssistView() {
    return <div>
        <div className='title-container'>
            <p className='title'>Assist View</p>
        </div>
        <AssistChart csvFile={"/data/processed.csv"}/>
        <QuestionAnswer />
    </div>
}

export default AssistView;
