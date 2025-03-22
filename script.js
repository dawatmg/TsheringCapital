/**
 * Optimized JavaScript for website
 * Features modern practices like:
 * - ES6+ syntax
 * - Event delegation
 * - Performance optimization
 * - Lazy loading
 * - Intersection Observer API
 */

// Use IIFE to avoid polluting global namespace
(function() {
  'use strict';
  
  // DOM elements cache
  const DOM = {};
  
  // Configuration
  const CONFIG = {
    animationThreshold: 0.2,
    scrollOffset: 100,
    headerHeight: 0, // Will be calculated on init
    mobileBreakpoint: 768
  };
  
  /**
   * Initialize the application when DOM is ready
   */
  function init() {
    // Cache DOM elements for better performance
    cacheDOM();
    
    // Set initial state
    CONFIG.headerHeight = DOM.header.offsetHeight;
    
    // Register event listeners
    bindEvents();
    
    // Set up scroll animations
    setupScrollAnimations();
    
    // Apply initial styles
    updateHeaderOnScroll();
    
    // Set up form validation
    if (DOM.contactForm) {
      setupFormValidation();
    }
    
    // Mark initialization as complete
    document.documentElement.classList.add('js-loaded');
  }
  
  /**
   * Cache DOM elements for better performance
   */
  function cacheDOM() {
    DOM.header = document.querySelector('.header');
    DOM.navLinks = document.querySelectorAll('a[href^="#"]');
    DOM.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    DOM.nav = document.querySelector('nav');
    DOM.contactForm = document.getElementById('contactForm');
    DOM.sections = document.querySelectorAll('.section');
    DOM.scrollAnimElements = document.querySelectorAll('.animate-on-scroll');
    DOM.externalLinks = document.querySelectorAll('a[href^="http"]');
  }
  
  /**
   * Bind event listeners
   */
  function bindEvents() {
    // Throttled scroll event
    window.addEventListener('scroll', throttle(updateHeaderOnScroll, 100));
    
    // Smooth scrolling using event delegation
    document.addEventListener('click', handleSmoothScroll);
    
    // Mobile menu toggle
    if (DOM.mobileMenuToggle) {
      DOM.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Form submission
    if (DOM.contactForm) {
      DOM.contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Handle external links
    DOM.externalLinks.forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
    
    // Window resize handling with debounce
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Handle escape key for accessibility
    document.addEventListener('keydown', handleEscapeKey);
  }
  
  /**
   * Update header styles based on scroll position
   */
  function updateHeaderOnScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    
    if (scrollY > CONFIG.scrollOffset) {
      DOM.header.classList.add('header-scrolled');
    } else {
      DOM.header.classList.remove('header-scrolled');
    }
  }
  
  /**
   * Handle smooth scrolling for anchor links
   * @param {Event} e - Click event
   */
  function handleSmoothScroll(e) {
    const target = e.target.closest('a[href^="#"]');
    
    if (!target) return;
    
    const targetId = target.getAttribute('href');
    
    // Skip empty anchors
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      e.preventDefault();
      
      const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - CONFIG.headerHeight;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      if (DOM.nav.classList.contains('mobile-open')) {
        toggleMobileMenu();
      }
      
      // Update URL without scrolling (for shareable links)
      history.pushState(null, null, targetId);
    }
  }
  
  /**
   * Toggle mobile menu visibility
   */
  function toggleMobileMenu() {
    DOM.mobileMenuToggle.setAttribute(
      'aria-expanded', 
      DOM.mobileMenuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    );
    
    DOM.nav.classList.toggle('mobile-open');
    
    // Prevent body scrolling when menu is open
    document.body.classList.toggle('menu-open');
  }
  
  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(DOM.contactForm);
    const formValues = Object.fromEntries(formData.entries());
    
    // Validate form fields
    if (validateForm(formValues)) {
      // Here you would typically send the form data to a server
      // For this simple example, we'll just show an alert
      showFormSuccess('Form submitted! In a real implementation, this would send data to your server.');
      
      // Reset the form
      DOM.contactForm.reset();
    }
  }
  
  /**
   * Validate form fields
   * @param {Object} formValues - Form values
   * @returns {boolean} - Validation result
   */
  function validateForm(formValues) {
    let isValid = true;
    
    // Simple validation example
    // In a real app, would have more comprehensive validation
    for (const [key, value] of Object.entries(formValues)) {
      const input = DOM.contactForm.querySelector(`[name="${key}"]`);
      
      if (input.required && !value.trim()) {
        markInvalid(input, 'This field is required');
        isValid = false;
      } else if (input.type === 'email' && !isValidEmail(value)) {
        markInvalid(input, 'Please enter a valid email address');
        isValid = false;
      } else {
        markValid(input);
      }
    }
    
    return isValid;
  }
  
  /**
   * Mark form input as invalid
   * @param {HTMLElement} input - Input element
   * @param {string} message - Error message
   */
  function markInvalid(input, message) {
    input.classList.add('is-invalid');
    
    // Add error message if it doesn't exist
    let errorMsg = input.nextElementSibling;
    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      input.parentNode.insertBefore(errorMsg, input.nextSibling);
    }
    
    errorMsg.textContent = message;
  }
  
  /**
   * Mark form input as valid
   * @param {HTMLElement} input - Input element
   */
  function markValid(input) {
    input.classList.remove('is-invalid');
    
    // Remove error message if it exists
    const errorMsg = input.nextElementSibling;
    if (errorMsg && errorMsg.classList.contains('error-message')) {
      errorMsg.remove();
    }
  }
  
  /**
   * Validate email format
   * @param {string} email - Email address
   * @returns {boolean} - Validation result
   */
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  /**
   * Show form success message
   * @param {string} message - Success message
   */
  function showFormSuccess(message) {
    // Simple alert for demo purposes
    // In production, would create and show a proper success message in the UI
    alert(message);
  }
  
  /**
   * Set up animation on scroll using Intersection Observer
   */
  function setupScrollAnimations() {
    // Add class to sections for animations
    DOM.sections.forEach(section => {
      if (!section.classList.contains('animate-on-scroll')) {
        section.classList.add('animate-on-scroll');
      }
    });
    
    // Use Intersection Observer for better performance than scroll events
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Stop observing once animation is triggered
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: CONFIG.animationThreshold,
        rootMargin: '0px'
      });
      
      DOM.scrollAnimElements.forEach(element => {
        observer.observe(element);
      });
    } else {
      // Fallback for browsers that don't support Intersection Observer
      DOM.scrollAnimElements.forEach(element => {
        element.classList.add('animate');
      });
    }
  }
  
  /**
   * Handle window resize events
   */
  function handleResize() {
    // Update header height
    CONFIG.headerHeight = DOM.header.offsetHeight;
    
    // Reset mobile menu on desktop
    if (window.innerWidth > CONFIG.mobileBreakpoint && DOM.nav.classList.contains('mobile-open')) {
      DOM.nav.classList.remove('mobile-open');
      DOM.mobileMenuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  }
  
  /**
   * Handle escape key press
   * @param {Event} e - Keydown event
   */
  function handleEscapeKey(e) {
    if (e.key === 'Escape' && DOM.nav.classList.contains('mobile-open')) {
      toggleMobileMenu();
    }
  }
  
  /**
   * Throttle function to limit execution frequency
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in ms
   * @returns {Function} - Throttled function
   */
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  /**
   * Debounce function to delay execution
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} - Debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Add styles for form validation
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .is-invalid {
      border-color: #dc3545 !important;
    }
    
    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .menu-open {
      overflow: hidden;
    }
    
    .header-scrolled {
      background-color: rgba(255, 255, 255, 0.95);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    @media (prefers-reduced-motion: reduce) {
      .animate-on-scroll {
        transition: none !important;
        opacity: 1;
        transform: none;
      }
      
      html {
        scroll-behavior: auto;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
})();
