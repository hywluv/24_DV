import React, {useContext} from 'react';
import {Map, APILoader} from '@uiw/react-baidu-map';

import {store} from '../store';
import {LabelProvider} from './Overview/ChartContext';
import DetailViewChart from './Overview/detailchart';

function DetailView() {
    const {state, dispatch} = useContext(store);

    return <div style={{width: '100%', height: '100%'}}>
        <p>Detail View</p>
        {/*<p>{state.count}</p>*/}
        {/*<button onClick={() => dispatch({type: 'decrease'})}>minus</button>*/}
        {/*<APILoader akay='Yvjkj9EN8qfW4vDB6WoTfd01DYWWTzDW'>*/}
        {/*    <Map />*/}
        {/*</APILoader>*/}
        <DetailViewChart csvFile={"/data/processed.csv"}/>
    </div>
}

export default DetailView;
