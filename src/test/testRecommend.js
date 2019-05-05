// /**
//  * Created by jasonchen on 2017.10.30.
//  */
// // 相关度算法——皮尔逊
// function sim_pearson (prefs, name1, name2) {
//   let p1=0, // 输入用户
//     p2=0;  // 计算相似度用户
//   prefs.forEach ((item,i)=>{
//     if(item[0].uname=== name1){
//       p1=i;
//       return;
//     }else if(item[0].uname=== name2) {
//       p2=i;
//       return;
//     }
//   });
//   // console.log('p1', p1);
//   // console.log(p2);
//
//   let temp1 = prefs[p1].filter((d,i)=>{ // 是否同时订阅评分某个商品
//     let flag = false;
//     for(let i=0; i<prefs[p2].length; i++){
//       if(prefs[p2][i].pid === d.pid){
//         flag = true;
//         break;
//       }
//     }
//     return flag;
//   });
//
//   let temp2 = prefs[p2].filter((d,i) => {
//     let flag = false;
//     for(let i=0; i<prefs[p1].length; i++){
//       if(prefs[p1][i].pid===d.pid){
//         flag = true;
//         break;
//       }
//     }
//     return flag;
//   });
//
//   if (temp1.length===0) return 1;
//   if (temp2.length===0) return 1;
//   let n = temp1.length + temp2.length;
//   if (n===0) return 1;
//
//   let sum1 = 0; // 输入用户
//   let sum2 = 0;
//   prefs[p1].forEach((d)=>{sum1+=d.views});
//   prefs[p2].forEach((d)=>{sum2+=d.views});
//
//   let sqrt1 = 0;
//   let sqrt2 = 0;
//   prefs[p1].forEach((d)=>{sqrt1+=d.views*d.views});
//   prefs[p2].forEach((d)=>{sqrt2+=d.views*d.views});
//   //
//   // 乘积和
//   let sum3 = 0;
//   for(let k =0;k<temp1.length;k++){
//     sum3+=temp1[k].views*temp2[k].views;
//   }
//   //
//   // pearson相关度
//   let num = sum3 - (sum1*sum2/n);
//   let den = Math.sqrt((sqrt1-Math.pow(sum1,2)/n)*(sqrt2-Math.pow(sum2,2)/n));
//   if (den===0) return 0;
//   //
//   let uu = num/den;
//   return num/den;
// };
//
// // 相关度算法——欧几里得距离
//  function sim_distance (prefs, name1, name2) {
//   let p1=0,p2=0;
//   prefs.forEach ((item,i)=>{
//     if(item[0].uname===name1){
//       p1=i;
//       return;
//     }else if(item[0].uname===name2){
//       p2=i;
//       return;
//     }
//   });
//   // console.log(p1);
//   // console.log(p2);
//
//   let temp1 = prefs[p1].filter((d,i)=>{
//     let flag = false;
//     for(let i=0;i<prefs[p2].length;i++){
//       if(prefs[p2][i].pid===d.pid){
//         flag = true;
//         break;
//       }
//     }
//     return flag;
//   });
//   let temp2 = prefs[p2].filter((d,i)=>{
//     let flag = false;
//     for(let i=0;i<prefs[p1].length;i++){
//       if(prefs[p1][i].pid===d.pid){
//         flag = true;
//         break;
//       }
//     }
//     return flag;
//   });
//
//   if (temp1.length===0) return 1;
//   if (temp2.length===0) return 1;
//   let n = temp1.length+temp2.length;
//   if (n===0) return 1;
//
//   let sum_square = 0;
//   for(let k =0;k<temp1.length;k++){
//     sum_square+=Math.pow(temp1[k].views-temp2[k].views,2);
//   }
//
//   return 1/(1+Math.sqrt(sum_square));
// };
//
// // TopN 相关用户
// function topMatch(prefs, person, n = 3, similarity = sim_pearson) {
//   let p1=0;
//   prefs.forEach ((item,i)=>{
//     if(item[0].uname===person){
//       p1=i;
//       return;
//     }
//   });
//
//   let scores = [];
//   for(let i=0;i<prefs.length;i++){
//     if(i!==p1){
//       scores.push({sim:similarity(prefs,person,prefs[i][0].uname),name:prefs[i][0].uname})
//     }
//   }
//   scores.sort((a,b)=>{
//     if(a.sim>b.sim){
//       return -1;
//     }else {
//       return 1;
//     }
//   });
//   return scores.splice(0,n);
// };
//
// // TopN 推荐产品（未购买）
//  function getRecommend (prefs,person,similarity= sim_pearson,users=null,n=3){
//   let totals = [];
//   let simSums = [];
//   let RankedProduct = [];
//   let sim = 0;
//   let newperson = true;
//   let myproduct = []; // 推荐人评分数据
//   let result = [];
//   // let p1 = 0;
//   for(let i=0;i<prefs.length;i++){
//     if(prefs[i][0].uname===person) {
//       newperson = false; //
//       // 不是新用户
//       // p1 = i;
//       for(let j=0; j<prefs[i].length; j++) {
//         myproduct.push(prefs[i][j].pid); // 该用户的评分数据
//       }
//       break;
//     }
//   }
//   console.log('myproduct',myproduct);
//   for(let i=0; i<prefs.length; i++){
//     if(prefs[i][0].uname === person) continue;
//     if (similarity === sim_pearson){ //　皮尔逊算法
//       sim = similarity(prefs, person, prefs[i][0].uname)
//       console.log('sim' , prefs[i][0].uname, sim)
//     }else{
//       sim = similarity(users,person,prefs[i][0].uname)
//     }
//     for(let j=0;j<prefs[i].length;j++){
//       // 是新人，或者没有看过产品
//       if(newperson || myproduct.indexOf(prefs[i][j].pid)<0 ) {
//         // totals[prefs[i][j].pid] = 0;
//         // simSums[prefs[i][j].pid] = 0;
//         totals[j] = 0;
//         simSums[j] = 0;
//         RankedProduct.push(prefs[i][j].pid);
//       }
//     }
//     for(let j=0;j<prefs[i].length;j++){
//       // 是新人，或者没有看过产品
//       if(newperson || myproduct.indexOf(prefs[i][j].pid)<0 ) {
//         totals[j]+=prefs[i][j].views*sim;
//         simSums[j]+=sim;
//       }
//     }
//   }
//   // console.log(totals);
//   // console.log(simSums);
//
//   for(let i=0;i<totals.length;i++){
//     result.push({commRank:totals[i]/simSums[i],pid:RankedProduct[i]});
//   }
//   result.sort((a,b)=>{
//     if(a.commRank>b.commRank){
//       return -1;
//     }else {

//       return 1;
//     }
//   });
//    result.splice(n)
//   return result;
// };
//
// const prefs = [[{
//   pid: 'a',
//   uname: '1',
//   views: 8
// },{
//   pid: 'b',
//   uname: '1',
//   views: 4
// },{
//   pid: 'c',
//   uname: '1',
//   views: 10
// },{
//   pid: 'd',
//   uname: '1',
//   views: 6
// }, {
//   pid: 'f',
//   uname: '1',
//   views: 10
// }],[{
//   pid: 'a',
//   uname: '2',
//   views: 8
// },{
//   pid: 'a',
//   uname: '2',
//   views: 8
// },{
//   pid: 'c',
//   uname: '2',
//   views: 8
// },{
//   pid: 'e',
//   uname: '2',
//   views: 8
// }],[{
//   pid: 'a',
//   uname: '3',
//   views: 8
// }],[{
//   pid: 'd',
//   uname: '4',
//   views: 8
// },{
//   pid: 'b',
//   uname: '4',
//   views: 8
// },{
//   pid: 'c',
//   uname: '4',
//   views: 8
// },{
//   pid: 'a',
//   uname: '4',
//   views: 8
// }],[{
//   pid: 'a',
//   uname: '5',
//   views: 8
// },{
//   pid: 'b',
//   uname: '5',
//   views: 7
// },{
//   pid: 'e',
//   uname: '5',
//   views: 10
// }]]
//
// const user={
//   'cxd':{
//     // # 工资
//     'sal':1000,
//       // # 风险承受能力
//     'riskab':0.8
//     },
//     'syq':{
//       'sal':800,
//         'riskab':0.7
//     },
//     'jack':{
//       'sal':1000,
//         'riskab':0.7
//     },
//     'lory':{
//       'sal':1600,
//         'riskab':0.9
//     },
//     'mary':{
//       'sal':1900,
//         'riskab':0.8
//     },
//     'new':{
//       'sal':1000,
//         'riskab':0.8
//     }
// }
//
// console.log(getRecommend(prefs, '4'))



/**
 * Created by jasonchen on 2017.10.30.
 */
// 相关度算法——皮尔逊
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

// 相关度算法——欧几里得距离
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

// TopN 相关用户
function topMatch(prefs, person, n = 3, similarity = sim_pearson) {
  let p1=0;
  prefs.forEach ((item,i)=>{
    if(item[0].uname===person){
      p1=i;
      return;
    }
  });

  let scores = [];
  for(let i=0;i<prefs.length;i++){
    if(i!==p1){
      console.log(similarity(prefs,person,prefs[i][0].uname),)
      scores.push({sim:similarity(prefs,person,prefs[i][0].uname),name:prefs[i][0].uname})
    }
  }
  scores.sort((a,b)=>{
    if(a.sim>b.sim){
      return -1;
    }else {
      return 1;
    }
  });
  console.log(scores)
  return scores.splice(0,n);
};

// TopN 推荐产品
function getRecommend (prefs, book, similarity= sim_pearson, users=null,n=3){
  let sim = 0;
  // let newperson = true;
  let myproduct = []; //
  let result = [];
  // let p1 = 0;
  const books = Object.keys(prefs)
  for(let b of books){
    if(b === book) {
      myproduct = prefs[b]
      break;
    }
  }
  console.log('myproduct',myproduct);
  for(let b of books){
    if(b === book) continue;
    if (similarity === sim_pearson){ //　皮尔逊算法
      sim = similarity(prefs, book, b)
      result.push({book: b, sim})
      similarity(prefs, book, b)
    }
  }
  result.sort((a,b)=>{
    if(a.sim>b.sim){
      return -1;
    }else {
      return 1;
    }
  });
  result.splice(n)
  return result;
};

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
  }
}


console.log(getRecommend(prefs, 'book2'))
// console.log(topMatch(prefs, 9))