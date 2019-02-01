# dexJS-NCAAB


# Resources 
[NCAAB Data Set](https://www.kaggle.com/ncaa/ncaa-basketball)

# Possible Libraries
[Sample Dex Scatter Plot](https://bl.ocks.org/PatMartin/e0e3a3302f96ce7073eb0dd1df8a4512)
[Sample Elegans Scatter Plot](https://elegans.readthedocs.io/en/latest/supporting_charts.html#scatter)



## Project Layout
    ├── python                    # Folder for data generation script and data in csvs
    ├── dex                       # Folder for dexJS 
    ├── LICENSE              
    └── README.md

## Install Required Dependencies

### Python 
Install and Enter your Virtual Environment
```
cd python/
pip install virtualenv #if you don't have virtualenv installed 

virtualenv <Name_of_Virtual_Environment>
source <Name_of_Virtual_Environment>/bin/activate
```

Install project requirements
```
pip install -r reqs.txt
```

Install helper function
```
pip install -e git+https://github.com/SohierDane/BigQuery_Helper#egg=bq_helper

```

Enable Google authenticaiton
```
export GOOGLE_APPLICATION_CREDENTIALS=./secrets/Data\ Visualization-0a64d281dd18.json
```