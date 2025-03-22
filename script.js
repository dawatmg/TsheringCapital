// Main JavaScript file for the website
document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements
  const header = document.querySelector('.header');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('nav');
  const contactForm = document.getElementById('contactForm');
  const sections = document.querySelectorAll('.section');
  
  // Add animation class to all sections
  sections.forEach(section => {
    if (!section.classList.contains('animate-on-scroll')) {
      section.classList.add('animate-on-scroll');
    }
  });
  
  // Handle scroll events
  window.addEventListener('scroll', function() {
    // Header styling on scroll
    if (window.scrollY > 100) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.8) {
        element.classList.add('animate');
      }
    });
  });
  
  // Mobile menu toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      const expanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true' || false;
      mobileMenuToggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('mobile-open');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') return;
      
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        if (nav.classList.contains('mobile-open')) {
          mobileMenuToggle.click();
        }
        
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL
        history.pushState(null, null, targetId);
      }
    });
  });
  
  // Contact form handling
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      let isValid = true;
      const formElements = contactForm.elements;
      
      for (let i = 0; i < formElements.length; i++) {
        const input = formElements[i];
        
        if (input.hasAttribute('required') && !input.value.trim()) {
          markInvalid(input, 'This field is required');
          isValid = false;
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
          markInvalid(input, 'Please enter a valid email address');
          isValid = false;
        } else if (input.type !== 'submit') {
          markValid(input);
        }
      }
      
      if (isValid) {
        // In a real implementation, you would send the data to a server
        alert('Form submitted! In a real implementation, this would send data to your server.');
        contactForm.reset();
      }
    });
  }
  
  // External links
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
  
  // Helper functions
  function markInvalid(input, message) {
    input.classList.add('is-invalid');
    
    // Add error message
    let errorMsg = input.nextElementSibling;
    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      input.parentNode.insertBefore(errorMsg, input.nextSibling);
    }
    
    errorMsg.textContent = message;
  }
  
  function markValid(input) {
    input.classList.remove('is-invalid');
    
    // Remove error message
    const errorMsg = input.nextElementSibling;
    if (errorMsg && errorMsg.classList.contains('error-message')) {
      errorMsg.remove();
    }
  }
  
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  // Trigger initial animations
  window.dispatchEvent(new Event('scroll'));
});
