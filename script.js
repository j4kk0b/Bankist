'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('header');

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Page navigation
// document.querySelectorAll('.nav__link').forEach(link => {
//   link.addEventListener('click', e => {
//     e.preventDefault();
//     const id = link.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', e => {
  if (!e.target.classList.contains('active')) e.preventDefault();

  if (
    e.target.classList.contains('nav__link') &&
    e.target.getAttribute('href') !== '#'
  ) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

//Button scrolling
btnScrollTo.addEventListener('click', e => {
  // const s1coords = section1.getBoundingClientRect();

  //Scrolling
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

//Tabbed component

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  //Active Tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Active content area
  tabsContent.forEach(con => {
    if (
      con.classList.contains(
        `operations__content--${clicked.getAttribute('data-tab')}`
      )
    )
      con.classList.add('operations__content--active');
    else con.classList.remove('operations__content--active');
  });
});

//Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
  }
};

nav.addEventListener('mouseover', e => handleHover(e, 0.5));

nav.addEventListener('mouseout', e => handleHover(e, 1));

//Sticky navigation bar
const headerObserver = new IntersectionObserver(
  entry => {
    if (!entry[0].isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${nav.getBoundingClientRect().height}px`,
  }
);

headerObserver.observe(header);

//Reveal sections
const sectionObserver = new IntersectionObserver(
  (entries, observer) => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 0.15,
  }
);

[...document.querySelectorAll('.section')].forEach(sec => {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});

//Lazy loading images
const imgTargets = [...document.querySelectorAll('img[data-src]')];

const imgObserver = new IntersectionObserver(
  (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    //Replace placeholder img with original
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', () => {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  }
);

imgTargets.forEach(img => imgObserver.observe(img));

//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  //Next slide

  let curSlide = 0;
  const maxSlide = slides.length;

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (maxSlide - 1 <= curSlide) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activeDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide <= 0) curSlide = maxSlide - 1;
    else curSlide--;

    goToSlide(curSlide);
    activeDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  //Slider dots
  const dotContainer = document.querySelector('.dots');

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(d => d.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  dotContainer.addEventListener('click', e => {
    if (!e.target.classList.contains('dots__dot')) return;
    curSlide = e.target.dataset.slide;
    activeDot(curSlide);
    goToSlide(curSlide);
  });

  //Init slider
  const Init = function () {
    goToSlide(curSlide);
    createDots();
    activeDot(curSlide);
  };

  Init();
};
slider();
