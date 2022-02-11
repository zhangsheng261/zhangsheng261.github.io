/**
 * type值的意义
 * XYZ 代表用XYZ初始化的瓦片数据
 * Image代表图片数据
 * Arcgis_前缀的代表arcgis发布的WMS/WMTS数据
 * geo_ 前缀的代表geoserver发布的WMS/WMTS数据
 * remove节点是否可以删除
 * */
var treeData_2D = [
  {
        id: 1,
        label: '地图服务',
        expand: true,
        isDir: true,
        remove: false,
        children: [
          {
            id: 11,
            label: 'WFS服务',
            expand: false,
            isDir: true,
            remove: true,
            children: [
              //   {
              //     id: 111,
              //     label: '北京border_WFS',
              //     url: '',
              //     type: 'WFS',
              //     visible: false,
              //     remove: true
              // }
            ]
          },
          {
                id: 12,
                label: 'WMS服务',
                expand: false,
                isDir: true,
                children: [
                  // {
                  //   type: 'Geo_WMS',
                  //   visible: false,
                  //   id: 121,
                  //   url:'http://172.30.17.136:8080/geoserver/geophysical/wms',
                  //   layers:'geophysical:ud1_JT',
                  //   label:'geoservertest',
                  //   remove: true
                  // }
                  // ,    {
                  //     id: 122,
                  //     label: '北京Border_WMS',
                  //     expand: false,
                  //     type: 'ArcGIS_WMS',
                  //     url: 'http://172.30.17.125:6080/arcgis/rest/services/TestService/BeiJingBorder4/MapServer',
                  //     remove: true,
                  //     visible: false
                  // }
                ],
                remove: true
            },
            {
                id: 13,
                label: 'WMTS服务',
                expand: false,
                isDir: true,
                remove: true,
                children: [
                  {
                        label: '天地图影像地图',
                        id: 131,
                        type: 'XYZ',
                        url: 'http://t4.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=a01f0d8bb5b718b9740ef22bd1774ac2',
                        visible: false,
                        remove: true
                    },
                    {
                        id: 132,
                        label: '天地图矢量地图',
                        url: 'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a01f0d8bb5b718b9740ef22bd1774ac2',
                        type: 'XYZ',
                        remove: true,
                        visible: true
                    },
                    {
                        id: 133,
                        label: '天地图文字标注',
                        url: 'http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=a01f0d8bb5b718b9740ef22bd1774ac2',
                        type: 'XYZ',
                        remove: true,
                        visible: true
                    },
                  {
                    id: 134,
                    label: '1:250万中国地质图',
                    url: 'http://219.144.130.58:6400/gettile?layer=GeoMapChina&TileMatrix={z}&TileCol={x}&TileRow={y}',
                    type: 'XYZ',
                    remove: true,
                    visible: false
                  },
                  {
                    id: 135,
                    label: '1:500万亚洲地质图',
                    url: 'http://210.73.59.31/asia/{z}/{y}/{x}.png',
                    type: 'XYZ',
                    remove: true,
                    visible: false,
                    urlfunc: function (coordinate) {
                     // alert(coordinate[0] + " X= " + coordinate[1] + " Y= " + coordinate[2]);
                      var x = 'C' + mapconfig.zeroFill(coordinate[1], 8, 16);
                      var y = 'R' + mapconfig.zeroFill(-coordinate[2] - 1, 8, 16);
                      var z = 'L' + mapconfig.zeroFill(coordinate[0], 2, 10);
                      return 'http://210.73.59.31/asia/'+z +'/' + y + '/' + x + '.png';//这里可以修改地图路径
                    }
                  },
                  {
                    label: '中国西部能源矿产图',
                    id: 136,
                    type: 'XYZ',
                    url:'http://219.144.130.58/xibei/xbny/{z}/{x}/{y}.png', //https://c.tile.opentopomap.org/5/27/11.png   http://219.144.130.58/xibei/xbny/8/204/102.png
                    visible: false,
                    remove: true,
                  },
                     // {
                     //    label: 'geo_wmts',
                     //    id: 137,
                     //    type: 'Geo_WMTS',
                     //    url:'http://172.30.17.136:8080/geoserver/gwc/service/wmts',
                     //    layers:'geophysical:ud1_JT',
                     //    visible: false,
                     //    remove: true,
                     //  },
                  // {
                  //   label: 'BeiJingBorder3',
                  //   id: 138,
                  //   type: 'ArcGIS_WMTS',
                  //   url:'http://172.30.17.125:6080/arcgis/rest/services/TestService/BeiJingBorder3/MapServer/WMTS/',
                  //   visible: false,
                  //   matrixIds:[0, 1, 2, 3, 4],
                  //   resolutions:[
                  //         0.00475892201166056,
                  //         0.00237946100583028,
                  //         0.00118973050291514,
                  //         5.9486525145757E-4,
                  //         2.97432625728785E-4,
                  //       ],
                  //   origin:[-400, 400],
                  //   remove: true,
                  // }
                  {
                    label: 'OpenTopoMap 地形图',
                    id: 139,
                    type: 'XYZ',
                    url:'https://c.tile.opentopomap.org/{z}/{x}/{y}.png', //https://c.tile.opentopomap.org/5/27/11.png   http://219.144.130.58/xibei/xbny/8/204/102.png
                    visible: false,
                    remove: true,
                  },
                  {
                    label: 'OSM 地理图',
                    id: 140,
                    type: 'XYZ',
                    url:'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', //https://c.tile.opentopomap.org/5/27/11.png   http://219.144.130.58/xibei/xbny/8/204/102.png
                    visible: false,
                    remove: true,
                  },
                  {
                    label: '中国矿产地（2019）',
                    id: 141,
                    type: 'XYZ',
                    url:'http://219.142.81.85/arcgis/rest/services/orefield2019_6/MapServer/tile/{z}/{y}/{x}', // http://219.142.81.85/arcgis/rest/services/orefield2019_6/MapServer/tile/5/14/25
                    visible: false,
                    remove: true,
                  },
                  //1:5万地质图I48E001007湖滩

                  // {
                  //   label: '1:5万地质图I48E001007湖滩(示例来自：NGAC )',
                  //   id: 142,
                  //   type: 'Geo_WMTS',
                  //   url:'http://219.142.81.86/igserver/ogc/kvp/TBS10E52K52E006006/WMTSServer', // http://219.142.81.85/arcgis/rest/services/orefield2019_6/MapServer/tile/5/14/25
                  //   visible: false,
                  //   remove: true,
                  // },

                ],
            },
            // {
            //     id: 14,
            //     label: 'ArcGIS_WMS',
            //     expand: false,
            //     isDir: true,
            //     remove: true,
            //     children: [
            //
            //     ]
            // },
            // {
            //     id: 15,
            //     label: 'ArcGIS_WMTS',
            //     expand: false,
            //     isDir: true,
            //     remove: true,
            //     children: [
            //     ]
            // },
          // {
          //   id: 16,
          //   label: 'Geo_WMTS',
          //   expand: false,
          //   isDir: true,
          //   remove: true,
          //   children: [
          //     {
          //     ]
          // }
        ],
    },
  {
      id: 2,
      label: '工作数据',
      expand: false,
      isDir: true,
      remove: false,
      children: [

      ]
  }
];
var treeData_3D = [{
        id: 1,
        label: '地图服务',
        expand: true,
        children: [
          {
            id: 9,
            label: 'DEM',
            expand: false,
            children: [{
              id: 91,
              label: '地形数据',
              expand: false,
              type: 'DEM',
              url: "https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path",
              visible: false
            }]
          },
          {
                id: 11,
                label: 'ArcGIS_WMS',
                expand: false,
                children: [{
                    id: 111,
                    label: '北京Border_WMS',
                    expand: false,
                    type: 'ArcGIS_WMS',
                    url: 'http://172.30.17.125:6080/arcgis/rest/services/TestService/BeiJingBorder4/MapServer',
                    visible: false,
                    imageryLayer: null
                }]
            },
            {
                id: 12,
                label: 'ArcGIS_WMTS',
                expand: false,
                children: [{
                    id: 121,
                    label: '北京Border_WMTS',
                    expand: false,
                    type: 'ArcGIS_WMTS',
                    url: 'http://172.30.17.125:6080/arcgis/rest/services/TestService/BeiJingBorder3/MapServer/WMTS?service=WMTS&request=GetTile&layer=BeiJingBorder3&style=default&tilematriX={TileMatrix}&tilerow={TileRow}&tilecoL={TileCol}',
                    visible: false,
                    imageryLayer: null
                }]
            },
            {
                id: 13,
                label: 'WFS',
                expand: false,
                children: []
            },
            {
                id: 21,
                label: 'WMS服务',
                expand: false,
                children: [

                ]
            },
            {
                id: 22,
                label: 'WMTS服务',
                expand: false,
                children: [
                    /* {
                         id: 224,
                         label: '天地图影像底图',
                         type: 'WMTS',
                         url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=a01f0d8bb5b718b9740ef22bd1774ac2",
                         visible: false,
                         layer: 'tdt4',
                         imageryLayer: null,
                     }, */
                    {
                        id: 223,
                        label: '天地图影像注记',
                        type: 'WMTS',
                        url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=a01f0d8bb5b718b9740ef22bd1774ac2",
                        visible: true,
                        layer: 'tdt3',
                        imageryLayer: null,
                    },
                    {
                        id: 221,
                        label: '天地图矢量底图',
                        type: 'WMTS',
                        url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&\
                    TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=a01f0d8bb5b718b9740ef22bd1774ac2",
                        visible: false,
                        layer: 'tdt1',
                        imageryLayer: null,
                    },
                    {
                        id: 222,
                        label: '天地图矢量注记',
                        type: 'WMTS',
                        url: 'http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=a01f0d8bb5b718b9740ef22bd1774ac2',
                        layer: 'tiandituCvaMarker',
                        visible: false,
                        imageryLayer: null,
                    }
                ],
            }
        ],
    },
    {
        id: 5,
        label: '地球物理',
        expand: false,
        children: [


        ]
    }
];
var treeWorkSpace = [{
    label: '所有文件',
    id: 1,
    children: [{
        label: '数据表',
        id: 2,
        children: []
    }, {
        label: '网格文件',
        id: 3,
        children: []
    }, {
      label: '三维数据',
      id: 3,
      children: []
    }/*, {
        label: 'GIS文件',
        id: 4,
        children: []
    }, {
        label: '其它',
        id: 5,
        children: []
    }*/]
}];
var spatialReferences=[
  {
    label:'未定义',
    options:[
      {
        label:'未定义',
        value:'Null'
      }
    ]
  },
  {
    label:'WGS 84',
    options:[
      {
        label:'WGS 84',
        value:'EPSG:4326'
      }
    ]
  },
  {
    label:'西安80',
    options:[
      {
        label:'西安80_3度_135E',
        value:'EPSG:2390'
      },
      {
        label:'西安80_3度_132E',
        value:'EPSG:2389'
      },
      {
        label:'西安80_3度_129E',
        value:'EPSG:2388'
      },
      {
        label:'西安80_3度_126E',
        value:'EPSG:2387'
      },
      {
        label:'西安80_3度_123E',
        value:'EPSG:2386'
      },
      {
        label:'西安80_3度_120E',
        value:'EPSG:2385'
      },
      {
        label:'西安80_3度_117E',
        value:'EPSG:2384'
      },
      {
        label:'西安80_3度_114E',
        value:'EPSG:2383'
      },
      {
        label:'西安80_3度_111E',
        value:'EPSG:2382'
      },
      {
        label:'西安80_3度_108E',
        value:'EPSG:2381'
      },
      {
        label:'西安80_3度_105E',
        value:'EPSG:2380'
      },
      {
        label:'西安80_3度_102E',
        value:'EPSG:2379'
      },
      {
        label:'西安80_3度_99E',
        value:'EPSG:2378'
      },
      // {
      //   label:'西安80_3度_96E',
      //   value:'EPSG:2377'
      // },
      // {
      //   label:'西安80_3度_93E',
      //   value:'EPSG:2376'
      // },
      // {
      //   label:'西安80_3度_90E',
      //   value:'EPSG:2375'
      // },
      // {
      //   label:'西安80_3度_87E',
      //   value:'EPSG:2374'
      // },
      // {
      //   label:'西安80_3度_84E',
      //   value:'EPSG:2373'
      // },
      // {
      //   label:'西安80_3度_81E',
      //   value:'EPSG:2372'
      // },
      // {
      //   label:'西安80_3度_78E',
      //   value:'EPSG:2371'
      // },

      {
        label:'西安80_6度_135E',
        value:'EPSG:2348'
      },
      {
        label:'西安80_6度_129E',
        value:'EPSG:2347'
      },
      {
        label:'西安80_6度_123E',
        value:'EPSG:2346'
      },
      {
        label:'西安80_6度_117E',
        value:'EPSG:2345'
      },
      {
        label:'西安80_6度_111E',
        value:'EPSG:2344'
      },
      {
        label:'西安80_6度_105E',
        value:'EPSG:2343'
      },
      {
        label:'西安80_6度_99E',
        value:'EPSG:2342'
      },
      // {
      //   label:'西安80_6度_93E',
      //   value:'EPSG:2341'
      // },
      // {
      //   label:'西安80_6度_87E',
      //   value:'EPSG:2340'
      // },
      // {
      //   label:'西安80_6度_81E',
      //   value:'EPSG:2339'
      // },
      // {
      //   label:'西安80_6度_75E',
      //   value:'EPSG:2338'
      // }
    ]
  },
  {
    label:'2000国家大地',
    options: [
      {
        label:'2000国家大地_3度_135E',
        value:'EPSG:4554'
      },
      {
        label:'2000国家大地_3度_132E',
        value:'EPSG:4553'
      },
      {
        label:'2000国家大地_3度_129E',
        value:'EPSG:4552'
      },
      {
        label:'2000国家大地_3度_126E',
        value:'EPSG:4551'
      },
      {
        label:'2000国家大地_3度_123E',
        value:'EPSG:4550'
      },
      {
        label:'2000国家大地_3度_120E',
        value:'EPSG:4549'
      },
      {
        label:'2000国家大地_3度_117E',
        value:'EPSG:4548'
      },
      {
        label:'2000国家大地_3度_114E',
        value:'EPSG:4547'
      },
      {
        label:'2000国家大地_3度_111E',
        value:'EPSG:4546'
      },
      {
        label:'2000国家大地_3度_108E',
        value:'EPSG:4545'
      },
      {
        label:'2000国家大地_3度_105E',
        value:'EPSG:4544'
      },
      {
        label:'2000国家大地_3度_102E',
        value:'EPSG:4543'
      },
      {
        label:'2000国家大地_3度_99E',
        value:'EPSG:4542'
      },
      // {
      //   label:'2000国家大地_3度_96E',
      //   value:'EPSG:4541'
      // },
      // {
      //   label:'2000国家大地_3度_93E',
      //   value:'EPSG:4540'
      // },
      // {
      //   label:'2000国家大地_3度_90E',
      //   value:'EPSG:4539'
      // },
      // {
      //   label:'2000国家大地_3度_87E',
      //   value:'EPSG:4538'
      // },
      // {
      //   label:'2000国家大地_3度_84E',
      //   value:'EPSG:4537'
      // },
      // {
      //   label:'2000国家大地_3度_81E',
      //   value:'EPSG:4536'
      // },
      // {
      //   label:'2000国家大地_3度_78E',
      //   value:'EPSG:4535'
      // },

      {
        label:'2000国家大地_6度_135E',
        value:'EPSG:4512'
      },
      {
        label:'2000国家大地_6度_129E',
        value:'EPSG:4511'
      },
      {
        label:'2000国家大地_6度_123E',
        value:'EPSG:4510'
      },
      {
        label:'2000国家大地_6度_117E',
        value:'EPSG:4509'
      },
      {
        label:'2000国家大地_6度_111E',
        value:'EPSG:4508'
      },
      {
        label:'2000国家大地_6度_105E',
        value:'EPSG:4507'
      },
      {
        label:'2000国家大地_6度_99E',
        value:'EPSG:4506'
      },
      // {
      //   label:'2000国家大地_6度_93E',
      //   value:'EPSG:4505'
      // },
      // {
      //   label:'2000国家大地_6度_87E',
      //   value:'EPSG:4504'
      // },
      // {
      //   label:'2000国家大地_6度_81E',
      //   value:'EPSG:4503'
      // },
      // {
      //   label:'2000国家大地_6度_75E',
      //   value:'EPSG:4502'
      // }
    ]
  },
  {
    label:'北京54',
    options:[
      {
        label:'北京54_3度_135E',
        value:'EPSG:2442'
      },
      {
        label:'北京54_3度_132E',
        value:'EPSG:2441'
      },
      {
        label:'北京54_3度_129E',
        value:'EPSG:2440'
      },
      {
        label:'北京54_3度_126E',
        value:'EPSG:2439'
      },
      {
        label:'北京54_3度_123E',
        value:'EPSG:2438'
      },
      {
        label:'北京54_3度_120E',
        value:'EPSG:2437'
      },
      {
        label:'北京54_3度_117E',
        value:'EPSG:2436'
      },
      {
        label:'北京54_3度_114E',
        value:'EPSG:2435'
      },
      {
        label:'北京54_3度_111E',
        value:'EPSG:2434'
      },
      {
        label:'北京54_3度_108E',
        value:'EPSG:2433'
      },
      {
        label:'北京54_3度_105E',
        value:'EPSG:2432'
      },
      {
        label:'北京54_3度_102E',
        value:'EPSG:2431'
      },
      {
        label:'北京54_3度_99E',
        value:'EPSG:2430'
      },
      // {
      //   label:'北京54_3度_96E',
      //   value:'EPSG:2429'
      // },
      // {
      //   label:'北京54_3度_93E',
      //   value:'EPSG:2428'
      // },
      // {
      //   label:'北京54_3度_90E',
      //   value:'EPSG:2427'
      // },
      // {
      //   label:'北京54_3度_87E',
      //   value:'EPSG:2426'
      // },
      // {
      //   label:'北京54_3度_84E',
      //   value:'EPSG:2425'
      // },
      // {
      //   label:'北京54_3度_81E',
      //   value:'EPSG:2424'
      // },
      // {
      //   label:'北京54_3度_78E',
      //   value:'EPSG:2423'
      // },

      {
        label:'北京54_6度_135E',
        value:'EPSG:21463'
      },
      {
        label:'北京54_6度_129E',
        value:'EPSG:21462'
      },
      {
        label:'北京54_6度_123E',
        value:'EPSG:21461'
      },
      {
        label:'北京54_6度_117E',
        value:'EPSG:21460'
      },
      {
        label:'北京54_6度_111E',
        value:'EPSG:21459'
      },
      {
        label:'北京54_6度_105E',
        value:'EPSG:21458'
      },
      {
        label:'北京54_6度_99E',
        value:'EPSG:21457'
      },
      // {
      //   label:'北京54_6度_93E',
      //   value:'EPSG:21456'
      // },
      // {
      //   label:'北京54_6度_87E',
      //   value:'EPSG:21455'
      // },
      // {
      //   label:'北京54_6度_81E',
      //   value:'EPSG:21454'
      // },
      // {
      //   label:'北京54_6度_75E',
      //   value:'EPSG:21453'
      // }
    ]
  }
];
var mapconfig = {
    x: 104.5, //中心点经度和纬度
    y: 35,
    zoom:5, //地图缩放级别
    treeData2d: treeData_2D,
    treeData3d: treeData_3D,
    tree2dDefaultLayers: [],
    treeWorkSpace: treeWorkSpace,
    tree3dDefaultLayers: [],
    spatialReferences:spatialReferences,
    algorithmUrlFromServerOrLocal:"0", //1代表本地服务，0代表服务器服务
    algorithmUrl:'',
    algorithmPort:'',
  zeroFill: function (num, len, radix) {
    var str = num.toString(radix || 10);
    while (str.length < len) {
      str = "0" + str;
    }
    return str;
  }
};
export default mapconfig;
