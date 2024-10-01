import pandas as pd

def process_csv():
    # Reading the CSV file
    df = pd.read_csv('NexTier - Frac Dataset.csv')
    
    # Dropping unnecessary columns
    df.drop(df.columns[[5, 6, 8, 17, 19, 21]], axis=1, inplace=True)
    
    # Convert 'Log Event Dt' to datetime format with dayfirst=True and handling errors
    df['Log.Event Dt'] = pd.to_datetime(df['Log.Event Dt'], dayfirst=True, errors='coerce')

    # Drop rows where the date is NaT (invalid dates)
    df = df.dropna(subset=['Log.Event Dt'])
    
    # Creating the NPT_ext column by summing the relevant external NPT columns
    df['NPT_ext'] = df[['NPT (Customer + Weather)', 'NPT (Customer)', 'NPT (Daylight Ops)', 'NPT (Weather)']].sum(axis=1)
    
    # Creating the NPT_int column by summing the relevant internal NPT columns
    df['NPT_int'] = df[['NPT (NEX Equipment)', 'NPT (NEX Support/Logistics/Other)']].sum(axis=1)
    
    # Dropping irrelevant columns after NPT calculation
    df.drop(df.iloc[:, 6:13], inplace=True, axis=1)
    
    # Ensure there are no missing values
    df.fillna(0, inplace=True)
    
    # Grouping by Fleet Name and Log Event Date, then summing the relevant columns
    grouped_df = df.groupby(['Fleet Name', 'Log.Event Dt']).agg({
        'Pumping Hours': 'sum',
        'Transition Time (hrs)': 'sum',
        'NPT_int': 'sum',
        'Time Available (hrs)': 'sum',
        'NPT_ext': 'sum'
    }).reset_index()
    
    # Calculate the ranking score
    grouped_df['Ranking Score'] = (grouped_df['Pumping Hours'] - grouped_df['Transition Time (hrs)'] - grouped_df['NPT_int']) / (grouped_df['Time Available (hrs)'] - grouped_df['NPT_ext'])
    
    # Rank fleets based on the calculated ranking score
    grouped_df['Daily_Rank'] = grouped_df.groupby('Log.Event Dt')['Ranking Score'].rank(ascending=False)
    
    # Sort by date and rank
    grouped_df = grouped_df.sort_values(by=['Log.Event Dt', 'Daily_Rank'])
    
    # Saving to output.csv
    grouped_df.to_csv('output.csv', index=False)
    
    print("Output saved to output.csv")

# Execute the function to process data and save the results
process_csv()
