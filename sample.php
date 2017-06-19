<?php
require_once "jssdk.php";
$jssdk = new JSSDK("wxd1dc60a5653dc3b4", "d730fad976f9f4609f78e8b5da8dcc8a");
$signPackage = $jssdk->GetSignPackage();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">
  <link rel="stylesheet" href="./weui.css">
  <title></title>
</head>
<body>
  <button id="btn" class="weui_btn weui_btn_primary">调用接口</button>
  <button id="btn2" class="weui_btn weui_btn_primary">获取定位</button>
  <button id="btn3" class="weui_btn weui_btn_primary">获取网络状态信息</button>
  <button id="btn4" class="weui_btn weui_btn_primary">打开照片</button>
</body>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script>
  /*
   * 注意：
   * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
   * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
   * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
   *
   * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
   * 邮箱地址：weixin-open@qq.com
   * 邮件主题：【微信JS-SDK反馈】具体问题
   * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
   */
  wx.config({
    debug: true,
    appId: '<?php echo $signPackage["appId"];?>',
    timestamp: <?php echo $signPackage["timestamp"];?>,
    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
    signature: '<?php echo $signPackage["signature"];?>',
    jsApiList: [
     "openLocation",
     "getLocation",
     "getNetworkType",
     "chooseImage"
      // 所有要调用的 API 都要加到这个列表中
    ]
  });

  wx.ready(function () {
    document.getElementById("btn").onclick = function(){
       wx.openLocation({
            latitude: 30.54202, // 纬度，浮点数，范围为90 ~ -90
            longitude: 104.0731, // 经度，浮点数，范围为180 ~ -180。
            name: 'handsight', // 位置名
            address: 'handsight', // 地址详情说明
            scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: 'http://www.handsight.cn' // 在查看位置界面底部显示的超链接,可点击跳转
        });
     }
     document.getElementById("btn2").onclick = function(){
      wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
            }
        });
     }

     document.getElementById("btn3").onclick = function(){
     wx.getNetworkType({
        success: function (res) {
            var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
            }
        });
     }

      document.getElementById("btn4").onclick = function(){
      wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
           var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          }
      });
     }





  });
</script>
</html>
