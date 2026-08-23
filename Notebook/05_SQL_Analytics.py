# Databricks notebook source
# MAGIC %sql
# MAGIC SELECT *
# MAGIC FROM workspace.retail_project.gold_region_sales;

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT region,
# MAGIC        total_sales
# MAGIC FROM workspace.retail_project.gold_region_sales
# MAGIC ORDER BY total_sales DESC;

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT category,
# MAGIC        total_sales,
# MAGIC        total_profit
# MAGIC FROM workspace.retail_project.gold_category_sales
# MAGIC ORDER BY total_sales DESC;

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT *
# MAGIC FROM workspace.retail_project.gold_top_states;

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT *
# MAGIC FROM workspace.retail_project.gold_discount_analysis
# MAGIC ORDER BY discount;

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT
# MAGIC     ROUND(SUM(sales),2) AS total_sales,
# MAGIC     ROUND(SUM(profit),2) AS total_profit,
# MAGIC     SUM(quantity) AS total_quantity
# MAGIC FROM workspace.retail_project.silver_sales;

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT
# MAGIC     region,
# MAGIC     ROUND(SUM(profit),2) AS total_profit
# MAGIC FROM workspace.retail_project.silver_sales
# MAGIC GROUP BY region
# MAGIC ORDER BY total_profit DESC;

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT
# MAGIC     state,
# MAGIC     ROUND(SUM(sales),2) AS total_sales
# MAGIC FROM workspace.retail_project.silver_sales
# MAGIC GROUP BY state
# MAGIC ORDER BY total_sales DESC;

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT
# MAGIC     category,
# MAGIC     ROUND(AVG(discount),2) AS avg_discount
# MAGIC FROM workspace.retail_project.silver_sales
# MAGIC GROUP BY category;

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT
# MAGIC     state,
# MAGIC     ROUND(SUM(profit),2) AS total_profit
# MAGIC FROM workspace.retail_project.silver_sales
# MAGIC GROUP BY state
# MAGIC ORDER BY total_profit DESC
# MAGIC LIMIT 5;

# COMMAND ----------

