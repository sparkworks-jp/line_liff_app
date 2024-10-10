
export const coffeeProducts = [
    { id: 1, name: 'Espresso', price: 250, image: '/espresso.jpg', isNew: true },
    { id: 2, name: 'Latte', price: 340, image: '/latte.jpg', isNew: false },
    { id: 3, name: 'Cappuccino', price: 340, image: '/cappuccino.jpg', isNew: false },
  ];
  
  export function getProductById(id) {
    return coffeeProducts.find(product => product.id === Number(id));
  }