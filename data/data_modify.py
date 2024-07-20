# put the data in the ./meta
import os
import pandas as pd
import re

def parse_filename(filename):
    # 编译一个正则表达式来匹配文件名结构
    pattern = re.compile(r'(\d+)(VGG19|ResNet50)(Ratio|Height)(IID|COV|ADV|OOD)\.(\d+)\.(\d+)\.csv')

    # 尝试匹配给定的文件名
    match = pattern.match(filename)
    if match:
        # 提取所有相关的组件
        bar_chart_type = int(match.group(1))
        model_name = match.group(2)
        sampling_target = match.group(3)
        sampling_method = match.group(4)
        downsampling_level = int(match.group(5))
        run_index = int(match.group(6))
        
        # 返回解析结果
        return {
            'BarChartType': bar_chart_type,
            'ModelName': model_name,
            'SamplingTarget': sampling_target,
            'SamplingMethod': sampling_method,
            'DownsamplingLevel': downsampling_level,
            'RunIndex': run_index
        }
    else:
        # 如果匹配失败，返回一个错误信息
        return None

def process_csv_data(file_path):
    df = pd.read_csv(file_path)
    df['Difference'] = abs(df['InferenceResult'] - df['GroundTruth'])
    
    # 计算差值的平均值和方差
    mean_difference = df['Difference'].mean()
    variance_difference = df['Difference'].var()
    
    total_rows = df.shape[0]
    
    return {
        'MeanDiff': mean_difference,
        'VarianceDiff': variance_difference,
        'TotalRows': total_rows
    }

# BarCharType ModelName SamplingTarget SamplingMethod DownsamplingLevel
def process_csv_files():
    data = []
    # 获取当前文件的绝对路径07002586930.9*36.+9*63.36.2
    current_file_path = os.path.abspath(__file__)
    # 获取当前文件所在的目录
    current_file_dir = os.path.dirname(current_file_path)
    path = os.path.join(current_file_dir, 'meta')
    files = os.listdir(path)
    for file in files:
        if file.endswith('.csv'):
            # 解析文件名
            parsed = parse_filename(file)
            if parsed is None:
                continue
            file_path = os.path.join(path, file)
            processed = process_csv_data(file_path)
            data.append({
                'BarChartType': parsed['BarChartType'],
                'ModelName': parsed['ModelName'],
                'SamplingTarget': parsed['SamplingTarget'],
                'SamplingMethod': parsed['SamplingMethod'],
                'DownsamplingLevel': parsed['DownsamplingLevel'],
                'RunIndex': parsed['RunIndex'],
                'MeanDiff': processed['MeanDiff'],
                'VarianceDiff': processed['VarianceDiff'],
                'TotalRows': processed['TotalRows']
            })
    return pd.DataFrame(data)
    
if __name__ == '__main__':
    df = process_csv_files()
    file_path = os.path.abspath(__file__)
    dir = os.path.dirname(file_path)
    file = os.path.join(dir, 'processed.csv')
    df.to_csv(file, index=False)