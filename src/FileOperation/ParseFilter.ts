import { ParsingError } from './Parser';
export type configPerlin = {
  seed: number;
  scale: number;
  threshold: number;
  amplitude: number;
};

const isConfigPerlin = (obj: any): obj is configPerlin => {
  return (
    obj !== undefined &&
    typeof obj.seed === 'number' &&
    typeof obj.scale === 'number' &&
    typeof obj.threshold === 'number' &&
    typeof obj.amplitude === 'number'
  );
};

export const parsePerlin = (perlin: any): configPerlin | ParsingError | undefined => {
  if (perlin === undefined) return undefined;
  if (isConfigPerlin(perlin)) return perlin;
  else return { mssg: 'could not parse perlin filter: ' + JSON.stringify(perlin) };
};
