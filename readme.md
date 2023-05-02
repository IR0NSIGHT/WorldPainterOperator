# AdvancedOperator

github: https://github.com/IR0NSIGHT/WorldPainterOperator
The AdvancedOperator provides a way to run global operations in WorldPainter using
config files.
It supports more detailed filters than WorldPainter does, for example allowing above and below slope filters at the same time, perlin noise operators, choosing randomly from a list of terrains to set, ...

## Running the script

Execute the script from within WorldPainter with (Top of Window)>>Tools>>Run script
select the AdvancedOperator.js file
select a config file of your liking
hit run

## Building a config

in the configs folder you will find some example configs.
the config must obey the JSON format, with the exception that comments are allowed in the form of (a comment)
comments can span multiple lines.
in its most basic form an operation has a name, and (optional) some actions:

```json
{
  "name": "my first operation, all is grass",
  "terrain": 0
}
```

```json
{
  "name": "set everything to grass/dirt and frost",
  "terrain": [0, 1],
  "layer": ["Frost", 1]
}
```

you can use `"terrain": 42` to set the terrain with id: 42.
if you give a list of terrain: `"terrain": [42, 0, 0, 57]`, for each block the used terrain is randomly chosen from the terrain ID list.
This means that `"terrain": [0,1]` will randomly sprinkle grass(id=0) (50%) and dirt(id=1)(50%) blocks.

A list of block-ids for worldpainter can be found here: https://www.worldpainter.net/trac/wiki/Scripting/TerrainTypeValues

It works similar for setting layers, with one exception.
`"layer": ["Frost",1]` will set the frost layer to 1 ("ON"). `"layer": ["Pines", 7]` will set the pines layer to 7 (on a scale 0 to 15).
If you input a list of layers to set: `"layer": [["Frost",1],  ["Pines", 7]]`, all of them will be applied.
Note that layers come in two forms: BIT layers and scalar layers.

### Bit Layers:

Frost, Void
Bit Layers are on or off.
Setting Frost to 15 will have the same effect as "[Frost, 1]".

### Scalar Layers:

Pine, Deciduous, Caves, Caverns, Chasms, Swamp, Jungle, Resources, ReadOnly, Annotations, Custom Layers
For some of these layers, 0..15 means the strength of the layer. pines = 9 means dense pine forest, pines=4 means light pine forest.
For other layers, the number is an id, like annotations:
https://www.worldpainter.net/trac/wiki/Scripting/AnnotationColours

you can also use custom layers (Ground Cover etc.) by referencing them by name. "My Custom GroundCover" f.e. (avoid spaces)

## Filters

You can apply your terrain and layers based on filters.
A simple operation using filters is

```json
{
  "name": "replace grass and clay with dirt",
  "onlyOnTerrain": [0, 35],
  "terrain": [2]
}
```

a complex filter using all available standardfilters:

```json
{
  "name": "high ground pines with forest floor",
  "layer": ["Pines", 7],
  "terrain": [0, 0, 0, 2, 3, 4],
  "aboveLevel": 90,
  "belowLevel": 150,
  "belowDegrees": 40,
  "belowDegrees": 60,
  "onlyOnTerrain": 0,
  "onlyOnLayer": "Frost"
}
```

#### Perlin Noise

you can use the perlin noise filter to generate natural shapes:

```json
{
  "name": "big shape frost",
  "layer": ["Frost", 1],
  "perlin": {
    "seed": 42069.0,
    "scale": 100.0,
    "amplitude": 1.0,
    "threshold": 0.4
  }
}
```

scale is how big the "bubbles" are, threshold = 0.4 means 40% of the tested area will be filled.
amplitude is not relevant and should always stay 1.

## Limitations

All operations are global, no restriction to area operated on is possible

## Planned Expansion

There is already working infrastructure in place for very complex chained filters including Perlin Noise, inverting, nesting but the config parsing does not support it yet.

Fuzzy Edges: break up transitions between areas (forest to plains) by breaking up the edge
Smooth Transitions: similar approach but its not the edge shape thats broken up but the value of layer set (15->0 in 10 blocks range)

GUI for creating filters, possibly website based/react
