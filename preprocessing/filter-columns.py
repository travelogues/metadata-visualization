"""
Filters the relevant columns from the soure CSV, so that we get 
something readable.
"""
import pandas as pd

INPUT_FILE = '../data/TravelogueD17_2020-05-04.csv'
OUTPUT_FILE = '../data/TravelogueD17_filtered.csv'

data = pd.read_csv(INPUT_FILE, delim_whitespace=False, sep=',', quotechar='"', index_col=0)
# print(data.iloc[17]) # Output a sample record

# data = data[data['Barcode'].notna()] # Remove rows without barcode
# data = data[data['Bar~data['Barcode'].str.startswith('Z') == False] # Remove non-barcode barcodes (argh)
# data = data[~data['Barcode'].str.contains(';')] # Remove multiple barcode columns

filtered = data[[
  'Systemnummer',
  'Barcode', 
  'Volltext',
  'Verlagsort normiert ; GND-ID',
  'Verleger normiert ; GND-ID',
  'Drucker ; GND-ID',
  'Erscheinungsjahr',
  'Marker',
  'Werktitel',
  'Haupttitel ; Titelzusatz ; Verantwortlichkeitsangabe'
]]


filtered.to_csv(OUTPUT_FILE, index=False)
