from google.cloud import bigquery
import bq_helper  # Helper functions for putting BigQuery results in Pandas DataFrames https://github.com/SohierDane/BigQuery_Helper
from pandas import DataFrame
import secret_data

#Export Credentials
'''
$ export GOOGLE_APPLICATION_CREDENTIALS="/path/to/keyfile.json"
'''
#https://google-auth.readthedocs.io/en/latest/user-guide.html#service-account-private-key-files

client = bigquery.Client(project=secret_data.PROJECT_ID)

ncaa_basketball = bq_helper.BigQueryHelper(active_project="bigquery-public-data", dataset_name="ncaa_basketball")

# List of all the tables in the ncaa_basketball dataset
tables = ncaa_basketball.list_tables()


for x in tables:
    df = ncaa_basketball.head(x,1000)
    df.to_csv(r'generated_data/'+str(x)+'.csv')
    print('Generated '+ str(x))

# Table schema
for x in tables:
    df = ncaa_basketball.table_schema(x)
    print(df)



