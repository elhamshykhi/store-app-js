import API from "./API.js";

const openCartBtn = document.querySelector("#open_cart");
const cartSection = document.querySelector("#cart_section");

const cartFull = document.querySelector("#cart_full");
const cartEmptyMsg = document.querySelector("#cart_empty_msg");
const clearCart = document.querySelector("#clear_cart");
const confirmCart = document.querySelector("#confirm_cart");
const cartContainer = document.querySelector("#cart_container");
const cartTotal = document.querySelector("#cart_total");
const cartItemsNum = document.querySelector("#cart_items_num");

class Cart {
  constructor() {
    this.cartProducts = [];
    this.cartLogic();

    openCartBtn.addEventListener("click", () => {
      cartSection.classList.add("show_cart");
    });

    clearCart.addEventListener("click", () => {
      this.clearCartItems();
    });

    confirmCart.addEventListener("click", () => {
      cartSection.classList.remove("show_cart");
    });
  }

  refreshCart(selectedProduct) {
    this.cartProducts.push(selectedProduct);

    this.displayCartItems(this.cartProducts);
    this.setCartValue(this.cartProducts);
  }

  setUpCart() {
    API.fetchCart().then(() => {
      this.cartProducts = API.getData();
      if (!this.cartProducts.length) {
        clearCart.classList.add("hidden");
      }

      this.displayCartItems(this.cartProducts);
      this.setCartValue(this.cartProducts);
    });
  }

  displayCartItems(items) {
    if (items.length) {
      cartEmptyMsg.classList.add("hidden");
      clearCart.classList.remove("hidden");
      cartFull.classList.add("show_cartFull");
    }

    cartContainer.innerHTML = items
      .map((item) => {
        return `<div
      class="w-full flex items-center justify-between gap-x-2 sm:gap-x-4 border-b border-stone-200 last:border-b-0 py-2"
    >
      <div
        class="w-auto xs:w-24 h-20 sm:w-32 sm:h-20 bg-stone-200 overflow-hidden rounded-lg flex items-center justify-center"
      >
        <img
          src=${item.image}
          alt=""
          class="h-full w-full xs:w-5/6 sm:w-2/3 object-cover object-center"
        />
      </div>
  
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-around gap-x-2 flex-1">
        <span class="font-lato sm:text-lg capitalize font-bold">${
          item.title
        }</span>
        <span class="font-lato sm:text-lg capitalize">${item.price.toFixed(
          2
        )} $</span>
      </div>
  
      <div class="flex flex-col items-center justify-center">
        <button type="button" class='cart_quantity_add' data-id=${item.id}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 pointer-events-none"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
        <span class="">${item.quantity}</span>
        <button type="button" class='cart_quantity_minus' data-id=${item.id}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 pointer-events-none"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </div>
      <button type="button" class="cart_trash" data-id=${item.id}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 pointer-events-none"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    </div>`;
      })
      .join("");
  }

  setCartValue(cartItems) {
    let tempCartItems = 0;

    const cartTotalPrice = cartItems.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);

    cartTotal.innerHTML = `${cartTotalPrice.toFixed(2)}`;
    cartItemsNum.innerHTML = tempCartItems;
  }

  cartLogic() {
    cartContainer.addEventListener("click", (e) => {
      const cartTarget = e.target;

      // find item in cart
      const cartItem = this.cartProducts.find(
        (item) => item.id === Number(cartTarget.dataset.id)
      );

      // increase or decrease in quantity and delete cart item
      if (cartTarget.classList.contains("cart_quantity_add")) {
        cartItem.quantity++;

        this.setCartValue(this.cartProducts);
        API.updateCartItem("update", cartItem);
        cartTarget.nextElementSibling.innerHTML = cartItem.quantity;
      } else if (cartTarget.classList.contains("cart_quantity_minus")) {
        if (cartItem.quantity > 1) {
          cartItem.quantity--;
        }

        this.setCartValue(this.cartProducts);
        API.updateCartItem("update", cartItem);
        cartTarget.previousElementSibling.innerHTML = cartItem.quantity;
      } else if (cartTarget.classList.contains("cart_trash")) {
        this.removeCartItem(cartItem.id);

        cartContainer.removeChild(cartTarget.parentElement);

        if (!cartContainer.children.length) {
          this.emptyCart();
        }
      }
    });
  }

  clearCartItems() {
    this.cartProducts.forEach((item) => this.removeCartItem(item.id));
    this.cartProducts = [];

    if (cartContainer.children.length) {
      [...cartContainer.children].forEach((item) => item.remove());
      this.emptyCart();
    }
  }

  removeCartItem(id) {
    const item = this.cartProducts.find((item) => item.id === id);

    API.updateCartItem("delete", item);
    this.cartProducts = this.cartProducts.filter((item) => item.id !== id);
    this.setCartValue(this.cartProducts);

    [...document.querySelectorAll(".add_to_cart")].forEach((btn) => {
      if (Number(btn.dataset.id) === id) {
        btn.innerHTML = "add to cart";
        btn.disabled = false;
      }
    });
  }

  emptyCart() {
    cartSection.classList.remove("show_cart");
    cartEmptyMsg.classList.remove("hidden");
    clearCart.classList.add("hidden");
    cartFull.classList.remove("show_cartFull");
  }
}

export default new Cart();
