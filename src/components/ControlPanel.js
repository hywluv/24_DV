import React, {useContext} from 'react';
import {useState} from 'react';
import {Select} from 'antd';

import {store} from '../store';
import '../css/ControlPanel.css'
import OverviewSelector from "./Overview/OverviewSelection";
import {ConditionSelector} from "./AssistView/ConditionSelector";

function ControlPanel() {
    const {state, dispatch} = useContext(store);
    const [view, setView] = useState('OverviewSelection')
    const showOverviewSelector = () => setView('OverviewSelection')
    const showModelSelector = () => setView('ModelSelection')


   return (
    <div className="control-panel">
        <p style={{fontSize: '25px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Times New Roman', textAlign: 'center'}}>Control Panel</p>
        <div style={{marginLeft: 20}}>
            <OverviewSelection/>
        </div>
        <div>
            <br/>
            <p style={{fontFamily: 'Georgia', fontSize: 20, color: '#fefefe', textAlign: 'center'}}>Filter Group 1</p>
            <div style={{width: 200, fontFamily: 'Trebuchet MS', textAlign: 'left', marginLeft: 20}}>
                Model Name:
                <ConditionSelector
                    selectorKey="ModelName"
                    options={[
                        {label: 'ResNet50', value: 'ResNet50'},
                        {label: 'VGG19', value: 'VGG19'},
                        {label: 'N/A', value: 'N/A'}  // Added N/A option
                    ]}
                    filterGroup="filters1"
                />
            </div>
            <br/>
            <div style={{width: 200, fontFamily: 'Trebuchet MS', textAlign: 'left', marginLeft: 20}}>
                Sampling Target:
                <ConditionSelector
                    selectorKey="SamplingTarget"
                    options={[
                        {label: 'Ratio', value: 'Ratio'},
                        {label: 'Height', value: 'Height'},
                        {label: 'N/A', value: 'N/A'}  // Added N/A option
                    ]}
                    filterGroup="filters1"
                />
            </div>
            <br/>
            <div style={{width: 200, fontFamily: 'Trebuchet MS', textAlign: 'left', marginLeft: 20}}>
                Sampling Method:
                <ConditionSelector
                    selectorKey="SamplingMethod"
                    options={[
                        {label: 'ADV', value: 'ADV'},
                        {label: 'COV', value: 'COV'},
                        {label: 'IID', value: 'IID'},
                        {label: 'OOD', value: 'OOD'},
                        {label: 'N/A', value: 'N/A'}  // Added N/A option
                    ]}
                    filterGroup="filters1"
                />
            </div>
            <br/>
            <div style={{width: 200, fontFamily: 'Trebuchet MS', textAlign: 'left', marginLeft: 20}}>
                Downsampling Level:
                <ConditionSelector
                    selectorKey="DownsamplingLevel"
                    options={[
                        {label: '2', value: '2'},
                        {label: '4', value: '4'},
                        {label: '8', value: '8'},
                        {label: '16', value: '16'},
                        {label: 'N/A', value: 'N/A'}  // Added N/A option
                    ]}
                    filterGroup="filters1"
                />
            </div>
            <br/>

            <p style={{fontFamily: 'Georgia', fontSize: 20, color: '#fefefe', textAlign:'center'}}>Filter Group 2</p>
            <div style={{width: 200, fontFamily: 'Trebuchet MS', textAlign: 'left', marginLeft: 20}}>
                Model Name:
                <ConditionSelector
                    selectorKey="ModelName"
                    options={[
                        {label: 'ResNet50', value: 'ResNet50'},
                        {label: 'VGG19', value: 'VGG19'},
                        {label: 'N/A', value: 'N/A'}  // Added N/A option
                    ]}
                    filterGroup="filters2"
                />
            </div>
            <br/>
            <div style={{width: 200, fontFamily: 'Trebuchet MS', textAlign: 'left', marginLeft: 20}}>
                Sampling Target:
                <ConditionSelector
                    selectorKey="SamplingTarget"
                    options={[
                        {label: 'Ratio', value: 'Ratio'},
                        {label: 'Height', value: 'Height'},
                        {label: 'N/A', value: 'N/A'}  // Added N/A option
                    ]}
                    filterGroup="filters2"
                />
            </div>
            <br/>
            <div style={{width: 200, fontFamily: 'Trebuchet MS', textAlign: 'left', marginLeft: 20}}>
                Sampling Method:
                <ConditionSelector
                    selectorKey="SamplingMethod"
                    options={[
                        {label: 'ADV', value: 'ADV'},
                        {label: 'COV', value: 'COV'},
                        {label: 'IID', value: 'IID'},
                        {label: 'OOD', value: 'OOD'},
                        {label: 'N/A', value: 'N/A'}  // Added N/A option
                    ]}
                    filterGroup="filters2"
                />
            </div>
            <br/>
            <div style={{width: 200, fontFamily: 'Trebuchet MS', textAlign: 'left', marginLeft: 20}}>
                Downsampling Level:
                <ConditionSelector
                    selectorKey="DownsamplingLevel"
                    options={[
                        {label: '2', value: '2'},
                        {label: '4', value: '4'},
                        {label: '8', value: '8'},
                        {label: '16', value: '16'},
                        {label: 'N/A', value: 'N/A'}  // Added N/A option
                    ]}
                    filterGroup="filters2"
                />
            </div>
        </div>
    </div>
   );
}

function OverviewSelection() {
    const {state, dispatch} = useContext(store);
    const onChange = (value) => {
        // 可以在F12调试窗口中通过console.log查看信息进行Debug
        console.log(value);
        dispatch({
            type: 'changeOption',
            payload: value
        });
    };

    return <div>
        <OverviewSelector/>
    </div>
}


export default ControlPanel;
