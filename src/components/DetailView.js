import React, {useContext} from 'react';
import {Map, APILoader} from '@uiw/react-baidu-map';

import {store} from '../store';
import {LabelProvider} from './Overview/ChartContext';
import DetailViewChart from './Overview/detailchart';

function DetailView() {
    const {state, dispatch} = useContext(store);

    return <div style={{width: '100%', height: '100%'}}>
        <p style={{fontSize: '25px', fontWeight: 'bold', color: '#666666', fontFamily: 'Times New Roman', textAlign: 'left', marginLeft:8}}>Detail View</p>
        {/*<p>{state.count}</p>*/}
        {/*<button onClick={() => dispatch({type: 'decrease'})}>minus</button>*/}
        {/*<APILoader akay='Yvjkj9EN8qfW4vDB6WoTfd01DYWWTzDW'>*/}
        {/*    <Map />*/}
        {/*</APILoader>*/}
        <DetailViewChart csvFile={"/data/processed.csv"}/>
    </div>
}

export default DetailView;
