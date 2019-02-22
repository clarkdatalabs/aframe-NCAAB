# A-Frame and NCAA Men's Basketball


# Resources 
[NCAAB Data Set](https://www.kaggle.com/ncaa/ncaa-basketball)

# Libraries
[Pandas](https://pandas.pydata.org/)

[Google BigQuery](https://cloud.google.com/bigquery/docs/reference/libraries)

[A-Frame](https://aframe.io/)




## Project Layout
    ├── python                    # Folder for data generation script and data in csvs
    ├── javascript                # Folder for dexJS 
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

### Javascript 
Run the following in the javascript folder to start your own server
```
python -m SimpleHTTPServer
```

### Browser

[In-Browser](https://hopetambala.github.io/aframe-NCAAB/aFrame/)

