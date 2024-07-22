import React, { useState, useEffect, useContext } from 'react';
import ReactECharts from 'echarts-for-react';
import Papa from 'papaparse';
import { store } from '../../store';

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

const diagonalPattern = {
  type: 'pattern',
  image: {
    src: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <defs>
          <pattern id="pattern" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="10" y2="10" stroke="#000" stroke-width="2"/>
          </pattern>
        </defs>
        <rect width="20" height="20" fill="url(#pattern)"/>
      </svg>
    `),
  },
};

const TotalFromCSV = ({ csvFile }) => {
  const [options, setOptions] = useState({});
  const [sortOrder, setSortOrder] = useState('none');  // 控制排序的状态
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    Papa.parse(csvFile, {
      download: true,
      header: true,
      complete: (results) => {
        // 按照组合分组并计算平均值
        const groupedData = {};
        results.data.forEach(item => {
          const groupKey = `${item["ModelName"]},${item["SamplingTarget"]},${item["SamplingMethod"]},${item["DownsamplingLevel"]}`;
          const value = parseFloat(item[state.OverviewSelection || "Average MeanDiff"]);
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = { sum: 0, count: 0, label: item["BarChartType"] };
          }
          groupedData[groupKey].sum += value;
          groupedData[groupKey].count += 1;
        });

        // 将分组数据转换为图表所需的格式
        const data = Object.keys(groupedData).map(key => ({
          label: /*groupedData[key].label + ' - ' + */key,
          value: groupedData[key].sum / groupedData[key].count
        }));

        // 根据用户选择对数据进行排序
        if (sortOrder === 'ascending') {
          data.sort((a, b) => a.value - b.value);
        } else if (sortOrder === 'descending') {
          data.sort((a, b) => b.value - a.value);
        }

        // 设置图表选项
        const options = {
          title: {
            text: '按模型和采样特征概览',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: data.map(item => item.label),
            axisLabel: {
              show: true,
              interval: 0,
              rotate: 45
            }
          },
          yAxis: {
            type: 'value',
            name: state.OverviewSelection ? state.OverviewSelection.replace('value', '') : '默认'
          },
          series: [{
            itemStyle:{
              borderRadius: [10,10,0,0],
              shadowColor: 'rgba(0, 0, 0, 0.4)',
              shadowBlur: 10,
              color: 'diagonalPattern', 
            },
            data: data.map((item) => ({
              value: item.value,
              itemStyle: {
               // borderRadius: shapeMapping[item.label.split(',')[2]],
                color:{
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0, color: colorMapping[item.label.split(',')[3]].split('linear-gradient(45deg, ')[1].split(', ')[0]
                    },
                    {
                      offset: 1, color: colorMapping[item.label.split(',')[3]].split(', ')[1].split(')')[0]
                    },
                  ],
                },
                
              },
            })),
            
            barWidth: '60%',
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              //color: 'rgba(220, 220, 220, 0.8)'
            }
          }]
        };
        setOptions(options);
      }
    });
  }, [csvFile, state.OverviewSelection, sortOrder]);

  return (
    <div>
      <ReactECharts option={options} style={{ height: 400 }} />
      <button onClick={() => setSortOrder('ascending')}>as</button>
      <button onClick={() => setSortOrder('descending')}>de</button>
      <button onClick={() => setSortOrder('none')}>re</button>
    </div>
  );
};

export default TotalFromCSV;