import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Papa from 'papaparse';
import { useLabel } from './ChartContext';

const prepareChartData = (data, metric) => {
    // 以 RunIndex 分组
    const groups = data.reduce((acc, item) => {
        // 增加 1 使 RunIndex 从 1 开始
        const index = parseInt(item["RunIndex"]) + 1;  // 确保转换为数字并加一
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

const getMaxPoints = (data, indicators) => {
    const maxPoints = {};

    // 找到每个 type 的最大值
    data.forEach(group => {
        group.data.forEach(item => {
            if (!maxPoints[item.type] || item.value > maxPoints[item.type].value) {
                maxPoints[item.type] = { value: item.value, runIndex: group.runIndex };
            }
        });
    });

    // 调试日志
    console.log('Max Points:', maxPoints);
    console.log('Indicators:', indicators);

    return Object.entries(maxPoints).map(([type, point]) => {
        // 确保 indicators 是有效的数组
        if (!Array.isArray(indicators)) {
            console.error('Indicators should be an array:', indicators);
            return null;
        }

        // 找到对应的 indicator
        const indicatorIndex = indicators.findIndex(indicator => indicator.name === `Type ${type}`);

        if (indicatorIndex === -1) {
            console.warn('Indicator not found for type:', type);
            return null;
        }

        return {
            coord: [indicatorIndex, point.value],
            value: point.value,
            symbol: 'pin',
            symbolSize: 50,
            label: {
                show: true,
                formatter: `{c}`,
                color: '#000',
                fontSize: 12
            },
            itemStyle: {
                color: 'red'
            }
        };
    }).filter(point => point !== null); // 过滤掉无效项
};

const prepareRadarData = (groups) => {
    return groups.map(group => ({
        name: `RunIndex ${group.runIndex}`,
        value: group.data.map(item => item.value)
    }));
};

const DetailViewChart = ({csvFile}) => {
    const {selectedLabel} = useLabel();
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
                        const maxPoints = getMaxPoints(data);

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
                                data: radarData.map(item => item.name),
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
                                data: radarData,
                                /*label: {
                                    show: true,
                                    formatter: (params) => `${params.value.toFixed(2)}`, // 控制显示的位数
                                    color: '#000',
                                    fontSize: 12
                                },*/
                                markPoint:{
                                    data: maxPoints
                                },
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
            <div style={{width: '100%'}}>
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
            <div style={{display: 'flex', flexWrap: "wrap", gap: '20px'}}>
                {chartOptions.map((options, index) => (
                    <div key={index} style={{width: 'calc(50% - 20px)', height: '400px'}}>
                        <ReactECharts option={options} style={{height: '100%', width: '100%'}}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetailViewChart;