# Repo for ZJU 2024 Summer semester Data Visualization Class

## Introduction

This is the repository for the Project2 of course Data Visualization in ZJU 2024 Summer semester. 
Our topic is about establishing the data analysis and visualization in the field of Computer Vision algorithms.

## Team Members and Contribution info

- **Yuwei Hu** [@Starrism](https://github.com/hywluv)
  - Class: Mix 2206
  - Team Leader
  - Data Preprocessing
  - Analysis System Function Design
- **Zhe Yin** [@InGeYZ](https://github.com/InGeYZ)
  - Class: Mix 2306
  - html and css design
  - UI design
- **Daiyang Wu** [@Daiyang Wu](https://github.com/74666666666)
  - Class: Turing 2201
  - Data Analysis
  - css and UI design

You can view contribution details of our work in the commit graph. You can contact us via email [@hyw](hyw-luv@zju.edu.cn) if you have any questions.

## File Structure

```text
.
├── README.md
├── package.json
├── package-lock.json
├── .gitignore
├── public
│   ├── data
│   │   ├── meta // meta data of the dataset
│   │   │    └── *.csv
│   │   ├── data_modified.py // data preprocessing script
│   │   ├── avg.csv // preprocessed data
│   │   └── processed.csv // preprocessed data
│   └── template_files.* // given by template repo
└── src
    ├── index.js
    ├── index.css
    ├── logo.svg
    ├── serviceWorker.js
    ├── setupTests.js
    ├── backend
    │   └── openai_backend.py // backend Insight script
    ├── css
    │   └── *.css
    ├── test
    │   └── App.test.js
    ├── store
    │   ├── api.js
    │   ├── data.js
    │   ├── index.js
    │   └── reducer.js
    └── components
        ├── App.js
        ├── AssistView.js
        ├── DetailView.js
        ├── ControlPanel.js
        ├── Overview.js
        ├── AssistView
        │   ├── AssistChart.js
        │   └── ConditionSelector.js
        ├── Overview
        │   ├── ChartContext.js // Context for Overview Chart and Detail Chart
        │   ├── OverviewSelector.js
        │   ├── Total.js // Overview Chart
        │   └── DetailChart.js
        └── question_answer
            └── qa.js
```

## How to run

1. Clone the repository

```bash
git clone git@github.com:hywluv/24_DV.git
```

2. Install dependencies

```bash
npm install
pip install flask flask_cors pandas requests openai
```

3. modify your openai api key in `src/backend/openai_backend.py`

```bash
# openai api
export OPENAI_API_KEY="your api key"
```

4. Run the project

```bash
npm start
python3 src/backend/openai_backend.py # backend running on port 5011
```

4. Open your browser and visit `http://localhost:3000/`