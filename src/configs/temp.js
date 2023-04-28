//LayerManager.getInstance()
//    .getLayer(name)
//    .getLayers() //all
//

print("Default layers:");
var allLayers = dimension.getAllLayers(false);
allLayers =
  org.pepsoft.worldpainter.layers.LayerManager.getInstance().getLayers();
allLayers.forEach(function (element) {
  print("\t" + element.getName());
});
print("CUSTOM:");
allLayers = dimension.getCustomLayers();
allLayers.forEach(function (element) {
  print("\t" + element.getName() + " id: " + element.getId());
});
////PaletteManager.paletteList (private)
//PaletteManager.getLayers() //return all custom layers
//PaletteManager.getPalettes()
//
//App.getCustomLayers()
//Dimension.getCustomLayers();
//org.pepsoft.worldpainter
