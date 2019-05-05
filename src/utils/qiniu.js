const qiniu = require('qiniu');
// const sConfig = require('../../config');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'FRCRP7V2kY12Pt3EOoxhO3T4sgKkwvOoG12pBqaT';
qiniu.conf.SECRET_KEY = 'y55ZOLjQ9yeSJjpOvHR45gT4KShU0HBzKfgzcs4Z';

var mac = new qiniu.auth.digest.Mac(qiniu.conf.ACCESS_KEY, qiniu.conf.SECRET_KEY)

// 上传到七牛
function upToQiniu(filePath, key) {
  const accessKey = 'FRCRP7V2kY12Pt3EOoxhO3T4sgKkwvOoG12pBqaT'; // 你的七牛的accessKey
  const secretKey = 'y55ZOLjQ9yeSJjpOvHR45gT4KShU0HBzKfgzcs4Z'; // 你的七牛的secretKey
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

  const options = {
    scope: 'yomi-pic-test', // 你的七牛存储对象
    // returnBody: `{"key":${sConfig.IMG_SERVER}"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}`
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)

  const config = new qiniu.conf.Config()
  // 空间对应的机房
  config.zone = qiniu.zone.Zone_z2
  const localFile = filePath
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  // 文件上传
  return new Promise((resolved, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr, respBody, respInfo) {
      console.log(respErr, respBody, respInfo)
      if (respErr) {
        reject(respErr)
      }
      if (respInfo.statusCode == 200) {
        resolved(respBody)
      } else {
        resolved(respBody)
      }
    })
  })

}


// 上传到七牛
function upToQiniuStream(stream, key) {
  const accessKey = 'FRCRP7V2kY12Pt3EOoxhO3T4sgKkwvOoG12pBqaT'; // 你的七牛的accessKey
  const secretKey = 'y55ZOLjQ9yeSJjpOvHR45gT4KShU0HBzKfgzcs4Z'; // 你的七牛的secretKey
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

  const options = {
    scope: 'yomi-pic-test' // 你的七牛存储对象
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  const config = new qiniu.conf.Config()
  // 空间对应的机房
  config.zone = qiniu.zone.Zone_z2
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  // 文件上传
  return new Promise((resolve, reject) => {
    // console.log(respErr, respBody, respInfo)
    formUploader.putStream(uploadToken, key, stream, putExtra, function(respErr,
                                                                        respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        resolve(respBody);
      } else {
        reject(respInfo.statusCode);
        reject(respBody);
      }
    });
  })

}

// upToQiniu(__dirname + '/console.js', 's/纯纯粹粹.jpeg').then(res => {
//   console.log('aaaaaaaa', res)
// })

module.exports = {
  upToQiniu,
  upToQiniuStream
}