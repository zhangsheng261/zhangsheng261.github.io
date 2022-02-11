import XLSX from "xlsx"
import ol from "openlayers"
import proj4 from "proj4"
import LocalDB from './LocalDB.js'
const commonFunctions = {
    map: null,
    Cesium: null,
    cesiumViewer: null,
    ImportDataTo2d: null,
    ImportDataTo3d: null,
    addCoordinateTransform: null,
    LocalDB:LocalDB,
    getDataFromGrd:null,
    changeSpatialReference:null,
    getColumnNamesFromXls:null,
    transformCommon:null,
    text2grd:null
};

commonFunctions.ImportDataTo2d = function(file, callback) {
    var exten = file.name.substr(-4);
    if (exten == ".xls" || exten == ".xlsx") {
        var _this = this;
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function(e) {
            _this.addCoordinateTransform();
            var data = e.target.result;
            var workBook = XLSX.read(data, {
                type: "binary"
            });
            let defaultSheet = workBook.Sheets["Sheet1"];
            let json = XLSX.utils.sheet_to_json(defaultSheet);
            let xmin = 9999;
            let ymin = 9999;
            let xmax = 0;
            let ymax = 0;
            let layerid = Math.random() * 10 + Math.random() * 10 + Math.random() * 10 + Math.random() * 10;
            let vectorSource = new ol.source.Vector();
            let vectorLayer = new ol.layer.Vector({
                id: layerid,
                source: vectorSource,
                declutter: true,
            });
            _this.map.addLayer(vectorLayer);
            let features = [];
            for (var i = 0, item; item = json[i++];) {
                let inCoor = [item.X, item.Y];
                let outCoor = ol.proj.transform(inCoor, 'EPSG:2384', 'EPSG:4326');
                if (outCoor[0] < xmin) {
                    xmin = outCoor[0];
                }
                if (outCoor[0] > xmax) {
                    xmax = outCoor[0];
                }

                if (outCoor[1] < ymin) {
                    ymin = outCoor[1];
                }
                if (outCoor[1] > ymax) {
                    ymax = outCoor[1];
                }
                let feature = new ol.Feature({
                    geometry: new ol.geom.Point(outCoor),
                    name: 'P:' + (item.P * 1).toFixed(2)
                });
                feature.setStyle(new ol.style.Style({
                    text: new ol.style.Text({
                        text: 'P: ' + (item.P * 1).toFixed(2),
                        offsetX: 30,
                        offsetY: -10
                    }),
                    image: new ol.style.Circle({
                        radius: 4,
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 0, 0, 0.1)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'red',
                            width: 1
                        })
                    })
                }));
                features.push(feature);
            }
            vectorSource.addFeatures(features);
            _this.map.getView().setCenter([(xmin + xmax) / 2, (ymin + ymax) / 2]);

            if (typeof callback == "function") {
                var node = {};
                node.id = layerid;
                node.label = file.name;
                callback(node);
            }
        }
    } else if (exten == ".grd") {
        let reader = new FileReader();
        reader.readAsText(file);
        const _this = this;
        reader.onload = function(e) {
            let dsaa;
            let nx, ny;
            let xmin, xmax, ymin, ymax, zmin, zmax;
            let x = [];
            let y = [];
            let z = [];
            let data;
            data = this.result.replace(/\r|\n/, " ").split(/\s+/); //split(/-|:|,/); 多个分隔符情况
            dsaa = data[0];
            nx = parseInt(data[1]);
            ny = parseInt(data[2]);
            xmin = parseFloat(data[3]);
            xmax = parseFloat(data[4]);
            ymin = parseFloat(data[5]);
            ymax = parseFloat(data[6]);
            zmin = parseFloat(data[7]);
            zmax = parseFloat(data[8]);
            let dx = (xmax - xmin) / (nx - 1);
            for (let i = 0; i < nx; i++) {
                x[i] = xmin + (i * dx);
            }
            let dy = (ymax - ymin) / (ny - 1);
            for (let i = 0; i < ny; i++) {
                y[i] = ymin + (i * dy);
            }
            for (let i = 0; i < ny; i++) {
                z[i] = [];
                for (let j = 0; j < nx; j++) {
                    const temp = parseFloat((data[i * nx + j + 9]));
                    if (temp == 1.70141e+38)
                        z[i][j] = " ";
                    else
                        z[i][j] = temp;
                }
            }
            _this.addCoordinateTransform();
            var geoJson = {
                "type": "FeatureCollection",
                "features": []
            };
            for (var m = 0; m < x.length; m++) {
                for (var n = 0; n < y.length; n++) {
                    var inCoor = [y[n], x[m]];
                    var zValue = z[n][m];
                    let outCoor = ol.proj.transform(inCoor, 'EPSG:2384', 'EPSG:4326');
                    var feature = {
                        "type": "Feature",
                        "properties": {
                            "P": zValue
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": outCoor
                        }
                    };
                    geoJson.features.push(feature);
                }
            }
            let layerid = Math.random() * 10 + Math.random() * 10 + Math.random() * 10 + Math.random() * 10;
            var vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(geoJson)
            });
            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                style: function(feature, resolution) {
                    var value = feature.get('P');
                    var style = new ol.style.Style({
                        text: new ol.style.Text({
                            text: 'P: ' + (value * 1).toFixed(2),
                            offsetX: 20,
                            offsetY: -10
                        }),
                        image: new ol.style.Circle({
                            radius: 3,
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 0, 0, 0.1)'
                            }),
                            stroke: new ol.style.Stroke({
                                color: 'red',
                                width: 1
                            })
                        })
                    })
                    //style.getText().setText(resolution < 5000 ? value : '');
                    return style;
                },
                declutter: true,
                id: layerid,
            });
            if (typeof callback == "function") {
                var node = {};
                node.id = layerid;
                node.label = file.name;
                callback(node);
            }
            _this.map.addLayer(vectorLayer);

        }

    }
}
commonFunctions.ImportDataTo3d = function(file, callback) {
    var exten = file.name.substr(-4);
    if (exten == ".xls") {
        var _this = this;
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function(e) {
            proj4.defs("EPSG:2384",
                "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs"
            );
            var projection = new ol.proj.Projection({
                code: 'EPSG:2384',
                extent: [345754.23, 2501018.29, 607809.05, 5528581.54],
                units: 'm',
                axisOrientation: 'neu',
                global: false
            });
            ol.proj.addProjection(projection);
            ol.proj.addCoordinateTransforms("EPSG:4326", "EPSG:2384",
                function(coordinate) {
                    return proj4("EPSG:4326", "EPSG:2384", coordinate);
                },
                function(coordinate) {
                    return proj4("EPSG:2384", "EPSG:4326", coordinate);
                }
            );
            var data = e.target.result;
            var workBook = XLSX.read(data, {
                type: "binary"
            });
            var defaultSheet = workBook.Sheets["Sheet1"];
            var json = XLSX.utils.sheet_to_json(defaultSheet);
            _this.cesiumViewer.entities.removeAll();
            var xmin = 9999;
            var ymin = 9999;
            var xmax = 0;
            var ymax = 0;
            for (var i = 0, item; item = json[i++];) {
                var inCoor = [item.X, item.Y];
                var outCoor = ol.proj.transform(inCoor, 'EPSG:2384', 'EPSG:4326');
                var entity = _this.cesiumViewer.entities.add({
                    position: _this.Cesium.Cartesian3.fromDegrees(outCoor[0], outCoor[1]),
                    point: {
                        pixelSize: 8,
                        color: _this.Cesium.Color.YELLOW
                    }
                });
                if (outCoor[0] > xmax) {
                    xmax = outCoor[0];
                }
                if (outCoor[1] > ymax) {
                    ymax = outCoor[1];
                }
                if (xmin > outCoor[0]) {
                    xmin = outCoor[0];
                }
                if (ymin > outCoor[1]) {
                    ymin = outCoor[1];
                }
            }
            var entity = _this.cesiumViewer.entities.add({
                position: _this.Cesium.Cartesian3.fromDegrees((xmin + xmax) / 2, (ymin + ymax) / 2),
                point: {
                    pixelSize: 1,
                    color: _this.Cesium.Color.YELLOW
                }
            })
            _this.cesiumViewer.zoomTo(entity, new _this.Cesium.HeadingPitchRange(60, -30, 8000));

            let layerid = Math.random() * 10 + Math.random() * 10 + Math.random() * 10 + Math.random() * 10;
            if (typeof callback == "function") {
                var node = {};
                node.id = layerid;
                node.label = file.name;
                callback(node);
            }
        }
    } else if (exten == ".grd") {
        let reader = new FileReader();
        reader.readAsText(file);
        const _this = this;
        reader.onload = function(e) {
            let dsaa;
            let nx, ny;
            let xmin, xmax, ymin, ymax, zmin, zmax;
            let x = [];
            let y = [];
            let z = [];
            let data;
            data = this.result.replace(/\r|\n/, " ").split(/\s+/); //split(/-|:|,/); 多个分隔符情况
            dsaa = data[0];
            nx = parseInt(data[1]);
            ny = parseInt(data[2]);
            xmin = parseFloat(data[3]);
            xmax = parseFloat(data[4]);
            ymin = parseFloat(data[5]);
            ymax = parseFloat(data[6]);
            zmin = parseFloat(data[7]);
            zmax = parseFloat(data[8]);
            let dx = (xmax - xmin) / (nx - 1);
            for (let i = 0; i < nx; i++) {
                x[i] = xmin + (i * dx);
            }
            let dy = (ymax - ymin) / (ny - 1);
            for (let i = 0; i < ny; i++) {
                y[i] = ymin + (i * dy);
            }
            for (let i = 0; i < ny; i++) {
                z[i] = [];
                for (let j = 0; j < nx; j++) {
                    const temp = parseFloat((data[i * nx + j + 9]));
                    if (temp == 1.70141e+38)
                        z[i][j] = " ";
                    else
                        z[i][j] = temp;
                }
            }
            proj4.defs("EPSG:2384",
                "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs"
            );
            var projection = new ol.proj.Projection({
                code: 'EPSG:2384',
                extent: [345754.23, 2501018.29, 607809.05, 5528581.54],
                units: 'm',
                axisOrientation: 'neu',
                global: false
            });
            ol.proj.addProjection(projection);
            ol.proj.addCoordinateTransforms("EPSG:4326", "EPSG:2384",
                function(coordinate) {
                    return proj4("EPSG:4326", "EPSG:2384", coordinate);
                },
                function(coordinate) {
                    return proj4("EPSG:2384", "EPSG:4326", coordinate);
                }
            );
            var geoJson = {
                "type": "FeatureCollection",
                "features": []
            };
            for (var m = 0; m < x.length; m++) {
                for (var n = 0; n < y.length; n++) {
                    var inCoor = [y[n], x[m]];
                    var zValue = z[n][m];
                    let outCoor = ol.proj.transform(inCoor, 'EPSG:2384', 'EPSG:4326');
                    var feature = {
                        "type": "Feature",
                        "properties": {
                            "P": zValue
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": outCoor
                        }
                    };
                    geoJson.features.push(feature);
                }
            }
            _this.Cesium.GeoJsonDataSource.load(geoJson).then(function(dataSource) {
                _this.cesiumViewer.dataSources.add(dataSource);
                var entities = dataSource.entities.values;
                for (var i = 0, entity; entity = entities[i++];) {
                    entity.billboard = null;
                    entity.point = {
                        pixelSize: 8,
                        color: _this.Cesium.Color.YELLOW
                    }
                }
            })
        }

    }
}

commonFunctions.transformCommon=function(outSR,extent){
  var projection = new ol.proj.Projection({
    code:outSR,
    extent: extent,
    units: 'm',
    axisOrientation: 'neu',
    global: false
  });
  ol.proj.addProjection(projection);
  ol.proj.addCoordinateTransforms("EPSG:4326",outSR,
    function(coordinate) {
      return proj4("EPSG:4326", outSR, coordinate);
    },
    function(coordinate) {
      return proj4(outSR, "EPSG:4326", coordinate);
    }
  );
}
commonFunctions.changeSpatialReference=function(type){
  var _this=this;
  switch (type) {
    //西安80_3_135E
    case "EPSG:2390":
      proj4.defs("EPSG:2390","+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2390",[383491.79,5080510.22,482969.27,5362933.35]);
      break;
    //西安80_3_132E
    case "EPSG:2389":
      proj4.defs("EPSG:2389","+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2389",[376543.07,4699381.82,610019.49,5417370.16]);
      break;
    //西安80_3_129E
    case "EPSG:2388":
      proj4.defs("EPSG:2388","+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2388",[374503.71,4582752.55,606982.76,5569734.31]);
      break;
    //西安80_3_126E
    case "EPSG:2387":
      proj4.defs("EPSG:2387","+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2387",[372262.41,4451707.20,600236.68,5897931.50]);
      break;
    //西安80_3_123E
    case "EPSG:2386":
      proj4.defs("EPSG:2386","+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2386",[352748.50,3123735.45,599394.71,5937993.20]);
      break;
    //西安80_3_120E
    case "EPSG:2385":
      proj4.defs("EPSG:2385","+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2385",[347872.18,2703741.00,599933.10,5912397.96]);
      break;
    //西安80_3_117E
    case "EPSG:2384":
      proj4.defs("EPSG:2384","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2384",[345754.23,2501018.29,607809.05,5528581.54]);
      break;
    //西安80_3_114E
    case "EPSG:2383":
      proj4.defs("EPSG:2383","+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2383",[344577.81,2381399.02,617340.68,5036052.73]);
      break;
    //西安80_3_111E
    case "EPSG:2382":
      proj4.defs("EPSG:2382","+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2382",[341226.51,2003803.92,618043.76,4998266.16]);
      break;
    //西安80_3_108E
    case "EPSG:2381":
      proj4.defs("EPSG:2381","+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2381",[341298.75,2012660.96,623358.77,4704936.09]);
      break;
    //西安80_3_105E
    case "EPSG:2380":
      proj4.defs("EPSG:2380","+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2380",[345643.00,2489941.81,623868.16,4676054.37]);
      break;
    //西安80_3_102E
    case "EPSG:2379":
      proj4.defs("EPSG:2379","+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2379",[344166.50,2338206.74,622925.76,4729375.42]);
      break;
    //西安80_3_99E
    case "EPSG:2378":
      proj4.defs("EPSG:2378","+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2378",[344482.25,2371431.40,622787.60,4737151.76]);
      break;

    //西安80_6_135E
    case "EPSG:2348":
      proj4.defs("EPSG:2348","+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2348",[263541.63,4991550.21,482969.27,5362933.35]);
      break;
    //西安80_6_129E
    case "EPSG:2347":
      proj4.defs("EPSG:2347","+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2347",[247158.43,4532694.83,702362.87,5855474.42]);
      break;
    //西安80_6_123E
    case "EPSG:2346":
      proj4.defs("EPSG:2346","+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2346",[200433.02,2917986.59,698769.38,5941134.37]);
      break;
    //西安80_6_117E
    case "EPSG:2345":
      proj4.defs("EPSG:2345","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2345",[190416.42,2452360.40,708209.04,5714208.92]);
      break;
    //西安80_6_111E
    case "EPSG:2344":
      proj4.defs("EPSG:2344","+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2344",[182364.58,2005744.33,736087.30,5001552.17]);
      break;
    //西安80_6_105E
    case "EPSG:2343":
      proj4.defs("EPSG:2343","+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2343",[189098.51,2384748.79,746725.12,4708209.07]);
      break;
    //西安80_6_99E
    case "EPSG:2342":
      proj4.defs("EPSG:2342","+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
      _this.transformCommon("EPSG:2342",[188253.38,2340415.25,744728.08,4787120.08]);
      break;

      //国家2000_3_135E
     case "EPSG:4554":
      proj4.defs("EPSG:4554","+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4554",[383491.84,5080507.85,482969.27,5362930.84]);
      break;
    //国家2000_3_132E
    case "EPSG:4553":
      proj4.defs("EPSG:4553","+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4553",[376543.13,4699379.62,610019.44,5417367.63]);
      break;
    //国家2000_3_129E
    case "EPSG:4552":
      proj4.defs("EPSG:4552","+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4552",[374503.76,4582750.41,606982.71,5569731.71]);
      break;
    //国家2000_3_126E
    case "EPSG:4551":
      proj4.defs("EPSG:4551","+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4551",[372262.47,4451705.13,600236.64,5897928.74]);
      break;
    //国家2000_3_123E
    case "EPSG:4550":
      proj4.defs("EPSG:4550","+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4550",[352748.57,3123733.99,599394.66,5937990.42]);
      break;
    //国家2000_3_120E
    case "EPSG:4549":
      proj4.defs("EPSG:4549","+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4549",[347872.25,2703739.74,599933.05,5912395.20]);
      break;
    //国家2000_3_117E
    case "EPSG:4548":
      proj4.defs("EPSG:4548","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4548",[345754.30,2501017.13,607809.00,5528578.96]);
      break;
    //国家2000_3_114E
    case "EPSG:4547":
      proj4.defs("EPSG:4547","+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4547",[344577.88,2381397.91,617340.63,5036050.38]);
      break;
    //国家2000_3_111E
    case "EPSG:4546":
      proj4.defs("EPSG:4546","+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4546",[341226.58,2003802.99,618043.70,4998263.83]);
      break;
    //国家2000_3_108E
    case "EPSG:4545":
      proj4.defs("EPSG:4545","+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4545",[341298.83,2012660.02,623358.71,4704933.89]);
      break;
    //国家2000_3_105E
    case "EPSG:4544":
      proj4.defs("EPSG:4544","+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4544",[345643.07,2489940.65,623868.10,4676052.19]);
      break;
    //国家2000_3_102E
    case "EPSG:4543":
      proj4.defs("EPSG:4543","+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4543",[344166.57,2338205.65,622925.70,4729373.22]);
      break;
    //国家2000_3_99E
    case "EPSG:4542":
      proj4.defs("EPSG:4542","+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4542",[344482.32,2371430.30,622787.54,4737149.55]);
      break;

    //国家2000_6_135E
    case "EPSG:4512":
      proj4.defs("EPSG:4512","+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4512",[263541.74,4991547.88,482969.27,5362930.84]);
      break;
    //国家2000_6_129E
    case "EPSG:4511":
      proj4.defs("EPSG:4511","+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4511",[209606.47,3290627.32,702362.77,5855471.68]);
      break;
    //国家2000_6_123E
    case "EPSG:4510":
      proj4.defs("EPSG:4510","+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4510",[196182.08,2729495.05,698769.28,5941131.59]);
      break;
    //国家2000_6_117E
    case "EPSG:4509":
      proj4.defs("EPSG:4509","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4509",[184047.25,2106579.41,708208.94,5714206.25]);
      break;
    //国家2000_6_111E
    case "EPSG:4508":
      proj4.defs("EPSG:4508","+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4508",[179915.67,1849516.47,736087.19,5001549.83]);
      break;
    //国家2000_6_105E
    case "EPSG:4507":
      proj4.defs("EPSG:4507","+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4507",[181721.15,1965854.14,746725.01,4708206.87]);
      break;
    //国家2000_6_99E
    case "EPSG:4506":
      proj4.defs("EPSG:4506","+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      _this.transformCommon("EPSG:4506",[188253.52,2340414.16,744727.96,4787117.85]);
      break;

    //北京54_3_135E
    case "EPSG:2442":
      proj4.defs("EPSG:2442","+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2442",[-4732877.28,6062975.30,-3392451.48,5862929.31]);
      break;
    //北京54_3_132E
    case "EPSG:2441":
      proj4.defs("EPSG:2441","+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2441",[-4463920.24,5821618.40,-3149953.77,5697338.45]);
      break;
    //北京54_3_129E
    case "EPSG:2440":
      proj4.defs("EPSG:2440","+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2440",[-4190940.98,5602465.29,-2904771.25,5546689.30]);
      break;
    //北京54_3_126E
    case "EPSG:2439":
      proj4.defs("EPSG:2439","+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2439",[-3915268.90,5403804.54,-2657656.30,5410166.82]);
      break;
    //北京54_3_123E
    case "EPSG:2438":
      proj4.defs("EPSG:2438","+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2438",[-3637977.63,5224065.78,-2409213.14,5287004.48]);
      break;
    //北京54_3_120E
    case "EPSG:2437":
      proj4.defs("EPSG:2437","+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2437",[-3359919.61,5061814.63,-2159918.81,5176489.40]);
      break;
    //北京54_3_117E
    case "EPSG:2436":
      proj4.defs("EPSG:2436","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2436",[-3081757.19,4915747.10,-1910141.77,5077965.93]);
      break;
    //北京54_3_114E
    case "EPSG:2435":
      proj4.defs("EPSG:2435","+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2435",[-2803990.34,4784683.65,-1660158.38,4990837.93]);
      break;
    //北京54_3_111E
    case "EPSG:2434":
      proj4.defs("EPSG:2434","+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2434",[-2526981.25,4667563.10,-1410167.56,4914569.92]);
      break;
    //北京54_3_108E
    case "EPSG:2433":
      proj4.defs("EPSG:2433","+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2434",[-2250976.11,4563436.40,-1160303.51,4848687.49]);
      break;
    //北京54_3_105E
    case "EPSG:2432":
      proj4.defs("EPSG:2432","+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2432",[-1976124.13,4471460.49,-910647.03,4792777.11]);
      break;
    //北京54_3_102E
    case "EPSG:2431":
      proj4.defs("EPSG:2431","+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2431",[-1702494.21,4390892.34,-661235.35,4746485.48]);
      break;
    //北京54_3_99E
    case "EPSG:2430":
      proj4.defs("EPSG:2430","+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:2430",[-1430089.26,4321083.17,-412070.81,4709518.66]);
      break;
    //北京54_6_135E
    case "EPSG:21463":
      proj4.defs("EPSG:21463","+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:21463",[-4732877.28,6062975.30,-3392451.48,5862929.31]);
      break;
    //北京54_6_129E
    case "EPSG:21462":
      proj4.defs("EPSG:21462","+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:21462",[-4190940.98,5602465.29,-2904771.25,5546689.30]);
      break;
    //北京54_6_123E
    case "EPSG:21461":
      proj4.defs("EPSG:21461","+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:21461",[-3637977.63,5224065.78,-2409213.14,5287004.48]);
      break;
    //北京54_6_117E
    case "EPSG:21460":
      proj4.defs("EPSG:21460","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:21460",[-3081757.19,4915747.10,-1910141.77,5077965.93]);
      break;
    //北京54_6_111E
    case "EPSG:21459":
      proj4.defs("EPSG:21459","+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:21459",[-2526981.25,4667563.10,-1410167.56,4914569.92]);
      break;
    //北京54_6_105E
    case "EPSG:21458":
      proj4.defs("EPSG:21458","+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:21458",[-1976124.13,4471460.49,-910647.03,4792777.11]);
      break;
    //北京54_6_99E
    case "EPSG:21457":
      proj4.defs("EPSG:21457","+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
      _this.transformCommon("EPSG:21458",[-1430089.26,4321083.17,-412070.81,4709518.66]);
      break;


  }
}
//投影坐标和地理坐标间的转换
commonFunctions.addCoordinateTransform = function() {
    //西安80
    proj4.defs("EPSG:2384",
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs"
    );
    var projectionXiAn80 = new ol.proj.Projection({
        code: 'EPSG:2384',
        extent: [345754.23, 2501018.29, 607809.05, 5528581.54],
        units: 'm',
        axisOrientation: 'neu',
        global: false
    });
  ol.proj.addProjection(projectionXiAn80);
  ol.proj.addCoordinateTransforms("EPSG:4326", "EPSG:2384",
    function(coordinate) {
      return proj4("EPSG:4326", "EPSG:2384", coordinate);
    },
    function(coordinate) {
      return proj4("EPSG:2384", "EPSG:4326", coordinate);
    }
  );

    //国家2000
    proj4.defs("EPSG:4548","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
    var projectionCGCS2000 = new ol.proj.Projection({
      code: 'EPSG:4548',
      extent: [345754.30,2501017.13,607809.00,5528578.96],
      units: 'm',
      axisOrientation: 'neu',
      global: false
    });
  ol.proj.addProjection(projectionCGCS2000);
  ol.proj.addCoordinateTransforms("EPSG:4326", "EPSG:4548",
    function(coordinate) {
      return proj4("EPSG:4326", "EPSG:4548", coordinate);
    },
    function(coordinate) {
      return proj4("EPSG:4548", "EPSG:4326", coordinate);
    }
  );

    //北京54
    proj4.defs("EPSG:2436","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
    var projectionBeiJing54 = new ol.proj.Projection({
      code: 'EPSG:2436',
      extent: [-3081757.19,4915747.10,-1910141.77,5077965.93],
      units: 'm',
      axisOrientation: 'neu',
      global: false
    });
    ol.proj.addProjection(projectionBeiJing54);
    ol.proj.addCoordinateTransforms("EPSG:4326", "EPSG:2436",
      function(coordinate) {
        return proj4("EPSG:4326", "EPSG:2436", coordinate);
      },
      function(coordinate) {
        return proj4("EPSG:2436", "EPSG:4326", coordinate);
      }
    );
}
commonFunctions.coordinateTrans2dTo2d=function(incoor,outcoor,inObj){
  // //西安80
  // proj4.defs("EPSG:2384",
  //   "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs"
  // );
  // //国家2000
  // proj4.defs("EPSG:4548","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
  // //北京54
  // proj4.defs("EPSG:2436","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs");
  this.changeSpatialReference(incoor);
  var outPut=[];
  var data=inObj.data;
  for(var i=0;i<data.length;i++){
    var item=data[i];
    var outCoor= proj4(incoor,outcoor,[item.X*1,item.Y*1]);
    var newObj=item;
    newObj.newX=outCoor[0];
    newObj.newY=outCoor[1];
    outPut.push(newObj);
  }
  return outPut;
}
//从文件获取数据存到indexedDB
commonFunctions.getJsonFromFile = function(file,param,callback) {
        let _this=this;
        //var exten = file.name.substr(-4);
        var tempArr = file.name.split('.');
        var exten = tempArr[tempArr.length-1];
        if (exten == "xls" || exten == 'xlsx') {
          _this.getDataFromXls(exten,file,param,function (data) {
            _this.LocalDB.state.db.addData(data,callback);
          })
        }
        else if (exten == "grd") {
          _this.getDataFromGrd(exten,file,param,function (data) {
            _this.LocalDB.state.db.addData(data,callback);
          })
        }
        else if (exten == "dat"||exten == "txt"||exten == "csv"||exten == "xyz") {
          _this.getDataFromTxt(exten,file,param,function (data) {
            _this.LocalDB.state.db.addData(data,callback);
          })
        }else if(exten == 'xyzval'){
          _this.getDataFromXYZVAL(exten,file,param,function (data) {
            _this.LocalDB.state.db.addData(data,callback)
          })
        }
}

commonFunctions.getDataFromXYZVAL=function(fileType,file,param,callback){

  let _this = this;
  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function() {
    let x = [];
    let y = [];
    let z = [];
    let value = [];
    let data = this.result.replace(/\r|\n/, " ").split(/\s+/); //split(/-|:|,/); 多个分隔符情况
    for(let j= 0;j<data.length;j++){
      if(data[j]==''||data[j]==null||typeof(data[j])==undefined){
        data.splice(j,1);
        j=j-1;
      }
    }
    let displayeName=file.name;
    let guid=_this.newGuid();
    for (let i = 4; i <data.length ; i++) {
      let index = i%4;
      switch (index) {
        case 0:
          x.push(parseFloat(data[i]))
          break;
        case 1:
          y.push(parseFloat(data[i]))
          break;
        case 2:
          z.push(parseFloat(data[i]))
          break;
        case 3:
          value.push(parseFloat(data[i]))
          break;

      }

    }
    let isomin = null ;
    let isomax = null ;
    for (let i = 0; i <value.length ; i++) {
      if (value[i] < 10000490712.635){
        if (isomin == null || isomax == null){
          isomin = value[i]
          isomax = value[i]
          continue
        }
        if (value[i] <isomin){
          isomin = value[i]
        }else if (value[i] > isomax){
          isomax = value[i]
        }
      }
    }

   /* let newValues = []
    for (let i = 0; i <value.length ; i++) {
      if (value[i] !== 10000490712.635){
        newValues.push(value[i])
      }
    }
    let isomin = Math.min(...newValues)
    let isomax = Math.max(...newValues)
    newValues=[]*/
    let sortx = x.concat([]).sort((a, b) => a - b)
    let xmin = sortx[0]
    let xmax = sortx[sortx.length-1]
    let sorty = y.concat([]).sort((a, b) => a - b)
    let ymin = sorty[0]
    let ymax = sorty[sorty.length-1]
    let sortz = z.concat([]).sort((a, b) => a - b)
    let zmin = sortz[0]
    let zmax = sortz[sortz.length-1]
    let newData = {
      x:x,
      y:y,
      z:z,
      xmin:xmin,
      xmax:xmax,
      ymin:ymin,
      ymax:ymax,
      zmin:zmin,
      zmax:zmax,
      value:value,
      isomin:isomin,
      isomax:isomax,
    }


    var objData={
      "guid": guid,
      "file":file,
      "data": newData,
      "displayName":displayeName,
      "datatype":fileType,
      "separation":param.separation,
      "spatialReference":param.spatialReference,
    }

    if(typeof callback=="function"){
      callback(objData);
    }
  }

}

commonFunctions.getDataFromTxt=function(fileType,file,param,callback){
    var _this = this;
    var displayeName=file.name;
    var guid=_this.newGuid();
    var data=[];
    let index = 0;
    var dataNew= [];
    while(index < param.data.length) {
      data.push(param.data.slice(index, index += param.field.length));
    }
    data.map(item=>{
      let obj = {};
      for (let i = 0; i <param.field.length ; i++) {
        obj[param.field[i].replace('.','!#!')]=item[i];
      }
      dataNew.push(obj);
    })
    var objData={
      "guid": guid,
      "file":file,
      "data": dataNew,
      "displayName":displayeName,
      "datatype":fileType,
      "separation":param.separation,
      "spatialReference":param.spatialReference,
      "bindX":param.bindX,
      "bindY":param.bindY
    }

    if(typeof callback=="function"){
      callback(objData);
    }
};
commonFunctions.getColumnNamesFromXls=function(file,callback){
  var reader=new FileReader();
  reader.readAsBinaryString(file);
  reader.onload=function (e) {
    var data = e.target.result;
    var workBook = XLSX.read(data, {
      type: "binary"
    });
    let defaultSheet = workBook.Sheets[workBook.SheetNames[0]];
    let json = XLSX.utils.sheet_to_json(defaultSheet);
    let dataObj=json[0];
    var cols=[];
    for(var key in dataObj){
      cols.push(key);
    }
    if(typeof callback=="function"){
      callback(cols);
    }
  }
}
commonFunctions.getDataFromXls=function(fileType,file,param,callback){
  if(fileType== 'xlsx'){//把xlsx文件改为xls
    fileType = 'xls';
  }
  var _this = this;
  var reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onload = function(e) {
    var data = e.target.result;
    var workBook = XLSX.read(data, {
      type: "binary"
    });
    let defaultSheet = workBook.Sheets[workBook.SheetNames[0]];
    let json = XLSX.utils.sheet_to_json(defaultSheet);
    var displayeName=file.name;
    var guid=_this.newGuid();

    var objData={
      "guid": guid,
      "file":file,
      "data": json,
      "displayName":displayeName,
      "datatype":fileType,
      "spatialReference":param.spatialReference,
      "bindX":param.bindX,
      "bindY":param.bindY
    }

    if(typeof callback=="function"){
      callback(objData);
    }
  }
};
commonFunctions.getDataFromGrd=function(fileType,file,param,callback){
  var _this=this;
  var objData;
  let reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = function(e) {
    let arrayBuffer = this.result;
    let dataView = new DataView(arrayBuffer);
    var str2 = "";
    for(var i = 0; i < 4; i++) {
      str2 = str2 + String.fromCharCode(dataView.getUint8(i,true));
    }
    //二进制DSBB文件
    if (str2=="DSBB"){
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = function(e) {
        let nx,ny;
        let xmin,xmax,ymin,ymax,zmin,zmax;
        let x = [];
        let y = [];
        let z = [];
        nx   = dataView.getUint8(4,true);
        ny   = dataView.getUint8(6,true);
        xmin = dataView.getFloat64(8,true);
        xmax = dataView.getFloat64(16,true);
        ymin = dataView.getFloat64(24,true);
        ymax = dataView.getFloat64(32,true);
        zmin = dataView.getFloat64(40,true);
        zmax = dataView.getFloat64(48,true);
        let jsonArray=[];

        var dx = (xmax-xmin)/(nx-1);
        for(let i=0;i<nx;i++)
        {
          x[i]=xmin+(i*dx);
        }
        var dy = (ymax-ymin)/(ny-1);
        for(let i=0;i<ny;i++)
        {
          y[i]=ymin+(i*dy);
        }

        for(let i=0;i<ny;i++){
          z[i]=[];
          for(let j=0;j<nx;j++){
            z[i][j]=dataView.getFloat32(56+(j+nx*i)*4,true);
            let json = {
              "x": x[j],
              "y": y[i],
              "z": z[i][j]
            };
            jsonArray.push(json);
          }
        }
        var grd={};
        grd.type="DSAA";
        grd.xmin= xmin;
        grd.zmin=zmin;
        grd.ymin=ymin;
        grd.xmax=xmax;
        grd.ymax=ymax;
        grd.zmax=zmax;
        grd.xcount=nx;
        grd.ycount=ny;
        grd.x = x;
        grd.y = y;
        grd.z = z;
        var displayeName=file.name;
        var guid=_this.newGuid();

        objData={
          "guid": guid,
          "data": jsonArray,
          "grdData":grd,
          "displayName":displayeName,
          "datatype":fileType,
          "spatialReference":param.spatialReference
        }
        if(typeof callback=="function"){
          callback(objData);
        }

      }
      //二进制DSRB文件
    }else if (str2=="DSRB"){
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = function(e) {
        let nx,ny;
        let xmin,xmax,ymin,ymax,zmin,zmax;
        let x = [];
        let y = [];
        let z = [];

        ny   = dataView.getUint32(20,true);
        nx   = dataView.getUint32(24,true);

        xmin = dataView.getFloat64(28,true);
        ymin = dataView.getFloat64(28+8,true);

        dx = dataView.getFloat64(28+8*2,true);
        dy = dataView.getFloat64(28+8*3,true);

        xmax = xmin + dx*(nx-1);
        ymax = ymin + dy*(ny-1);

        zmin = dataView.getFloat64(28+8*4,true);
        zmax = dataView.getFloat64(28+8*5,true);

        let jsonArray=[];

        var dx = (xmax-xmin)/(nx-1);
        for(let i=0;i<nx;i++)
        {
          x[i]=xmin+(i*dx);
        }
        var dy = (ymax-ymin)/(ny-1);
        for(let i=0;i<ny;i++)
        {
          y[i]=ymin+(i*dy);
        }

        for(let i=0;i<ny;i++){
          z[i]=[];
          for(let j=0;j<nx;j++){
            z[i][j]=dataView.getFloat64(100+(j+nx*i)*8,true);
            let json = {
              "x": x[j],
              "y": y[i],
              "z": z[i][j]
            };
            jsonArray.push(json);
          }
        }
        var grd={};
        grd.type="DSAA";
        grd.xmin= xmin;
        grd.zmin=zmin;
        grd.ymin=ymin;
        grd.xmax=xmax;
        grd.ymax=ymax;
        grd.zmax=zmax;
        grd.xcount=nx;
        grd.ycount=ny;
        grd.x = x;
        grd.y = y;
        grd.z = z;
        var displayeName=file.name;
        var guid=_this.newGuid();

        objData={
          "guid": guid,
          "data": jsonArray,
          "grdData":grd,
          "displayName":displayeName,
          "datatype":fileType,
          "spatialReference":param.spatialReference
        }
        if(typeof callback=="function"){
          callback(objData);
        }

      }
      //文本文件
    }else {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function() {
          let dsaa;
          let nx, ny;
          let xmin, xmax, ymin, ymax, zmin, zmax;
          let x = [];
          let y = [];
          let z = [];
          let data;
          data = this.result.replace(/\r|\n/, " ").split(/\s+/); //split(/-|:|,/); 多个分隔符情况
          dsaa = data[0];
          nx = parseInt(data[1]);
          ny = parseInt(data[2]);
          xmin = parseFloat(data[3]);
          xmax = parseFloat(data[4]);
          ymin = parseFloat(data[5]);
          ymax = parseFloat(data[6]);
          zmin = parseFloat(data[7]);
          zmax = parseFloat(data[8]);

          var grd={};
          grd.type=data[0];
          grd.xmin= parseFloat(data[3]);
          grd.zmin=parseFloat(data[7]);
          grd.ymin=parseFloat(data[5]);
          grd.xmax=parseFloat(data[4]);
          grd.ymax=parseFloat(data[6]);
          grd.zmax=parseFloat(data[8]);
          grd.xcount=parseInt(data[1]);
          grd.ycount=parseInt(data[2]);
          var jsonArray=[];
          let dx = (xmax - xmin) / (nx - 1);
          for (let i = 0; i < nx; i++) {
            x[i] = xmin + (i * dx);
          }
          let dy = (ymax - ymin) / (ny - 1);
          for (let i = 0; i < ny; i++) {
            y[i] = ymin + (i * dy);
          }
          for (let i = 0; i < ny; i++) {
            z[i] = [];
            for (let j = 0; j < nx; j++) {
              const temp = parseFloat((data[i * nx + j + 9]));
              if (temp >=  1.70141E38) {
                z[i][j] = "NaN";
              }
              else {
                z[i][j] = temp;
              }
              var json = {
                "x": x[j],
                "y": y[i],
                "z": z[i][j]
              };
              jsonArray.push(json);
            }
          }
          grd.x = x;
          grd.y = y;
          grd.z = z;
          var displayeName=file.name;
          var guid=_this.newGuid();
          objData={
            "guid": guid,
            "data": jsonArray,
            "grdData":grd,
            "displayName":displayeName,
            "datatype":fileType,
            "spatialReference":param.spatialReference
          }
          if(typeof callback=="function"){
            callback(objData);
          }
        }
    }

  }
}
//生成guid
commonFunctions.newGuid=function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
//从indexedDB获取数据,根据key查询数据
commonFunctions.getJsonFromDatabase = function(key,callback) {
    this.LocalDB.state.db.getData(key,callback);
}
//从indexedDB获取多个数据,根据key查询数据
commonFunctions.getJsonsFromDatabase = function(keys,callback) {
  this.LocalDB.state.db.getDatas(keys,callback);
}
//获取数据库中所有数据
commonFunctions.getAllJsonFromDatabase = function(callback){
    this.LocalDB.state.db.getAllData(callback)
}
//根据key值删除记录
commonFunctions.deleteJsonFromDatabase = function(key,callback){
    this.LocalDB.state.db.deleteData(key,callback)
}
commonFunctions.createOnlineServerLayer=function(params){
  var tempLayer=null;
  switch (params.type) {
    case "XYZ":
      tempLayer = new ol.layer.Tile({
        title: params.label,
        id: params.id,
        source: new ol.source.XYZ({
          url: params.url,
          tileUrlFunction: params.urlfunc
          // crossOrigin: "Anonymous"
        }),
        visible: params.visible
      })
      break;
    case "ArcGIS_WMS":
      tempLayer = new ol.layer.Tile({
        title: params.label,
        id: params.id,
        source: new ol.source.TileArcGISRest({
          projection: 'EPSG:4326',
          url: params.url,
          // crossOrigin: "Anonymous"
        }),
        visible: params.visible
      })
      break;
    // case "ArcGIS_WMTS":
    //   var projection = ol.proj.get("EPSG:4326");
    //   var matrixIds = [0, 1, 2, 3, 4];
    //   var resolutions = [
    //     0.00475892201166056,
    //     0.00237946100583028,
    //     0.00118973050291514,
    //     5.9486525145757E-4,
    //     2.97432625728785E-4,
    //   ];
    //   var tileGrid = new ol.tilegrid.TileGrid({
    //     tileSize: 256,
    //     origin: [-400, 400], //原点（左上角）
    //     resolutions: resolutions, //分辨率数组
    //     extent: [115.41730899999999, 39.438295999999966, 117.50016000000002,
    //       41.05923899999996
    //     ],
    //     // crossOrigin: "Anonymous"
    //   });
    //   var xyzSource = new ol.source.XYZ({
    //     tileGrid: tileGrid,
    //     projection: projection,
    //     url: 'http://172.30.17.125:6080/arcgis/rest/services/TestService/BeiJingBorder3/MapServer/tile/{z}/{y}/{x}',
    //     // crossOrigin: 'anonymous'
    //   })
    //   var tempLayer = new ol.layer.Tile({
    //     id: arr[i].id,
    //     source: xyzSource,
    //     visible: arr[i].visible
    //   })
    //   this.map.addLayer(tempLayer);
    //   break;
    case "ArcGIS_WMTS":
      var projection = ol.proj.get("EPSG:4326");
      tempLayer = new ol.layer.Tile({
        id: params.id,
        source: new ol.source.WMTS({
          //服务地址
          url: params.url,
          format: 'image/png',
          matrixSet: 'EPSG:4326',
          projection: projection,
          style: 'default',
          tileGrid: new ol.tilegrid.TileGrid({
            origin: params.origin,
            resolutions: params.resolutions,
            matrixIds: params.matrixIds,
          })
        }),
        visible: params.visible,
        wrapX: true
      })
      break;
    case "WFS":
      var _this = this;
      var param = {
        'service': 'WFS',
        'version': '1.0.0',
        'request': 'GetFeature',
        'typeName': 'BJ_Border:Line,BJ_Border:point',
        'outputFormat': 'text/javascript',
        'format_options': 'callback:loadFeatures'
      };
      var vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        loader: function (extent, resolution, projection) {
          $.ajax({
            url: 'http://172.30.17.136:8080/geoserver/wfs',
            data: $.param(param),
            type: 'GET',
            dataType: 'jsonp',
            jsonpCallback: 'loadFeatures'
          });
        },
        projection: 'EPSG:4326',
        // crossOrigin: "Anonymous"
      });
      window.loadFeatures = function (response) {
        vectorSource.addFeatures((new ol.format.GeoJSON()).readFeatures(
          response));
      }
      tempLayer = new ol.layer.Vector({
        source: vectorSource,
        title: params.label,
        id: params.id,
        visible: params.visible
      });
      break;
    case "Geo_WMS":
      tempLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({

          url: params.url,
          serverType: 'geoserver',
          params: {
            'LAYERS': params.layers,
            'TILED': false
          },
          transition: 0,
          //crossOrigin: "Anonymous"
        }),
        id: params.id,
        visible: params.visible
      });
      break;
    case "Geo_WMTS":
      var projection = ol.proj.get("EPSG:4326");
      // 切片名，可以根据后台缩放等级数量减少，但必须与切片大小一一对应
      var matrixIds = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10',
        'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];
      // 切片大小
      var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5,
        4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];
      tempLayer = new ol.layer.Tile({
        id: params.id,
        visible: params.visible,
        source: new ol.source.WMTS({
          //服务地址
          url: params.url,
          layer: params.layers,
          //切片集
          matrixSet: 'EPSG:4326',
          format: 'image/png',
          projection: projection,
          //切片信息
          tileGrid: new ol.tilegrid.WMTS({
            tileSize: [256, 256],
            extent: [-180.0, -90.0, 180.0, 90.0],//范围
            origin: [-180.0, 90.0],
            resolutions: resolutions,
            matrixIds: matrixIds
          }),
          wrapX: true
        })
      })
      break;
  }
  return tempLayer;
}
commonFunctions.text2grd = function(text,dat){
    var ss=eval('(' + text+ ')');
    var txt=Base64.decode(ss.res);
    var ori;
    var dsaa;
    var nx,ny;
    var xmin,xmax,ymin,ymax,zmin,zmax;
    var dx,dy;
    var x = new Array();
    var y = new Array();
    var z = new Array();
    var data = new Array();
    ori=0;
    data  = txt.replace(/\r|\n/," ").split(/\s+/); //split(/-|:|,/); ¶à¸ö·Ö¸ô·ûÇé¿ö
    dsaa  = data[ori+0];
    nx    = parseInt(data[ori+1]);
    ny    = parseInt(data[ori+2]);
    xmin  = parseFloat(data[ori+3]);
    xmax  = parseFloat(data[ori+4]);
    ymin  = parseFloat(data[ori+5]);
    ymax  = parseFloat(data[ori+6]);
    zmin  = parseFloat(data[ori+7]);
    zmax  = parseFloat(data[ori+8]);
    var dx = (xmax-xmin)/(nx-1);
    for(var i=0;i<nx;i++)
    {
      x[i]=xmin+(i*dx);
    }
    var dy = (ymax-ymin)/(ny-1);
    for(var i=0;i<ny;i++)
    {
      y[i]=ymin+(i*dy);
    }
    for(var i=0;i<ny;i++){
      z[i]=new Array();
      for(var j=0;j<nx;j++){
        z[i][j]=parseFloat(data[i*nx+j+ori+9]);
      }
    }
    dat.type="DSAA";
    dat.nx  = nx
    dat.ny  = ny;
    dat.xmin= xmin;
    dat.xmax= xmax;
    dat.ymin= ymin;
    dat.ymax= ymax;
    dat.zmin= zmin;
    dat.zmax= zmax;
    dat.dx  = dx;
    dat.dy  = dy;
    dat.x   = x;
    dat.y   = y;
    dat.z   = z;
}
export default commonFunctions;
