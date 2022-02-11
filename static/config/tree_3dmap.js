var treeData =[
      {
        title: '天地图矢量地图注记服务',
        checked: true,
        url:'http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=a01f0d8bb5b718b9740ef22bd1774ac2',
        layer:'tiandituCvaMarker',
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "tiandituCvaMarker",
        show: true,
        maximumLevel: 16
      },
      {
        title: '天地图矢量地图服务',
        checked: false,
        url:'http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=a01f0d8bb5b718b9740ef22bd1774ac2',
        layer: "tiandituImg",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "tiandituImg",
        show: false,
        maximumLevel: 18
      },
      {
        title: '天地图全球影像地图服务',
        checked: false,
        url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=a01f0d8bb5b718b9740ef22bd1774ac2",
        layer: "GoogleMapsCompatible",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false
      }, 
      {
        title: '天地图全球影像注记服务',
        checked: false,
        url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=a01f0d8bb5b718b9740ef22bd1774ac2",
        layer: "tdtImgAnnoLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "tdtImgAnnoLayer",
        show: false  
      }
];

var map3dconfig={
  treeData3d:treeData
};
export default map3dconfig;
