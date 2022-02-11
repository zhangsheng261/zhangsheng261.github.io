window.menuClick = function (key) {

}
var navListData = [
  // {
  //     index: 0,
  //     name: '首页',
  //     handleClick: this.toIndexPage,
  //     hasChildren: false
  // },
  //数据管理
  {
    index: 1,
    name: '数据管理', //菜单名称
    icon: 'el-icon-wallet',
    handleClick: this.firstNavClick, //主菜单绑定的点击事件（预留，暂时未用到，方便后期扩展）
    hasChildren: true, //是否含有下拉菜单
    children: [
      { //下拉列表
        name: '导入本地数据',
        hasChildren: false, //是否含有下拉菜单
        handleClick: "handleImportLocalData", //叶子节点的事件（我们真正放自定义方法的地方
        achieve: true//该方法是否已经实现，实现的为true，未实现为false
      }, {
        name: '添加在线数据',
        hasChildren: false,
        handleClick: "handleImportOnLineData",
        achieve: true //该方法是否已经实现，实现的为true，未实现为false
      }, {
        name: '保存工程',
        hasChildren: false,
        handleClick: "saveAsProjectFile",
        achieve: true //该方法是否已经实现，实现的为true，未实现为false
      },
      {
        name: '打开工程',
        hasChildren: false,
        handleClick: "openProjectFile",
        achieve: true //该方法是否已经实现，实现的为true，未实现为false
      }
      // {
      //   name: '保存配置文件',
      //   hasChildren: false,
      //   handleClick: this.handleLeafClick,
      //   achieve: false //该方法是否已经实现，实现的为true，未实现为false
      // },
      // {
      //   name: '算法管理',
      //   hasChildren: false,
      //   handleClick:"showAlgManage",
      //   achieve: true
      // }
    ]
  },
  //外业整理
  // {
  //   index: 2,
  //   name: '外业整理',
  //   handleClick: this.firstNavClick,
  //   hasChildren: true,
  //   children: [{
  //     name: '磁测数据',
  //     hasChildren: true,
  //     handleClick: this.sedNavClick, //二级菜单标题绑定的事件
  //     children: [{
  //       name: '探头一致性',
  //       hasChildren: false,
  //       handleClick: this.handleLeafClick,
  //       achieve: false
  //     }, {
  //       name: '噪声实验',
  //       hasChildren: false,
  //       handleClick: this.handleLeafClick,
  //       achieve: false
  //     }, {
  //       name: '单点地磁要素计算',
  //       hasChildren: false,
  //       handleClick: this.handleLeafClick,
  //       achieve: false
  //     }, {
  //       name: '多点地磁要素计算',
  //       hasChildren: false,
  //       handleClick: this.handleLeafClick,
  //       achieve: false
  //     }, {
  //       name: '各项改正',
  //       hasChildren: false,
  //       handleClick: this.handleLeafClick,
  //       achieve: false
  //     }, {
  //       name: '精度检验',
  //       hasChildren: false,
  //       handleClick: this.handleLeafClick,
  //       achieve: false
  //     }]
  //   }, {
  //     name: '重力数据',
  //     hasChildren: true,
  //     handleClick: this.sedNavClick,
  //     children: [{
  //       name: '静态试验',
  //       hasChildren: false,
  //       handleClick: this.handleLeafClick,
  //       achieve: false
  //     },
  //       {
  //         name: '动态试验',
  //         hasChildren: false,
  //         handleClick: this.handleLeafClick,
  //         achieve: false
  //       },
  //       {
  //         name: '基点联测',
  //         hasChildren: false,
  //         handleClick: this.handleLeafClick,
  //         achieve: false
  //       }
  //     ]
  //   }]
  // },
  //内业整理
  {
    index: 3,
    name: '数据预处理',
    icon: 'el-icon-wallet',
    handleClick: this.firstNavClick,
    hasChildren: true,
    children: [{
      name: '设置坐标系统',
      hasChildren: false,
      handleClick: "handleSetCoorSystem",
      achieve: true
    },
      // {
      //   name: '坐标转换',
      //   hasChildren: false,
      //   handleClick: "handleCoordinateTransForm",
      //   achieve: true
      // },
      {
        name: '数据网格化',
        hasChildren: false,
        handleClick: "grdHandle",
        achieve: true
      },
      // {
      //   name: '白化处理',
      //   handleClick: "grdFilterHandle",
      //   achieve: true
      // },
      {
        name: '单点地磁要素计算',
        hasChildren: false,
        handleClick: "singleGravityCal",
        achieve: true
      },
      {
        name: '多点地磁要素计算',
        handleClick: "multiGravityCal",
        achieve: true
      }
    ]
  },
  {
    index: 5,
    name: '平面',
    icon: 'el-icon-wallet',
    handleClick: this.firstNavClick,
    hasChildren: true,
    children: [
      {
        name: '空间域',
        hasChildren: true,
        handleClick: this.sedNavClick,
        children: [
          //   {
          //   name: '向上延拓',
          //   hasChildren: false,
          //   handleClick: this.handleLeafClick,
          //   achieve: false
          // },
          //   {
          //     name: '向下延拓',
          //     hasChildren: false,
          //     handleClick: this.handleLeafClick,
          //     achieve: false
          //   },
          {
            name: '水平一阶导数',
            hasChildren: false,
            handleClick: "derivative",
            achieve: true
          },
          {
            name: '滑动平均滤波',
            hasChildren: false,
            handleClick: "mvfilter",
            achieve: true
          },
          {
            name: '插值切割法',
            hasChildren: false,
            handleClick: "czqgExecute",
            achieve: true
          },
          // {
          //   name: '垂直一阶导数',
          //   hasChildren: false,
          //   handleClick: this.handleLeafClick,
          //   achieve: false
          // },
          // {
          //   name: '垂直二阶导数',
          //   hasChildren: false,
          //   handleClick: this.handleLeafClick,
          //   achieve: false
          // }
        ]
      },
      {
        name: '频率域',
        hasChildren: true,
        handleClick: this.sedNavClick,
        children: [{
          name: '向上延拓',
          hasChildren: false,
          handleClick: "contiUp",
          achieve: true
        },
          {
            name: '向下延拓',
            hasChildren: false,
            handleClick: "contiDown",
            achieve: true
          },
          {
            name: '化磁极',
            hasChildren: false,
            handleClick: "handlePfp",
            achieve: true
          },
          {
            name: '高通滤波',
            hasChildren: false,
            handleClick: "frefilter",
            achieve: true
          },
          {
            name: '低通滤波',
            hasChildren: false,
            handleClick: "frefilterLow",
            achieve: true
          },
          {
            name: '位场曲面延拓',
            hasChildren: false,
            handleClick: "qhp2d",
            achieve: true
          },
          // {
          //   name: '一阶导数',
          //   hasChildren: false,
          //   handleClick: this.handleLeafClick,
          //   achieve: false
          // },
          // {
          //   name: '二阶导数',
          //   hasChildren: false,
          //   handleClick: this.handleLeafClick,
          //   achieve: false
          // },
          // {
          //   name: '总水平导数',
          //   hasChildren: false,
          //   handleClick: this.handleLeafClick,
          //   achieve: false
          // },
          // {
          //   name: '解析信号',
          //   hasChildren: false,
          //   handleClick: this.handleLeafClick,
          //   achieve: false
          // }
        ]
      },
      // {
      //   name: '分量换算',
      //   hasChildren: false,
      //   handleClick: this.handleLeafClick,
      //   achieve: false
      // },
      // {
      //   name: '正则化滤波',
      //   hasChildren: false,
      //   handleClick: this.handleLeafClick,
      //   achieve: false
      // },
      // {
      //   name: '补偿圆滑滤波',
      //   hasChildren: false,
      //   handleClick: this.handleLeafClick,
      //   achieve: false
      // },
      // {
      //   name: '趋势分析',
      //   hasChildren: false,
      //   handleClick: this.handleLeafClick,
      //   achieve: false
      // }
    ]
  },
  //剖面数据处理
  {
    index: 4,
    name: '剖面',
    icon: 'el-icon-wallet',
    handleClick: this.firstNavClick,
    hasChildren: true,
    children: [{
      name: '空间域',
      hasChildren: true,
      handleClick: this.sedNavClick,
      children: [{
        name: '曲线圆滑',
        hasChildren: false,
        handleClick: "smoothCurve",
        achieve: true
      },
        // {
        //   name: '向上延拓',
        //   hasChildren: false,
        //   handleClick: this.handleLeafClick,
        //   achieve: false
        // },
        // {
        //   name: '向下延拓',
        //   hasChildren: false,
        //   handleClick: this.handleLeafClick,
        //   achieve: false
        // },
        // {
        //   name: '导数计算',
        //   hasChildren: false,
        //   handleClick: this.handleLeafClick,
        //   achieve: false
        // }
      ]
    },
      {
        name: '频率域',
        hasChildren: true,
        handleClick: this.sedNavClick,
        children: [{
          name: '导数计算',
          hasChildren: false,
          handleClick: "derivativeCalculation",
          achieve: true
        },
          // {
          //   name: '解析延拓',
          //   hasChildren: false,
          //   handleClick: "analyticContinuation",
          //   achieve: true
          // },
          {
            name: '向上延拓',
            hasChildren: false,
            handleClick: "analyticContinuationTop",
            achieve: true
          },
          {
            name: '向下延拓',
            hasChildren: false,
            handleClick: "analyticContinuationDown",
            achieve: true
          },

          // {
          //   name: '化磁极',
          //   hasChildren: false,
          //   handleClick: this.handleLeafClick,
          //   achieve: false
          // },
          // {
          //   name: '磁重转换',
          //   hasChildren: false,
          //   handleClick: this.handleLeafClick,
          //   achieve: false
          // },
          // {
          //   name: '异常分析',
          //   hasChildren: false,
          //   handleClick: this.handleLeafClick,
          //   achieve: false
          // },
          // {
          //   name: '功率谱',
          //   hasChildren: false,
          //   handleClick: this.handleLeafClick,
          //   achieve: false
          // }
        ]
      },
    ]
  },
  //平面数据处理

  //重磁反演解释
  {
    index: 6,
    name: '正反演',
    icon: 'el-icon-wallet',
    handleClick: this.firstNavClick,
    hasChildren: true,
    children: [{
      name: '剖面数据',
      hasChildren: true,
      handleClick: this.sedNavClick,
      children: [{
        name: '人机交互建模',
        hasChildren: false,
        handleClick: "HumanMachineClick",
        achieve: true
      },
        {
          name: '归一化总梯度',
          hasChildren: false,
          handleClick: "GuiYiHuAZTD",
          achieve: true
        },
        // {
        //   name: '相关成像',
        //   hasChildren: false,
        //   handleClick: this.handleLeafClick,
        //   achieve: false
        // },
        // {
        //   name: '归一化总梯度',
        //   hasChildren: false,
        //   handleClick: this.handleLeafClick,
        //   achieve: false
        // },
        // {
        //   name: '偏移成像',
        //   hasChildren: false,
        //   handleClick: this.handleLeafClick,
        //   achieve: false
        // },
        // {
        //   name: '欧拉反褶积',
        //   hasChildren: false,
        //   handleClick: this.handleLeafClick,
        //   achieve: false
        // },
        // {
        //   name: '界面反演',
        //   hasChildren: false,
        //   handleClick: this.handleLeafClick,
        //   achieve: false
        // },
        // {
        //   name: '特征点法',
        //   hasChildren: false,
        //   handleClick: this.handleLeafClick,
        //   achieve: false
        // }
      ]
    },
      {
        name: '平面数据',
        hasChildren: true,
        handleClick: this.sedNavClick,
        children: [{
          name: '常密度界面正演(Parker法)',
          hasChildren: false,
          handleClick: "handlerForwardParker",
          achieve: true
        }, {
          name: '指数变密度界面正演',
          hasChildren: false,
          handleClick: "handleForwardVar",
          achieve: true
        },
          {
            name: '密度界面反演',
            hasChildren: false,
            handleClick: "handleForwardInversion",
            achieve: true
          },
          // {
          //   name: '化磁极',
          //   hasChildren: false,
          //   handleClick: this.handleLeafClick,
          //   achieve: false
          // }

        ]
      },
    ]
  },
  //电法正反演
  // {
  //   index: 7,
  //   name: '电法正反演',
  //   handleClick: this.firstNavClick,
  //   hasChildren: true,
  //   children: [{
  //     name: '二维电阻率极化率探测正反演',
  //     hasChildren: false,
  //     handleClick: this.handleLeafClick,
  //     achieve: false
  //   },
  //     {
  //       name: '二维电阻率极化率正反演',
  //       hasChildren: false,
  //       handleClick: this.handleLeafClick,
  //       achieve: false
  //     },
  //     {
  //       name: '瞬变电磁一维正反演',
  //       hasChildren: false,
  //       handleClick: this.handleLeafClick,
  //       achieve: false
  //     },
  //     {
  //       name: '瞬变电磁2.5维正反演',
  //       hasChildren: false,
  //       handleClick: this.handleLeafClick,
  //       achieve: false
  //     }
  //   ]
  // },
  //化探数据处理
  // {
  //   index: 8,
  //   name: '化探数据处理',
  //   handleClick: this.firstNavClick,
  //   hasChildren: true,
  //   children: [{
  //     name: '子主题list-1',
  //     hasChildren: false,
  //     handleClick: this.handleLeafClick,
  //     achieve: false
  //   }
  //
  //   ]
  // },
  //专题图制作

  {
    index: 9,
    name: '专题图制作',
    icon: 'el-icon-wallet',
    handleClick: this.firstNavClick,
    hasChildren: true,
    children: [{
      name: '散点图',
      hasChildren: false,
      handleClick: "handleImportThematicPointData",
      achieve: true
    },
      {
        name: '平剖图',
        hasChildren: false,
        handleClick: "handleImportThematicFlatData",
        achieve: true
      },
      {
        name: '等值线图',
        hasChildren: false,
        handleClick: "handleImportThematicLinesData",
        achieve: true
      },
      {
        name: '对比图',
        hasChildren: false,
        handleClick: "handleImportThematicMultipleData",
        achieve: true
      }
      // {
      //   name: '综合剖面图',
      //   hasChildren: false,
      //   handleClick: this.handleLeafClick,
      //   achieve: false
      // },
      // {
      //   name: '异常剖析图',
      //   hasChildren: false,
      //   handleClick: this.handleLeafClick,
      //   achieve: false
      // },
      // {
      //   name: '彩色阴影图',
      //   hasChildren: false,
      //   handleClick: this.handleLeafClick,
      //   achieve: false
      // }
    ]
  },
  //成果发布与共享
  {
    index: 10,
    name: '成果发布与共享',
    icon: 'el-icon-wallet',
    handleClick: this.firstNavClick,
    hasChildren: true,
    children: [
      {
        name: '成果共享管理',
        hasChildren: false,
        handleClick: "showSharingProductionsManage",
        achieve: true
      },
      {
        name: 'GeoJson数据共享',
        hasChildren: false,
        handleClick: "shareResultByJosn",
        achieve: true
      }
      // ,
      // {
      //   name: '发布在线地图服务',
      //   hasChildren: false,
      //   handleClick: "shareResultByWMS",
      //   achieve: true
      // }
      // {
      //   name: '发布为WMS服务',
      //   hasChildren: false,
      //   handleClick: this.handleLeafClick,
      //   achieve: false
      // },
      // {
      //   name: '发布为WFS服务',
      //   hasChildren: false,
      //   handleClick: this.handleLeafClick,
      //   achieve: false
      // },
      // {
      //   name: '发布到三维球',
      //   hasChildren: false,
      //   handleClick: this.handleLeafClick,
      //   achieve: false
      // }
    ]
  },

  {
    index: 11,
    name: '系统设置',
    icon: 'el-icon-setting',
    handleClick: this.firstNavClick,
    hasChildren: true,
    children: [
      {
        name: '算法管理',
        hasChildren: false,
        handleClick: "showAlgManage",
        achieve: true
      },
      {
        name: '算法服务设置',
        hasChildren: false,
        handleClick: "algorithmUrlSet",
        achieve: true
      },
      {
        name: '本地算法下载',
        hasChildren: false,
        handleClick: "algorithmDownToLocal",
        achieve: true
      }
      /* ,
       {
         name: '算法使用统计',
         hasChildren: false,
         handleClick: "algorithmUseStatistics",
         achieve: true
       },
       {
         name: '算法使用地址检测统计',
         hasChildren: false,
         handleClick: "addressDetection",
         achieve: true
       }*/
    ]
  },
  {
    index: 12,
    name: '在线帮助',
    icon: 'el-icon-setting',
    handleClick: this.firstNavClick,
    hasChildren: true,
    children: [
      {
        name: '用户手册',
        hasChildren: false,
        handleClick: "userHelp",
        achieve: true
      },
      {
        name: '问题反馈',
        hasChildren: false,
        handleClick: "suggestFeedback",
        achieve: true
      }
    ]
  }
];
var menudata = {
  navListData: navListData
}
export default menudata
