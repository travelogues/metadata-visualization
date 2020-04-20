import pandas as pd

INPUT_FILE = '../data/TravelogueD16_filtered.csv'

data = pd.read_csv(INPUT_FILE, delim_whitespace=False, sep=',', quotechar='"', index_col=0)

unique = data['Verleger normiert ; GND-ID'].unique()
print(unique)