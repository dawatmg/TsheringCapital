// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle sticky header
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.9)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(contactForm);
            const formValues = {};
            
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            // Here you would typically send the form data to a server
            // For this simple example, we'll just show an alert
            alert('Form submitted! In a real implementation, this would send data to your server.');
            
            // Reset the form
            contactForm.reset();
        });
    }
    
    // Add animation classes on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const checkScroll = function() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('animate');
            }
        });
    };
    
    // Add animate-on-scroll class to sections that should animate
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('animate-on-scroll');
    });
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on initial load
    
    // Mobile menu toggle (if needed in future)
    // This is a placeholder for future implementation
    const mobileMenuToggle = document.createElement('div');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<span></span><span></span><span></span>';
    
    document.querySelector('.header-container').appendChild(mobileMenuToggle);
    
    mobileMenuToggle.addEventListener('click', function() {
        document.querySelector('nav').classList.toggle('mobile-open');
    });
    
    // Optional: You can add image lazy loading or other performance optimizations here
    
    // Optional: You can add animations or transitions for the images or other elements
    
    // Optional: You can add a testimonials slider if needed in the future
    
    // Make all external links open in a new tab
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
});

// CSS class for animations (to be used with animate-on-scroll)
// Add this to your CSS or add it dynamically here if you prefer
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-on-scroll.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block;
                cursor: pointer;
                width: 30px;
                height: 25px;
                position: relative;
            }
            
            .mobile-menu-toggle span {
                display: block;
                position: absolute;
                height: 3px;
                width: 100%;
                background: #3c3c40;
                border-radius: 3px;
                opacity: 1;
                left: 0;
                transform: rotate(0deg);
                transition: .25s ease-in-out;
            }
            
            .mobile-menu-toggle span:nth-child(1) {
                top: 0px;
            }
            
            .mobile-menu-toggle span:nth-child(2) {
                top: 10px;
            }
            
            .mobile-menu-toggle span:nth-child(3) {
                top: 20px;
            }
            
            nav {
                display: none;
                width: 100%;
            }
            
            nav.mobile-open {
                display: block;
            }
            
            nav ul {
                flex-direction: column;
                align-items: center;
            }
            
            nav ul li {
                margin: 10px 0;
            }
        }
    </style>
`);
