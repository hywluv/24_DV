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
        <p style={{fontSize: '25px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Times New Roman', textAlign: 'center'}}>Control Panel</p>
        <br></br>
        <p style={{fontSize: '20px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Montserrat', textAlign: 'center'}}>Current Selection: { state.SelectorSelection }</p>
        <br></br><br></br><br></br>
        <nav style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
            <button style={{ width: '150px', height: '27px', fontSize: '15px' , cursor: 'pointer' , backgroundColor: '#f7f9f9', border: 'outset', fontFamily: "Open Sans", color: '#000', marginBottom: 8}} onClick={ showOverviewSelector }>OverviewSelection</button>
            <button style={{ width: '150px', height: '27px', fontSize: '15px' , cursor: 'pointer' , backgroundColor: '#f7f9f9', border: 'outset', fontFamily: "Open Sans", color: '#000'}} onClick={ showModelSelector }>ModelSelection</button>
        </nav>
        <main style={{ marginTop: '150px' }}>
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

    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 10}}>
        < OverviewSelector />
        <Select onChange={ onChange } defaultValue='default'>
            <Select.Option style={{fontFamily: "LobsterCourier New", color: '#000'}} value='default'>Default</Select.Option>
            <Select.Option style={{fontFamily: "LobsterCourier New", color: '#000'}} value='A'>Dataset A</Select.Option>
            <Select.Option style={{fontFamily: "LobsterCourier New", color: '#000'}} value='B'>Dataset B</Select.Option>
        </Select>
    </div>
}

function ModelSelection () {
    const { state, dispatch } = useContext(store)
    const onChange = (value) => {
        console.log(value)
        dispatch({ type: 'changeOption', payload: value })  
    }
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
        <Select onChange={ onChange } defaultValue='default'>
            <Select.Option style={{fontFamily: "LobsterCourier New", color: '#000'}} value='default'>Default</Select.Option>
            <Select.Option style={{fontFamily: "LobsterCourier New", color: '#000'}} value='VGG19'>VGG19</Select.Option>
            <Select.Option style={{fontFamily: "LobsterCourier New", color: '#000'}} value='ResNet50'>ResNet50</Select.Option>
        </Select>
    </div>
}

export default ControlPanel;
