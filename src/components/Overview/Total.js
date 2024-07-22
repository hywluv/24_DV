import React, { useState, useEffect, useContext } from 'react';
import ReactECharts from 'echarts-for-react';
import Papa from 'papaparse';
import { store } from '../../store';
import { useLabel } from './ChartContext'; // 导入自定义的useLabel hook

const TotalFromCSV = ({ csvFile }) => {
    const [options, setOptions] = useState({});
    const [sortOrder, setSortOrder] = useState('none');  // 控制排序的状态
    const { state, dispatch } = useContext(store);
    const { selectedLabel, setSelectedLabel } = useLabel(); // 使用上下文中的selectedLabel和setSelectedLabel

    const handleMouseOver = (params) => {
        // 确保在悬停时获取正确的数据点名称
        setSelectedLabel(params.name);  // 这里假设 data 对象中的 name 字段存储了我们需要的 label
        console.log("Mouse over:", params.name); // 调试输出
    };

    const onEvents = {
        'mouseover': handleMouseOver
    };

    useEffect(() => {
        Papa.parse(csvFile, {
            download: true,
            header: true,
            complete: (results) => {
                const groupedData = {};
                results.data.forEach(item => {
                    const groupKey = `${item["ModelName"]},${item["SamplingTarget"]},${item["SamplingMethod"]},${item["DownsamplingLevel"]}`;
                    const meanValue = parseFloat(item["MeanDiff"]);
                    const varianceValue = parseFloat(item["VarianceDiff"]);
                    const maxValue = parseFloat(item["MaxDiff"]);
                    const minValue = parseFloat(item["MinDiff"]);
                    if (!groupedData[groupKey]) {
                        groupedData[groupKey] = {
                            meanSum: 0,
                            varianceSum: 0,
                            maxSum: 0,
                            minSum: 0,
                            count: 0,
                            label: item["BarChartType"]
                        };
                    }
                    groupedData[groupKey].meanSum += meanValue;
                    groupedData[groupKey].varianceSum += varianceValue;
                    groupedData[groupKey].maxSum += maxValue;
                    groupedData[groupKey].minSum += minValue;
                    groupedData[groupKey].count += 1;
                });

                // Apply sorting
                const data = Object.keys(groupedData).map(key => ({
                    label: groupedData[key].label + ' - ' + key,
                    mean: groupedData[key].meanSum / groupedData[key].count,
                    variance: groupedData[key].varianceSum / groupedData[key].count,
                    max: groupedData[key].maxSum / groupedData[key].count,
                    min: groupedData[key].minSum / groupedData[key].count
                })).sort((a, b) => {
                    if (sortOrder === 'ascending') {
                        return a.mean - b.mean;
                    } else if (sortOrder === 'descending') {
                        return b.mean - a.mean;
                    }
                    return 0;
                });

                let options = buildOptions(data);
                setOptions(options);
                // setChartKey(prevKey => prevKey + 1); // Force re-render
            }
        });
    }, [csvFile, state.OverviewSelection, sortOrder]); // Include sortOrder in the dependencies

    function buildOptions(data) {
        let yAxisConfig = [{ type: 'value', name: state.OverviewSelection }];
        let seriesConfig = [{
            name: state.OverviewSelection,
            type: 'bar',
            data: data.map(item => item[state.OverviewSelection.toLowerCase()])
        }];

        if (state.OverviewSelection === 'default') {
            yAxisConfig = [
                { type: 'value', name: 'Mean' },
                { type: 'value', name: 'Variance', position: 'right' }
            ];
            seriesConfig = [
                { name: 'Mean', type: 'bar', data: data.map(item => item.mean) },
                { name: 'Variance', type: 'line', yAxisIndex: 1, data: data.map(item => item.variance) }
            ];
        }

        return {
            title: { text: '按模型和采样特征概览', left: 'center' },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            xAxis: {
                type: 'category',
                data: data.map(item => item.label),
                axisLabel: { show: true, interval: 0, rotate: 45 }
            },
            yAxis: yAxisConfig,
            series: seriesConfig
        };
    }

    return (
        <div>
            <ReactECharts option={options} onEvents={onEvents} style={{ height: 400 }} />
            <button onClick={() => setSortOrder('ascending')}>升序排序</button>
            <button onClick={() => setSortOrder('descending')}>降序排序</button>
            <button onClick={() => setSortOrder('none')}>恢复原始顺序</button>
            {/*<div>[TEST]当前选中的标签: {selectedLabel}</div>*/}
        </div>
    );
};

export default TotalFromCSV;