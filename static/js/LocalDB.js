var indexedDB = {
  dbName: null,
  db: null,
  dbStore: null,
  indexDB: null,
  CreateLocalDB: function () {
    if (this.db != null) {
      return;
    }
    this.init();
  },
//初始化
  init: function () {
    this.dbName = "GeoPhysical_" + (new Date().getDay() + "_" + new Date().getHours() + "_" + new Date().getMinutes());
    this.db = null;
    this.dbStore = null;
    this.indexDB = null;
    this.initDB();
  },
  initDB: function () {
    var _this = this;
    //var indexDB = window.indexedDB;完善
    // 获取IDBFactory接口实例
    var indexDB =
      window.indexedDB ||
      window.webkitIndexedDB ||
      window.mozIndexedDB ||
      window.msIndexedDB;
    if (!indexDB) {
      console.log('你的浏览器不支持IndexedDB');
    }
    _this.indexDB = indexDB;
    // 2\. 通过IDBFactory接口的open方法打开一个indexedDB的数据库实例
    // 第一个参数： 数据库的名字，第二个参数：数据库的版本。
    //indexDB.deleteDatabase(_this.dbName);
    var openDBRequest = indexDB.open(_this.dbName);
    // 第一次打开成功后或者版本有变化自动执行以下事件：一般用于初始化数据库。
    openDBRequest.onupgradeneeded = function (event) {
      _this.db = event.target.result;
      if (!_this.db.objectStoreNames.contains("defaultStore")) {
        _this.dbStore = _this.db.createObjectStore("defaultStore", {
          keyPath: 'guid'
        });
        //创建字段key索引，从key获取数据。
        _this.dbStore.createIndex('guid', 'guid', {
          unique: false
        });

      }
    };
    openDBRequest.onerror = function () {
      console.log("打开数据库失败！")
    };
    //此方法很重要
    openDBRequest.onsuccess = function () {
      _this.db = openDBRequest.result;
    }
  },
  //获取所有数据
  getAllData: function (callback) {

    var transaction = this.db.transaction(['defaultStore']);
    var objStore = transaction.objectStore('defaultStore');
    var request = objStore.openCursor();
    var data = [];
    request.onerror = function () {
      console.log('获取所有数据失败！')
    }
    request.onsuccess = function (event) {
      var result = event.target.result;
      if (result && result !== null) {
        data.push(result.value);
        result.continue();
      } else {
        if (callback) {
          callback(data);
        }
      }
    }
  },
  deleteData: function (key, callback) {

    var transaction = this.db.transaction(['defaultStore'], 'readwrite');
    var objStore = transaction.objectStore('defaultStore');
    var request = objStore.delete(key);
    request.onorreor = function () {
      console.log('删除失败！')
    };
    request.onsuccess = function () {
      console.log('删除成功');
      if (callback) {
        callback()
      }
    }
  },
  isKeyExist: function (key, callback) {
    var _this = this;
    var isExist = false;
    //数据库的 objectStore 游标查询
    var objStore = _this.db.transaction('defaultStore').objectStore('defaultStore');
    objStore.openCursor().onsuccess = function (e) {
      var cursor = e.target.result;
      if (cursor) {
        if (cursor.key == key) {
          isExist = true;
        }
        cursor.continue();// 游标继续往下 搜索，重复触发 onsuccess方法，如果到最后返回null
      } else {
        callback(isExist);
      }
    }
  },
  getAllKeys: function (callback) {

    var keys = [];
    var objStore = this.db.transaction('defaultStore').objectStore('defaultStore');
    objStore.openCursor().onsuccess = function (e) {
      var cursor = e.target.result;
      if (cursor) {
        keys.push(cursor.key)
        cursor.continue();
      } else {
        callback(keys);
      }
    }
  },
  getDataInfos: function (callback) {

    var transaction = this.db.transaction(['defaultStore']);
    var objStore = transaction.objectStore('defaultStore');
    var request = objStore.openCursor();
    var data = [];
    request.onerror = function () {
      console.log('获取所有数据失败！')
    }
    request.onsuccess = function (event) {
      var result = event.target.result;
      if (result && result !== null) {
        data.push({key: result.key, label: result.value.displayName});
        result.continue();
      } else {
        if (callback) {
          callback(data);
        }
      }
    }
  },
//仅获取指定类型文件
  gettypeDataInfos: function (type, callback) {

    var transaction = this.db.transaction(['defaultStore']);
    var objStore = transaction.objectStore('defaultStore');
    var request = objStore.openCursor();
    var data = [];
    request.onerror = function () {
      console.log('获取所有数据失败！')
    };
    request.onsuccess = function (event) {
      var result = event.target.result;
      if (result && result !== null && result.value.datatype == type) {
        data.push({key: result.key, label: result.value.displayName});
        result.continue();
      } else if (result !== null)
        result.continue();
      else {
        if (callback) {
          callback(data);
        }
      }
    }
  },

//obj 数据库存储对象key不变，其他属性更新
//更新成功返回1，失败返回0
  updateData: function (key, param, callback) {
    var _this = this;
    this.getData(key, function (result) {
      for (var k in param) {
        result[k] = param[k];
      }
      var updateRequest = _this.db.transaction(['defaultStore'], 'readwrite').objectStore('defaultStore').put(result);
      updateRequest.onsuccess = function () {
        callback('1');
      };
      updateRequest.onerror = function () {
        callback('0');
      }
    })
  },
  deleteIndexDB: function () {
    this.indexDB.deleteDatabase(this.dbName);
    this.db = null;
    this.dbStore = null;
    this.dbName = null;
  },
//添加数据
  addData: function (obj, callback) {
    var _this = this;
    var isContainsKey = false;
    for (var key in obj) {
      if (key == "guid") {
        isContainsKey = true;
      }
    }
    if (!isContainsKey) {
      console.log("插入的对象必须包含【guid】属性！");
      return;
    }
    _this.isKeyExist(obj.guid, function (isExist) {
      if (isExist) {
        console.log("值已存在");
        return;
      }
      var request = _this.db.transaction(['defaultStore'], 'readwrite').objectStore(
        'defaultStore').add(obj);
      request.onsuccess = function () {
        if (callback) {
          callback()
        }
      };
      request.onerror = function () {
        console.log("数据入库失败！");
      }
    })

  },
//获取数据
  getData: function (key, callback) {
    var transaction = this.db.transaction(['defaultStore']);
    var objStore = transaction.objectStore('defaultStore');
    var request = objStore.get(key);
    request.onerror = function () {
      console.log("获取数据失败！");
    };
    request.onsuccess = function () {
      if (request.result) {
        callback(request.result);
      } else {
        console.log("记录为空！");
      }
    }
  },
  //获取多个数据
  getDatas: function (keys, callback) {
    var transaction = this.db.transaction(['defaultStore']);
    var objStore = transaction.objectStore('defaultStore');
    var request = objStore.openCursor();
    var data = [];
    request.onerror = function () {
      console.log('获取所有数据失败！')
    };
    request.onsuccess = function (event) {
      var result = event.target.result;
      if (result && result !== null && keys.indexOf(result.value.guid) != -1) {
        data.push(result.value);
        result.continue();
      } else if (result !== null)
        result.continue();
      else {
        if (callback) {
          callback(data);
        }
      }
    }
  },
}
indexedDB.prototype = {
  extend: function (obj) {
    for (var key in obj) {
      this[key] = obj[key];
    }
  },

};

// var LocalDB = new CreateLocalDB();

export default {
  state: {
    db: indexedDB
  }
}
