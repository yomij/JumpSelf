// const commentDao = require('../db/comment')
const userDao = require('../db/user')
const chapterDao = require('../db/chapter')
const bookDao = require('../db/book')
const behaviorDao = require('../db/behavior')

const commentDao = require('../db/comment')
// commentDao.insertComment({
//   bookId: '5ca8a3d40e23761aa0bfe49f',
//   chapterId:  '5ca8a3d40e23761aa0bfe49f0',
//   userId: '5c9f584f81a4b6449c52ad14',
//   content: '难受',
//   createTime: Date.now(),
// })

async function test(dao, func) {
  // console.log(await commentDao.findByChapter('5ca8a3d40e23761aa0bfe49f0'))
  // console.log(await chapterDao.findChaptersByBookId('5ca8a3d40e23761aa0bfe49f', 1, 10))
  //  console.log(await chapterDao.findChapterById("5ca8a3d40e23761aa0bfe49f0"))
  // const res = await userDao.overhead('5c9f584f81a4b6449c52ad14', '5cb56b203ad6d3106022bf97', 1)
  //  const res = await userDao.server.addSub('5c9f584f81a4b6449c52ad14', '5cb56b203ad6d3106022bf97')

  // 获取最热书籍
  // const res = await bookDao.getHeaterByTag(['玄幻奇幻', '科幻灵异'], 3)

  // const res = await  bookDao.search('天蚕土豆')
  // const res = await commentDao.addComment('5cb9a9b35349443d303530b8', '5cb9a9b35349443d303530b80', '5c9f584f81a4b6449c52ad14', '吼吼吼略略略号都爱是啊谁都不会u啊是不低啊时代uahb嗲是不iuas比赛巴斯u不阿斯u的不爱上不i')
  // const res = await  commentDao.getComment('5cb9a9b35349443d303530b80', 1, 10)

  // const res = await bookDao.server.preSearch('东')
  // const res = await chapterDao.findChaptersMore('5cb9dcce7c0eb039dc954ac5', 3, 3)
  // const res = await commentDao.like('5cc1b5b7700449333c88bd32', '5c9f584f81a4b6449c52ad14')

  // const data = {
  //   "5cb9a9bd5349443d303530ba": {"1": {"count": 3, "extara": null}, "4": {"count": 3, "extra": null}, "lastUpdate": 1556547368829,},
  //   "5cbf2a5e67245d36b02bc6c8": {"2": {"count": 1, "extra": null}, "3": {"count": 37733, "extara": null}},
  //   "5cb9dcce7c0eb039dc954ac5": {"1": {"count": 2, "extra": null}}
  // }
  //
  // const ks = ['clickCount', 'readCount', 'totalReadTime', 'shareCount']
  // const res = []
  // const books = []
  // for(let key in data) {
  //   books.push(key)
  //   const k = Object.keys(data[key])
  //   const temp = {}
  //   k.forEach(item => {
  //     item === 'lastUpdate' ? temp['lastUpdateTime'] =  data[key][item] : temp[ks[item - 1]] = data[key][item].count
  //   })
  //   res.push(temp)
  // }
  // const res =await behaviorDao.totalRead('5c9f584f81a4b6449c52ad14')
  // await bookDao.model.updateMany({}, {isDelete: 0})
  await chapterDao.insertChapters([{
    "_id": "5cb9a9b35349443d303530b0",
    "createTime": "2019-04-19T10:57:51.954Z",
    "chapterNum": 0,
    "title": "第一章 yomi是猪",
    "source": "https://read.ixdzs.com/66/66746/p1.html",
    "wordCount": 3908,
    "bookId": "5cb9a9b35349443d303530b8",
    "content": "<p>我欲封天,第一章书生孟浩</p><p>赵国是一个小国，如这南赡大地的其他小国一样，向往东土，向往大唐，向往长安，这是国主的倾慕，也是赵国文生的理想，一如都城内的唐楼，与皇宫齐高，似可以遥望千山万水外的东土长安。ai悫鹉琻</p><p>四月的季节，说不出冷，也自然没有难熬的热，轻微的风抚过大地，掠过了北漠羌笛，吹过了东土大唐，掀起一些尘土如雾，在黄昏的夕阳下，转了个弯儿，卷在南域边缘赵国的大青山，落在了此刻于这青山顶端，坐在那里的一个文生少年身上。</p><p>少年有些瘦弱，手中拿着一个葫芦，穿着一身干净的蓝色文士长衫，看起来约莫十六七岁的样子，个字不高，皮肤有些黑，但清澈的双眼带着一抹聪颖，只是此刻皱起的眉头，使得聪颖内敛，神色中多了一抹茫然。</p><p>“又落榜了……”少年叹了口气，他叫孟浩，是这大青山下云杰县一个普通书生，早年双亲突然失踪，留下家财本就不殷，这几年读书不菲，到了如今已贫贫如洗。</p><p>“考了三年，这三年来整日看那些贤者书籍，已看的几欲作呕，莫非科举真的不是我孟浩未来的路？”孟浩自嘲，低头看了一眼手中的葫芦，神色有些黯淡。</p><p>“当官发财做个有钱人的理想已经越来越远，更不用说有钱之后去东土大唐……百无一用是书生。”孟浩苦笑，坐在这安静的山顶，看着手中的葫芦，神色的茫然越来越深，那茫然里带着对未来的恐惧，对自己人生的迷茫，不知晓自己以后能做些什么，也不知晓未来的路在哪里。</p><p>会不会有个贵人看好了自己，是否还有个深闺小姐突然中意自己，又或者若干年后，自己还在不断的科举。</p><p>这些问题没有答案，对一个十六七岁的少年来说，这样的迷茫，仿佛化作了一张噬人的大口，将他无形的吞噬，让他有些害怕。</p><p>“哪怕是县城里的教习先生，每月也只有几钱银子，甚至不如王伯的木匠铺子赚钱，早知如此头些年不去读书，和王老伯去学木匠手艺，想来日后总算能解决温饱，好过如今一无所有。”孟浩沉默。</p><p>“家里已经没有多少粮食了，银两也都花的所剩无几，还欠了周员外三两银子，以后……怎么办。”孟浩抬起头，看着天空，喃喃低语，天空很蓝，很大，遥远看不到尽头，仿佛如他看不到未来。</p><p>许久之后，孟浩摇了摇头，从怀里取出一张纸条，认真的看了看，将纸条放进了葫芦里，站起身用力将葫芦扔下青山。</p><p>青山下有一条大河，河水寒冬不冻，传说通往东土大唐。</p><p>山顶的孟浩，默默的看着山下大河中渐渐飘远的葫芦，没有眨眼，仿佛看到了自己的娘亲，看到了儿时的欢乐，那葫芦里带着他的理想，带着他对未来波澜壮阔的憧憬，越飘越远，不知未来的某日，会有谁捡到这个葫芦，看到里面的纸条。</p><p>直至过去了数十息的时间，孟浩才收回了目光，将神色中的茫然隐藏起来，深深的呼吸了一口山顶的气息，目中露出坚定。</p><p>“不管如何，读书也好，做工也罢，总要……生活下去。”孟浩的性格本就这样，聪颖中带着坚强，若非如此，早年双亲外出后他也不可能一个人独自活到现在。</p><p>孟浩抬头看了一眼天空，目中坚定之意更深，就要向山下走去。</p><p>就在这时，忽然从那山崖下传来了微弱的声音，那声音似要被风吹散，落入孟浩耳中时微弱仿佛难以察觉。</p><p>“救命……救命……”</p><p>孟浩脚步一顿，怔了一下后仔细又听了听，那救命之声此刻随着他的专注也清晰了一些。</p><p>“救命……”</p><p>孟浩快走几步，到了山顶的边缘，向下看时，立刻看到在这峭壁的半山腰上，似乎存在了一处裂缝，有人从那里探出半个身子，面色苍白带着惊恐绝望，正在呼喊。</p><p>“你……可是孟浩，救命，孟才子救我。”从半山腰探出身子的也是一个少年，他一眼就看到了孟浩，神色立刻露出惊喜，仿佛绝处将要逢生。</p><p>“王有材？”孟浩睁大了眼，看着半山腰那里的少年，此人他认识，正是县城木匠铺王伯的儿子。</p><p>“你……你怎么跑这里来了？”孟浩看了一眼下方的山腰裂缝，那里极为陡峭，根本就无法让人攀爬下去，稍微一个不注意必定坠落山下大河中。</p><p>尤其是河水湍急，一旦落入水中九死一生。</p><p>“不止是我，还有附近县其他几人，我们都在这里，孟兄先别说了，快救我们出去。”王有材急忙开口，许是在那里探身子时间长了，话语说完时一手抓空，若不是被身后同伴抓住衣衫，险些滑落，吓的王有材面色更为苍白起来。</p><p>孟浩看到了险急，但他独自上山，没有绳索想要救人根本就没有办法，此刻回头看了一眼漫山遍野的藤条，双眼一亮立刻开始寻找起来。</p><p>他身子本就瘦弱，用了两柱香的时间，这才找到足够长的藤条，喘着粗气连忙卷着藤条回到山崖边，一边喊着下方王有材的名字，一边弯腰将藤条顺下山崖。</p><p>“你还没说，你们到底怎么下去的？”孟浩顺着藤条问道。</p><p>“飞！”说出这个字的不是王有材，而是他旁边探出身子的一个*岁少年，这少年虎头虎脑，大声开口。</p><p>“扯淡，飞什么飞，你能飞下去，现在怎么不飞上来。”孟浩嘲讽，索性把藤条向上拽了一些。</p><p>“别听他胡说，我们是被一个会飞的女人抓过来的，说是要带我们去什么宗做杂役。”王有材连忙开口，生怕招惹了孟浩收回藤条。</p><p>“又扯淡了，会飞？那是传说中的仙人，谁信啊。”孟浩不屑一顾，暗道自己看过的书籍里，有不少遇到了仙人结果成为有钱人的故事，这种事情，只是书本骗人的罢了。</p><p>眼看那藤条已经到了山崖的裂缝处，被王有材一把抓住，可突然的，孟浩觉得身后阴风阵阵，仿佛四周的温度一下子回到了冬季，让他身子哆嗦，下意识的回头时，立刻惊呼一下，整个人险些踏空落下山崖。</p><p>一个面色苍白，看不出年纪的女子，穿着一身银色长袍，站在那里面无表情的望着孟浩，这女子样貌极美，只是那煞白的面孔，阴寒的气息，却是有种刚刚从坟墓里爬出之感。</p><p>“有些资质，既然自己找来，也算你的造化。”</p><p>这声音落在耳中如骨头在摩擦，尤其这女子的双眼睛仿佛蕴含了某种奇异的力量，让孟浩看一眼，立刻全身瞬间一片寒冷，仿佛在这女子面前没有丝毫秘密，被看透了全身。</p><p>话语还在回荡，那女子大袖一甩，顿时一股绿色的风瞬间卷起孟浩，在孟浩惊呼中，随着那女子竟直奔山崖坠落，这一幕迅雷般让孟浩大脑一片空白。</p><p>待到了那裂缝处，这女子抬手一甩，将孟浩直接扔入裂缝内，绿风呼啸间她自己也踏入进去。她这一进来，顿时吓的王有材三人连连退后。</p><p>这女子站在那里没有说话，只是抬头看了一眼上方顺下来的藤条。</p><p>孟浩身子颤抖，内心紧张，爬起身后快速的看了一眼四周，这裂缝不大，内部很小，站了几人后已没多少空余。</p><p>当他的目光落在王有材身上时，看到了他身边的两个少年，一个是那虎头虎脑的家伙，另一个则是白白净净身子较胖，这二人此刻都身子颤抖，神色恐惧，似乎快哭了出来。</p><p>“本就缺一个，你和他们一起吧。”那面色煞白仿佛没有任何情绪的女子，此刻不再去看藤条，而是目光落向孟浩。</p><p>“你……你是谁。”孟浩强忍内心的惊恐，他毕竟读过不少书，且性格坚强，尽管恐惧，但却知晓此刻决不能慌乱。</p><p>女子没有说话，右手抬起一挥，绿风再次出现，呼啸卷起孟浩以及王有材等人，与这女子一同飞出了洞穴，直奔天空而去，刹那不见了踪影，只有这大青山，依旧耸立，在这黄昏里渐渐融到了黑夜中。</p><p>孟浩面色苍白，他看到了自己在绿风内，竟横渡天阙，在这天地间疾驰飞行，前方的风呼啸灌入口中，呼吸都觉得困难，可脑海中却是强烈的浮现了一个词语。</p><p>“仙人？”他坚持了数十息的时间，便难以承受，眼前一黑昏了过去。</p><p>当他睁开眼睛时，已经在了一处半山腰的青石空地上，四周山峦起伏，云雾缭绕绝非凡尘，能看到一些精美的阁楼环绕山峦八方，满眼陌生。</p><p>他身边王有材以及另外两个少年，此刻都已苏醒过来，正身子颤抖惊恐的望着前方背对着四人的女子。</p><p>在这女子的前方，有两个穿着绿色长袍的男子，年纪看起来都是二十许岁，但都是双眼凹陷，瞳孔绿油油的，让人望之生畏。</p><p>“许师姐好手段，出门一次竟带回了四个拥有资质的小娃。”两个男子中的一人，带着恭维向着那女子说道。</p><p>“将他们带去杂役处。”那女子神情冷漠，看都不看孟浩四人一眼，迈步间整个人化作了一道长虹，没入山峦之间消失不见。</p><p>此刻的孟浩已恢复了心神，他怔怔的看着那女子消失的地方，目中渐渐竟露出了一抹在他身上十六年来前所未有的神采，这神采让孟浩的内心，一下子沸腾了。</p><p>“杂役？这是要给仙人打工，应该不少赚吧。”孟浩期待起来，因为他看出来了，这里的人不是要害命。</p><p>“许师姐已经到了凝气第七层，被掌教赐了风幡，没到筑基便可飞行，让人羡慕。”另一个绿袍修士，感慨的说道，随后神色带着高高在上之意，看向孟浩四人。</p><p>“你，还有你，跟我走，去南区杂役处。”话语间，此人指了指王有材和其旁虎头虎脑的少年。</p><p>“这……这里是什么地方？”被那人一指，王有材身子哆嗦，打着颤音开口。</p><p>“靠山宗。”</p><p>－－－－－－－－－－－－－</p><p>书生孟浩和大家见面啦，收藏和推荐票，一个都不要少呀，首页有新书活动，收藏有奖励，还有大转盘抽奖，耳根为大家争取了海量的起点币，还有电子书以及ipadmini，中奖率不小，我也会去抽抽看。</p><p>收藏，推荐票！！</p><p>晚上还有一章，今晚八点有语音活动，新书发布会。</p><p>;</p>",
  }])
  console.log(res)

  // console.log(books)
}


async function getNochapterBook() {
  let res = await chapterDao.model.aggregate([

    {
      $project: {
        // _id: 1,
        title: 1,
        bookId: 1,
        accounts: 1,
      }
    },

    {$group: {_id: '$bookId', count: {$sum: 1}}},
    // {$match: {bookId: {$ne: require('mongoose').Types.ObjectId('5cd129e47752e7163ef37772')}}},
    {
      "$lookup": {
        "from": 'books',
        "localField": "_id",
        "foreignField": "_id",
        "as": "book"
      }
    },
    {"$unwind": "$book"},
    {
      $project: {
        _id: 1,
        count: 1,
        book: {
          title: 1,
          extra: 1
        }
      }
    },

  ])
  require('../utils/file').writeJson(res, 'bookChapter')
  console.log(res.length)
  return res
}


async function getbook() {
  const books = await bookDao.model.find({}, '_id title createTime extra.urls.mainUrl')
  return books
}


async function getRecommendData() {
  let res = await behaviorDao.model.aggregate([
    {
      $project: {
        _id: 1,
        book: 1,
        user: 1,
        clickCount: 1,
        everSub: true,
        grade: 1,
        lastUpdateTime: 1,
        readCount: 1,
        shareCount: 1,
        // gradex: [ "$grade", "$readCount", '$shareCount' ]
        gradex: {$add: [{$multiply: ["$grade", 100]}, {$multiply: ["$readCount", 1]}, {$multiply: ["$shareCount", 10]}]}
      }
    },
    {$match: {user: {$ne: require('mongoose').Types.ObjectId('5cc477282b8c663720c50433')}}},
    {$group: {_id: '$book', user: {$addToSet: '$user'}, gradex: {$addToSet: '$gradex'}}},

  ])
  res = res.map(item => {
    const temp = {}
    item.user.forEach((u, i) => {
      temp[u] = item.gradex[i]
    })
    return {
      [item._id]: temp
    }
  })

  let personal = await behaviorDao.model.aggregate([
    {
      $project: {
        _id: 1,
        book: 1,
        user: 1,
        clickCount: 1,
        everSub: true,
        grade: 1,
        lastUpdateTime: 1,
        readCount: 1,
        shareCount: 1,
        // gradex: [ "$grade", "$readCount", '$shareCount' ]
        gradex: {$add: [{$multiply: ["$grade", 100]}, {$multiply: ["$readCount", 1]}, {$multiply: ["$shareCount", 10]}]}
      }
    },
    {$match: {user: {$eq: require('mongoose').Types.ObjectId('5cc477282b8c663720c50433')}}},
    {$sort: {gradex: 1}},
    {$group: {_id: '$user', book: {$addToSet: '$book'}, gradex: {$addToSet: '$gradex'}}},

  ])
  return {
    behavior: res,
    personalInfo: personal
  }
}

// test()

// getNochapterBook()

const n = require('./reverseTest')

async function dos() {
  const book = await getbook()
  const haschapter = await getNochapterBook()
  const has = haschapter.filter(item => book.some(c => c._id.toHexString() === item._id.toHexString()))
  let failed = []
  book.forEach(e => {
    const id = e._id.toHexString()
    let isPass = true
    for (let i = 0; i < has.length; i++) {
      let f = has[i]
      if (id === f._id.toHexString()) {
        isPass = false
        break
      }
    }
    if (isPass) failed.push(e)
  })
  failed = failed.map(item => {
    return {
      bookId: item._id,
      title: item.title,
      chapterUrl: 'https://read.ixdzs.com' + item.extra.urls.mainUrl.split('/d')[1]
    }
  })
  console.log(failed.length)
  n.insertFailedBook(failed)
}

dos()

// test()

