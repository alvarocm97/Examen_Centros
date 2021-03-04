require([
"esri/map",
"esri/layers/FeatureLayer",
"esri/geometry/Extent",
"esri/tasks/ServiceAreaTask",
"esri/tasks/ServiceAreaParameters",
"esri/tasks/query",
"esri/dijit/Legend",
"esri/dijit/Scalebar",

"esri/symbols/SimpleLineSymbol",
"esri/symbols/SimpleFillSymbol",
"esri/Color",

"dojo/ready",
"dojo/parser",
"dojo/on",
"dojo/_base/array",
"dojo/dom",

"dijit/layout/TabContainer",
"dijit/TitlePane",
"dijit/layout/ContentPane",
"dijit/layout/BorderContainer",
"dojo/domReady!"],
function(
    Map, FeatureLayer, Extent, ServiceAreaTask, ServiceAreaParameters, Query, Legend, Scalebar, SimpleLineSymbol, SimpleFillSymbol, Color, ready, parser, on, array, dom, TabContainer, TitlePane, ContentPane, BorderContainer) {

ready(function () {

// parser.parse();

var map = new Map("divMap", {
    basemap: "topo",        
    extent: new Extent({
        xmin: -415811.796930644,
        ymin: 4919170.17081106,
        xmax: -400757.003653631,
        ymax: 4930449.88246117,
        spatialReference: {wkid:102100}}),
    sliderStyle: "small"
  });

var centros = new FeatureLayer("https://services6.arcgis.com/dg19uZyAi5CA76BH/arcgis/rest/services/CENTROS_SALUD/FeatureServer/0", {outFields : ["*"]});

map.addLayers([centros]);

map.on("load", selectParams);

var serviceAreaTask = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area");

function selectParams(){
                  
    var centrosSalud = new Query(); 
    
    centrosSalud.where = "NOMBRE = NOMBRE"
    
    centros.selectFeatures(centrosSalud, FeatureLayer.SELECTION_NEW);

    centros.on("selection-complete", mapPolygons)            
   };

function mapPolygons(parametros){          

var serviceAreaParameters = new ServiceAreaParameters();

serviceAreaParameters.defaultBreaks= [1];

serviceAreaParameters.outSpatialReference = map.spatialReference;

serviceAreaParameters.returnFacilities = false;

// serviceAreaParameters.facilities = parametros.features;

array.forEach(parametros.features, function(elementos){
    serviceAreaParameters.facilities = {};
    serviceAreaParameters.facilities.features = [];
    serviceAreaParameters.facilities.features.push(elementos)
    console.log("parametro",serviceAreaParameters)

serviceAreaTask.solve(serviceAreaParameters, function(solveResult){
    console.log('jjj',solveResult);

    var polygonSymbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,  
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,187,45]), 2),
      new Color([0,187,45,0.25])
    );

    array.forEach(solveResult.serviceAreaPolygons, function(serviceArea){

      serviceArea.setSymbol(polygonSymbol);

      map.graphics.add(serviceArea);
    });

     });

    });

};

var scalebar = new Scalebar ({
    map: map,
    attachTo: "bottom-left",
    scalebarStyle: "line",
    scalebarUnit: "metric"         
});

var legend = new Legend ({
    map: map,      
}, "legendDiv")

legend.startup();

});
    
});