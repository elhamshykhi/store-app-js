"use strict";

import API from "./API.js";
import AppUI from "./AppUI.js";
import Cart from "./Cart.js";
import Products from "./Products.js";

class App {
  constructor() {
    this.setUpApp();
  }

  setUpApp() {
    API.fetchProducts().then(() => {
      new Products(API.getData());
    });
    Cart.setUpCart();
    AppUI.setUpAppUI();
  }
}

const app = new App();
