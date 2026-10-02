"use strict";

/* =========================
PAGE LOADER
========================= */

window.addEventListener("load", () => {
const loader = document.getElementById("pageLoader");

setTimeout(() => {
loader?.classList.add("hide");
}, 350);
});

/* =========================
THEME
========================= */

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.querySelector(".theme-icon");

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {
root.classList.add("light");
}

function updateThemeIcon() {
if (!themeIcon) return;

themeIcon.textContent = root.classList.contains("light")
? "☾"
: "☼";
}

updateThemeIcon();

themeToggle?.addEventListener("click", () => {

root.classList.toggle("light");

const theme = root.classList.contains("light")
? "light"
: "dark";

localStorage.setItem("portfolio-theme", theme);

updateThemeIcon();
});

/* =========================
MOBILE NAVIGATION
========================= */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle?.addEventListener("click", () => {

const isOpen = nav.classList.toggle("open");

menuToggle.setAttribute(
"aria-expanded",
String(isOpen)
);
});

document.querySelectorAll(".nav a").forEach(link => {

link.addEventListener("click", () => {


nav.classList.remove("open");

menuToggle?.setAttribute(
  "aria-expanded",
  "false"
);


});

});

/* =========================
SCROLL REVEAL
========================= */

const revealObserver = new IntersectionObserver(

entries => {

entries.forEach(entry => {

  if (entry.isIntersecting) {

    entry.target.classList.add("show");

    revealObserver.unobserve(entry.target);

  }

});


},

{
threshold: 0.1,
rootMargin: "0px 0px -40px 0px"
}

);

document
.querySelectorAll(".reveal")
.forEach(element => {
revealObserver.observe(element);
});

/* =========================
ACTIVE NAV + HEADER
========================= */

const sections = [
...document.querySelectorAll("main section[id]")
];

const links = [
...document.querySelectorAll(".nav a")
];

const header = document.getElementById("header");
const backTop = document.getElementById("backTop");

function updateScrollUI() {

const scrollPosition = window.scrollY;

header?.classList.toggle(
"scrolled",
scrollPosition > 30
);

backTop?.classList.toggle(
"show",
scrollPosition > 500
);

let current = "home";

sections.forEach(section => {

const sectionTop =
  section.offsetTop - 180;

if (scrollPosition >= sectionTop) {
  current = section.id;
}

});

links.forEach(link => {

link.classList.toggle(
  "active",
  link.getAttribute("href") === `#${current}`
);

});

}

window.addEventListener(
"scroll",
updateScrollUI,
{ passive: true }
);

updateScrollUI();

/* =========================
BACK TO TOP
========================= */

backTop?.addEventListener("click", () => {

window.scrollTo({
top: 0,
behavior: "smooth"
});

});

/* =========================
CURSOR GLOW
========================= */

const cursorGlow =
document.getElementById("cursorGlow");

if (
cursorGlow &&
window.matchMedia("(pointer:fine)").matches
) {

let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;

document.addEventListener("mousemove", event => {


mouseX = event.clientX;
mouseY = event.clientY;


});

function animateGlow() {

glowX += (mouseX - glowX) * 0.08;
glowY += (mouseY - glowY) * 0.08;

cursorGlow.style.left = `${glowX}px`;
cursorGlow.style.top = `${glowY}px`;

requestAnimationFrame(animateGlow);

}

animateGlow();
}

/* =========================
CONTACT FORM
========================= */

const contactForm =
document.getElementById("contactForm");

const formStatus =
document.getElementById("formStatus");

contactForm?.addEventListener("submit", () => {

if (formStatus) {

formStatus.style.display = "block";

formStatus.textContent =
  "Sending your message…";


}

});

/* =========================
CURRENT YEAR
========================= */

const year =
document.getElementById("year");

if (year) {
year.textContent =
new Date().getFullYear();
}

/* =========================
PREVENT EMPTY FORM
========================= */

contactForm?.addEventListener("input", event => {

if (
event.target.matches("input, textarea") &&
formStatus
) {
formStatus.style.display = "none";
}

});
