const file = require('./file')
/**
 * 皮尔逊相似度计算
 * @param prefs 数据集 [{
 *   bookId: {
 *     userId: Grade
 *   }
 * } * n]
 * @param book 相似度计算书籍1
 * @param b 相似度计算书籍2
 * @returns {number} 相似度
 */
function sim_pearson (prefs, book, b) {
  let common = []
  const d1 = prefs[book]
  const d2 = prefs[b]
  Object.keys(d1).forEach(u1 => {
    for(let u2 of Object.keys(d2)){
      if(u1 === u2){
        common.push(u1)
        break;
      }
    }
  })
  const n = common.length
  if (n === 0) return 1

  // 和
  let sum1 = common.reduce((total, key) => d1[key] + total, 0)
  let sum2 = common.reduce((total, key) => d2[key] + total, 0)
  // 平方和
  let sum1_sq = common.reduce((total, key) => d1[key] ** 2 + total, 0)
  let sum2_sq = common.reduce((total, key) => d2[key] ** 2 + total, 0)
  // 求乘积之和
  let p_sum = common.reduce((total, key) => d2[key] * d1[key] + total, 0)
  const den = ((n * sum1_sq - sum1 ** 2) * (n * sum2_sq - sum2 ** 2)) ** 0.5
  if (den === 0) return 0
  const num = n * p_sum - sum1 * sum2
  return num / den
};

// 欧几里得距离
function sim_distance (prefs, name1, name2) {
  let p1=0,p2=0;
  prefs.forEach ((item,i)=>{
    if(item[0].uname===name1){
      p1=i;
      return;
    }else if(item[0].uname===name2){
      p2=i;
      return;
    }
  });
  // console.log(p1);
  // console.log(p2);

  let temp1 = prefs[p1].filter((d,i)=>{
    let flag = false;
    for(let i=0;i<prefs[p2].length;i++){
      if(prefs[p2][i].pid===d.pid){
        flag = true;
        break;
      }
    }
    return flag;
  });
  let temp2 = prefs[p2].filter((d,i)=>{
    let flag = false;
    for(let i=0;i<prefs[p1].length;i++){
      if(prefs[p1][i].pid===d.pid){
        flag = true;
        break;
      }
    }
    return flag;
  });

  if (temp1.length===0) return 1;
  if (temp2.length===0) return 1;
  let n = temp1.length+temp2.length;
  if (n===0) return 1;

  let sum_square = 0;
  for(let k =0;k<temp1.length;k++){
    sum_square+=Math.pow(temp1[k].views-temp2[k].views,2);
  }

  return 1/(1+Math.sqrt(sum_square));
};

/**
 * 计算相识度
 * @param prefs
 * @returns {book1: {book2: sim1, book2: sim2}}
 */
function getSimsList(prefs, simFun = sim_pearson) {
  console.log(prefs)
  const keys = Object.keys(prefs)
  let result = {}
  keys.forEach(b0 => {
    result[b0] = {}
    keys.forEach(b => {
      if(b === b0) return
      result[b0][b] = simFun(prefs, b0, b)
    })
  })
  return result
}

/**
 * 计算相似读矩阵
 * @param prefs
 * @returns {{result: Array, keys: string[]}}
 */
function getSimsListArr(prefs,  simFun = sim_pearson) {
  console.log(prefs)
  let result = []
  const keys = Object.keys(prefs)
  keys.forEach((b0, i0) => {
    result.push([])
    keys.forEach((b, i) => {
      if(i === i0) {
        return result[i][i0] = null
      } else if (i - i0 > 0) {
        result[i0][i] = simFun(prefs, b0, b)
      } else {
        result[i0][i] = result[i][i0]
      }
      
    })
  })
  const final = {
    keys,
    result
  }
  file.writeJson(final, file.getNameByDay(), 'R_PATH')
  return final
}

/**
 * 格式化用户输入并推荐
 * @param userInterest {bookId: interest} // 输入用户书籍兴趣度
 * @param count number 兴趣度最高的n本书
 */
function doRecommend(userInterest, count) {
  let result = []
  const final = file.readJson(file.getNameByDay(), 'R_PATH')
  const keys = final.keys
  let data = new Array(final.keys.length).fill(0)
  const inputKeys = userInterest
  inputKeys.forEach(item => {
    let i = keys.indexOf(item[0])
    if (i > -1) data[i] =  item[1]
  })
  final.result.forEach((item, i) => {
    if (data[i] === 0) {
      result.push([keys[i], item.reduce((res, sim, index) => res + sim * data[index], 0)])
    }
  })
  result = result.sort((a,b)=>{
    if(a[1] > b[1]) return -1
    else return 1
  }).splice(0, count)
  return result
}

// test数据
const prefs = {
  book1: {
    user1: 1,
    user2: 4,
    user3: 3,
    user4: 4
  },
  book2: {
    user1: 1,
    user2: 4,
    user3: 3,
    user4: 1
  },
  book3: {
    user1: 3,
    user2: 2,
    user3: 3,
    user4: 4
  },
  book4:  {
    user1: 1,
    user7: 2,
    user5: 3,
    user6: 4
  },
  book5:  {
    user1: 1,
    user2: 2,
    user5: 4,
    user6: 4
  }
}

// console.log(getSimsListArr(prefs, sim_pearson))
// console.log(doRecommend([['book2', 5], ['book3', 5]], 3))

module.exports = {
  getSimsList,
  doRecommend,
  getSimsListArr
}

// console.log(getRecommend(prefs, 'book2'))
// console.log(topMatch(prefs, 9))
