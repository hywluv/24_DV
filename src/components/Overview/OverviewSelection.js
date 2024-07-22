import React, { useContext } from 'react';
import { Select } from 'antd';
import { store } from '../../store';

const { Option } = Select;  // Destructure Option from Select for easy usage

const OverviewSelector = () => {
    const { state, dispatch } = useContext(store);  // Use useContext to access state and dispatch

    const onChange = (value) => {
        console.log(value)
        // When selection changes, dispatch an action to update state
        dispatch({
            type: 'OverviewSelection',
            payload: value
        });
    };

    return (
        <Select
            value={state.OverviewSelection}
            onChange={onChange}
            defaultValue={"Average MeanDiff"}  // Set default value
            style={{ width: 200 }}  // Optionally specify width
        >
            <Select.Option value="Average MeanDiff">Mean</Select.Option>
            <Select.Option value="Average VarianceDiff">Variance</Select.Option>
            <Select.Option value="MaxDiff">Max</Select.Option>
            <Select.Option value="MinDiff">Min</Select.Option>
        </Select>
    );
};

export default OverviewSelector;