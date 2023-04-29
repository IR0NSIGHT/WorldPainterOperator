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

in the configs folder you will find an example config
the config must obey the JSON format, with the exception that comments are allowed in the form of (a comment)
comments can span multiple lines

## Limitations

All operations are global, no restriction to area operated on is possible

## Planned Expansion

More detailed filters like onlyOnTerrain/Layer etc

There is already working infrastructure in place for very complex chained filters including Perlin Noise, inverting, nesting but the config parsing does not support it yet.

Fuzzy Edges: break up transitions between areas (forest to plains) by breaking up the edge
Smooth Transitions: similar approach but its not the edge shape thats broken up but the value of layer set (15->0 in 10 blocks range)
