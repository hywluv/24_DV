import React, { useState, useEffect, useContext } from 'react';
import ReactECharts from 'echarts-for-react';
import Papa from 'papaparse';
import { store } from '../../store';

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
          label: groupedData[key].label + ' - ' + key,
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
            data: data.map(item => item.value),
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
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