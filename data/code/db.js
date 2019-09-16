
/*
const Sequelize = require("sequelize");
const sequelize = new Sequelize('mysql://root@localhost:3306/jsm3');  

sequelize
.authenticate()
.then(() => {
    console.log('Connection successfully made.');
})
.catch(err => {
    console.error('Error connecting to database', err);
});


const Product = sequelize.define('product', {
  name: {
      type: Sequelize.STRING
  },
  quantity: {
      type: Sequelize.FLOAT
  },
  cost: {
      type: Sequelize.FLOAT
  },
  price: {
      type: Sequelize.FLOAT
  },
  unit: {
      type: Sequelize.STRING
  }
});

Product.sync().then(() => {
  return Product.create({
      name: 'Product 001',
      quantity: 10,
      cost: 100,
      price: 120,
      unit: 'kg' 
  });
});


Product.findAll().then(products => {
  console.log(products)
}) 
*/