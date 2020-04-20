import csv
import json
import re

INPUT_FILE = '../data/TravelogueD16_filtered.csv'
OUTPUT_FILE = '../data/TravelogueD16.json'

def parse_gnd_field(field):
  tokens = field.split(';')
  return list(filter(lambda t: t.strip().startswith('(DE-') == False and len(t.strip()) > 0, tokens))

def parse_date(field):
  numbers_only = re.sub('[^0-9]', '', field)
  return int(numbers_only)

def parse_markers(field):
  tokens = list(map(lambda str: str.strip(), field.split(';')))

  # Produces tokens like 'TravelogueD16 Südamerika Afrika Asien' and 'TravelogueD16 Orient'
  tokens = list(map(lambda str: str.replace('TravelogueD16', '').strip(), tokens))

  # Now we're down to lists like this: ['Orient', 'Asien Europa Afrika'] -> split/flatmap this
  tokens = list(map(lambda str: str.split(' '), tokens))
  return [y for x in tokens for y in x]

with open(INPUT_FILE, 'r') as infile, open(OUTPUT_FILE, 'w') as outfile:
  reader = csv.reader(infile)

  next(reader) # Skip header

  as_json = []
  
  for row in reader:
    as_json.append({
      'barcode': row[0],
      'url': row[6],
      'place_of_publication': parse_gnd_field(row[1])[0],
      'publishers': parse_gnd_field(row[2]),
      'printers': parse_gnd_field(row[3]),
      'people': list(set(parse_gnd_field(row[3]) + parse_gnd_field(row[2]))), # for convenience
      'date': parse_date(row[4]),
      'marker_regions': parse_markers(row[5]),
      'work_title': row[7],
      'title_full': row[8]
    })

  outfile.write(json.dumps(as_json, indent=2))