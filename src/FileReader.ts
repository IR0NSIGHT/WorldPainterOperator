function isValidApply(op: object):boolean {
    let out: boolean = (typeof op == "object") && op.hasOwnProperty("type")
    return out
}

function getTerrainByIdx(terrain_idx: number):string {
    // @ts-ignore
    return org.pepsoft.worldpainter.Terrain.values()[terrain_idx].getName()
}

function getTerrainIdxForCustom(index: number) {
    return (index < 48)
        ? ((index < 24) ? index + 47 : index + 52)
        : index + 54;
}
