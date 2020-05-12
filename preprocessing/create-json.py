import csv
import json
import re

INPUT_FILE = '../data/TravelogueD16_filtered.csv'
NER_RESULTS = '../data/TravelogueD16_filtered_entities.csv'
OUTPUT_FILE = '../visualization/public/TravelogueD16.json'

def load_entities():
  with open(NER_RESULTS) as infile:
    reader = csv.reader(infile)
    next(reader)

    def split(entities):
      if (len(entities.strip()) == 0):
        return []
      else:
        return entities.split(';')
    
    entity_dict = {}
    for row in reader:
      entity_dict[row[0]] = {
        'locations': split(row[1]),
        'people': split(row[2])
      }

    return entity_dict

def parse_gnd_field(field, default = '[Unknown]'):
  if (field):
    tokens = field.split(';')
    return list(filter(lambda t: t.strip().startswith('(DE-') == False and len(t.strip()) > 0, tokens))
  else:
    return [ default ]

def parse_date(field):
  """
  fields = field.split('[')
  numbers_only = re.sub('[^0-9]', '', fields[len(fields) - 1])
  if numbers_only:
    if (len(numbers_only) > 4):
      print(field)
    return int(numbers_only)
  else:
    return None
  """
  return int(field)

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

entity_dict = load_entities()

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
      people = [ p for p in people if p != '[Unknown]' ]

    date = parse_date(row[6])
    
    if (date):
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
        'title_full': row[9],
        'entities': entity_dict[row[0]] if row[0] in entity_dict else []
      })

  outfile.write(json.dumps(as_json, indent=2))