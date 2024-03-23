import "./style.css";

// Slider Logic
const slideBtns = document.querySelectorAll("[data-slideBtn]");
const slideContainer = document.querySelector("[data-slideContainer]");
const slides = [...document.querySelectorAll("[data-slide]")];

let currentIndex = 0;
let isMoving = false;

function handleSliderBtnEvent(e) {
  // check if slider is already moving
  if (isMoving) return;
  isMoving = true;
  e.currentTarget.id === "prev" ? currentIndex-- : currentIndex++;

  slideContainer.dispatchEvent(new Event("moveSlider"));
}

const removeDisabledAttributes = (els) =>
  els.forEach((el) => el.removeAttribute("disabled"));
const addDisabledAttributes = (els) =>
  els.forEach((el) => el.setAttribute("disabled", "true"));

slideBtns.forEach((btn) => btn.addEventListener("click", handleSliderBtnEvent));

slideContainer.addEventListener("moveSlider", () => {
  // 1. transition
  slideContainer.style.transform = `translateX(-${currentIndex * slides[0].clientWidth}px)`;

  // 2. remove disabled attributes
  removeDisabledAttributes(slideBtns);

  // 3. add disabled if required
  currentIndex === 0 && addDisabledAttributes([slideBtns[0]]);
});

// transition end event
slideContainer.addEventListener("transitionend", () => (isMoving = false));

// disable image drag event
document
  .querySelectorAll("[data-slide] img")
  .forEach((img) => (img.ondragstart = () => false));

// intersection observer

const slideObserver = new IntersectionObserver(
  (slide) => {
    if (slide[0].isIntersecting) {
      addDisabledAttributes([slideBtns[1]]);
    }
  },
  {
    threshold: 0.75,
  },
);

slideObserver.observe(slides[slides.length - 1]);

// Fade up observer

function fadeUpObserverCallback(elements) {
  elements.forEach((el) => {
    if (el.isIntersecting) {
      el.target.classList.add("faded");
      fadeUpObserver.unobserve(el.target);
      el.target.addEventListener(
        "transitionend",
        () => {
          el.target.classList.remove("fade-up", "faded");
        },
        { once: true },
      );
    }
  });
}

const fadeUpObserverOptions = {
  threshold: 0.9,
};

const fadeUpObserver = new IntersectionObserver(
  fadeUpObserverCallback,
  fadeUpObserverOptions,
);

document.querySelectorAll(".fade-up").forEach((item) => {
  fadeUpObserver.observe(item);
});
