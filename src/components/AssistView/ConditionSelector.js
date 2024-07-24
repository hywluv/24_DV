import { Select } from 'antd';
import { store } from '../../store';
import {useContext} from "react";

function ConditionSelector({ selectorKey, options, filterGroup }) {
    const { state, dispatch } = useContext(store);
    const selectedValue = state[filterGroup][selectorKey];

const onChange = (value) => {
    console.log(`${selectorKey} changed to ${value} in ${filterGroup}`);
    let actionType;
    if (filterGroup === 'filters1') {
        actionType = 'UPDATE_CONDITION_1';
    } else if (filterGroup === 'filters2') {
        actionType = 'UPDATE_CONDITION_2';
    } else if (filterGroup === 'overview') {
        actionType = 'UPDATE_CONDITION_OVERVIEW';
    }

    dispatch({
        type: actionType,
        payload: { key: selectorKey, value }
    });
};

    return (
        <Select defaultValue={selectedValue || options[0].value} style={{ width: 150 ,fontFamily: "Trebuchet MS"}} onChange={onChange}>
            {options.map(option => (
                <Select.Option style={{fontFamily: "Trebuchet MS"}} key={option.value} value={option.value}>{option.label}</Select.Option>
            ))}
        </Select>
    );
}

export { ConditionSelector };