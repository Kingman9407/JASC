document.addEventListener('DOMContentLoaded', function () {
    // ==== SELECTORS ====
    const parallaxSection = document.getElementById('parallaxSection');
    const imageReveal = document.getElementById('imageReveal');
    const imageContainer = document.getElementById('imageContainer');
    const textContent = document.getElementById('textContent');
    const darkContent = document.getElementById('darkContent');
    const lightContent = document.getElementById('lightContent');
    const mainHeading = document.getElementById('mainHeading');
    const subHeading = document.getElementById('subHeading');
    const ctaButton = document.getElementById('ctaButton');
    const fadeInElements = document.querySelectorAll('.opacity-0.transition-all.duration-800');
    const parallaxImage = document.getElementById('parallaxImage');
    const parallaxSectionAlt = document.querySelector('.parallax-section');
    const parallaxOverlay = document.getElementById('parallaxOverlay');
    const mobileHamburger = document.querySelector('.hamburger-menu');
    const mobileNavLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    const body = document.body;

    function initializeNavigation() {
        // Desktop hover functionality
        navItems.forEach(item => {
            const navLink = item.querySelector('.nav-link');
            const subMenu = item.querySelector('.sub-menu');

            if (subMenu) {
                // === Desktop hover ===
                item.addEventListener("mouseenter", function () {
                    if (window.innerWidth > 768) {
                        navItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                const otherSubMenu = otherItem.querySelector(".sub-menu");
                                if (otherSubMenu) {
                                    otherSubMenu.style.opacity = "0";
                                    otherSubMenu.style.visibility = "hidden";
                                }
                            }
                        });

                        subMenu.style.opacity = "1";
                        subMenu.style.visibility = "visible";
                        subMenu.style.transform = "translateY(0)";
                    }
                });

                item.addEventListener("mouseleave", function() {
                    if (window.innerWidth > 768) {
                        subMenu.style.opacity = "0";
                        subMenu.style.visibility = "hidden";
                    }
                });

                // === Mobile toggle for submenu visibility ===
                navLink.addEventListener("click", function (e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault(); // Prevent navigation on first click (just toggles submenu)
                        
                        const wasActive = item.classList.contains('active');
                        
                        // Close other submenus
                        navItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                                const otherSubMenu = otherItem.querySelector('.sub-menu');
                                if (otherSubMenu) {
                                    otherSubMenu.style.visibility = "hidden";
                                    otherSubMenu.style.opacity = "0";
                                    otherSubMenu.style.maxHeight = "0";
                                }
                            }
                        });
                        
                        if (wasActive) {
                            // If already open, toggle closed
                            item.classList.remove('active');
                            if (subMenu) {
                                subMenu.style.visibility = "hidden";
                                subMenu.style.opacity = "0";
                                subMenu.style.maxHeight = "0";
                            }
                        } else {
                            // If closed, open it
                            item.classList.add('active');
                            if (subMenu) {
                                subMenu.style.visibility = "visible";
                                subMenu.style.opacity = "1";
                                subMenu.style.maxHeight = "500px";
                            }
                        }
                    }
                });
            }
        });

        // Submenu links click handling - CRITICAL FIX
        document.querySelectorAll('.dropdown-links a').forEach(link => {
            link.addEventListener('click', function(e) {
                const targetPageId = this.getAttribute('href');
                
                // Always close mobile menu
                mobileHamburger?.classList.remove('active');
                mobileNavLinks?.classList.remove('active');
                body.style.overflow = '';
                navItems.forEach(item => item.classList.remove('active'));
                
                // For hash links, handle with dynamic page system
                if (targetPageId.startsWith('#')) {
                    e.preventDefault();
                    
                    // Call the existing switchPage function
                    switchPage(targetPageId);
                    
                    // After switching pages, scroll to section if needed
                    setTimeout(() => {
                        const targetElement = document.querySelector(targetPageId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 400);
                }
                // For external links, let default behavior happen
            });
        });

        // Toggle mobile menu
        if (mobileHamburger) {
            mobileHamburger.addEventListener('click', function () {
                mobileHamburger.classList.toggle('active');
                mobileNavLinks.classList.toggle('active');
                body.style.overflow = mobileNavLinks.classList.contains('active') ? 'hidden' : '';
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (mobileNavLinks && mobileNavLinks.classList.contains('active') && 
                !mobileHamburger?.contains(event.target) &&
                !mobileNavLinks?.contains(event.target)) {
                mobileHamburger?.classList.remove('active');
                mobileNavLinks.classList.remove('active');
                body.style.overflow = '';
                navItems.forEach(item => item.classList.remove('active'));
            }
        });
    }

    function isElementInView(element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= (window.innerHeight * 0.8) && rect.bottom >= 0;
    }

    window.addEventListener('scroll', function () {
        fadeInElements.forEach(function (element) {
            if (isElementInView(element)) {
                element.classList.remove('opacity-0', 'translate-y-5');
                element.classList.add('opacity-100', 'translate-y-0');
            }
        });

        if (parallaxImage && parallaxSectionAlt) {
            const sectionRect = parallaxSectionAlt.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const sectionHeight = parallaxSectionAlt.offsetHeight;

            const scrollProgress = Math.max(0, -sectionRect.top / (sectionHeight - viewportHeight));

            if (scrollProgress >= 0 && scrollProgress <= 1.5) {
                const easedProgress = scrollProgress < 0.5
                    ? 2 * scrollProgress * scrollProgress
                    : -1 + (4 - 2 * scrollProgress) * scrollProgress;

                const scale = 0.7 + (easedProgress * 0.35);
                const translateY = -easedProgress * 20;

                parallaxImage.style.transform = `translateY(${translateY}px) scale(${scale})`;

                if (parallaxOverlay) {
                    const overlayOpacity = Math.min(scrollProgress * 2, 1);
                    parallaxOverlay.style.opacity = overlayOpacity;
                    const overlayTranslateY = -50 + (scrollProgress * 5);
                    parallaxOverlay.style.transform = `translate(-50%, ${overlayTranslateY}%)`;
                }
            }
        }

        if (parallaxSection) {
            const rect = parallaxSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;

            let scrollProgress = (-sectionTop + (sectionHeight * 0.5)) / sectionHeight;
            scrollProgress = Math.max(0, Math.min(1, scrollProgress));

            if (imageContainer) {
                if (scrollProgress >= 0 && scrollProgress <= 1.5) {
                    const zoomProgress = Math.min(1, scrollProgress * 2);
                    const scale = 0.5 + (zoomProgress * 0.5);
                    imageContainer.querySelector('img').style.transform = `scale(${scale})`;

                    const textContainer = document.getElementById('textContainer');
                    if (textContainer) {
                        const translateY = scrollProgress * 80;
                        textContainer.style.transform = `translateY(${translateY}vh)`;
                    }

                    if (scrollProgress > 0.3) {
                        const revealPercent = Math.min(100, ((scrollProgress - 0.3) * 150));
                        if (revealPercent > 60) {
                            mainHeading?.classList.remove('text-green-500');
                            mainHeading?.classList.add('text-[#F5F5DC]');
                            subHeading?.classList.remove('text-green-500');
                            subHeading?.classList.add('text-[#F5F5DC]');
                        } else {
                            mainHeading?.classList.remove('text-[#F5F5DC]');
                            mainHeading?.classList.add('text-green-500');
                            subHeading?.classList.remove('text-[#F5F5DC]');
                            subHeading?.classList.add('text-green-500');
                        }
                    }
                }
            }
        }

        checkCounterContainer();
        checkCounters();
    });

    function animateCounter(counter, target) {
        let count = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        function updateCount() {
            count += increment;
            if (count >= target) {
                counter.textContent = Math.floor(target) + "+";
                return;
            }
            counter.textContent = Math.floor(count) + "+";
            requestAnimationFrame(updateCount);
        }

        updateCount();
    }

    function checkCounters() {
        const counterElements = document.querySelectorAll('.counter');
        counterElements.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            if (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom >= 0 &&
                !counter.classList.contains('counted')
            ) {
                const target = parseInt(counter.getAttribute('data-target'));
                counter.classList.add('counted');
                animateCounter(counter, target);
            }
        });
    }

    function checkCounterContainer() {
        const counterContainer = document.querySelector('.counter-container');
        if (counterContainer && isElementInView(counterContainer)) {
            counterContainer.classList.remove('hidden');
            counterContainer.classList.add('show');
        }
    }

    function animatePageTransition(targetPage) {
        targetPage.style.opacity = '0';
        targetPage.style.display = 'block';

        setTimeout(() => {
            targetPage.style.transition = 'opacity 0.4s ease';
            targetPage.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            targetPage.style.transition = '';
        }, 450);
    }

    function switchPage(targetPageId) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });

        const targetPage = document.querySelector(targetPageId);
        if (targetPage) {
            animatePageTransition(targetPage);

            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === targetPageId) {
                    link.classList.add('active');
                }
            });

            history.pushState(null, null, targetPageId);
        }
    }

    function loadInitialPage() {
        const hash = window.location.hash || '#home-page';
        switchPage(hash);
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetPageId = this.getAttribute('href');
            if (targetPageId.startsWith('#')) {
                e.preventDefault();
                switchPage(targetPageId);
            }
        });
    });

    window.addEventListener('popstate', function () {
        loadInitialPage();
    });

    document.querySelectorAll('a[href^="#"]:not(.nav-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            mobileNavLinks?.classList.remove('active');
            mobileHamburger?.classList.remove('active');
            body.style.overflow = '';
            navItems.forEach(item => item.classList.remove('active'));
        }
    });

    // Initialize navigation
    initializeNavigation();
    
    window.dispatchEvent(new Event('scroll'));
    loadInitialPage();
});
// Initialize ScrollyVideo
// ScrollyVideo.js CDN link (include this in your HTML head)
// <script src="https://cdn.jsdelivr.net/npm/scrolly-video@latest/dist/scrolly-video.js"></script>
// ScrollyVideo.js CDN link (include this in your HTML head)
// <script src="https://cdn.jsdelivr.net/npm/scrolly-video@latest/dist/scrolly-video.js"></script>

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize ScrollyVideo with online video
  const scrollyVideo = new ScrollyVideo({
    scrollyVideoContainer: '.holder',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    // Use playbackRate method for smooth forward scrolling
    useWebCodecs: false,
    // Adjust these values for performance
    transitionSpeed: 6,
    frameThreshold: 0.1,
    // Make sure video covers the container
    cover: true,
    // Enable responsive behavior
    responsive: true,
    // Debug mode to see what's happening
    debug: true
  });
  
  // Optional: Add error handling
  scrollyVideo.onError = function(error) {
    console.error('ScrollyVideo Error:', error);
  };
  
  // Optional: Add ready callback
  scrollyVideo.onReady = function() {
    console.log('ScrollyVideo is ready');
  };
})
// <script src="https://unpkg.com/scrolly-video@latest/dist/scrolly-video.js"></script>

document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit more to ensure DOM is fully ready
  setTimeout(() => {
    // Get the DOM element directly
    const holderElement = document.querySelector('section.vid .holder');
    
    if (holderElement) {
      console.log('Holder element found:', holderElement);
      
      // Initialize ScrollyVideo with the DOM element (not selector string)
      const scrollyVideo = new ScrollyVideo({
        scrollyVideoContainer: holderElement, // Pass the actual DOM element
        src: 'n1.mp4',
        // Use playbackRate method for smooth forward scrolling
        useWebCodecs: false,
        // Adjust these values for performance
        transitionSpeed: 6,
        frameThreshold: 0.1,
        // Make sure video covers the container
        cover: true,
        // Enable responsive behavior
        responsive: true,
        // Debug mode to see what's happening
        debug: true
      });
      
      // Optional: Add error handling
      if (scrollyVideo.onError) {
        scrollyVideo.onError = function(error) {
          console.error('ScrollyVideo Error:', error);
        };
      }
      
      // Optional: Add ready callback
      if (scrollyVideo.onReady) {
        scrollyVideo.onReady = function() {
          console.log('ScrollyVideo is ready');
        };
      }
    } else {
      console.error('Could not find .holder element');
    }
  }, 100);
});
// <script src="https://unpkg.com/scrolly-video@latest/dist/scrolly-video.js"></script>

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize ScrollyVideo
  const scrollyVideo = new ScrollyVideo({
    scrollyVideoContainer: 'section.vid .holder',
    src: 'n1.mp4',
    transitionSpeed: 6,
    frameThreshold: 0.1
  });
});

let slideIndex = 0;
            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.dot');
            
            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                });
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
            
            function currentSlide(index) {
                slideIndex = index - 1;
                showSlide(slideIndex);
            }
            
            function autoSlide() {
                slideIndex = (slideIndex + 1) % slides.length;
                showSlide(slideIndex);
            }
            
            // Auto-advance slides every 4 seconds
            setInterval(autoSlide, 4000);