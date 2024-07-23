import { Select } from 'antd';
import { store } from '../../store';
import {useContext} from "react";

function ConditionSelector({ selectorKey, options, filterGroup }) {
    const { state, dispatch } = useContext(store);
    const selectedValue = state[filterGroup][selectorKey];

    const onChange = (value) => {
        console.log(`${selectorKey} changed to ${value} in ${filterGroup}`);
        dispatch({
            type: `UPDATE_CONDITION_${filterGroup === 'filters1' ? '1' : '2'}`,
            payload: { key: selectorKey, value }
        });
    };

    return (
        <Select defaultValue={selectedValue || options[0].value} style={{ width: 120 }} onChange={onChange}>
            {options.map(option => (
                <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
            ))}
        </Select>
    );
}

export { ConditionSelector };