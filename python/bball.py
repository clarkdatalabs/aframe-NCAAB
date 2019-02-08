from google.cloud import bigquery
import bq_helper  # Helper functions for putting BigQuery results in Pandas DataFrames https://github.com/SohierDane/BigQuery_Helper
from pandas import DataFrame
import secret_data

#https://google-auth.readthedocs.io/en/latest/user-guide.html#service-account-private-key-files

client = bigquery.Client(project=secret_data.PROJECT_ID)

ncaa_basketball = bq_helper.BigQueryHelper(active_project="bigquery-public-data", dataset_name="ncaa_basketball")

# List of all the tables in the ncaa_basketball dataset
tables = ncaa_basketball.list_tables()

# Chosen Data Set
# mbb_teams_games_sr

# Query of All Data from Teams Games
query = """SELECT * 
            FROM `bigquery-public-data.ncaa_basketball.mbb_teams_games_sr`"""

df = ncaa_basketball.query_to_pandas_safe(query, max_gb_scanned=1)
df.to_csv(r'generated_data/'+'teams_games_all'+'.csv')


# Print 10000 Records of Each Table
'''
for x in tables:
    df = ncaa_basketball.head(x,10000)
    df.to_csv(r'generated_data/'+str(x)+'.csv')
    print('Generated '+ str(x))

# Table schema
for x in tables:
    df = ncaa_basketball.table_schema(x)
    print(df)
'''


