// Dom7
var $$ = Dom7;
var BILL = [];

var STORE = new DevExpress.data.ArrayStore({
  key: "Consignment_No",
  data: BILL
});

function processDataBILL(data) {
  if (Array.isArray(data) && data.length) {
    for (var i = 0; i < data.length; i++) {
      var tmp = data[i];
      var fou = false;
      for (var j = 0; j < BILL.length; j++) {
        if (BILL[j].Consignment_No == tmp.Consignment_No) {
          fou = true;
          break;
        }
      }
      if (fou) {
        STORE.push([{
          type: "update",
          key: fou.Consignment_No,
          data: tmp
        }]);
      } else {
        STORE.push([{ type: "insert", data: tmp }]);
      }
    }
  }

}

function onBackKeyDown() {
  debugger;
  var cpage = mainView.activePage;
  var cpagename = cpage.name;
  console.log(cpagename);
  if (($$('#leftpanel').hasClass('active')) || ($$('#rightpanel').hasClass('active'))) { // #leftpanel and #rightpanel are id of both panels.
    app.closePanel();
    return false;
  } else if ($$('.modal-in').length > 0) {
    app.closeModal();
    return false;
  } else if (cpagename == 'index') {
    app.confirm('Thoát chương trình?', function () {
      // var deviceType = device.platform;
      // if(deviceType == “Android” || deviceType == “android”){
      navigator.app.exitApp();
      // }
    },
      function () {
      });
  } else if (cpagename == 'odf') {
    app.confirm('Dữ liệu chưa được lưu. Vẫn thoát?', function () {
      // var deviceType = device.platform;
      // if(deviceType == “Android” || deviceType == “android”){
        mainView.router.back();
      // }
    },
      function () {
      });
  }{
    mainView.router.back();
  }
}

// Framework7 App main instance
var app = new Framework7({
  root: '#app', // App root element
  id: 'com.kerryexpress.kesmobile', // App bundle ID
  name: 'KesMobile', // App name
  theme: 'auto', // Automatic theme detection
  version: 130,
  // App root data
  data: {
    user: {
      user_name: null,
      password: '****',
      dc: ''
    },
    lastChoice: {},
    serverUrl: "http://210.211.121.146:30000",
    pushBill: true,
    geoLocation: {},
    signal: true,
    store: STORE,
    version: "1.0.5"
  },
  store: STORE,

  gridComponent: null,
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
    goHome: function () {
      app.router.navigate('/', {
        reloadCurrent: true,
        ignoreCache: true,
      });
      //app.methods.refreshGrid();
    },
    onBackKeyDown: function () {

      var leftp = app.panel.left && app.panel.left.opened;
      var rightp = app.panel.right && app.panel.right.opened;

      if (leftp || rightp) {

        app.panel.close();
        return false;
      } else if ($$('.modal-in').length > 0) {

        app.dialog.close();
        app.popup.close();
        return false;
      } else if (app.views.main.router.url == '/') {
        app.dialog.confirm("Thoát ứng dụng", "Kerrier Mobile", function () {
          navigator.app.exitApp();
        }, function () {
          return false;
        });
      } else {
        mainView.router.back();
      }

    },
    // updateStore: function () {      //debugger;

    //   $.ajax({
    //     url: app.data.serverUrl + "/api/CacheMPOD/" + app.data.user.user_name + "?u=" + app.data.user.user_name + "&p=" + app.data.user.password,
    //     method: "GET",
    //   }).done(function (data) {
    //     BILL = data;
    //   });

    //   // DevExpress.data.AspNet.createStore({
    //   //   key: "Consignment_No",
    //   //   loadUrl: app.data.serverUrl + "/api/MPOD/" + app.data.user.user_name + "?u=" + app.data.user.user_name + "&p=" + app.data.user.password,
    //   //   //insertUrl: url + "/InsertOrder",
    //   //   //updateUrl: url + "/UpdateOrder",
    //   //   //deleteUrl: url + "/DeleteOrder",
    //   //   requireTotalCount: true,
    //   //   onBeforeSend: function (method, ajaxOptions) {
    //   //     ajaxOptions.xhrFields = { withCredentials: true };
    //   //   },
    //   // });
    // },
    searchBarcode: function (a, exact) {
      if (!exact) {
        exact = true;
      }
      if (app.gridComponent) {
        if (exact) {
          app.gridComponent.selectRows(a);

          if (app.gridComponent.getSelectedRowKeys().filter(function (x) { return x == a; }).length > 0) {
            mainView.router.navigate("/bill/" + a + "/");
          } else {
            app.toast.create({
              text: "Không tìm thấy " + a,
              closeTimeout: 2000,
            }).open();
          }
        } else {
          //app.store.load().done(function (as){
          var t = BILL.filter(function (x) { return x.Consignment_No.endsWith(a); });
          if (t.length == 1) {
            mainView.router.navigate("/bill/" + t[0].Consignment_No + "/");
          } else if (t.length > 1) {
            app.toast.create({
              text: "Tìm thấy nhiều bill (" + t.length + ") kết thúc bởi " + a,
              closeTimeout: 2000,
            }).open();
          } else {
            app.toast.create({
              text: "Không tìm thấy " + a,
              closeTimeout: 2000,
            }).open();
          }
          //});
        }

      }
    },
    refreshGrids: function () {
      //debugger;
      setTimeout(function () {
        app.gridComponent = $("#grid-data").dxDataGrid({
          dataSource: {
            store: STORE,
            reshapeOnPush: true
          },
          repaintChangesOnly: true,
          // filterRow: {
          //   visible: true
          // },
          scrolling: {
            mode: "virtual"
          },
          selection: {
            mode: "single"
          },
          // searchPanel: {
          //   visible: true,
          //   width: '100%',
          //   placeholder: "Tìm..."
          // },
          //hoverStateEnabled: true,
          showColumnHeaders: false,
          showBorders: false,
          showColumnLines: false,
          showRowLines: true,
          filterValue: [["PRO", "=", 4], 'or', ['PRO', '=', 3]],
          onContentReady: function (e) {

            $$('.search-barcode').off('click').on('click', function () {
              app.dialog.prompt("Nhập số vận đơn", "Tìm kiếm", function (a) {
                app.methods.searchBarcode(a, false);
              })
            });
            // Scan click

            $$('.scan-barcode').off('click').on('click', function () {
              cordova.plugins.barcodeScanner.scan(
                function (result) {
                  var a = result.text;
                  app.methods.searchBarcode(a);
                },
                function (error) {
                  //
                  //alert("Lỗi: " + error);
                },
                {
                  preferFrontCamera: false, // iOS and Android
                  showFlipCameraButton: true, // iOS and Android
                  showTorchButton: true, // iOS and Android
                  torchOn: false, // Android, launch with the torch switched on (if available)
                  saveHistory: true, // Android, save scan history (default false)
                  prompt: "Đưa mã vạch hiện vào khu vực quét", // Android
                  resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                  formats: "QR_CODE,CODE_128", // default: all but PDF_417 and RSS_EXPANDED
                  orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                  disableAnimations: true, // iOS
                  disableSuccessBeep: false // iOS and Android
                }
              );

            });

            //if (app.cacheStore) {
            //app.store.load().done(function (a) {
            var cPOD = 0;
            var cRET = 0;
            var cDEL = 0;
            var cNOT = 0;
            var total = 0;
            var a = BILL;
            if (a) {
              for (var i = 0; i < a.length; i++) {
                if (a[i].PRO == 1) cPOD++;
                if (a[i].PRO == 2) cRET++;
                if (a[i].PRO == 3) cDEL++;
                if (a[i].PRO == 4) cNOT++;
              }
              // cPOD = a.filter(x => x.PRO == 1).length;
              // cRET = a.filter(x => x.PRO == 2).length;
              // cDEL = a.filter(x => x.PRO == 3).length;
              // cNOT = a.filter(x => x.PRO == 4).length;
              total += cNOT + cDEL;
            }
            $('#totalCountPOD').text(cPOD);
            $('#totalCountRET').text(cRET);
            $('#totalCountDEL').text(cDEL);
            $('#totalCountNOT').text(cNOT);
            $('.COUNT_DEL').text(total);
            $('#COUNT_PODR_I').text(cPOD);
            $('#COUNT_PODR_T').text(cPOD);

            // if (cNOT == 0) {
            //   setTimeout(function () { $('#grid-data').dxDataGrid("instance").refresh(); }, 30000);
            // }

            //});
            //}
          },
          columns: [
            {
              dataField: "Id",
              allowSearch: false,
              visible: false,
              editOptions: {
                visible: false
              }
            },
            {
              dataField: "PRO",
              allowSearch: false,
              visible: false,
              editOptions: {
                visible: false
              },
              sortOrder: "desc"
            },
            {
              dataField: "Consignment_No",
              allowSorting: false,
              caption: "Số VĐ",
              // headerCellTemplate: function (head, info) {
              //   var tmp = `<div class="item-content">
              //     <div class="item-inner">    
              //       <div class="item-title"><strong>Số vận đơn</strong></div>         
              //       <div class="item-after after-fix">
              //         <span id="totalCountNOT" class="badge badge-fix">0</span>
              //         <span id="totalCountDEL" class="badge color-red badge-fix">0</span>
              //         <span id="totalCountPOD" class="badge color-green badge-fix">0</span>
              //         <span id="totalCountRET" class="badge color-orange badge-fix">0</span>
              //         <a id="search" href="#" >
              //           <span class="badge color-blue badge-fix"><i class="f7-icons" style="font-size:12px">search</i></span>
              //         </a>
              //       </div>                  
              //     </div>
              //   </div>`;
              //   head.append(tmp);
              //   setTimeout(function () {
              //     if (app.store) {
              //       app.store.load().done(function (a) {
              //         var cPOD = 0;
              //         var cRET = 0;
              //         var cDEL = 0;
              //         var cNOT = 0;
              //         if (a) {
              //           cPOD = a.filter(x => x.PRO == 1).length;
              //           cRET = a.filter(x => x.PRO == 2).length;
              //           cDEL = a.filter(x => x.PRO == 3).length;
              //           cNOT = a.filter(x => x.PRO == 4).length;
              //         }
              //         $('#totalCountPOD').text(cPOD);
              //         $('#totalCountRET').text(cRET);
              //         $('#totalCountDEL').text(cDEL);
              //         $('#totalCountNOT').text(cNOT);

              //         if (cNOT == 0) {
              //           setTimeout(function () { $('#grid-data').dxDataGrid("instance").refresh(); }, 30000);
              //         }

              //       });
              //     }
              //     $$('#search').on('click', function () {
              //       app.dialog.prompt('Tìm? Bấm Ok để tải dữ liệu', function (name) {
              //         if (name == "") {
              //           app.gridComponent.refresh();
              //         } else {
              //           app.gridComponent.searchByText(name);
              //         }

              //       })
              //     });

              //   }, 500);

              // },
              cellTemplate: function (container, options) {
                var co = "color-gray color-green color-orange color-red color-gray".split(' ');

                $("<div class=''>").append(
                  $("<div class=''>").append(
                    $("<div class='row'>").append(
                      $("<div class='col-10'><a class='" + co[options.data.PRO] + "'><i class='f7-icons style='font-size:16px'>circle_fill</i></a>"),
                      $("<div class='col-80'><span style='color:blue;font-weight:600; font-size:18px;text-decoration: underline;'>" + options.data.Consignment_No + "</span>"),
                      $("<div class='col-10'>").text("ND")
                    ),
                    $("<div class='row'>").append(
                      $("<div class='col-10'><a class='icon link'><img src='img/ic_call.png' style='height:24px'/></a>"),
                      $("<div class='col-90'>").text(options.data.Recipient_Name || "N/A")
                    ),
                    $("<div class='row' style='min-height:24px'>").append(
                      $("<div class='col' >").text(options.data.Recipient_Address || " ")),
                    $("<div class='row' style='min-height:24px'>").append(
                      $("<div class='col'>").append(
                        $("<span>").text(options.data.Recipient_Phone_No || " ")),
                      $("<div class='col'>").append(
                        $("<span>").text(options.data.Recipient_Contact_Person || " "))
                    ),
                    $("<div class='row' style='min-height:24px'>").append(
                      $("<div class='col'>").text(options.data.Remark + " ")
                    )
                  )
                ).appendTo(container);
                //$(container).css("padding", "0px");
              }
            },
            {
              dataField: "Created_Date",
              visible: false,
              editOptions: {
                visible: false
              },
              sortOrder: "desc"
            },
            {
              dataField: "Recipient_Name",
              visible: false,
              editOptions: {
                visible: false
              },
            },
            {
              dataField: "Recipient_Contact_Person",
              visible: false,
              editOptions: {
                visible: false
              },
            },
            {
              dataField: "Recipient_Phone_No",
              visible: false,
              editOptions: {
                visible: false
              },
            },
            {
              dataField: "Recipient_Address",
              visible: false,
              editOptions: {
                visible: false
              },
            },
            {
              dataField: "Remark",
              visible: false,
              editOptions: {
                visible: false
              },
            },
            {
              dataField: "Special_Delivery_Remark",
              visible: false,
              editOptions: {
                visible: false
              },
            }
          ],
          //remoteOperations: true,
          onRowClick:function(e){
            app.data.lastChoice = e.data;
            if (e.data.PRO > 2) {              
              mainView.router.navigate('/bill/' + e.data.Consignment_No + '/');
            }
          },
          onSelectionChanged: function (e) {
            app.data.lastChoice = {};
            var data = e.selectedRowsData;
            if (data.length > 0) {
              if (data[0].PRO > 2) {
                app.data.lastChoice = data[0];
                mainView.router.navigate('/bill/' + data[0].Consignment_No + '/');
              }
            }
          }
        }).dxDataGrid("instance");
      }, 500);

    },
    setPRO: function (bill, type) {
      var fou = false;
      for (var i = 0; i < BILL.length; i++) {
        if (BILL[i].Consignment_No == bill) {
          fou = true;
          break;
        }
      }
      if (fou) {
        STORE.push([{
          type: "update",
          key: bill,
          data: {
            PRO: type
          }
        }]);
      }
    },
    refreshBILL: function () {
      $.ajax({
        url: app.data.serverUrl + "/api/CacheMPOD/" + app.data.user.user_name + "?u=" + app.data.user.user_name + "&p=" + app.data.user.password,
        method: "GET",
        success: function (data) {
          processDataBILL(data);
        },
        error: function (err) {
          var msg = JSON.stringify(err);
          var ty = msg.includes("deadlock");

          //app.preloader.hide();
          app.toast.create({
            text: "Lỗi: " + (ty ? "Server đang bận. Thử lại sau ít phút" : msg),
            closeTimeout: 2000,
          }).open();
          //console.timeEnd("Pushs:" + r.Consignment_No);
          // if (cb) {
          //   cb(false);
          // }
        }
      }).done(function (data) {
        processDataBILL(data);
      });
      //var data = $.getJSON(app.data.serverUrl + "/api/CacheMPOD/" + app.data.user.user_name + "?u=" + app.data.user.user_name + "&p=" + app.data.user.password);
    }
  },
  // App routes
  routes: routes,
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

//ready
var setUserInfoSuccess = function (obj) {
  //console.log(obj.name);
  NativeStorage.getItem("userInfo", getUserInfoSuccess, getUserInfoError);
};
var setUserInfoError = function (error) {
  console.log(error.code);
  if (error.exception !== "") console.log(error.exception);
};
var getUserInfoSuccess = function (obj) {
  //console.log(obj.name);
  //NativeStorage.remove("userInfo", removeSuccess, removeError);
  if (obj && obj.user && obj.user.length > 4 && obj.key && obj.key != "****") {
    app.data.user.user_name = obj.user;
    app.data.user.password = obj.key;
    app.data.user.dc = obj.dc;
    $$("#user-name").text(obj.user);
    $$(".user-name").text(obj.user);
    $$("#user-fullname").text(obj.fullname);
    $$("#last-login").text(obj.last);
    if (obj.sex) {
      $$("#user-image").attr("src", "img/sex/" + obj.sex + ".png");
    } else {
      $$("#user-image").attr("src", "img/sex/null.png");
    }
    //app.methods.refreshBILL();
  } else {
    app.loginScreen.open("#my-login-screen");
  }
};
var getUserInfoError = function (error) {
  console.log(error);
  if (error.exception !== "") console.log(error.exception);
  if (error.code == 2) {
    app.loginScreen.open("#my-login-screen")
  }
};
var removeUserInfoSuccess = function () {
  console.log("Removed");
};
var removeUserInfoError = function (error) {
  console.log(error.code);
  if (error.exception !== "") console.log(error.exception);
};



///GEO///
var onGeoSuccess = function (position) {
  app.data.geoLocation = position;
  NativeStorage.setItem("location", position, function (data) { }, function (error) { });
};

// onError Callback receives a PositionError object
//
function onGeoError(error) {

}
///END GEO

function checkConnection() {

  var networkState = navigator.connection.type;
  console.log("Check network", networkState, new Date().toJSON());
  var states = {};
  states[Connection.UNKNOWN] = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI] = 'WiFi connection';
  states[Connection.CELL_2G] = 'Cell 2G connection';
  states[Connection.CELL_3G] = 'Cell 3G connection';
  states[Connection.CELL_4G] = 'Cell 4G connection';
  states[Connection.CELL] = 'Cell generic connection';
  states[Connection.NONE] = 'No network connection';

  //alert('Connection type: ' + states[networkState]);
  if (networkState == Connection.NONE) {
    app.data.signal = false;
    app.toast.create({
      text: "Không có tín hiệu mạng",
      closeTimeout: 2000,
    }).open();
    setTimeout(checkConnection, 10000);
  } else {
    if (app.data.signal) {

    } else {
      app.data.signal = true;
      app.gridComponent.refresh();
    }
    setTimeout(checkConnection, 30000);
  }
}

var onNotificationReceived = function (pushNotification) {
  var message = pushNotification.message;
  var title = pushNotification.title;

  if (message === null || message === undefined) {
    // Android messages received in the background don't include a message. On Android, that fact can be used to
    // check if the message was received in the background or foreground. For iOS the message is always present.
    title = 'Thông báo';
    message = 'Không có gì...';
  }

  // Custom name/value pairs set in the App Center web portal are in customProperties
  if (pushNotification.customProperties && Object.keys(pushNotification.customProperties).length > 0) {
    message += '\nCustom properties:\n' + JSON.stringify(pushNotification.customProperties);
  }

  app.toast.create({
    text: "<strong>" + title + "</strong><br>" + message,
    position: 'top',
    closeButton: true,
    closeButtonText: '<i class="f7-icons">close_round_fill</i>',
  }).open();

  //console.log(title, message);
}

//////////////////////////////////////////
//////////////////////////////////////////
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  document.addEventListener("backbutton", app.methods.onBackKeyDown, false);
  app.methods.refreshGrids();
  $$(".switch-page").off('click').on('click', function () {
    //debugger;
    app.methods.refreshBILL();
  });
  // sync
  $$('.sync').on('click', function () {
    app.toast.create({
      text: "Đã đồng bộ với server",
      position: 'top',
      closeTimeout: 2000,
    }).open();
  });

  // sync
  $$('.language').on('click', function () {
    app.actions.create({
      buttons: [
        {
          text: 'Chọn ngôn ngữ',
          label: true
        },
        {
          text: 'Tiếng việt',
          bold: true
        },
        {
          text: 'English',
        },
        {
          text: 'Hủy',
          color: 'red'
        },
      ]
    }).open();
  });
  AppCenter.Push.addEventListener('notificationReceived', onNotificationReceived);
  var platform = device.platform;
  if (device.platform.toLocaleUpperCase() == "ANDROID") {
    codePush.sync(null,
      {
        updateDialog: false,
        installMode: InstallMode.IMMEDIATE,
        deploymentKey: "DfMgrGWErW59AgYLW-xJCImHYiGGryZjCFy5WV"

      });
  }
  if (device.platform.toLocaleUpperCase() == "IOS") {
    codePush.sync(null,
      {
        updateDialog: false,
        installMode: InstallMode.IMMEDIATE,
        deploymentKey: "883VVBZ52zV0mdqiGriMayQp7LiaHJGJ7wyxE"

      });
  }
  if (platform == "iOS" || platform == "Android") {
    //codePush.sync(null, { updateDialog: true, installMode: InstallMode.IMMEDIATE });
    checkConnection();
    //check update
    var t = new Date().getTime();
    app.request.get(app.data.serverUrl + "/api/Version", function (data) {
      //debugger;
      var dat = JSON.parse(JSON.parse(data));
      if (dat.version > app.version) {
        app.toast.create({
          text: "<strong>Có bản cập nhập mới... </strong><a class='link external' href='" + dat.url + "'><i class='f7-icons'>cloud_download_fill</i> Tải về</a>.<br>Phiên bản: " + dat.version + ". Ngày: " + dat.date_upload,
          position: 'top',
          closeButton: true,
          closeButtonText: '<i class="f7-icons">close_round_fill</i>',
        }).open();
      }
    });

    //end check update
  }


  AppCenter.Analytics.setEnabled(true);

  NativeStorage.getItem("config", function (result) {
    app.data.serverUrl = result.server || app.data.serverUrl;
    app.data.pushBill = result.push;
  }, function (error) {
    NativeStorage.setItem("config", {
      server: app.data.serverUrl,
      push: app.data.pushBill
    }, function (data) {

    }, function (error) {

    });
  });

  NativeStorage.getItem("userInfo", getUserInfoSuccess, getUserInfoError);

  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
  ////
  setInterval(function () {
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
  }, 60000);

  //app.methods.updateStore();
  //app.methods.refreshBILL();


  //app.methods.refreshGrid();
  if (cordova.getAppVersion) {
    cordova.getAppVersion.getVersionNumber(function (version) {
      $$('.version').text(version);
    });
  }

  setTimeout(function () {
    app.methods.refreshBILL();
    setTimeout(function () {
      app.methods.refreshBILL();
    }, 30000);
  }, 1000);

  if (cordova.getAppVersion) {
    cordova.getAppVersion.getVersionNumber(function (version) {
      app.data.version = version;
      $$('.version').text(version);
    });
  }

});



// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  $.get(app.data.serverUrl + "/api/MPOD?u=" + username + "&p=" + password, function (data, status) {
    if (data && data.user_name && data.user_name.length > 0) {
      // Alert username and password
      //app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
      var obj = {
        user: data.user_name,
        fullname: "Nhân viên Kerry",
        key: password,
        last: new Date(),
        sex: null,
        location: "Not set",
        dc: data.dc,
      };
      //debugger;
      NativeStorage.setItem("userInfo", obj, setUserInfoSuccess, setUserInfoError);
      location.reload();
    } else {
      app.toast.create({
        text: "Thông tin đăng nhập không đúng",
        closeTimeout: 2000,
      }).open();
    }
  });
});
// Logout
$$('#dang-xuat').on('click', function () {
  NativeStorage.setItem("userInfo", {}, setUserInfoSuccess, setUserInfoError);
  app.loginScreen.open("#my-login-screen");
  location.reload();
});

$$('.user_panel').on('click', function () {
  app.router.navigate('/user/');
  app.panel.close("left");
});

// // route
// $$('.route-map').on('click', function () {
//   mainView.router.navigate("/route/");
// });
