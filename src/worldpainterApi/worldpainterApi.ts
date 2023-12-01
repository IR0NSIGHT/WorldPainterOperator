import { ParsingError } from '../FileOperation/Parser';
import { Layer } from '../Layer/Layer';
import { log } from "../log";

export function getTerrainById(terrainId: number): Terrain {
  // @ts-ignore worldpainter java object
  const terrain = org.pepsoft.worldpainter.Terrain.VALUES[terrainId];
  return terrain;
}

export interface Terrain {
  getName(): string;
}


const allLayers =(): Layer[] => {
  const javaIterator = dimension.getAllLayers(false).iterator();
  const myArr = [];
  while (javaIterator.hasNext()) {
      // Assuming the Java objects have a 'name' property, adapt this to your actual Java class structure
      const javaLayer = javaIterator.next();
      myArr.push(javaLayer);
  }
  return myArr;
}

export function getLayerById(layerId: string): Layer | ParsingError {
  switch (layerId) {
    case 'Frost': // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Frost.INSTANCE;

    case 'Caves': // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Caves.INSTANCE;

    case 'Caverns': // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Caverns.INSTANCE;

    case 'Chasms': // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Chasms.INSTANCE;

    case 'Deciduous': // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.DeciduousForest.INSTANCE;

    case 'Pines': // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.PineForest.INSTANCE;

    case 'Swamp': // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.SwampLand.INSTANCE;

    case 'Jungle': // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Jungle.INSTANCE;

    case 'Void': // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Void.INSTANCE;

    case 'Resources': // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Resources.INSTANCE;

    case 'ReadOnly': // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.ReadOnly.INSTANCE;

    case 'Annotations': // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Annotations.INSTANCE;

    default: {
      //search for custom layers
      //@ts-ignore overload exists, but isnt documented in dimension typestub.
      const customLayers: Layer[] = allLayers()

      let matched: Layer | undefined = undefined;
      try {
        customLayers
        .filter((f) => f != null)
        .forEach(function (element) {
          if (layerId == element.getName()) {
            matched = element;
          }
        });
      } catch (error) {
        //ignore, handled below
        return { mssg: 'could not find custom layer with name: ' + layerId + "\navailable custom layers:\n" + customLayers + "\nerror:" + error};
      }

      if (matched == undefined || matched == null) {
        return { mssg: 'could not find custom layer with name: ' + layerId + "\navailable custom layers:\n" + customLayers.map(l => l.getName()) };
      }
      return matched;
    }
  }
}
