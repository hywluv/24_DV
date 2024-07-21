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
        let data = results.data.map(item => ({
          label: `${item["BarChartType"]}, ${item["ModelName"]}, ${item["SamplingTarget"]}, ${item["SamplingMethod"]}, ${item["DownsamplingLevel"]}`,
          value: parseFloat(item[state.OverviewSelection || "Average MeanDiff"])
        }));

        if (sortOrder === 'ascending') {
          data.sort((a, b) => a.value - b.value);
        } else if (sortOrder === 'descending') {
          data.sort((a, b) => b.value - a.value);
        }

        const options = {
          title: {
            text: 'Overview',
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
              show: false,
              interval: 0,
              rotate: 45
            }
          },
          yAxis: {
            type: 'value',
            name: state.OverviewSelection ? state.OverviewSelection.replace('value', '') : 'Default'
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
      <button onClick={() => setSortOrder('ascending')}>Sort Ascending</button>
      <button onClick={() => setSortOrder('descending')}>Sort Descending</button>
      <button onClick={() => setSortOrder('none')}>Restore Original Order</button>
    </div>
  );
};

export default TotalFromCSV;