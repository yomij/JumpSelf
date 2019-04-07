const colorx = require("color-thief-node");
const superagent = require('superagent')

module.exports = async function (imgUrl) {
  // const img = 'http://img.yomij.cn/1124176533d0e0e9e4o.jpg'
  console.log(imgUrl)
  const bufferImg = await superagent.get(imgUrl)
  const items = await colorx.getPaletteFromURL(bufferImg.body)
  // thmclrx.octree('http://pic1.win4000.com/mobile/2018-12-10/5c0e13e2e923a.jpg', (res) => console.log(res));
  let color = [0, 0, 0]
  items.forEach((item, index) => {
    const a = [.7 , .1, .1, .05, .05]
    color[0] += ~~(item[0] * a[index])
    color[1] += ~~(item[1] * a[index])
    color[2] += ~~(item[2] * a[index])
  })
  console.log(items, color)
  return {
    // colors
    url: imgUrl,
    colors: [
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, .5)`,
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, .8)`,
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`
    ],
    allColor: items,
    isDark: !(color[0]*0.299 + color[1]*0.578 + color[2]*0.114 >= 192)
  }
}