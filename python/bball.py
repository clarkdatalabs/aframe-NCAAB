from google.cloud import bigquery
import secret_data

#Export Credentials
'''
$ export GOOGLE_APPLICATION_CREDENTIALS="/path/to/keyfile.json"
'''
#https://google-auth.readthedocs.io/en/latest/user-guide.html#service-account-private-key-files

client = bigquery.Client(project=secret_data.PROJECT_ID)

# Perform a query.
QUERY = (
    'SELECT * FROM `bigquery-public-data.usa_names.usa_1910_2013` '
    'WHERE state = "TX" '
    'LIMIT 100')
query_job = client.query(QUERY)  # API request
rows = query_job.result()  # Waits for query to finish

for row in rows:
    print(row.name)
