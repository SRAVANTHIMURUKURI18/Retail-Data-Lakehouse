# Databricks notebook source
from pyspark.sql.functions import *

# COMMAND ----------

df = spark.table("workspace.retail_project.silver_sales")

display(df)

# COMMAND ----------

print("Total Records:", df.count())

# COMMAND ----------

from pyspark.sql.functions import col, when, count

df.select([
    count(when(col(c).isNull(), c)).alias(c)
    for c in df.columns
]).show()

# COMMAND ----------

total_rows = df.count()
unique_rows = df.dropDuplicates().count()

print("Total Rows :", total_rows)
print("Unique Rows:", unique_rows)
print("Duplicate Rows:", total_rows - unique_rows)

# COMMAND ----------

df.printSchema()

# COMMAND ----------

df.select(
    min("sales").alias("Min Sales"),
    max("sales").alias("Max Sales"),
    avg("sales").alias("Average Sales"),
    min("profit").alias("Min Profit"),
    max("profit").alias("Max Profit")
).show()

# COMMAND ----------

invalid_sales = df.filter(col("sales") < 0)

print("Invalid Sales Records:", invalid_sales.count())

# COMMAND ----------

invalid_quantity = df.filter(col("quantity") <= 0)

print("Invalid Quantity Records:", invalid_quantity.count())

# COMMAND ----------

print("========== DATA QUALITY REPORT ==========")
print(f"Total Records      : {df.count()}")
print(f"Duplicate Records  : {total_rows - unique_rows}")
print(f"Invalid Sales      : {invalid_sales.count()}")
print(f"Invalid Quantity   : {invalid_quantity.count()}")
print("=========================================")

# COMMAND ----------

