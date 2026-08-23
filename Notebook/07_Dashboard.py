# Databricks notebook source
gold_region = spark.table("workspace.retail_project.gold_region_sales")
gold_category = spark.table("workspace.retail_project.gold_category_sales")
gold_states = spark.table("workspace.retail_project.gold_top_states")
gold_discount = spark.table("workspace.retail_project.gold_discount_analysis")

# COMMAND ----------

display(gold_region)

# COMMAND ----------

display(gold_category)

# COMMAND ----------

display(gold_states)

# COMMAND ----------

display(gold_discount)

# COMMAND ----------

