# A-Frame and NCAA Men's Basketball

## Demos
[Interactive 3D Chart](https://hopetambala.github.io/aframe-NCAAB/aFrame/)

<p align="middle">
    <img src="https://github.com/hopetambala/aframe-NCAAB/blob/master/assets/Aframe.png">
</p>

## Description
The goal of this project was to use Google's BigQuery Python client library to query data in [Kaggle's NCAA Basketball data](https://www.kaggle.com/ncaa/ncaa-basketball) which dates from as far back as 1894. We chose a subset of data from the 2017-2018 NCAA Basketball Tournament bracket and created an A-Frame Visualization. 

The data was queried into a Pandas to allow for easier data manipulation. CSVs of the data were generated and placed into the Aframe folder. Using d3, that data was loaded into Aframe to create a 3D "Bracket-like" Scatter Plot that explores the relationships between the basketball teams
A) Seed in the Tournament
B) Playing Style
C) Progression into the tournament.

## Resources 
[NCAAB Data Set](https://www.kaggle.com/ncaa/ncaa-basketball)

[Basketball Analytics](https://www.nbastuffer.com/team-evaluation-metrics/)

## Libraries
[Pandas](https://pandas.pydata.org/)

[Google BigQuery](https://cloud.google.com/bigquery/docs/reference/libraries)

[A-Frame](https://aframe.io/)


## Project Layout
    ├── python                    # Folder for data generation script and data in csvs
    ├── javascript                # Folder for Aframe 
    ├── LICENSE              
    └── README.md

## Build and run

### Python 
Install virtual environment library
```
cd python/
pip install virtualenv #if you don't have virtualenv installed 
```

Create and activate virtualenv
```
virtualenv <Name_of_Virtual_Environment>
source <Name_of_Virtual_Environment>/bin/activate
```

Install project requirements usings the reqs.text
```
pip install -r reqs.txt
```

Install BigQuery helper function
```
pip install -e git+https://github.com/SohierDane/BigQuery_Helper#egg=bq_helper
```

Enable Google authentication by exporting the required .json keys via terminal
```
export GOOGLE_APPLICATION_CREDENTIALS=./secrets/Data\ Visualization-0a64d281dd18.json
```

Run python script to generate CSV via terminal
```
python bball_query.py
```

### Javascript 
Run the following in the javascript folder to start your own server
```
python -m SimpleHTTPServer
```
## Tutorial & Development

### Kaggle

### BigQuery

### Pandas
#### NBA Analytics and Equations

### AFrame

#### d3 Data Manipulation


## Extras
### Created Metrics
[Win Chance Percentage](https://public.tableau.com/views/NCAAB-aFrame/WinPCTChange?:embed=y&:display_count=yes&publish=yes)

[Transition Offense](https://public.tableau.com/profile/hope.tambala#!/vizhome/NCAAB-aFrame/TransitionOffense)