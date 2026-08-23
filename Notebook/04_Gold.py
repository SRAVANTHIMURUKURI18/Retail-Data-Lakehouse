# Databricks notebook source
from pyspark.sql.functions import *

silver_df = spark.table("workspace.retail_project.silver_sales")

display(silver_df)

# COMMAND ----------

gold_region = silver_df.groupBy("region") \
    .agg(
        round(sum("sales"), 2).alias("total_sales"),
        round(sum("profit"), 2).alias("total_profit"),
        sum("quantity").alias("total_quantity")
    )

display(gold_region)

# COMMAND ----------

gold_region.write \
.mode("overwrite") \
.option("overwriteSchema", "true") \
.saveAsTable("workspace.retail_project.gold_region_sales")

# COMMAND ----------

spark.table("workspace.retail_project.gold_region_sales").show()

# COMMAND ----------

from pyspark.sql.functions import *

# COMMAND ----------

silver_df = spark.table("workspace.retail_project.silver_sales")

display(silver_df)

# COMMAND ----------

gold_region = silver_df.groupBy("region") \
    .agg(
        round(sum("sales"), 2).alias("total_sales"),
        round(sum("profit"), 2).alias("total_profit"),
        sum("quantity").alias("total_quantity")
    )

display(gold_region)

# COMMAND ----------

gold_region.write \
.mode("overwrite") \
.option("overwriteSchema","true") \
.saveAsTable("workspace.retail_project.gold_region_sales")

# COMMAND ----------

gold_category = silver_df.groupBy("category") \
    .agg(
        round(sum("sales"),2).alias("total_sales"),
        round(sum("profit"),2).alias("total_profit"),
        sum("quantity").alias("total_quantity")
    )

display(gold_category)

# COMMAND ----------

gold_category.write \
.mode("overwrite") \
.option("overwriteSchema","true") \
.saveAsTable("workspace.retail_project.gold_category_sales")

# COMMAND ----------

top_states = silver_df.groupBy("state") \
    .agg(
        round(sum("sales"),2).alias("total_sales")
    ) \
    .orderBy(desc("total_sales")) \
    .limit(10)

display(top_states)

# COMMAND ----------

top_states.write \
.mode("overwrite") \
.option("overwriteSchema","true") \
.saveAsTable("workspace.retail_project.gold_top_states")

# COMMAND ----------

discount_analysis = silver_df.groupBy("discount") \
    .agg(
        round(avg("sales"),2).alias("avg_sales"),
        round(avg("profit"),2).alias("avg_profit")
    ) \
    .orderBy("discount")

display(discount_analysis)

# COMMAND ----------

discount_analysis.write \
.mode("overwrite") \
.option("overwriteSchema","true") \
.saveAsTable("workspace.retail_project.gold_discount_analysis")

# COMMAND ----------

spark.sql("SHOW TABLES IN workspace.retail_project").show(truncate=False)

# COMMAND ----------

