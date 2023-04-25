# AdvancedOperator

The AdvancedOperator provides a way to run global operations in WorldPainter using
config files.
It supports more detailed filters than WorldPainter does, for example allowing above and below slope filters at the same time.

## Running the script

Execute the script from within WorldPainter with topbar>>Tools>>Run script
select the AdvancedOperator.js file
select a config of your liking
hit run

## Building a config

in the configs folder you will find an example config

## Limitations

Operations are limited to set only one type of terrain/layer at a time.

BIT_PER_CHUNK layers currently dont work, this includes all binary (on or off) layers:
Frost, Void, ..

All operations are global, no restriction to area operated on is possible

## Planned Expansion

Allow supplying a list of terrains and layers that will be randomly chosen.
More detailed filters like onlyOnTerrain/Layer etc

There is already working infrastructure in place for very complex chained filters including Perlin Noise, inverting, nesting but the config parsing does not support it yet.

Fuzzy Edges: break up transitions between areas (forest to plains) by breaking up the edge
Smooth Transitions: similar approach but its not the edge shape thats broken up but the value of layer set (15->0 in 10 blocks range)
