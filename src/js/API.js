const BASE_URL = "http://localhost:5000";

class API {
  constructor() {
    this.data = [];
  }

  async fetchProducts() {
    try {
      const { data } = await axios.get(`${BASE_URL}/products`);
      this.data = data;
    } catch (error) {
      console.log(error.message);
    }
  }

  async fetchCart() {
    try {
      const { data } = await axios.get(`${BASE_URL}/cart`);
      this.data = data;
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveCartItem(item) {
    try {
      await axios.post(`${BASE_URL}/cart`, item);
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateCartItem(operation, item) {
    if (operation === "delete") {
      try {
        await axios.delete(`${BASE_URL}/cart/${item.id}`);
      } catch (error) {
        console.log(error.message);
      }
    }
    if (operation === "update") {
      try {
        await axios.patch(`${BASE_URL}/cart/${item.id}`, {
          ...item,
          quantity: item.quantity,
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  async fetchWhyUs() {
    try {
      const { data } = await axios.get(`${BASE_URL}/whyUs`);
      this.data = data;
    } catch (error) {
      console.log(error.message);
    }
  }
  async fetchFaq() {
    try {
      const { data } = await axios.get(`${BASE_URL}/faq`);
      this.data = data;
    } catch (error) {
      console.log(error.message);
    }
  }

  getData() {
    return this.data;
  }
}

export default new API();
