// https://developers.arcgis.com/javascript/3/jsapi/
var mapApp = {
    map : undefined
}

mapApp.getPOIs = function (callback) {
    $.get("../api/pois", function (data) {
        console.log(data)
        if (callback) callback(data.pois);
    });
}


mapApp.initMap = function (callback) {
    mapApp.map;

    require(["esri/map", "esri/symbols/SimpleMarkerSymbol",  "esri/layers/GraphicsLayer", "dojo/domReady!"],
        function (Map, SimpleMarkerSymbol, GraphicsLayer) {
        mapApp.map = new Map("map", {
            basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
            center: [-58.3724715, -34.595986], // longitude, latitude
            zoom: 13
        });

        mapApp.POIsLayer = new GraphicsLayer({ id: "circles" });
        mapApp.map.addLayer(mapApp.POIsLayer);
        mapApp.POIsSymbol = new SimpleMarkerSymbol({
                "color": [230, 76, 0, 150],
                "size": 12,
                "angle": -30,
                "xoffset": 0,
                "yoffset": 0,
                "type": "esriSMS",
                "style": "esriSMSCircle",
                "outline": {
                    "color": [168, 0, 0, 255],
                    "width": 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                }
            });
        
        if (callback) callback();
    });
}

mapApp.initMap(function () {
    mapApp.getPOIs(function (pois) {
        require(["esri/graphic", "esri/geometry/Point", "dojo/domReady!"],
            function (Graphic, Point, GraphicLayer) {
                pois.forEach(function (poiData) {

                    var poi = new Point(poiData.XLon, poiData.YLat, mapApp.map.spatialReference)
                    mapApp.POIsLayer.add(new Graphic(poi, mapApp.POIsSymbol, poiData));
                })
                
            });
    });
});