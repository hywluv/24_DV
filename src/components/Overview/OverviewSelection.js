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
            <Select.Option value="mean">Mean</Select.Option>
            <Select.Option value="variance">Variance</Select.Option>
            <Select.Option value="max">Max</Select.Option>
            <Select.Option value="min">Min</Select.Option>
            <Select.Option value="default">Default</Select.Option>
        </Select>
    );
};

export default OverviewSelector;