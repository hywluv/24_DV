// 不同请求的处理
const reducer = (state, action) => {
    switch (action.type) {
        case 'increment':
            return {
                ...state,
                count: state.count + 1
            };
        case 'decrease':
            return {
                ...state,
                count: state.count - 1
            };
        case 'changeOption':
            return {
                ...state,
                changeOption: action.payload
            };
        case 'init': {
            let newData = [];
            // TODO: use action.payload to update newData
            console.log(action.payload);
            newData = action.payload;
            return {
                ...state,
                data: newData
            };
        }
        case 'UPDATE_CONDITION_1':
            return {
                ...state,
                filters1: {
                    ...state.filters1,
                    [action.payload.key]: action.payload.value
                }
            };
        case 'UPDATE_CONDITION_2':
            return {
                ...state,
                filters2: {
                    ...state.filters2,
                    [action.payload.key]: action.payload.value
                }
            };
        case 'UPDATE_CONDITION_OVERVIEW':
            return {
                ...state,
                overview: {
                    ...state.overview,
                    [action.payload.key]: action.payload.value
                }
            };
        case 'OverviewSelection':
            return {
                ...state,
                OverviewSelection: action.payload
            };
        default:
            throw new Error();
    }
}

export default reducer;