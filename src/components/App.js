// 本文件是界面UI的根目录

import React from 'react';

import AssistView from './AssistView';
import ControlPanel from './ControlPanel';
import Overview from './Overview';
import DetailView from './DetailView';
import '../css/App.css'
import {LabelProvider} from './Overview/ChartContext';

// App组件
function App() {

    return <div className='root'>
        <div className='controlPanel'>
            <ControlPanel/>
        </div>
        <div className='mainPanel'>
            <LabelProvider>
                <div className='overview'><Overview/></div>
                <div className='otherview'>
                    <div style={{fontSize: '25px', fontWeight: 'bold', color: '#666666', fontFamily: 'Times New Roman', textAlign: 'left', marginLeft:8}} className='assistView'><AssistView/></div>
                    <div className='detailView'><DetailView/></div>
                </div>
            </LabelProvider>
        </div>
    </div>;
}

export default App;
