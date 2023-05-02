# Roadmap

## core features

- set terrain(s)
  list of terrains, randomly choose one
- set layer(s)
  list of layers, apply all
- standard filter

  - above/below degree
  - above/below level

- onlyOnTerrain(s)  
  list of terrains, OR
- onlyOnLayer(s)
  list of layers, OR

- onLand
- onWater
- onLava (is that not a lava block?)
- onBiome

- setTerrain and use -1 to skip when chosen:
  "terrain": [0,-1] => 50% skipped, 50% grass
- setBiome (is that a layer?)
- restrict operated area
  from (x,y) to (x,y)

## advanced features

- above/below WaterDepth
- perlin noise filter

  - absolute

- advanced filter
  - gradual
  - multiple filters addition, chaining, logical operations

## far distant future

- react frontend to interactivly build filters and export to config
