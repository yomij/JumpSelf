const superagent = require('superagent')
require('superagent-charset')(superagent)
require('superagent-proxy')(superagent)

const async = require('async');
const file = require('../utils/file')
const reserve = require('../novel/reserve')


const expiryTime = 30 * 60 * 1000;// 过期间隔时间，毫秒

const getProxyList = () => {

  return new Promise((resolve, reject) => {
    const nowDate = Date.now();
    const proxyData = file.readJson('proxy')
    if (proxyData && proxyData.time && nowDate - proxyData.time <  expiryTime ) {
      return resolve(proxyData.data);
    }
    const apiURL = 'http://www.66ip.cn/mo.php?sxb=&tqsl=100&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=http%3A%2F%2Fwww.66ip.cn%2F%3Fsxb%3D%26tqsl%3D100%26ports%255B%255D2%3D%26ktip%3D%26sxa%3D%26radio%3Dradio%26submit%3D%25CC%25E1%2B%2B%25C8%25A1';
    superagent
      .get(apiURL)
      .set('header', {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
        'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
        'referer': 'http://www.66ip.cn/'
      }).end((err, res) => {
      if(err) {
        reject(err)
      } else {

        const ret = res.text.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,4}/g);
        return resolve(ret)
        console.log(ret.length)
        async.mapLimit(ret, 10, function (ip, callback) {
          reserve.testProxy('/d/172/172980/', ip).then(res => {
            console.log('success', res)
            callback(null, ip)
          }).catch(e => {
            console.log('failed', e.message)
            callback(null, false)
          })
        }, function (err, result) {
          file.writeJson({
            time: Date.now(),
            data: result.filter(item => item)
          }, 'proxy')
          resolve(result.filter(item => item));
        })

      }
    })
  })
}

module.exports = {
  getProxyList
}