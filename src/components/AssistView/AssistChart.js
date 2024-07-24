import React, { useState, useEffect, useContext } from 'react';
import Papa from 'papaparse';
import ReactECharts from 'echarts-for-react';
import { store } from '../../store';  // 确保这里的路径正确，指向您的 Context 存储设置
import '../../index.css'

const gradientColor1 = ['#FF8C00', '#FFD700'];
const gradientColor2 = ['#1E90FF', '#87CEEB'];

function formatNumber(value) {
    return value.toFixed(4); // Adjust the number of decimal places here
}

function AssistView({ csvFile }) {
    const { state } = useContext(store);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        Papa.parse(csvFile, {
            download: true,
            header: true,
            complete: results => {
                const data = results.data;
                const filteredData1 = filterData(data, state.filters1);
                const filteredData2 = filterData(data, state.filters2);
                const stats1 = calculateStats(filteredData1);
                const stats2 = calculateStats(filteredData2);

                setChartData([
                    {category: 'Mean', model1: stats1.mean, model2: stats2.mean},
                    {category: 'Variance', model1: stats1.variance, model2: stats2.variance},
                    {category: 'Max', model1: stats1.max, model2: stats2.max},
                    {category: 'Min', model1: stats1.min, model2: stats2.min}
                ]);
            }
        });
    }, [csvFile, state.filters1, state.filters2]);

    function filterData(data, filters) {
        return data.filter(item => {
            return Object.keys(filters).every(key => {
                return filters[key] === 'N/A' || item[key] === filters[key];
            });
        });
    }

    function calculateStats(data) {
        if (data.length === 0) return { mean: 0, variance: 0, max: 0, min: 0 };

        const sum = data.reduce((acc, curr) => acc + parseFloat(curr.MeanDiff), 0);
        const mean = sum / data.length;
        const variance = data.reduce((acc, curr) => acc + Math.pow(parseFloat(curr.MeanDiff) - mean, 2), 0) / data.length;
        const max = Math.max(...data.map(item => parseFloat(item.MeanDiff)));
        const min = Math.min(...data.map(item => parseFloat(item.MeanDiff)));

        return { mean, variance, max, min };
    }

    const options = {
        tooltip: {},
        legend: {
            data: ['Model 1', 'Model 2']
        },
        xAxis: {
            type: 'category',
            data: chartData.map(item => item.category),
            axisLabel: {
                margin:10,
                show: true,
                interval: 0,
                rotate: 0,
                fontFamily: 'Menlo',
                fontSize: 12,
                color:'#000',
              }
        },
        yAxis: {
            type: 'value',
            nameTextStyle:{fontSize: 14, color: '#333', fontFamily: 'Menlo'}, 
            axisLabel:{fontFamily: 'Comic Sans MS', fontSize: 12, color:'#000'}
        },
        series: [
            {
                name: 'Model 1',
                type: 'bar',
                data: chartData.map(item => item.model1),
                backgroundStyle: {
                    color: 'rgba(220, 220, 220, 0.3)'
                },
                itemStyle:{
                    borderRadius: [10,10,0,0],
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 5,
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: gradientColor1[0] },
                            { offset: 1, color: gradientColor1[1] }
                        ]
                    },
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter:(params) => formatNumber(params.value), // 显示数值
                    fontSize: 12,
                    color: '#000'
                },
            },
            {
                name: 'Model 2',
                type: 'bar',
                data: chartData.map(item => item.model2),
                backgroundStyle: {
                    color: 'rgba(220, 220, 220, 0.3)'
                },
                itemStyle:{
                    borderRadius: [10,10,0,0],
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 5,
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: gradientColor2[0] },
                            { offset: 1, color: gradientColor2[1] }
                        ]
                    },
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter:(params) => formatNumber(params.value), // 显示数值
                    fontSize: 12,
                    color: '#000'
                },  
            }
        ]
    };

    return (
        <div className='assistchart-container'>
            <ReactECharts option={options} style={{ height: 600, width: '100%' }} />
        </div>
    );
}

export default AssistView;