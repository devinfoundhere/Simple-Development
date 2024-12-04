import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import random

# Function to predict ARR over 10 years based on key parameters
def predict_arr(initial_arr, annual_growth_rate, churn_rate, market_cap, customer_acquisition_cost, retention_spending, economic_factor, competition_factor, years=10):
    annual_arr = [initial_arr]
    customer_base = initial_arr / 1000  # Assuming $1000 per customer for simplicity
    customer_base_list = [customer_base]
    
    for year in range(1, years + 1):
        # Calculate churned customers
        churned_customers = customer_base * churn_rate
        
        # Calculate new customers acquired, influenced by customer acquisition cost and competition factor
        new_customers = (annual_growth_rate * customer_base) / (1 + customer_acquisition_cost) * (1 - competition_factor)
        
        # Calculate retained customers due to retention spending
        retained_customers = customer_base * (1 - churn_rate) * retention_spending
        
        # Update customer base
        customer_base = customer_base - churned_customers + new_customers + retained_customers
        customer_base = min(customer_base, market_cap / 1000)  # Ensure customer base doesn't exceed market cap
        customer_base_list.append(customer_base)
        
        # Calculate ARR for the current year, factoring in economic conditions
        annual_revenue = customer_base * 1000  # Assuming $1000 per customer
        economic_adjustment = 1 + (random.uniform(-economic_factor, economic_factor))
        new_arr = annual_revenue * economic_adjustment
        annual_arr.append(new_arr)
    
    return annual_arr, customer_base_list

# User-provided parameters
initial_arr = 500000  # Initial ARR in dollars
annual_growth_rate = 0.4  # Annual growth rate (e.g., 40% growth per year)
churn_rate = 0.1  # Churn rate (e.g., 10% of customers leave per year)
market_cap = 10000000  # Market cap / total addressable revenue in dollars
customer_acquisition_cost = 0.2  # Cost to acquire a customer as a fraction of revenue per customer
retention_spending = 0.3  # Spending on retention as a fraction of revenue per customer
economic_factor = 0.05  # Economic factor affecting growth, e.g., +/- 5%
competition_factor = 0.1  # Competition factor reducing growth, e.g., 10%
years = 10  # Number of years to project

# Predict ARR
years_list = list(range(years + 1))
arr_projection, customer_base_projection = predict_arr(initial_arr, annual_growth_rate, churn_rate, market_cap, customer_acquisition_cost, retention_spending, economic_factor, competition_factor, years)

# Create DataFrame for visualization and analysis
data = pd.DataFrame({'Year': years_list, 'Projected ARR': arr_projection, 'Customer Base': customer_base_projection})

# Display the DataFrame
data.head(11)

# Plot the projected ARR
plt.figure(figsize=(12, 6))
plt.plot(data['Year'], data['Projected ARR'], marker='o', linestyle='-', color='b', label='Projected ARR')
plt.plot(data['Year'], data['Customer Base'], marker='s', linestyle='--', color='r', label='Customer Base')
plt.xlabel('Year')
plt.ylabel('Value (in USD or Customers)')
plt.title('Projected ARR and Customer Base Over 10 Years')
plt.legend()
plt.grid(True)
plt.show()
