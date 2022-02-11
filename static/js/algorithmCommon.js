import commonFunctions from './common'
import { Base64 } from 'js-base64';
import mapconfig from '../config/tree_2dmap'
import localDB from './LocalDB'
import globalConfig from '../../src/components/Global'
const axios = require('axios');
const algorithmCommon={
  //属性
  axios:axios,
  Base64:Base64,
  db:localDB.state.db,
  name:'aaa',
  treeData:mapconfig.treeWorkSpace,
  mapconfig:mapconfig,
  //algorithmUrl:'http://'+mapconfig.algorithmUrl+':'+mapconfig.algorithmPort+'/?act=EXECUTE&t=1234567890',
  //方法
  executeAlgorithmCommon:null,
  executeAlgorithm:null,
  executeAlgorithm2:null,
  //接受两个grd
  executeAlgorithm3:null,
  //接受两个grd和一个xls
  executeAlgorithm4:null,
  executeAlgorithm5:null,
  executeAlgorithmOnServer:null,//除剖面exe算法外的调用方法，包括idw.exe
  executeAlgorithmOnServer2:null,//剖面exe算法调用方法
  text2grd:null,
  objNames:{},
  newResultName:null,//对结果文件重新自动命名  eg   name_1    name_2     name_3.....
};
//根据接收参数不同，分为三类
algorithmCommon.executeAlgorithm=function (result,params,type,callback) {
  var _this=this;
  setTimeout(function(){
    globalConfig.state.percent=40;
  },1000);

  var dat=" ";
  dat+=params+result.grdData.type+"\n"+
    result.grdData.xcount+"\n"+ result.grdData.ycount+"\n"+
    result.grdData.xmin+"\n"+result.grdData.xmax+"\n"+
    result.grdData.ymin+"\n"+result.grdData.ymax+"\n"+
    result.grdData.zmin+"\n"+result.grdData.zmax+"\n";

  for (let zj = 0; zj < result.grdData.z.length; zj++) {
    for (let zk = 0; zk < result.grdData.z[zj].length; zk++){
      if(result.grdData.z[zj][zk]=="NaN"){
        dat+="1.70141E38"+"\n";
      }
      else{
        dat+=result.grdData.z[zj][zk]+"\n";
      }

    }
  }

  let algorithmUrl='http://'+_this.mapconfig.algorithmUrl+':'+_this.mapconfig.algorithmPort+'/?act=EXECUTE&t=1234567890';
  var paramForLocalServer={};
  paramForLocalServer.fun=type;
  paramForLocalServer.par=dat;
  this.axios({
    method:'post',
    url:algorithmUrl,
    data:JSON.stringify(paramForLocalServer),
    dataType:'text',
    contentType:'application/json'
  }).then(function (response) {
    var grd={};
    var jsonArray=[];
    _this.text2grd(response,grd,jsonArray);
    var type = "grd";
    var displayeName = result.displayName +"("+ type+")";
    var guid = commonFunctions.newGuid();
    _this.name=_this.newResultName(_this.name);
    _this.db.addData({
      "guid": guid,
      "data": jsonArray,
      "grdData": grd,
      "displayName": _this.name,
      "datatype": type,
      "isExecuted":true
    }, function() {
      _this.treeData[0].children[1].children.push({
        label: _this.name,
        datatype: type,
        guid: guid
      });
      globalConfig.state.percent=100;
      setTimeout(function () {
        globalConfig.state.progressVisible=false;
      },2000)
    });
  }).catch(function (err) {
    if(typeof callback=="function"){
      callback();
    }

  });

}
algorithmCommon.executeAlgorithm2=function (result,params,type,callback) {
  var _this=this;
  setTimeout(function(){
    globalConfig.state.percent=40;
  },1000);

  var dat=" ";
  dat+=params+result.grdData.type+"\n"+
    result.grdData.xcount+","+ result.grdData.ycount+"\n"+
    result.grdData.xmin+","+result.grdData.xmax+"\n"+
    result.grdData.ymin+","+result.grdData.ymax+"\n"+
    result.grdData.zmin+","+result.grdData.zmax+"\n";

  for (let zj = 0; zj < result.grdData.z.length; zj++) {
    for (let zk = 0; zk < result.grdData.z[zj].length; zk++){
      if(result.grdData.z[zj][zk]=="NaN"){
        dat+="1.70141E38"+"\n";
      }
      else{
        dat+=result.grdData.z[zj][zk]+"\n";
      }
    }
  }

  let algorithmUrl='http://'+_this.mapconfig.algorithmUrl+':'+_this.mapconfig.algorithmPort+'/?act=EXECUTE&t=1234567890';
  var paramForLocalServer={};
  paramForLocalServer.fun=type;
  paramForLocalServer.par=dat;

  this.axios({
    method:'post',
    url:algorithmUrl,
    //url:'http://localhost:23412/?act=EXECUTE&t=1234567890',
    data:JSON.stringify(paramForLocalServer),
    dataType:'text',
    contentType:'application/json'
  }).then(function (response) {
    var grd={};
    var jsonArray=[];
    _this.text2grd(response,grd,jsonArray);
    var type = "grd";
    var guid = commonFunctions.newGuid();
    _this.name=_this.newResultName(_this.name);
    _this.db.addData({
      "guid": guid,
      "data": jsonArray,
      "grdData": grd,
      "displayName":_this.name,
      "datatype": type,
      "isExecuted":true
    }, function() {
      _this.treeData[0].children[1].children.push({
        label: _this.name,
        datatype: type,
        guid: guid
      });
      globalConfig.state.percent=100;
      setTimeout(function () {
        globalConfig.state.progressVisible=false;
      },2000)
    });
  }).catch(function (err) {
    if(typeof callback=="function"){
      callback();
    }

  });

}
//接受2个grd文件
algorithmCommon.executeAlgorithm3=function (result,result2,params,type,callback) {
  var _this=this;
  setTimeout(function(){
    globalConfig.state.percent=40;
  },1000);
  var dat=" ";
  dat+=params+result.grdData.type+"\n"+
    result.grdData.xcount+","+ result.grdData.ycount+"\n"+
    result.grdData.xmin+","+result.grdData.xmax+"\n"+
    result.grdData.ymin+","+result.grdData.ymax+"\n"+
    result.grdData.zmin+","+result.grdData.zmax+"\n";

  for (let zj = 0; zj < result.grdData.z.length; zj++) {
    for (let zk = 0; zk < result.grdData.z[zj].length; zk++){
      if(result.grdData.z[zj][zk]=="NaN"){
        dat+="1.70141E38"+"\n";
      }
      else{
        dat+=result.grdData.z[zj][zk]+"\n";
      }
    }
  }

  dat+=result2.grdData.type+"\n"+
    result2.grdData.xcount+","+ result2.grdData.ycount+"\n"+
    result2.grdData.xmin+","+result2.grdData.xmax+"\n"+
    result2.grdData.ymin+","+result2.grdData.ymax+"\n"+
    result2.grdData.zmin+","+result2.grdData.zmax+"\n";

  for (let zj = 0; zj < result2.grdData.z.length; zj++) {
    for (let zk = 0; zk < result2.grdData.z[zj].length; zk++){
      dat+=result2.grdData.z[zj][zk]+"\n";
    }
  }
  // _this.executeAlgorithmCommon(type,dat,callback);
  // return;
  let algorithmUrl='http://'+_this.mapconfig.algorithmUrl+':'+_this.mapconfig.algorithmPort+'/?act=EXECUTE&t=1234567890';
  var paramForLocalServer={};
  paramForLocalServer.fun=type;
  paramForLocalServer.par=dat;

  this.axios({
    method:'post',
    url:algorithmUrl,
    data:JSON.stringify(paramForLocalServer),
    dataType:'text',
    contentType:'application/json'
  }).then(function (response) {
    var grd={};
    var jsonArray=[];
    _this.text2grd(response,grd,jsonArray);
    var type = "grd";
    var displayeName = result.displayName +"("+ type+")";
    var guid = commonFunctions.newGuid();
    _this.name=_this.newResultName(_this.name);
    _this.db.addData({
      "guid": guid,
      "data": jsonArray,
      "grdData": grd,
      "displayName": _this.name,
      "datatype": type,
      "isExecuted":true
    }, function() {
      _this.treeData[0].children[1].children.push({
        label: _this.name,
        datatype: type,
        guid: guid
      });
      globalConfig.state.percent=100;
      setTimeout(function () {
        globalConfig.state.progressVisible=false;
      },2000)
    });
  }).catch(function (err) {
    if(typeof callback=="function"){
      callback();
    }
  });
}
algorithmCommon.executeAlgorithm4=function (result,result2,resultXls,params,type,callback) {
  var _this=this;
  setTimeout(function(){
    globalConfig.state.percent=40;
  },1000);

  var dat="";
  dat+=params+result.grdData.type+"\n"+
    result.grdData.xcount+","+ result.grdData.ycount+"\n"+
    result.grdData.xmin+","+result.grdData.xmax+"\n"+
    result.grdData.ymin+","+result.grdData.ymax+"\n"+
    result.grdData.zmin+","+result.grdData.zmax+"\n";

  for (let zj = 0; zj < result.grdData.z.length; zj++) {
    for (let zk = 0; zk < result.grdData.z[zj].length; zk++){
      if(result.grdData.z[zj][zk]=="NaN"){
        dat+="1.70141E38"+"\n";
      }
      else{
        dat+=result.grdData.z[zj][zk]+"\n";
      }
    }
  }
  dat+=result2.grdData.type+"\n"+
    result2.grdData.xcount+","+ result2.grdData.ycount+"\n"+
    result2.grdData.xmin+","+result2.grdData.xmax+"\n"+
    result2.grdData.ymin+","+result2.grdData.ymax+"\n"+
    result2.grdData.zmin+","+result2.grdData.zmax+"\n";

  for (let zj = 0; zj < result2.grdData.z.length; zj++) {
    for (let zk = 0; zk < result2.grdData.z[zj].length; zk++){
      dat+=result2.grdData.z[zj][zk]+"\n";
    }
  }
  for(let zj=0;zj<resultXls.length;zj++){
    dat+=resultXls[zj][0]+" "+resultXls[zj][1]+" "+resultXls[zj][2]+"\n";
  }
  let algorithmUrl='http://'+_this.mapconfig.algorithmUrl+':'+_this.mapconfig.algorithmPort+'/?act=EXECUTE&t=1234567890';
  var paramForLocalServer={};
  paramForLocalServer.fun=type;
  paramForLocalServer.par=dat;
  _this.axios({
    method:'post',
    //url:'http://localhost:23412/?act=EXECUTE&t=1234567890',
    url:algorithmUrl,
    data:JSON.stringify(paramForLocalServer),
    dataType:'text',
    contentType:'application/json'
  }).then(function (response) {
    var grd={};
    var jsonArray=[];
    _this.text2grd(response,grd,jsonArray);
    var type = "grd";
    var displayeName = result.displayName +"("+ type+")";
    var guid = commonFunctions.newGuid();
    _this.name=_this.newResultName(_this.name);
    _this.db.addData({
      "guid": guid,
      "data": jsonArray,
      "grdData": grd,
      "displayName": _this.name,
      "datatype": type,
      "isExecuted":true
    }, function() {
      _this.treeData[0].children[1].children.push({
        label: _this.name,
        datatype: type,
        guid: guid
      });
      globalConfig.state.percent=100;
      setTimeout(function () {
        globalConfig.state.progressVisible=false;
      },2000)
    });
    callback("success");
  }).catch(function (err) {
    if(typeof callback=="function"){
      callback("error");
    }

  });
}
algorithmCommon.executeAlgorithm5=function (params,type,callback) {
  var _this=this;
  let algorithmUrl='http://'+_this.mapconfig.algorithmUrl+':'+_this.mapconfig.algorithmPort+'/?act=EXECUTE&t=1234567890';
  var paramForLocalServer={};
  paramForLocalServer.fun=type;
  paramForLocalServer.par=params;
  this.axios({
    method:'post',
    //url:'http://localhost:23412/?act=EXECUTE&t=1234567890',
    url:algorithmUrl,
    data:JSON.stringify(paramForLocalServer),
    dataType:'text',
    contentType:'application/json'
  }).then(function (response) {
    let x = [];
    let y = [];
    let data;
    var grd={};
    var jsonArray=[];
    data = response.data.data;
    for (let j = 0; j < data.length; j++) {
      x[j] = j;
      y[j] = data[j];
      var json = {
        "x": j,
        "y": data[j],
      };
      jsonArray.push(json);
    }
    var type = "grd";
    var guid = commonFunctions.newGuid();
    globalConfig.state.percent=80;
    grd.x = x;
    grd.y = y;
    _this.name=_this.newResultName(_this.name);
    _this.db.addData({
      "guid": guid,
      "data": jsonArray,
      "grdData": grd,
      "displayName": _this.name,
      "datatype": type,
      "isExecuted":true
    }, function() {
      _this.treeData[0].children[1].children.push({
        label: _this.name,
        datatype: type,
        guid: guid
      });
      globalConfig.state.percent=100;
      setTimeout(function () {
        globalConfig.state.progressVisible=false;
      },2000)
    });
  }).catch(function (err) {
    if(typeof callback=="function"){
      callback();
    }

  });

}
//剖面本地算法调用
algorithmCommon.executeAlgorithm6=function (params,type,result_data,callback) {
  var dat="";
  for (let zj = 0; zj < params.data.length; zj++) {
      dat+=params.data[zj]+"\n";
  }
  var _this=this;
  let algorithmUrl='http://'+_this.mapconfig.algorithmUrl+':'+_this.mapconfig.algorithmPort+'/?act=EXECUTE&t=1234567890';
  var paramForLocalServer={};
  paramForLocalServer.fun=type;
  paramForLocalServer.par=dat;
  this.axios({
    method:'post',
    //url:'http://localhost:23412/?act=EXECUTE&t=1234567890',
    url:algorithmUrl,
    data:JSON.stringify(paramForLocalServer),
    dataType:'text',
    contentType:'application/json'
  }).then(function (response) {
    var grd={};
    var jsonArray=[];
    if(response.data.res==""){
      return;
    }
    // _this.text2grd(response,grd,jsonArray);
    var txt=_this.Base64.decode(response.data.res);
    var z = new Array();
    var data = new Array();
    data  = txt.replace(/\r|\n|\"/," ").split(/\s+/); //split(/-|:|,/); ¶à¸ö·Ö¸ô·ûÇé¿ö
    data.splice(0, 1);
    data.pop();
    let number =0;
    let x = [];
    let y = [];
    let y2 = [];
    for (let j = 0; j < data.length; j++) {
      if (j%2==0) {
        x.push(data[j]);
        // var json = {
        //   "x": data[j]
        // };
        let column_D = result_data.column_D;
        y2.push(result_data.data[number][column_D]);
        // json[result_data.column_D]=result_data.data[number];
        jsonArray[number][result_data.column_E]=data[j+1];
        number++;
        // json[result_data.column_E]=data[j+1];
        // jsonArray.push(json);
      }
      else {
        y.push(data[j]);
      }
    }
    globalConfig.state.percent=80;
    grd.x = x;
    grd.y = y;
    grd.y2 = y2;
    let type = "xls";
    let guid = commonFunctions.newGuid();
    _this.name=_this.newResultName(_this.name);
    _this.db.addData({
      "guid": guid,
      "data": jsonArray,
      "grdData": grd,
      "displayName": _this.name,
      "datatype": type,
      "isExecuted": true,
      "isView":true,
      "flag":params["flag"]
    }, function () {
      _this.treeData[0].children[0].children.push({
        label: _this.name,
        datatype: type,
        guid: guid,
        isView:true,
        Data:jsonArray,
        flag:params["flag"]
      });
      globalConfig.state.percent=100;
      setTimeout(function () {
        globalConfig.state.progressVisible=false;
      },2000);
    });
  })
    .catch(function (error) {
      callback('error',error);
      setTimeout(function () {
        globalConfig.state.progressVisible=false;
      },2000)
    });

}
//接受一个参数，Excel
algorithmCommon.executeAlgorithm7=function (result,params,p1,p2,type,callback) {
  var _this=this;
  setTimeout(function(){
    globalConfig.state.percent=40;
  },1000);

  var dat=params;
  for (let zj = 0; zj < result.data.length; zj++) {
    dat+=result.data[zj][p1]+" "+result.data[zj][p2]+"\n";
  }

  let algorithmUrl='http://'+_this.mapconfig.algorithmUrl+':'+_this.mapconfig.algorithmPort+'/?act=EXECUTE&t=1234567890';
  var paramForLocalServer={};
  paramForLocalServer.fun=type;
  paramForLocalServer.par=dat;

  this.axios({
    method:'post',
    url:algorithmUrl,
    data:JSON.stringify(paramForLocalServer),
    dataType:'text',
    contentType:'application/json'
  }).then(function (response) {
    var grd={};
    var jsonArray=[];
    _this.text2grd(response,grd,jsonArray);
    var type = "grd";
    var guid = commonFunctions.newGuid();
    _this.name=_this.newResultName(_this.name);
    _this.db.addData({
      "guid": guid,
      "data": jsonArray,
      "grdData": grd,
      "displayName":_this.name,
      "datatype": type,
      "isExecuted":true
    }, function() {
      _this.treeData[0].children[1].children.push({
        label: _this.name,
        datatype: type,
        guid: guid
      });
      globalConfig.state.percent=100;
      setTimeout(function () {
        globalConfig.state.progressVisible=false;
      },2000)
    });
  }).catch(function (err) {
    if(typeof callback=="function"){
      callback();
    }

  });

}

algorithmCommon.executeAlgorithmCommon=function(type,dat,name,callback){
  var _this=this;
  var paramForLocalServer={};
  paramForLocalServer.fun=type;
  paramForLocalServer.par=dat;
  let algorithmUrl='http://'+_this.mapconfig.algorithmUrl+':'+_this.mapconfig.algorithmPort+'/?act=EXECUTE&t=1234567890';
  this.axios({
    method:'post',
    //url:'http://localhost:23412/?act=EXECUTE&t=1234567890',
    url:algorithmUrl,
    data:JSON.stringify(paramForLocalServer),
    dataType:'text',
    contentType:'application/json'
  }).then(function (response) {
    var grd={};
    var jsonArray=[];
    if(response.data.res==""){
      return;
    }
    _this.text2grd(response,grd,jsonArray);
    var type = "grd";
    var displayeName =name;
    var guid = commonFunctions.newGuid();
    _this.db.addData({
      "guid": guid,
      "data": jsonArray,
      "grdData": grd,
      "displayName": _this.name,
      "datatype": type,
      "isExecuted":true
    }, function() {
      _this.treeData[0].children[1].children.push({
        label: _this.name,
        datatype: type,
        guid: guid
      });
      globalConfig.state.percent=100;
      setTimeout(function () {
        globalConfig.state.progressVisible=false;
      },2000)
    });
  }).catch(function (err) {
    if(typeof callback=="function"){
      callback();
    }

  });
}
algorithmCommon.text2grd=function(text,dat,jsonArray){
  var txt=this.Base64.decode(text.data.res);
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
      if(parseFloat(data[i*nx+j+ori+9])>=1.70141E38){
        z[i][j]=NaN;
      }
      else{
        z[i][j]=parseFloat(data[i*nx+j+ori+9]);
      }


      var json = {
        "x": x[j],
        "y": y[i],
        "z": z[i][j]
      };
      jsonArray.push(json);
    }
  }
  dat.type="DSAA";
  dat.nx  = nx
  dat.ny  = ny;
  dat.xcount=nx;
  dat.ycount=ny;
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
algorithmCommon.executeAlgorithmOnServer=function (params,spatialReference,callback) {
  var _this=this;
  setTimeout(function () {
    globalConfig.state.percent=40;
  },1000);
  this.axios({
    method: 'post',
    url: WebConfig.ServicesUrl + '/Algorithm',
    data: params,
    dataType: 'json',
    contentType: 'application/json;',
  })
    .then(function (response) {
      if (response.data.status==="ERROR"){
        callback('error',response.data.message);
      }else{
        let dsaa;
        let nx, ny;
        let xmin, xmax, ymin, ymax, zmin, zmax;
        let x = [];
        let y = [];
        let z = [];
        let data;
        data = response.data.data;
        dsaa = data[0];
        nx = parseInt(data[1]);
        ny = parseInt(data[2]);
        xmin = parseFloat(data[3]);
        xmax = parseFloat(data[4]);
        ymin = parseFloat(data[5]);
        ymax = parseFloat(data[6]);

        var grd = {};
        grd.type = data[0];
        grd.xmin = parseFloat(data[3]);
        grd.zmin = parseFloat(data[7]);
        grd.ymin = parseFloat(data[5]);
        grd.xmax = parseFloat(data[4]);
        grd.ymax = parseFloat(data[6]);
        grd.zmax = parseFloat(data[8]);
        grd.xcount = parseInt(data[1]);
        grd.ycount = parseInt(data[2]);
        //grd.zValus=[];
        var jsonArray = [];
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
            if (temp >= 1.70141E38)
            {
              z[i][j] = "NaN";
            }
            else{
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

        setTimeout(function () {
          globalConfig.state.percent=80;
        },2000)
        grd.x = x;
        grd.y = y;
        grd.z = z;
        var type = "grd";
        var guid = commonFunctions.newGuid();
        _this.name=_this.newResultName(_this.name);
        _this.db.addData({
          "guid": guid,
          "data": jsonArray,
          "grdData": grd,
          "displayName": _this.name,
          "datatype": type,
          "isExecuted": true,
          "spatialReference": spatialReference
        }, function () {
          _this.treeData[0].children[1].children.push({
            label: _this.name,
            datatype: type,
            guid: guid
          });
          setTimeout(function () {
            globalConfig.state.percent=100;
          },3000);
          setTimeout(function () {
            globalConfig.state.progressVisible=false;
          },3500);
          callback('success');
        });
      }
    })
    .catch(function (error) {
      callback('error',error);
      setTimeout(function () {
        globalConfig.state.progressVisible=false;
      },2000)
    });
}
//返回数据为两列数据
algorithmCommon.executeAlgorithmOnServer2=function (params,spatialReference,result_data,callback) {
  var _this=this;

  setTimeout(function(){
    globalConfig.state.percent=40;
  },1000);
  this.axios({
    method: 'post',
    url: WebConfig.ServicesUrl + '/Algorithm',
    data: params,
    dataType: 'json',
    contentType: 'application/json;',
  })
    .then(function (response) {
      let number =0;
      let x = [];
      let y = [];
      let y2 = [];
      let data;
      data = response.data.data;
      let grd = {};
      let jsonArray = [];
      jsonArray=result_data.data;
      for (let j = 0; j < data.length; j++) {
        if (j%2==0) {
          x.push(data[j]);
          // var json = {
          //   "x": data[j]
          // };
          let column_D = result_data.column_D;
          y2.push(result_data.data[number][column_D]);
          //json[result_data.column_D]=result_data.data[number][column_D];
          //获取全部原始数据
          jsonArray[number][result_data.column_E]=data[j+1];
          number++;
          //json[result_data.column_E]=data[j+1];
          // jsonArray.push(json);
        }
        else {
          y.push(data[j]);
        }
      }
      setTimeout(function(){
        globalConfig.state.percent=80;
      },1500);
      grd.x = x;
      grd.y = y;
      grd.y2 = y2;
      let type = "xls";
      let guid = commonFunctions.newGuid();
      _this.db.addData({
        "guid": guid,
        "data": jsonArray,
        "grdData": grd,
        "displayName": _this.name,
        "datatype": type,
        "isExecuted": true,
        "spatialReference": spatialReference,
        "isView":true,
        "flag":params["flag"]
      }, function () {
        _this.treeData[0].children[0].children.push({
          label: _this.name,
          datatype: type,
          guid: guid,
          isView:true,
          Data:jsonArray,
          flag:params["flag"]
        });
        setTimeout(function(){
          globalConfig.state.percent=100;
        },2000);
        setTimeout(function () {
          globalConfig.state.progressVisible=false;
        },2500);
        callback('success');
      });
    })
    .catch(function (error) {
      callback('error',error);
      setTimeout(function () {
        globalConfig.state.progressVisible=false;
      },2000)
    });
}

//避免结果文件名称重复，重命名  eg  name_1   name_2   name_3
algorithmCommon.newResultName=function (name) {
  var isContains=false;
  for(var key in this.objNames){
    if(key==name){
      isContains=true;
      var length=this.objNames[name].length;
      this.objNames[name].push(name);
      return name.substring(0,name.length-4)+'_'+length+name.substring(name.length-4);
    }
  }
  if(!isContains){
    this.objNames[name]=[];
    this.objNames[name].push(name);
    return name;
  }

}

export default algorithmCommon;
