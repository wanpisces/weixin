https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcc0b5f7c88c6dd1a&redirect_uri=http%3A%2F%2Fnba.bluewebgame.com%2Foauth_response.php&response_type=code&scope=snsapi_userinfo&state=STATE&uin=MjEwODkyNzk4Mw%3D%3D&key=44e820abd4d79852a13d557e1fd20c149e3ba65beddac2cc27d7b18fb684ab70d25e34d017ef92585e59c4073d71622d&pass_ticket=gpki8q9wppFWdWQtW+RpB6xuhZCCF1v3k4wdRV4nRPIjM073n734cio+DQfKfBH3bqgX6+LYgttYmBzeZ4Mo4w==&uin=MjEwODkyNzk4Mw%3D%3D&key=44e820abd4d79852423bfa4ed8153100c1988395723dd67b92e13578326c2922e11d5e14e0117dfe69a3f14364d1754d&pass_ticket=gpki8q9wppFWdWQtW+RpB6xuhZCCF1v3k4wdRV4nRPIjM073n734cio+DQfKfBH3bqgX6+LYgttYmBzeZ4Mo4w==&uin=MjEwODkyNzk4Mw%3D%3D&key=44e820abd4d79852a94dffd13ce5e73ad2e90cc82530b694fac7b68a844f486b598fb9159634e54d071fa526d3b79cf5&pass_ticket=gpki8q9wppFWdWQtW+RpB6xuhZCCF1v3k4wdRV4nRPIjM073n734cio+DQfKfBH3bqgX6+LYgttYmBzeZ4Mo4w==&uin=MjEwODkyNzk4Mw%3D%3D&key=44e820abd4d798528177903bf70e4184dcdc2e0fc95ad3149abdb2abd9c2472cefae020d4b641b0487e0aa74b36a7e51&pass_ticket=gpki8q9wppFWdWQtW+RpB6xuhZCCF1v3k4wdRV4nRPIjM073n734cio+DQfKfBH3bqgX6+LYgttYmBzeZ4Mo4w==&uin=MjEwODkyNzk4Mw%3D%3D&key=44e820abd4d798528177903bf70e4184dcdc2e0fc95ad3149abdb2abd9c2472cefae020d4b641b0487e0aa74b36a7e51&pass_ticket=gpki8q9wppFWdWQtW+RpB6xuhZCCF1v3k4wdRV4nRPIjM073n734cio+DQfKfBH3bqgX6+LYgttYmBzeZ4Mo4w==&uin=MjEwODkyNzk4Mw%3D%3D&key=44e820abd4d79852f2a7340f82a5e574dd38da2c424b30229531394a7fe33c9b0268d7a2d6d7e53f195b5fdbcebcda8a&pass_ticket=gpki8q9wppFWdWQtW+RpB6xuhZCCF1v3k4wdRV4nRPIjM073n734cio+DQfKfBH3bqgX6+LYgttYmBzeZ4Mo4w==&uin=MjEwODkyNzk4Mw%3D%3D&key=44e820abd4d798528d9143201091ed64b0a8c394928e150721241f7f132c7246b20c055b28d06e929f959e1899c61793&pass_ticket=gpki8q9wppFWdWQtW+RpB6xuhZCCF1v3k4wdRV4nRPIjM073n734cio+DQfKfBH3bqgX6+LYgttYmBzeZ4Mo4w==&uin=MjEwODkyNzk4Mw%3D%3D&key=44e820abd4d798528d9143201091ed64b0a8c394928e150721241f7f132c7246b20c055b28d06e929f959e1899c61793&pass_ticket=gpki8q9wppFWdWQtW+RpB6xuhZCCF1v3k4wdRV4nRPIjM073n734cio+DQfKfBH3bqgX6+LYgttYmBzeZ4Mo4w==
var json = {
  "success":"true",
  "mark":true,
  "activeId":"XXXX",
  "startTime":"2016-11-9 15:01:15",
  "endTime":"2016-11-9 15:01:15",
  "prize":"已中奖人信息",
  "rewardList":[
  {
    "rewardId":"1233",
    "rewardUrl":"",
    "rewardNum":12,
    "rewardName":"一等奖",
    "type":"1",
  },
  .....
  ],
}


var plan = require('flightplan');

// configuration
plan.target('production', [
  {
    host: '106.186.28.83',
    username: 'scan0932',
    agent: process.env.SSH_AUTH_SOCK
  },
]);

// run commands on localhost
plan.local(function(local) {
  // uncomment these if you need to run a build on your machine first
  // local.log('Run build');
  // local.exec('gulp build');

  local.log('Copy files to remote hosts');
  var filesToCopy = local.exec('git ls-files', {silent: true});
  // rsync files to all the destination's hosts
  local.transfer(filesToCopy, '~/www/');
});