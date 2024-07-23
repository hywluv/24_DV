// import React, { useEffect, useState } from 'react';
// import ReactECharts from 'echarts-for-react';
// import Papa from 'papaparse';
// import { useLabel } from './ChartContext';
//
// const DetailViewChart = ({ csvFile }) => {
//     const { selectedLabel } = useLabel();
//     const [chartData, setChartData] = useState([]);
//
//     // 解析 CSV 数据并更新图表数据
//     const fetchAndProcessCSV = (label) => {
//         Papa.parse( csvFile , {
//             download: true,
//             header: true,
//             complete: function(results) {
//                 const filteredData = results.data.filter(item => {
//                     const labelString = `1 - ${item["ModelName"]},${item["SamplingTarget"]},${item["SamplingMethod"]},${item["DownsamplingLevel"]}`;
//                     return labelString === label;
//                 });
//
//                 // 假设我们需要显示的数据是某种数值属性，这里以 "Value" 为例
//                 const dataForChart = filteredData.map(item => ({
//                     name: item["ModelName"], // 用模型名称作为类别
//                     value: Number(item["MeanDiff"]) // 转换字符串为数字
//                 }));
//
//                 setChartData(dataForChart);
//             }
//         });
//     };
//
//     useEffect(() => {
//         if (selectedLabel) {
//             fetchAndProcessCSV(selectedLabel);
//         }
//     }, [selectedLabel]);
//
//     // 配置 ECharts
//     const options = {
//         title: {
//             text: '模型数据详情',
//             left: 'center'
//         },
//         tooltip: {
//             trigger: 'axis',
//             axisPointer: {
//                 type: 'shadow'
//             }
//         },
//         xAxis: {
//             type: 'category',
//             data: chartData.map(item => item.name)
//         },
//         yAxis: {
//             type: 'value'
//         },
//         series: [{
//             data: chartData.map(item => item.value),
//             type: 'bar'
//         }]
//     };
//
//     return (
//         <div>
//             <ReactECharts option={options} style={{ height: 400 }} />
//             <div>当前选中的标签: {selectedLabel}</div>
//         </div>
//     );
// };
//
// export default DetailViewChart;

// import React, { useEffect, useState } from 'react';
// import ReactECharts from 'echarts-for-react';
// import Papa from 'papaparse';
// import { useLabel } from './ChartContext';
//
// const prepareChartData = (data) => {
//     const groups = data.reduce((acc, item) => {
//         const type = item["BarChartType"];
//         if (!acc[type]) {
//             acc[type] = [];
//         }
//         acc[type].push({
//             RunIndex: item["RunIndex"],
//             mean: Number(item["MeanDiff"])
//         });
//         return acc;
//     }, {});
//
//     return Object.keys(groups).sort().map(key => ({
//         type: key,
//         data: groups[key]
//     }));
// };
//
// const DetailViewChart = ({csvFile}) => {
//     const { selectedLabel } = useLabel();
//     const [chartGroups, setChartGroups] = useState([]);
//
//     useEffect(() => {
//         if (selectedLabel) {
//             Papa.parse(csvFile, {
//                 download: true,
//                 header: true,
//                 complete: function(results) {
//                     const filteredData = results.data.filter(item => {
//                         const labelString = `1 - ${item["ModelName"]},${item["SamplingTarget"]},${item["SamplingMethod"]},${item["DownsamplingLevel"]}`;
//                         return labelString === selectedLabel;
//                     });
//                     const preparedData = prepareChartData(filteredData);
//                     setChartGroups(preparedData);
//                 }
//             });
//         }
//     }, [selectedLabel, csvFile]);  // 添加 csvFile 作为依赖项
//
//     const getOptions = (chartData) => ({
//         title: {
//             text: `BarChart Type ${chartData.type}`,
//             left: 'center'
//         },
//         tooltip: {
//             trigger: 'axis',
//             axisPointer: {
//                 type: 'shadow'
//             }
//         },
//         xAxis: {
//             type: 'category',
//             data: chartData.data.map(item => item.RunIndex)
//         },
//         yAxis: {
//             type: 'value'
//         },
//         series: [{
//             data: chartData.data.map(item => item.mean),
//             type: 'bar'
//         }]
//     });
//
//     return (
//         <div>
//             {chartGroups.map((group, index) => (
//                 <ReactECharts key={index} option={getOptions(group)} style={{height: 400, width: '100%'}} />
//             ))}
//             <div>当前选中的标签: {selectedLabel}</div>
//         </div>
//     );
// };
//
// export default DetailViewChart;

    import React, { useEffect, useState } from 'react';
    import ReactECharts from 'echarts-for-react';
    import Papa from 'papaparse';
    import { useLabel } from './ChartContext';

    const prepareChartData = (data, metric) => {
        // 以 RunIndex 分组
        const groups = data.reduce((acc, item) => {
            const index = item["RunIndex"];
            if (!acc[index]) {
                acc[index] = [];
            }
            acc[index].push({
                type: item["BarChartType"],
                value: Number(item[metric])
            });
            return acc;
        }, {});

        return Object.keys(groups).sort().map(index => ({
            runIndex: index,
            data: groups[index]
        }));
    };

    const createRadarIndicator = (data) => {
        // 假设所有组共享相同的 BarChartTypes
        let types = [...new Set(data.flatMap(group => group.data.map(item => item.type)))];
        return types.map(type => ({
            name: `Type ${type}`,
            max: Math.max(...data.flatMap(group => group.data.filter(item => item.type === type).map(item => item.value))) * 1.2
        }));
    };

    const prepareRadarData = (groups) => {
        return groups.map(group => ({
            name: `RunIndex ${group.runIndex}`,
            value: group.data.map(item => item.value)
        }));
    };

    const DetailViewChart = ({ csvFile }) => {
        const { selectedLabel } = useLabel();
        const [chartOptions, setChartOptions] = useState([]);

        useEffect(() => {
            if (selectedLabel) {
                Papa.parse(csvFile, {
                    download: true,
                    header: true,
                    complete: function (results) {
                        const filteredData = results.data.filter(item => {
                            const labelString = `${item["ModelName"]},${item["SamplingTarget"]},${item["SamplingMethod"]},${item["DownsamplingLevel"]}`;
                            return labelString === selectedLabel;
                        });
                        const metrics = ['MeanDiff', 'MaxDiff', 'MinDiff', 'VarianceDiff'];
                        const chartsData = metrics.map(metric => {
                            const data = prepareChartData(filteredData, metric);
                            const indicators = createRadarIndicator(data);
                            const radarData = prepareRadarData(data);
                            return {
                                title: {
                                    text: `${metric} Data Radar Chart`,
                                    left: 'center',
                                    textStyle: {
                                        color: '#555555', // 标题文本颜色
                                        fontSize: 20, // 标题字体大小
                                        fontFamily: 'Georgia', // 标题字体
                                        fontWeight: 'bold' // 标题字体加粗
                                    }
                                },
                                tooltip: {},
                                legend: {
                                    data: radarData,
                                    top: "bottom"
                                },
                                radar: {
                                    indicator: indicators,
                                    name: {
                                        textStyle: {
                                            color: '#666666', // 坐标轴名称颜色
                                            fontSize: 12, // 坐标轴名称字体大小
                                            fontFamily: 'Comic Sans MS' // 坐标轴名称字体
                                        }
                                    },
                                    splitLine: {
                                        lineStyle: {
                                            color: '#af7ac5' // 网格线颜色
                                        }
                                    },
                                },
                                series: [{
                                    name: metric,
                                    type: 'radar',
                                    data: radarData
                                }]
                            };
                        });
                        setChartOptions(chartsData);
                    }
                });
            }
        }, [selectedLabel, csvFile]);

        return (
            <div>
                <br/>
                <div style={{ width: '100%' }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        alignItems: 'center', 
                        height: '100%', 
                        width: '80%',
                        marginLeft: 'auto' // 将这个容器向右对齐
                    }}>
                        <div style={{ 
                            fontFamily: 'FangSong', 
                            fontSize: 22, 
                            fontWeight: 'bold', 
                            textAlign: 'left', 
                            width: '100%' // 确保文字在容器内居中
                        }}>
                            当前选中的标签: {selectedLabel}
                        </div>
                    </div>
                </div>
                <br/><br/>
                <div style={{ display: 'flex', flexWrap:"wrap", gap: '20px'}}>
                    {chartOptions.map((options, index) => (
                        <div  key={index} style={{ width: 'calc(50% - 20px)', height: '400px' }}>
                        <ReactECharts option={options} style={{ height: '100%', width: '100%'}} />
                        </div>
                    ))} 
                </div>
            </div> 
        );
    };

    export default DetailViewChart;