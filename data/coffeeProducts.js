
export const coffeeProducts = [
    { id: 1, name: '塩漬け卵の月餅(蛋黄酥)', price: 250, image: '/egg.jpg', isNew: true },
    { id: 2, name: '緑豆ケーキ(绿豆糕)', price: 340, image: '/midorikeiki.jpg', isNew: false },
    { id: 3, name: 'アーモンドパイ(杏仁酥)', price: 340, image: '/aamonndopai.jpg', isNew: false },
    { id: 4, name: '揚げひねりパン（麻花）', price: 340, image: '/agehineripann.jpg', isNew: false },
    { id: 5, name: '月餅', price: 340, image: '/geppei.jpg', isNew: false },
    { id: 6, name: '大福（だいふく）', price: 340, image: '/daifuku.jpg', isNew: false },
    { id: 7, name: '羊羹（ようかん）', price: 340, image: '/cappuccino.jpg', isNew: false },
    { id: 8, name: 'らせん酥（螺旋酥）',  price: 340, image: '/rasensu.jpg' , isNew: false },
    { id: 9, name: 'たんこう酥（蛋黄酥）',  price: 500, image: '/tankōsu.png', isNew: false  },
    { id: 10, name: 'にくまつケーキ（肉松蛋糕）',  price: 500, image: '/nikumatsu.jpg' , isNew: false },
    { id: 11, name: 'エッグタルト（蛋挞）',  price: 500, image: '/eggutarto.jpg', isNew: false  },
    { id: 12, name: 'ほうり酥（凤梨酥）', price: 500, image: '/hōrisu.jpg' , isNew: false },
    { id: 13, name: 'りょくとう餅（绿豆饼）',  price: 500, image: '/ryokutō.jpg' , isNew: false },
    { id: 14, name: 'なつめに酥（枣泥酥）',  price: 500, image: '/natsumenisu.jpg' , isNew: false },
    { id: 15, name: 'ゆうご（油果）',  price: 500, image: '/yūgo.jpg' , isNew: false },
    { id: 16, name: 'ブラウニー（布朗尼）', price: 500, image: '/buraunī.jpg' , isNew: false },
    { id: 17, name: 'マカロン（马卡龙）',  price: 500, image: '/makaron.jpg', isNew: false  },
    { id: 18, name: 'マドレーヌ（玛德琳）',  price: 500, image: '/madorēnu.jpg' , isNew: false },

  
  
  ];
  



  export function getProductById(id) {
    return coffeeProducts.find(product => product.id === Number(id));
  }