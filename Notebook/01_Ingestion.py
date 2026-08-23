# Databricks notebook source

file_path = "/Volumes/workspace/retail_project/raw_data/SampleSuperstore.csv"

df = (
    spark.read
         .format("csv")
         .option("header", "true")
         .option("inferSchema", "true")
         .load(file_path)
)

display(df)

# COMMAND ----------

# Number of rows and columns
print(f"Rows: {df.count()}")
print(f"Columns: {len(df.columns)}")

# COMMAND ----------

# Display the schema
df.printSchema()

# COMMAND ----------

# Show the first 5 rows
df.show(5)


# COMMAND ----------

from pyspark.sql.functions import col

# Replace spaces with underscores in all column names
for column in df.columns:
    df = df.withColumnRenamed(column, column.replace(" ", "_"))

# Check the new column names
print(df.columns)

# COMMAND ----------

df.write \
    .format("delta") \
    .mode("overwrite") \
    .saveAsTable("workspace.retail_project.bronze_sales")

# COMMAND ----------

spark.sql("SELECT * FROM workspace.retail_project.bronze_sales").show(10)

# COMMAND ----------

