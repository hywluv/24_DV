import json

from flask import Flask, request, jsonify, make_response
import requests
from flask_cors import CORS

import openai
import pandas as pd

openai_api_key = 'sk-YdrilWs1mQCEfAcfAa0bC51743Cf4bA9Ab454eB76621006f'

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


@app.route('/ask', methods=['POST', 'OPTIONS'])  # 处理POST和OPTIONS请求
def ask():
    if request.method == 'OPTIONS':  # 对预检请求作出响应
        resp = make_response()
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return resp

    data = request.json
    df = pd.read_csv('/Users/hyw/Hyw_doc/Code/ZJUCS-24Spring/24DV/Proj2/public/data/avg.csv')
    data_prompts = df.to_string(index=False)
    print(data_prompts)
    prompt = data['prompt']
    headers = {
        'Authorization': f'Bearer {openai_api_key}',
        'Content-Type': 'application/json',
    }
    message = {
        'model': 'gpt-4o',  # 指定使用 GPT-3.5 Turbo
        'messages': [
            {
                "role": "system",
                "content": "You are a helpful assistant. There is the data about the The dataset contains empirical "
                           "study results from several AI algorithms reading charts like the ones here."
                           + data_prompts + "The value bigger means the algorithm is worse."
                           "Please answer the following questions based on the data using one paragraph."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        'max_tokens': 1000,
        'temperature': 0.5,
    }

    response = requests.post(
        'https://api.xiaoai.plus/v1/chat/completions',
        headers=headers,
        data=json.dumps(message)
    )
    print(response.json())
    return jsonify(response.json())


if __name__ == '__main__':
    app.run(debug=True, port=5011)
