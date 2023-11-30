import { Layer } from '../../Layer/Layer';
import { ParsingError } from '../../FileOperation/Parser';
import { Terrain } from '../worldpainterApi';

export function getTerrainById(_: number): Terrain {
  // @ts-ignore worldpainter java object
  return {
    getName() {
      return 'hello world';
    }
  };
}

function getLayerByIdMock(id: string): Layer {
  return {
    getName: () => 'Frost',
    getId: () => id,
    getDataSize: () => 'NIBBLE'
  };
}

export function getLayerById(layerId: string): Layer | ParsingError {
  switch (layerId) {
    case 'Frost': // @ts-ignore wp object
    case 'Caves': // @ts-ignore wp object
    case 'Caverns': // @ts-ignore wp object
    case 'Chasms': // @ts-ignore wp object
    case 'Deciduous': // @ts-ignore wp object
    case 'Pines': // @ts-ignore wp object
    case 'Swamp': // @ts-ignore wp object
    case 'Jungle': // @ts-ignore wp object
    case 'Void': // @ts-ignore wp object
    case 'Resources': // @ts-ignore wp object
    case 'ReadOnly': // @ts-ignore wp object
    case 'Annotations': // @ts-ignore wp object
      return getLayerByIdMock(layerId);

    default: {
      return { mssg: 'could not find custom layer with name: ' + layerId };
    }
  }
}
