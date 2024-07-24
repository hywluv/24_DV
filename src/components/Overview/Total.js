import React, {useState, useEffect, useContext} from 'react';
import ReactECharts from 'echarts-for-react';
import Papa from 'papaparse';
import {store} from '../../store';
import {useLabel} from './ChartContext'; // 导入自定义的useLabel hook


const colorMapping = {
    '2': 'linear-gradient(45deg, #0088FE, #00C49F)',
    '4': 'linear-gradient(45deg, #00C49F, #FFBB28)',
    '8': 'linear-gradient(45deg, #FFBB28, #FF8042)',
    '16': 'linear-gradient(45deg, #FF8042, #8884D8)',
};

/*const shapeMapping = {
  'ADV': [0,0,0,0],
  'COV': [10,10,0,0],
  'IID': [10,0,10,0],
  'OOD': [0,10,0,10],
}*/

function filterData(data, filters) {
    return data.filter(item => {
        return Object.keys(filters).every(key => {
            return filters[key] === 'N/A' || item[key] === filters[key];
        });
    });
}

const TotalFromCSV = ({csvFile}) => {
    const [options, setOptions] = useState({});
    const [sortOrder, setSortOrder] = useState('none');  // 控制排序的状态
    const {state, dispatch} = useContext(store);
    const {selectedLabel, setSelectedLabel} = useLabel(); // 使用上下文中的selectedLabel和setSelectedLabel

    const handleMouseOver = (params) => {
        // 确保在悬停时获取正确的数据点名称
        setSelectedLabel(params.name);  // 这里假设 data 对象中的 name 字段存储了我们需要的 label
        console.log("Mouse over:", params.name); // 调试输出
    };

    const onEvents = {
        'mouseover': handleMouseOver
    };

    useEffect(() => {
        console.log(state.overview); // 查看当前筛选条件
        Papa.parse(csvFile, {
            download: true,
            header: true,
            complete: (results) => {
                const filteredData = filterData(results.data, state.overview);
                const groupedData = {};
                filteredData.forEach(item => {
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
                    label: key,
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
    }, [csvFile, state.OverviewSelection, state.overview, sortOrder]); // Include sortOrder in the dependencies

    function buildOptions(data) {
        let yAxisConfig = [{
            type: 'value',
            name: state.OverviewSelection,
            axisLabel: {fontFamily: 'Comic Sans MS', fontSize: 12, color: '#000'},
            nameTextStyle: {fontSize: 14, color: '#333', fontFamily: 'Menlo'}
        }];
        let seriesConfig = [{
            name: state.OverviewSelection,
            type: 'bar',
            barWidth: '60%', showBackground: true,
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.3)'
            },
            itemStyle: {
                borderRadius: [10, 10, 0, 0],
                shadowColor: 'rgba(0, 0, 0, 0.4)',
                shadowBlur: 10,
            },
            animationDuration: 0, // 设置动画持续时间
            animationEasing: 'elasticOut', // 设置动画缓动效果
            data: data.map((item) => ({
                value: item[state.OverviewSelection.toLowerCase()],
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0,
                        x2: 0, y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: colorMapping[item.label.split(',')[3]].split('linear-gradient(45deg, ')[1].split(', ')[0]
                            },
                            {offset: 1, color: colorMapping[item.label.split(',')[3]].split(', ')[1].split(')')[0]},
                        ],
                    },
                },
            }))
        }];

        if (state.OverviewSelection === 'default') {
            yAxisConfig = [
                {
                    type: 'value',
                    name: 'Mean',
                    nameTextStyle: {fontSize: 14, color: '#333', fontFamily: 'Menlo'},
                    axisLabel: {fontFamily: 'Comic Sans MS', fontSize: 12, color: '#000'}
                },
                {
                    type: 'value',
                    name: 'Variance',
                    nameTextStyle: {fontSize: 14, color: '#333', fontFamily: 'Menlo'},
                    position: 'right',
                    axisLabel: {fontFamily: 'Comic Sans MS', fontSize: 12, color: '#000'}
                }
            ];
            seriesConfig = [
                {
                    name: 'Mean', type: 'bar',
                    barWidth: '60%', showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(220, 220, 220, 0.3)'
                    },
                    itemStyle: {
                        borderRadius: [10, 10, 0, 0],
                        shadowColor: 'rgba(0, 0, 0, 0.4)',
                        shadowBlur: 10,
                    },

                    animationDuration: 0, // 设置动画持续时间
                    animationEasing: 'elasticOut', // 设置动画缓动效果

                    data: data.map((item) => ({
                        value: item.mean,
                        itemStyle: {
                            // borderRadius: shapeMapping[item.label.split(',')[2]],
                            color: {
                                type: 'linear',
                                x: 0, y: 0,
                                x2: 0, y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: colorMapping[item.label.split(',')[3]].split('linear-gradient(45deg, ')[1].split(', ')[0]
                                    },
                                    {
                                        offset: 1,
                                        color: colorMapping[item.label.split(',')[3]].split(', ')[1].split(')')[0]
                                    },
                                ],
                            },

                        },
                    })),
                },
                {
                    name: 'Variance', type: 'line',
                    animationDuration: 10, // 设置动画持续时间
                    animationEasing: 'elasticOut', // 设置动画缓动效果
                    yAxisIndex: 1, data: data.map(item => item.variance)
                }
            ];
        }

        return {
            title: {
                text: '按模型和采样特征概览',
                left: 'center',
                textStyle: {
                    fontSize: 26,
                    fontFamily: 'STZhongsong',
                    fontWeight: 'bolder',
                    color: '#000080',
                    textAlign: 'center',
                    textBorderColor: '#000000',
                    textBorderWidth: 0,
                    textShadowColor: 'rgba(0, 0, 0, 1)',
                    textShadowBlur: 0,
                },
            },

            grid: {
                top: 60,
                bottom: 120,
            },

            dataZoom: [
                {
                    type: 'inside',
                },
                {
                    type: 'slider',
                },
            ],

            tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},

            legend: {
                data: seriesConfig.map(series => series.name),
                top: 10,
                right: 300
            },

            xAxis: {
                type: 'category',
                data: data.map(item => item.label),
                axisLabel: {
                    margin: 10,
                    show: true,
                    interval: 0,
                    rotate: 45,
                    fontFamily: 'Menlo',
                    fontSize: 11,
                    color: '#000',
                }
            },
            yAxis: yAxisConfig,
            series: seriesConfig
        };
    }

    const toggleSortOrder = () => {
        // 在点击时更新排序状态
        setSortOrder(current => {
            switch (current) {
                case 'none':
                    return 'ascending';
                case 'ascending':
                    return 'descending';
                case 'descending':
                    return 'none';
                default:
                    return 'none';
            }
        });
    };
    return (
        <div>
            <ReactECharts option={options} onEvents={onEvents} style={{height: 400}}/>
            <br></br>
            <button style={{
                width: '200px',
                height: '30px',
                fontSize: '15px',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                border: 'outset',
                fontFamily: "SimHei",
                marginLeft: 50
            }} onClick={toggleSortOrder}>
                排序: {sortOrder === 'none' ? '默认' : sortOrder === 'ascending' ? '升序' : '降序'}
            </button>
            {/*<div>[TEST]当前选中的标签: {selectedLabel}</div>*/}
        </div>
    );
};

export default TotalFromCSV;