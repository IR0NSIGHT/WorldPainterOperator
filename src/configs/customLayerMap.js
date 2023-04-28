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
