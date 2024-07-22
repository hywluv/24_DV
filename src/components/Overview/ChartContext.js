// ChartContext.js
import React, {createContext, useContext, useState} from 'react';

const LabelContext = createContext({
    selectedLabel: null,  // 保持与 useState 中的初始值一致
    setSelectedLabel: () => {}  // 提供一个空函数作为默认的 setSelectedLabel
});


export const useLabel = () => useContext(LabelContext);

export const LabelProvider = ({children}) => {
    const [selectedLabel, setSelectedLabel] = useState(null);

    return (
        <div>
            <LabelContext.Provider value={{selectedLabel, setSelectedLabel}}>
                {children}
            </LabelContext.Provider>
            {/*<div>[TEST]1当前选中的标签: {selectedLabel} </div>*/}
        </div>
    );
};