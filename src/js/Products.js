import API from "./API.js";
import Cart from "./Cart.js";

const searchInput = document.getElementById("search_input");
const totalProductsNum = document.querySelector("#total_products_num");
const pageNumber = document.getElementById("page_number");
const prevNextBtns = [...document.querySelectorAll(".prev_next_Btn")];

const carouselContainer = document.querySelector("#carousel_container");
const carouselList = document.querySelector("#carousel");

const productsList = document.getElementById("products_list");

export default class Products {
  constructor(allProducts) {
    this.allProducts = allProducts;
    this.currentPage = 1;
    this.numberPerPage = 6;
    this.numberOfItems = 0;
    this.numberOfPages = 0;
    this.carouselCounter = 0;
    this.filters = "";
    this.filteredProducts = this.allProducts;

    this.setUpProducts();

    searchInput.addEventListener("input", (e) => {
      this.filters = e.target.value;
      this.filterProducts(this.filters);
    });

    prevNextBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const btnId = e.target.id;

        if (btnId === "btn_prev" && this.currentPage > 1) {
          this.currentPage--;
        } else if (
          btnId === "btn_next" &&
          this.currentPage < this.numberOfPages
        ) {
          this.currentPage++;
        }

        this.refreshProducts(
          this.filteredProducts || this.allProducts,
          this.currentPage
        );
      });
    });
  }
  refreshProducts(products, currPage) {
    this.displayProducts(products, currPage);
    this.getAddToCartBtns();
  }

  setUpProducts() {
    this.refreshProducts(this.allProducts, this.currentPage);
    this.setUpCategories([
      ...new Set(this.allProducts.map((item) => item.category)),
    ]);
  }

  displayProducts(data, page = 1) {
    this.numberOfItems = data.length;
    this.numberOfPages = Math.ceil(this.numberOfItems / this.numberPerPage);
    totalProductsNum.innerHTML = `total items (${data.length})`;
    productsList.innerHTML = "";

    for (
      let i = (page - 1) * this.numberPerPage;
      i < page * this.numberPerPage;
      i++
    ) {
      if (data[i] !== undefined) {
        productsList.innerHTML += `<li id=${data[i].id} class="col-span-12 sm:col-span-6 lg:col-span-4">
          <div class="flex justify-between sm:flex-col gap-x-2 bg-stone-50 rounded-2xl relative p-2 xs:p-3 sm:p-4">
            <div>
              <div class="bg-white border-2 border-stone-100 rounded-2xl w-28 h-28 xs:w-36 xs:h-36 sm:h-64 sm:w-full">
                <img
                  src=${data[i].image}
                  alt=""
                  class="w-auto h-full mx-auto object-cover"
                />
              </div>
            </div>
            <div class="sm:py-4">
              <div class="flex items-center justify-between">
                <span class="font-playFair font-bold capitalize text-sm xs:text-base sm:text-lg lg:text-xl">
                  ${data[i].title}
                </span>
                <span class="font-lato font-bold text-teal-700 flex items-center gap-x-3">
                  <span class="text-sm xs:text-base sm:text-lg lg:text-xl"><span class="font-light">$</span>${data[i].price}</span>
                </span>
              </div>
              <span class="inline-block w-8 h-1 rounded-sm bg-teal-600"></span>
              <p class="font-lato text-xs xs:text-sm md:text-base text-justify mb-4 xs:mb-0 line-clamp-3 xs:line-clamp-4">
                ${data[i].desc}
              </p>
            </div>
            <button
              type="button"
              data-id=${data[i].id}
              class="add_to_cart bg-teal-900 text-white font-bold capitalize text-xs sm:text-sm font-lato rounded-lg sm:rounded-xl px-5 py-2.5 absolute bottom-0 right-0 -translate-x-6 translate-y-1/2"
            >
              add to cart
            </button>
          </div>
        </li>`;
      }
    }

    pageNumber.innerHTML = `${
      page < 10
        ? page.toString().padStart(this.numberOfPages.toString().length, "0")
        : page
    }/${this.numberOfPages}`;
  }

  setUpCategories(categories) {
    let categoriesList = `<span class="carousel_item ml-4 md:ml-0 mr-1 inline-block rounded-lg bg-stone-300 transition-transform duration-300 ease-in-out cursor-pointer">
                            <h4 data-category="all" class="py-1.5">all</h4>
                         </span>`;

    categoriesList += categories
      .map(
        (
          item
        ) => `<span class="carousel_item mr-1 inline-block rounded-lg bg-stone-300 transition-transform duration-300 ease-in-out cursor-pointer">
        <h4 data-category="${item}" class="py-1.5">${item}</h4>
      </span>`
      )
      .join("");

    carouselList.innerHTML = categoriesList;

    const carouselItems = [...document.querySelectorAll(".carousel_item")];

    carouselItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        this.filterCategory(e);
      });

      if (window.innerWidth < 768) {
        item.style.width = `${(carouselContainer.offsetWidth - 40) / 3}px`;
      } else {
        item.style.width = `${(carouselContainer.offsetWidth - 24) / 7}px`;
      }
    });

    window.addEventListener("resize", () => {
      this.carouselCounter = 0;
      carouselItems.forEach((item) => {
        if (window.innerWidth < 768) {
          item.style.width = `${(carouselContainer.offsetWidth - 40) / 3}px`;
          item.style.transform = `translateX(0px)`;
        } else {
          item.style.width = `${(carouselContainer.offsetWidth - 24) / 7}px`;
          item.style.transform = `translateX(0px)`;
        }
      });
    });

    carouselContainer.addEventListener("click", (e) => {
      const targetId = e.target.id;

      if (targetId === "prev_btn" && this.carouselCounter > 0) {
        this.carouselCounter--;
      } else if (targetId === "next_btn" && this.carouselCounter < 3) {
        this.carouselCounter++;
      }

      carouselItems.forEach(
        (item) =>
          (item.style.transform = `translateX(-${
            this.carouselCounter *
            ((carouselContainer.offsetWidth - 40 + 12) / 2.25)
          }px)`)
      );
    });
  }

  filterCategory(e) {
    const targetCategory = e.target.dataset.category.toLowerCase();

    this.currentPage = 1;

    this.filteredProducts =
      targetCategory !== "all"
        ? this.allProducts.filter((item) => item.category === targetCategory)
        : this.allProducts;

    this.refreshProducts(this.filteredProducts, this.currentPage);
  }

  filterProducts() {
    this.filteredProducts = this.allProducts.filter((p) => {
      return p.title.toLowerCase().includes(this.filters.toLowerCase());
    });

    this.refreshProducts(this.filteredProducts, this.currentPage);
  }

  getAddToCartBtns() {
    const buttonsDom = [...document.querySelectorAll(".add_to_cart")];
    buttonsDom.forEach((btn) => {
      const btnId = Number(btn.dataset.id);

      API.fetchCart().then(() => {
        const isInCart = API.getData().find((item) => item.id === btnId);
        if (isInCart) {
          btn.innerHTML = "in cart";
          btn.disabled = true;
        } else {
          btn.innerHTML = "add to cart";
          btn.disabled = false;
        }
      });

      btn.addEventListener("click", (e) => {
        e.target.innerHTML = "in cart";
        e.target.disabled = true;

        let selectedProduct;

        const product = this.allProducts.find((p) => p.id === btnId);
        selectedProduct = { ...product, quantity: 1 };
        API.saveCartItem(selectedProduct);
        Cart.refreshCart(selectedProduct);
      });
    });
  }
}
