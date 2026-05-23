/* main.js &mdash; Narrative Parallax Controller */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize smooth scrolling with Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential out
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Update ScrollTrigger on every Lenis scroll
lenis.on('scroll', ScrollTrigger.update);

// Link Lenis to the GSAP ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Helper to update active indicators (dots & desktop panel menu)
function updateActiveStates(progress) {
  // Determine active zone based on progress ranges
  // Zone 1: 0% to 25% -> progress [0.0, 0.25)
  // Zone 2: 25% to 50% -> progress [0.25, 0.50)
  // Zone 3: 50% to 75% -> progress [0.50, 0.75)
  // Zone 4: 75% to 100% -> progress [0.75, 1.0]
  let activeIndex = 0;
  if (progress >= 0.75) {
    activeIndex = 3;
  } else if (progress >= 0.50) {
    activeIndex = 2;
  } else if (progress >= 0.25) {
    activeIndex = 1;
  } else {
    activeIndex = 0;
  }
  
  // Update viewport dots
  const dots = document.querySelectorAll('.viewport-dots .dot');
  dots.forEach((dot, idx) => {
    if (idx === activeIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
  
  // Update desktop panel lists
  const panelItems = document.querySelectorAll('.zone-list .zone-item');
  panelItems.forEach((item, idx) => {
    if (idx === activeIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Set initial states for elements
function setInitialStates() {
  // Hide future zones off-screen
  gsap.set("#zone-2", { yPercent: 100 });
  gsap.set("#zone-3", { yPercent: 100 });
  gsap.set("#zone-4", { yPercent: 100 });
  
  // Set black screen cover
  gsap.set("#black-overlay", { opacity: 0 });
  
  // Hide all text cards except the first
  gsap.set(".text-card", { opacity: 0, y: 25 });
  gsap.set("#text-zone-1-sky", { opacity: 1, y: 0 });
  
  // Hide sequential elements in Zone 1 initially (at scroll = 0, only sky is visible)
  gsap.set("#img-sky", { opacity: 1, yPercent: 0 });
  gsap.set("#img-birds", { opacity: 0, yPercent: 40, xPercent: -15 });
  gsap.set("#img-mountain", { opacity: 0, yPercent: 40 });
  gsap.set("#img-tree", { opacity: 0, yPercent: 40 });
  gsap.set("#petals-container", { opacity: 0, yPercent: 0 });
  gsap.set("#img-deer", { opacity: 0, yPercent: 40 });

  // Scale Earth way up so it fills screen initially in Zone 4
  gsap.set("#img-earth", { 
    scale: 4.8, 
    transformOrigin: "center center" 
  });
  
  // Slightly zoom star backdrop for depth parallax
  gsap.set("#img-star", { 
    scale: 1.25, 
    transformOrigin: "center center" 
  });
}

// Build the GSAP ScrollTrigger timeline
function buildParallaxTimeline() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // Fluid follow scrub
      onUpdate: (self) => {
        updateActiveStates(self.progress);
      }
    }
  });

  // Base conceptual duration for timeline layout is 100 units

  // --- ZONE 1 SEQUENTIAL REVEAL & PARALLAX (Progress 0 to 25) ---
  
  // Fade out Scroll Prompt at the beginning
  tl.to(".scroll-prompt-container", {
    opacity: 0,
    duration: 3,
    ease: "power1.inOut"
  }, 0);

  // 1. Sky (visible at start)
  // Fade out Sky Text Card
  tl.to("#text-zone-1-sky", {
    opacity: 0,
    y: -25,
    duration: 3,
    ease: "power1.inOut"
  }, 3); // fades out between 3 and 6

  // Sky image slow scroll (moves continuously)
  tl.to("#img-sky", { yPercent: -20, ease: "none", duration: 35 }, 0);

  // 2. Birds fly/fade in (5 to 10)
  tl.to("#img-birds", { 
    opacity: 1, 
    yPercent: 0, 
    xPercent: 0, 
    ease: "power1.out", 
    duration: 4 
  }, 5);
  // Birds text card fades in
  tl.to("#text-zone-1-birds", {
    opacity: 1,
    y: 0,
    duration: 2.5,
    ease: "power1.out"
  }, 5.5);
  // Birds text card fades out
  tl.to("#text-zone-1-birds", {
    opacity: 0,
    y: -25,
    duration: 2,
    ease: "power1.in"
  }, 8.5);
  // Birds continue parallax scrolling after entry
  tl.to("#img-birds", { yPercent: -55, xPercent: 15, ease: "none", duration: 25 }, 10);

  // 3. Mountain slides up and fades in (10 to 15)
  tl.to("#img-mountain", { 
    opacity: 1, 
    yPercent: 0, 
    ease: "power1.out", 
    duration: 4 
  }, 10);
  // Mountain text card fades in
  tl.to("#text-zone-1-mountain", {
    opacity: 1,
    y: 0,
    duration: 2.5,
    ease: "power1.out"
  }, 10.5);
  // Mountain text card fades out
  tl.to("#text-zone-1-mountain", {
    opacity: 0,
    y: -25,
    duration: 2,
    ease: "power1.in"
  }, 13.5);
  // Mountain continues parallax scrolling after entry
  tl.to("#img-mountain", { yPercent: -35, ease: "none", duration: 21 }, 14);

  // 4. Tree slides up and fades in (15 to 20)
  tl.to("#img-tree", { 
    opacity: 1, 
    yPercent: 0, 
    ease: "power1.out", 
    duration: 4 
  }, 15);
  // Petals container fades in with the tree
  tl.to("#petals-container", {
    opacity: 1,
    ease: "power1.out",
    duration: 3
  }, 15.5);
  // Tree text card fades in
  tl.to("#text-zone-1-tree", {
    opacity: 1,
    y: 0,
    duration: 2.5,
    ease: "power1.out"
  }, 15.5);
  // Tree text card fades out
  tl.to("#text-zone-1-tree", {
    opacity: 0,
    y: -25,
    duration: 2,
    ease: "power1.in"
  }, 18.5);
  // Tree & petals continue parallax scrolling after entry
  tl.to("#img-tree", { yPercent: -75, ease: "none", duration: 17 }, 19);
  tl.to("#petals-container", { yPercent: -75, ease: "none", duration: 17 }, 19);

  // 5. Deer slides up and fades in (20 to 25)
  tl.to("#img-deer", { 
    opacity: 1, 
    yPercent: 0, 
    ease: "power1.out", 
    duration: 4 
  }, 20);
  // Deer text card fades in
  tl.to("#text-zone-1-deer", {
    opacity: 1,
    y: 0,
    duration: 2.5,
    ease: "power1.out"
  }, 20.5);
  // Deer text card fades out
  tl.to("#text-zone-1-deer", {
    opacity: 0,
    y: -25,
    duration: 2,
    ease: "power1.in"
  }, 25);
  // Deer continues parallax scrolling after entry
  tl.to("#img-deer", { yPercent: -110, ease: "none", duration: 12 }, 24);


  // --- ZONE 2 TRANSITIONS & PARALLAX (Progress 25 to 50) ---

  // Slide up Zone 2 Strata
  tl.to("#zone-2", {
    yPercent: 0,
    ease: "none",
    duration: 15
  }, 25); // slides up between 25 and 40

  // Entrance parallax for Root layer (slides in faster than soil)
  tl.fromTo("#img-root", 
    { yPercent: 40 }, 
    { yPercent: 0, ease: "none", duration: 15 }, 
    25
  );

  // Fade in Zone 2 Text Card
  tl.to("#text-zone-2", {
    opacity: 1,
    y: 0,
    duration: 4,
    ease: "power1.out"
  }, 33); // enters as Zone 2 is covering the screen

  // Fade out Zone 2 Text Card
  tl.to("#text-zone-2", {
    opacity: 0,
    y: -25,
    duration: 4,
    ease: "power1.inOut"
  }, 44);

  // Parallax Zone 2 elements
  tl.to("#img-soil", { yPercent: -30, ease: "none", duration: 25 }, 40);
  tl.to("#img-root", { yPercent: -60, ease: "none", duration: 25 }, 40);


  // --- ZONE 3 TRANSITIONS & PARALLAX (Progress 50 to 75) ---

  // Slide up Zone 3 Magma
  tl.to("#zone-3", {
    yPercent: 0,
    ease: "none",
    duration: 15
  }, 50); // slides up between 50 and 65

  // Entrance parallax for Magma layer
  tl.fromTo("#img-magma", 
    { yPercent: 20 }, 
    { yPercent: 0, ease: "none", duration: 15 }, 
    50
  );

  // Fade in Zone 3 Text Card
  tl.to("#text-zone-3", {
    opacity: 1,
    y: 0,
    duration: 4,
    ease: "power1.out"
  }, 58);

  // Fade out Zone 3 Text Card
  tl.to("#text-zone-3", {
    opacity: 0,
    y: -25,
    duration: 4,
    ease: "power1.inOut"
  }, 69);

  // Parallax Zone 3 magma upwards
  tl.to("#img-magma", { yPercent: -40, ease: "none", duration: 15 }, 65);

  // Fade to black overlay
  tl.to("#black-overlay", {
    opacity: 1,
    duration: 8,
    ease: "power1.inOut"
  }, 70); // fully black around 78

  // Position Zone 4 while hidden in black
  tl.to("#zone-4", {
    yPercent: 0,
    ease: "none",
    duration: 1
  }, 78);

  // Fade black overlay out
  tl.to("#black-overlay", {
    opacity: 0,
    duration: 8,
    ease: "power1.inOut"
  }, 79); // fully revealed by 87


  // --- ZONE 4 TRANSITIONS & ANIMATIONS (Progress 75 to 100) ---

  // Zoom star backdrop down slightly for endless cosmic depth feel
  tl.to("#img-star", {
    scale: 1.0,
    ease: "power1.out",
    duration: 21
  }, 79);

  // Scale down Earth from massive viewport filler to isolated blue sphere
  tl.to("#img-earth", {
    scale: 0.35,
    ease: "power2.out",
    duration: 21
  }, 79);

  // Fade in Zone 4 Text Card
  tl.to("#text-zone-4", {
    opacity: 1,
    y: 0,
    duration: 8,
    ease: "power1.out"
  }, 84);
}

// Particle Generator for Rose Petals (Bonus Effect)
function initRosePetals() {
  const container = document.getElementById('petals-container');
  if (!container) return;

  const petalCount = 30;
  for (let i = 0; i < petalCount; i++) {
    createPetal(container, true); // true to randomize initial y position
  }
}

function createPetal(container, randomY = false) {
  const petal = document.createElement('div');
  petal.classList.add('petal');

  // Random sizes and opacities
  const size = Math.random() * 8 + 6; // 6px to 14px
  const opacity = Math.random() * 0.55 + 0.45;
  const startX = Math.random() * 100; // 0% to 100% of container width
  const startY = randomY ? Math.random() * 100 : -10; // start off-screen or random y

  petal.style.width = `${size}px`;
  petal.style.height = `${size}px`;
  petal.style.opacity = opacity;
  petal.style.left = `${startX}%`;
  petal.style.top = `${startY}%`;

  // Rose color gradient shades
  const colors = [
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // light rose
    'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', // pink rose
    'linear-gradient(135deg, #f43f5e 0%, #fda4af 100%)', // rose red
    'linear-gradient(135deg, #ec4899 0%, #fbcfe8 100%)'  // magenta pink
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  petal.style.background = color;

  // Add initial random rotation and scale
  const scale = Math.random() * 0.6 + 0.6;
  const initialRotate = Math.random() * 360;
  petal.style.transform = `rotate(${initialRotate}deg) scale(${scale})`;

  container.appendChild(petal);

  const duration = Math.random() * 7 + 5; // 5s to 12s
  const swayAmount = Math.random() * 45 + 15; // 15px to 60px
  const rotateAmount = Math.random() * 360 + 180; // degrees to spin
  const swayDirection = Math.random() > 0.5 ? 1 : -1;

  // Drift down
  gsap.to(petal, {
    y: '105vh',
    rotation: `+=${rotateAmount}`,
    duration: duration,
    ease: "none",
    onComplete: () => {
      petal.remove();
      createPetal(container, false); // spawn a new one from the top
    }
  });

  // Horizontal sway
  gsap.to(petal, {
    x: swayDirection * swayAmount,
    yoyo: true,
    repeat: -1,
    duration: Math.random() * 2.5 + 1.5,
    ease: "sine.inOut"
  });
}

// Navigation click handlers
function initNavigation() {
  const dots = document.querySelectorAll('.viewport-dots .dot');
  const panelItems = document.querySelectorAll('.zone-list .zone-item');

  function getScrollPosition(zoneIndex) {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const maxScroll = scrollHeight - clientHeight;
    // Map index 0->0%, 1->25%, 2->50%, 3->75% of maxScroll
    return (zoneIndex / 4) * scrollHeight;
  }

  function handleNavigation(zoneIndex) {
    const targetScroll = getScrollPosition(zoneIndex);
    lenis.scrollTo(targetScroll, {
      duration: 1.5,
      // custom easing
      ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => handleNavigation(idx));
  });

  panelItems.forEach((item, idx) => {
    item.addEventListener('click', () => handleNavigation(idx));
  });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  setInitialStates();
  buildParallaxTimeline();
  initRosePetals();
  initNavigation();
  
  // Force scroll trigger refresh to align markers
  ScrollTrigger.refresh();
});
