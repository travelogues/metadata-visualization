import csv
import json
import re

INPUT_FILE = '../data/TravelogueD16_filtered.csv'
OUTPUT_FILE = '../data/TravelogueD16.json'

def parse_gnd_field(field, default = 'Unknown'):
  if (field):
    tokens = field.split(';')
    return list(filter(lambda t: t.strip().startswith('(DE-') == False and len(t.strip()) > 0, tokens))
  else:
    return [ default ]

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

def parse_nullable(field, default, split):
  if (field):
    if (split):
      return [ str.strip() for str in field.split(';') ]
    else:
      return field.strip()
  else:
    return default

with open(INPUT_FILE, 'r') as infile, open(OUTPUT_FILE, 'w') as outfile:
  reader = csv.reader(infile)

  next(reader) # Skip header

  as_json = []
  
  for row in reader:
    publishers = parse_gnd_field(row[4])
    printers = parse_gnd_field(row[5])

    # For convenience
    people = list(set(publishers + printers))
    if (len(people) > 1):
      people = [ p for p in people if p != 'Unknown' ]
    
    as_json.append({
      'identifier': row[0],
      'barcodes': parse_nullable(row[1], [], True),
      'urls': parse_nullable(row[2], [], True),
      'place_of_publication': parse_gnd_field(row[3])[0],
      'publishers': publishers,
      'printers': printers,
      'people': people,
      'date': parse_date(row[6]),
      'marker_regions': parse_markers(row[7]),
      'work_title': row[8],
      'title_full': row[9]
    })

  outfile.write(json.dumps(as_json, indent=2))