import pandas as pd
import numpy as np

# Load your dataset
# Replace 'your_dataset.csv' with the actual filename or dataframe source
df = pd.read_csv('your_dataset.csv')

# Function to identify values two standard deviations away from the mean
def find_outliers(df):
    outliers = {}
    for column in df.select_dtypes(include=[np.number]).columns:
        mean = df[column].mean()
        std = df[column].std()
        lower_bound = mean - 2 * std
        upper_bound = mean + 2 * std
        outliers[column] = df[(df[column] < lower_bound) | (df[column] > upper_bound)][column]
    return outliers

# Find and display outliers
outliers = find_outliers(df)
for column, outlier_values in outliers.items():
    print(f"Outliers for '{column}':")
    print(outlier_values)
    print("\n")
