import React, {useContext} from 'react';
import { useState } from 'react';
import {Select} from 'antd';

import {store} from '../store';
import '../css/ControlPanel.css'
import OverviewSelector from "./Overview/OverviewSelection";

function ControlPanel() {
    const {state, dispatch} = useContext(store);
    const [ view, setView ]  = useState('OverviewSelection')
    const showOverviewSelector = () => setView('OverviewSelection')
    const showModelSelector = () => setView('ModelSelection')

    
/*
    return <div>
        <p>Control Panel</p>
        <p>{state.count}</p>
        <button onClick={() => dispatch({type: 'increment'})}>add</button>
        <p>Current Selection:{state.SelectorSelection}</p>
        <OverviewSelector />
        <Select onChange={onChange} defaultValue='default'>
            <Select.Option value='default'>Default</Select.Option>
            <Select.Option value='A'>Dataset A</Select.Option>
            <Select.Option value='B'>Dataset B</Select.Option>
        </Select>

    </div> */
    return <div>
        <p>Control Panel</p>
        <p>{ state.count }</p>
        <button onClick={() => dispatch({type: 'increment'})}>add</button>
        <p>Current Selection: { state.SelectorSelection }</p>
        <nav>
            <button onClick={ showOverviewSelector }>OverviewSelection</button>
            <button onClick={ showModelSelector }>ModelSelection</button>
        </nav>
        <main>
            { view === 'OverviewSelection' && <OverviewSelection /> }
            { view === 'ModelSelection' && <ModelSelection /> }
        </main>
    </div>;
}

function OverviewSelection () {
    const {state, dispatch} = useContext(store);
    const onChange = (value)=>{
        // 可以在F12调试窗口中通过console.log查看信息进行Debug
        console.log(value);
        dispatch({
            type: 'changeOption',
            payload: value
        });
    };

    return <div>
        <OverviewSelector />
        <Select onChange={ onChange } defaultValue='default'>
            <Select.Option value='default'>Default</Select.Option>
            <Select.Option value='A'>Dataset A</Select.Option>
            <Select.Option value='B'>Dataset B</Select.Option>
        </Select>
    </div>
}

function ModelSelection () {
    const { state, dispatch } = useContext(store)
    const onChange = (value) => {
        console.log(value)
        dispatch({ type: 'changeOption', payload: value })  
    }
    return <div>
        <Select onChange={ onChange } defaultValue='default'>
            <Select.Option value='default'>Default</Select.Option>
            <Select.Option value='VGG19'>VGG19</Select.Option>
            <Select.Option value='ResNet50'>ResNet50</Select.Option>
        </Select>
    </div>
}

export default ControlPanel;
