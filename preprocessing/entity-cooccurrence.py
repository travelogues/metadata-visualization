import csv
import json
import numpy as np
import scipy.sparse as sparse
import matplotlib.pyplot as plt

INFILE = '../data/TravelogueD16_filtered_entities.csv'
OUT_EDGE_CSV = '../data/TravelogueD16_entities_cooccurrence.csv'
OUT_NODE_JSON = '../data/TravelogueD16_entities_nodes.json'
OUT_EDGE_JSON = '../data/TravelogueD16_entities_edges.json'

nodes = [] # Distinct entities { 'label': ..., 'type' ... }
edges = []

co_occurrences = [] # The list of entities per work

with open(INFILE) as infile, open(OUT_EDGE_CSV ,'w') as outfile:
  
  reader = csv.reader(infile)

  next(reader)
  for row in reader:
    # Ugly hack because... Python
    locations = [ f'{e}@LOC' for e in row[1].split(';') ] 
    people = [ f'{e}@PER' for e in row[2].split(';') ] 

    entities = [ e for e in locations + people if len(e) > 4 ]

    nodes += entities

    co_occurrences.append(entities)

  # Deduplicate
  nodes = list(set(nodes))

  # Write edge list CSV (use Gephi headers)
  outfile.write('Source,Target\n')

  for idxA in range(0, len(nodes)):
    for idxB in range(idxA + 1, len(nodes)):
      count = 0

      for t in co_occurrences:
        if nodes[idxA] in t and nodes[idxB] in t:
          count += 1

      if (count > 0):
        # print(f'{a} x {b} = {count}')
        edges.append([ nodes[idxA], nodes[idxB], count ])
        outfile.write(f'{nodes[idxA]},{nodes[idxB]}\n')

with open(OUT_NODE_JSON, 'w') as outnodes, open(OUT_EDGE_JSON, 'w') as outedges:

  def to_json_node(str):
    tokens = str.split('@')
    return { 'id': str, 'label': tokens[0], 'type': tokens[1] }

  def to_json_edge(t):
    from_node = t[0]
    to_node = t[1]
    count = t[2]
    return { 'source': from_node, 'target': to_node, 'value': count }

  json_nodes = [ to_json_node(n) for n in nodes ]
  json_edges = [ to_json_edge(e) for e in edges ]

  outnodes.write(json.dumps(json_nodes, indent=2))
  outedges.write(json.dumps(json_edges, indent=2))