'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContents = document.querySelectorAll('.operations__content');
const menuNav = document.querySelector('nav');
const links = document.querySelectorAll('.nav__link');
const ulLinks = document.querySelector('.nav__links');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const scrollBtn = document.querySelector('.scrollTopBtn');
const header = document.querySelector('header');
const allSections = document.querySelectorAll('.section');
const allImgs = document.querySelectorAll('img[data-src]');
const slider = document.querySelector('.slider');
const allSlides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


// Nav links
// Implementing scrolling on nav using Delegation (on the parent element(that hold the links)): (saves time and performance)
// 1. Add event listener to common parent element
// 2. Determine what element origanated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Mathcing strategy (to egnore the clicks outside the links)
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});


// // Operations tabbed
// const btns = document.querySelectorAll('.operations__tab-container button');
// const content = document.querySelectorAll('.operations__content');
// btns.forEach(function (btn, i) {
//   btn.addEventListener('click', function (e) {
//     content.forEach(function (contentc) {
//       btn.classList.remove('operations__tab--active');
//       contentc.classList.remove('operations__content--active');
//     })
//     content[i].classList.add('operations__content--active');
//     btn.classList.add('operations__tab--active');
//   });
// });

// Tabs Operation
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // I click on anything but not the btn (Guard condition (null))
  if (!clicked) return;

  // Removing active class
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContents.forEach(content => content.classList.remove('operations__content--active'));

  // Adding active class
  // 1.
  // tabs[clicked.dataset.tab - 1].classList.add('operations__tab--active');
  // tabsContents[clicked.dataset.tab - 1].classList.add('operations__content--active');

  // 2.
  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

// Menu hovering animation
const linksHoverAnimation = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== e.target) el.style.opacity = this;
    });
    logo.style.opacity = this;
    // this === opacity
  }
}
menuNav.addEventListener('mouseover', linksHoverAnimation.bind(0.5));
menuNav.addEventListener('mouseout', linksHoverAnimation.bind(1));
// menuNav.addEventListener('mouseover', function (e) {
//   linksHoverAnimation(e, 0.5);
// })
// menuNav.addEventListener('mouseout', function (e) {
//   linksHoverAnimation(e, 1);
// })


// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// Not good way
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) menuNav.classList.add('sticky');
//   else menuNav.classList.remove('sticky')
// })


// Using Intersecting API
const navHeight = menuNav.getBoundingClientRect().height;
console.log(navHeight);
const stickyNav = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) {
    menuNav.classList.add('sticky');
    menuNav.style.transition = '0.5s';
  }
  else menuNav.classList.remove('sticky');
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // To make it with all sections
  threshold: 0, // When the observer will work (if 0.15 => 15% before the section)
  rootMargin: `-${navHeight}px`,  // When the heights are the same
});
headerObserver.observe(header);


// Reveal sections
const seeSection = function (entries, observer) {
  // const entry=entries[0];
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  // To remove the observer form the element after itersecting with it (enhance performance)
  observer.unobserve(entry.target);
}
const sectionObserver = new IntersectionObserver(seeSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});


// Lazy loading images
const seeImg = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  // When the image loads => remove the lazy-img class
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // To remove the observer form the element after itersecting with it (enhance performance)
  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(seeImg, {
  root: null,
  // threshold: 0,
  threshold: 1,
  rootMargin: '200px', // To load img befoer the intersecting (if the user has a slow internet)
});
allImgs.forEach(img => imgObserver.observe(img));


// Implementing slider

const sliderFunction = function () {
  let curSlide = 0;
  const slidesLength = allSlides.length;

  // Functions
  const createDots = function () {
    allSlides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };
  const activeDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }
  // Updating slides translateX
  const goToSlide = function (slide) {
    allSlides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  }
  const init = function () {
    // For the time (0)
    goToSlide(0);
    createDots();
    activeDot(0);
  }
  init();
  // Next slide
  const nextSlide = function () {
    if (curSlide === slidesLength - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activeDot(curSlide);
  }
  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = slidesLength - 1;
    else curSlide--;
    goToSlide(curSlide);
    activeDot(curSlide);
  }

  // Event Listeners
  // Handle the clicks
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  // Arrows left and right click
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); // Short circuiting (remember) true && true
  });
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
};
sliderFunction();
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


// Selecting elements
console.log(document.documentElement); // html tag
console.log(document.head);
console.log(document.body);


const allSections2 = document.querySelectorAll('.section'); // As a NODE (Will not be updated if I deleted a section)
console.log(allSections2);

document.getElementById('section--1');
const allBtns = document.getElementsByTagName('button');
console.log(allBtns); // As a HTMLCollection (Will be updated if I deleted a btn)
console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
const message = document.createElement('div') // Tag type
message.classList.add('cookie-message');
// message.textContent = 'We are using cookies. <button class="btn btn--close-cookie">Got it!</button>';
message.innerHTML = 'We are using cookies. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message); // Add the element as a first one of the header elements
// header.append(message); // Add the element as a last one of the header elements
// It can not be in both positions
// header.append(message.cloneNode(true)); // To make multiple copies

// header.before(message) // Add the element right before the header (siblings)
// header.after(message) // Add the element right after the header (siblings)

// Deleting elements
// document.querySelector('.btn--close-cookie').addEventListener('click', function () {
//   message.remove();

//   // Old way of removing elements
//   // message.parentElement.removeChild(message);
// });


// Styles
message.style.backgroundColor = '#37383d'; // Inline styles
message.style.width = '100%'; // Inline styles

console.log(message.style.height); // Empty becasue it is not in the inline style
console.log(message.style.backgroundColor); // Will work

// Getting the element css property
console.log(getComputedStyle(message).height); // Will work (Computed means the style on the page)
console.log(getComputedStyle(message).color); // Will work (Computed means the style on the page)

// Adding more height
message.style.height = Number.parseFloat(getComputedStyle(message).height) + 20 + 'px'; // Using parseFloat to seperate the number form the unit

// Changing the custom property (CSS variables)
// const userClr = prompt('What is your color: ')
// document.documentElement.style.setProperty('--color-primary', userClr);
document.documentElement.style.setProperty('--color-primary', 'orangered');


// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautiful logo';

console.log(logo.designer); // Non-standard property
console.log(logo.getAttribute('designer'));

// Set attribute or create attribute
logo.setAttribute('Company', 'Bankist');

console.log(logo.src); // Absolute
console.log(logo.getAttribute('src')); // Getting as it is in html // Relative

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href')); // getAttribute returns the text thai I wrote in html text

// Data attributes
console.log(logo.dataset.versionNumber);

// Classses
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c', 'j');
logo.classList.contains('c');


// Implementing scroll to
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); // Not that good
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect()); // Better way

  // Getting current scrolling
  // console.log('Current scroll (x/y)', window.pageXOffset, window.pageYOffset);

  // Getting the viewport coords
  // console.log('height/width', document.documentElement.clientHeight, document.documentElement.clientWidth);

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // )


  // Old school of scrolling
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });


  // NEW WAY
  section1.scrollIntoView({ behavior: 'smooth' }); // Just this line will mater for scrolling (apply it on the element that I want to scroll to)
});

scrollBtn.addEventListener('click', function () {
  // 1. // Select the element that you want to scrill to
  document.documentElement.scrollIntoView({ behavior: 'smooth' });

  // 2.
  // window.pageYOffset = 0;
  // window.scrollTo({
  //   left: window.pageXOffset,
  //   top: window.pageYOffset,
  //   behavior: 'smooth',
  // });
});


// Event Listeners
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('Event listener: reading');

//   h1.removeEventListener('mouseenter', alertH1); // Removed after the first time
// };

// h1.addEventListener('mouseenter', alertH1); // Modern way
// h1.onmouseenter = alertH1; // Old way


// Random background color
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Link', e.target, e.currentTarget);
//   // e.target => shows the the element that has been clicked

//   // Stop propagation
//   // e.stopPropagation();
// });
// // If I click on the child, that means I have clicked on the parent as well
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Links', e.target, e.currentTarget);
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Nav', e.target, e.currentTarget);
// }, true);
// The third parameter it is false by default => true will give it the effect first

// By default the addEventlistener will give all the parent the same effect
// To stop it e.stopPropagation();


// Implementing scrolling on nav
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });


// DOM Traversing
const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards
console.log(h1.parentNode);
console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-secondary)';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// not common used
console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children); // select all siblings of h1
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });


// Might help handlers
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page Fully Loaded (html, css, js)', e);
});


// Good when I have a page with information, but bot for any page
// window.addEventListener('beforeunload', function (e) {
//   // beforeunload => before the user leaves the page
//   e.preventDefault(); // Some browsers requirs it
//   console.log(e);
//   e.returnValue = '';
// });