
export const coffeeProducts = [
    { id: 1, name: '塩漬け卵の月餅(蛋黄酥)', price: 250, image: '/egg.jpg', isNew: true },
    { id: 2, name: '緑豆ケーキ(绿豆糕)', price: 340, image: '/midorikeiki.jpg', isNew: false },
    { id: 3, name: 'アーモンドパイ(杏仁酥)', price: 340, image: '/aamonndopai.jpg', isNew: false },
    { id: 4, name: '揚げひねりパン（麻花）', price: 340, image: '/agehineripann.jpg', isNew: false },
    { id: 5, name: '月餅', price: 340, image: '/geppei.jpg', isNew: false },
    { id: 6, name: '大福（だいふく）', price: 340, image: '/daifuku.jpg', isNew: false },
    { id: 7, name: '羊羹（ようかん）', price: 340, image: '/cappuccino.jpg', isNew: false },
  ];
  



  export function getProductById(id) {
    return coffeeProducts.find(product => product.id === Number(id));
  }