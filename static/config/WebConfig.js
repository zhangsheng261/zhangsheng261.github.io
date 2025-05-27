let WebConfig = window.WebConfig = {
  //主地址 //用于集成zuul网关部署时注册、登录、登出使用 //如未集成zuul需与servicesUrl一致
  'ServicesIpPort':'http://121.36.245.56:16000/',//http://10.8.7.115:16000  http://localhost:15002
  //服务地址
  'ServicesUrl':"http://121.36.245.56:16000/GeoPhyServer",  //WebConfig.ServicesIpPort+"/GeoPhyServer" //172.30.17.101:8080/visualservice http://172.30.17.101:8080/visualservice  http://localhost:15002 http://localhost:15004 http://10.8.7.115:16000/GeoPhyServer
  //用户手册url
  'webUrl':'http://172.30.17.101:8080/GeoPhysical/static/userHelp/userHelp.pdf',
  //本地算法程序下載地址
  'PCServer':'http://172.30.17.101:8080/GeoPhysical/static/userHelp/PC_server.zip',
  //SSO验证服务器地址
  'ssoServer':'http://10.8.7.54',
  //前台页面地址（回跳地址）
  'appHost':'http://127.0.0.1:18080'
};
