import csv
import numpy as np
import scipy.sparse as sparse
import matplotlib.pyplot as plt

INFILE = '../data/TravelogueD16_filtered_entities.csv'
OUTFILE = '../data/TravelogueD16_entities_cooccurrence.csv'

locations = []
tuples = []

arr = []

with open(INFILE) as infile, open(OUTFILE ,'w') as outfile:
  reader = csv.reader(infile)

  next(reader)
  for row in reader:
    locations += row[1].split(';')
    tuples.append(row[1])

  locations = list(set(locations))
  locations = [ l for l in locations if len(l) > 2 ]

  outfile.write('Source,Target\n')

  for a in locations:
    for b in locations:
      count = 0

      for t in tuples:
        if a != b:
          if a in t and b in t:
              count += 1

      if (count > 0):
        # print(f'{a} x {b} = {count}')
        # arr.append([locations.index(a), locations.index(b), count])
        outfile.write(f'{a},{b}\n')

"""
matrix = np.array(arr)
shape = tuple(matrix.max(axis=0)[:2]+1)
coo = sparse.coo_matrix((matrix[:, 2], (matrix[:, 0], matrix[:, 1])), shape=shape,vdtype=matrix.dtype)

#print(repr(coo))
fig, ax = plt.spy(coo, label=locations)
plt.xticks(locations)
plt.show()
"""