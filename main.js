"use strict";

const tabContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabContents = document.querySelectorAll(".operations__content");

const modal = document.querySelector(".open-acount-modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn-close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const navs = document.querySelector(".nav__links");
const nav = document.querySelector(".nav");

///////////////////////////////////////
// Modal window
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
///////////////////////////////////////
//button scroll
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
//nav to setion scroll

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 1. Add event listener to common parent element
// 2. Determine what element originated the event
navs.addEventListener("click", function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//operations tab
tabContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest("button");
  if (!clicked) return;

  if (!clicked.classList.contains("operations__tab--active")) {
    //remove all active
    tabs.forEach((element) => {
      element.classList.remove("operations__tab--active");
    });
    tabContents.forEach((element) => {
      element.classList.remove("operations__content--active");
    });

    //button active
    clicked.classList.add("operations__tab--active");
    //text-content active
    const number = clicked.dataset.tab;
    document
      .querySelector(`.operations__content--${number}`)
      .classList.add("operations__content--active");
  }
});

//navigation style
const headleNavHover = function (e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((el) => {
      if (el != link) {
        el.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};

navs.addEventListener("mouseover", (e) => headleNavHover(e, 0.5));
navs.addEventListener("mouseout", (e) => headleNavHover(e, 1));

//sticky navigation
const header = document.querySelector(".header");
const obsCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};
const obsOptions = {
  root: null,
  threshold: 0.15,
  rootMargin: "-90px",
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);

//reveal sections
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  }
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
  rootMargin: "100px",
});
allSections.forEach((sec) => {
  sectionObserver.observe(sec);
  sec.classList.add("section--hidden");
});

//lazy loading images
const loadImg = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;
    //console.log("load Img");
    entry.target.addEventListener("load", function () {
      entry.target.classList.remove("lazy-img");
    });
    observer.unobserve(entry.target);
  }
};
const imgTargets = document.querySelectorAll("img[data-src]"); //包含data-src class的img标签
console.log(imgTargets);
const loadImageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});
imgTargets.forEach((el) => {
  loadImageObserver.observe(el);
});

//slider
let curSlide = 0;
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const btnLeft = document.querySelector(".btn-slide-left");
const btnRight = document.querySelector(".btn-slide-right");
const dotContainers = document.querySelector(".dots");
const dots = document.querySelectorAll(".dots__dot");

//根据slide数量动态创建原点
const createDots = function () {
  slides.forEach((s, i) => {
    dotContainers.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
const activateDot = function (slide) {
  document.querySelectorAll(".dots__dot").forEach((el) => {
    console.log("remove dota active");
    el.classList.remove("dots__dot--active");
  });
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};
createDots();
activateDot(curSlide);

slides.forEach((s, i) => {
  s.style.transform = `translateX(${i * 100}%)`;
});
const goToSlide = function (slideNum) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slideNum) * 100}%)`;
  });
};

const btnPreFun = function () {
  curSlide--;
  if (curSlide < 0) {
    curSlide = 2;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
const btnNextFun = function () {
  curSlide++;
  if (curSlide > 2) {
    curSlide = 0;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener("click", btnNextFun);
btnLeft.addEventListener("click", btnPreFun);
dotContainers.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const slideNum = e.target.dataset.slide;
    activateDot(slideNum);
    goToSlide(slideNum);
  }
});

// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// function debounce(fun, await) {
//   let timer;
//   return function () {
//     let _this = this;
//     let args = arguments;
//     if (timer) {
//       clearTimeout(timer);
//     }
//     timer = setTimeout(function () {
//       fun.apply(_this, args);
//     }, await);
//   };
// }
// const scrollSticky = function (e) {
//   console.log(window.scrollY);
//   console.log(initialCoords.top);
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// };
// window.addEventListener("scroll", debounce(scrollSticky, 500));
// const h1 = document.querySelector("h1");
// const logText = function (e) {
//   console.log("add Event Listener !");
//   //h1.removeEventListener("mouseenter", logText);
// };
// h1.addEventListener("mouseenter", logText);
// setTimeout(() => h1.removeEventListener("mouseenter", logText), 3000);

//btnScrollTo.addEventListener("click", function (e) {
//const s1coords = section1.getBoundingClientRect(); //获取坐标位置-相对于视窗
//console.log(s1coords);
//console.log(e.target.getBoundingClientRect()); //点击的坐标
//console.log(window.scrollX, window.scrollY);
//old way
//   window.scrollTo({
//     left: s1coords.left + window.screenX,
//     top: s1coords.top + window.scrollY,
//     behavior: "smooth",
//   });
//});

// h1.addEventListener("mouseenter", function (e) {
//   console.log("add Event Listener 2!");
// });

// h1.onmouseenter = function (e) {
//   console.log("add Event Listener !");
// };

//event bubbleing
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// //console.log(randomColor());

// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   console.log("child", e.target, e.currentTarget, this);
//   //关闭事件委托
//   e.stopPropagation();
// });

// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   console.log("parent", e.target, e.currentTarget, this);
// });
// document.querySelector(".nav").addEventListener("click", function (e) {
//   console.log("grandParent", e.target, e.currentTarget, this);
// });

//going downwards children
// const h1 = document.querySelector("h1");
// console.log(h1.querySelectorAll(".hightlight"));
// console.log(h1.childNodes);
// console.log(h1.children);

// //going upwards parent
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// console.log(h1.closest("header"));

// //going sideways
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.parentElement.children); //获取所有兄弟姐妹，包括自己
