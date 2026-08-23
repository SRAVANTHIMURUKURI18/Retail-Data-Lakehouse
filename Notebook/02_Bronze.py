# Databricks notebook source
from pyspark.sql.functions import *

bronze_df = spark.table("workspace.retail_project.bronze_sales")

display(bronze_df)

# COMMAND ----------

from pyspark.sql.functions import current_timestamp, lit

bronze_df = bronze_df.withColumn(
    "ingestion_timestamp",
    current_timestamp()
)

bronze_df = bronze_df.withColumn(
    "source_system",
    lit("Sample Superstore CSV")
)

display(bronze_df)

# COMMAND ----------

bronze_df.write \
    .format("delta") \
    .mode("overwrite") \
    .option("overwriteSchema", "true") \
    .saveAsTable("workspace.retail_project.bronze_sales")

# COMMAND ----------

spark.sql("""
SELECT *
FROM workspace.retail_project.bronze_sales
LIMIT 5
""")

# COMMAND ----------

