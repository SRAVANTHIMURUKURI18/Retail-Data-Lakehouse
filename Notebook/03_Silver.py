# Databricks notebook source
from pyspark.sql.functions import *

bronze_df = spark.table("workspace.retail_project.bronze_sales")

display(bronze_df)

# COMMAND ----------

for column in bronze_df.columns:
    bronze_df = bronze_df.withColumnRenamed(
        column,
        column.lower().replace(" ", "_")
    )

print(bronze_df.columns)

# COMMAND ----------

silver_df = bronze_df.dropDuplicates()
silver_df.show(5)

# COMMAND ----------

silver_df = bronze_df.dropDuplicates()

display(silver_df)

# COMMAND ----------

silver_df.write \
.mode("overwrite") \
.option("overwriteSchema", "true") \
.saveAsTable("workspace.retail_project.silver_sales")

# COMMAND ----------

spark.table("workspace.retail_project.silver_sales").show(5)

# COMMAND ----------

print(silver_df.columns)


# COMMAND ----------

silver_df.write \
    .format("delta") \
    .mode("overwrite") \
    .option("overwriteSchema", "true") \
    .saveAsTable("workspace.retail_project.silver_sales")

# COMMAND ----------

