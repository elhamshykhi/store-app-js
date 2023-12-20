import API from "./API.js";

const navbar = document.querySelector("#navbar");
const scrollDownBtn = document.querySelector("#scrollDown_btn");

const whyUsContainer = document.querySelector("#whyUs_container");
const accordionWrapper = document.querySelector("#accordion_wrapper");
const pageHeight = window.innerHeight;

class AppUI {
  constructor() {
    document.addEventListener("DOMContentLoaded", () => {
      this.setHeader();
    });

    window.addEventListener("scroll", () => {
      this.setHeader();
    });

    scrollDownBtn.addEventListener("click", () => {
      window.scrollBy({
        top: pageHeight - scrollY + 1,
        left: 0,
        behavior: "smooth",
      });
    });
  }

  setUpAppUI() {
    this.setUpWhyUs();
    this.setUpFaq();
  }

  setHeader() {
    if (scrollY + 144 >= pageHeight) {
      navbar.classList.add("setNavOnTop");
    } else {
      navbar.classList.remove("setNavOnTop");
    }
  }

  setUpWhyUs() {
    API.fetchWhyUs().then(() => {
      whyUsContainer.innerHTML = API.getData()
        .map(
          (item) => `<div
      class="border-2 border-stone-100 rounded-lg p-4 w-full col-span-12 xs:col-span-6 md:col-span-3"
    >
      <div
        class="w-11 h-11 rounded-full bg-teal-800 flex items-center justify-center text-white mb-2"
      >
      <img width="20px" src="../src/assets/images/${item.title}.svg" alt="${item.title}">
      </div>
      <h4 class="font-bold text-sm sm:text-base capitalize mb-1">
        ${item.title}
      </h4>
      <p class="text-justify font-lato text-xs xl:text-sm">
        ${item.text}
      </p>
    </div>`
        )
        .join("");
    });
  }

  setUpFaq() {
    API.fetchFaq().then(() => {
      accordionWrapper.innerHTML = API.getData()
        .map(
          (
            item
          ) => `<article class="faq bg-stone-50 shadow-md rounded-xl font-lato">
        <div class="flex items-center justify-between px-4 py-2">
          <p class="text-sm sm:text-base pointer-events-none capitalize">${item.heading}</p>
          <button type="button" class="faq_btn transition-transform duration-300 ease-in-out">
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
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>
        <div class="faq_text px-4 max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
          <p class="text-teal-900 text-xs sm:text-sm">${item.text}</p>
        </div>
      </article>`
        )
        .join("");

      const faqs = [...document.querySelectorAll(".faq")];
      faqs.forEach((faq) => {
        const btn = faq.querySelector(".faq_btn");
        const text = faq.querySelector(".faq_text");

        faqs[0].querySelector(".faq_text").style.maxHeight =
          text.scrollHeight + "px";
        faqs[0].querySelector(".faq_btn").style.transform = "rotate(180deg)";

        faq.addEventListener("click", () => {
          faqs.forEach((item) => {
            if (item !== faq) {
              const text = item.querySelector(".faq_text");
              const btn = item.querySelector(".faq_btn");
              text.style.maxHeight = null;
              btn.style.transform = "rotate(0deg)";
            }
          });
          text.style.maxHeight = text.scrollHeight + "px";
          btn.style.transform = "rotate(180deg)";
        });
      });
    });
  }
}
export default new AppUI();
