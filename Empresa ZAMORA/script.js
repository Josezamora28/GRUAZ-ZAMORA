document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. HEADER REDUCIDO EN SCROLL
       ========================================================================== */
    const mainHeader = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. MENÚ RESPONSIVO (MÓVIL)
       ========================================================================== */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    /* ==========================================================================
       3. DETECCIÓN DE SECCIÓN ACTIVA EN MENÚ (SCROLL SPY)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);

    /* ==========================================================================
       4. ANIMACIÓN AL APARECER SECCIONES (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal, .timeline-item');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Si ya se animó, dejamos de observarlo para optimizar rendimiento
                if (entry.target.classList.contains('reveal')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       5. CONTADORES DE ESTADÍSTICAS ANIMADOS
       ========================================================================== */
    const statsSection = document.getElementById('statsGrid');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 segundos
            const stepTime = Math.abs(Math.floor(duration / target));
            let current = 0;

            const timer = setInterval(() => {
                current += 1;
                
                // Formateadores específicos
                if (target === 15) {
                    stat.textContent = `+${current}`;
                } else if (target === 500) {
                    // Saltar de 5 en 5 para acelerar el de 500
                    current += 4; 
                    if (current >= target) current = target;
                    stat.textContent = `+${current}`;
                } else if (target === 24) {
                    stat.textContent = `${current}/7`;
                } else if (target === 100) {
                    stat.textContent = `${current}%`;
                }

                if (current >= target) {
                    clearInterval(timer);
                    // Asegurar valor final exacto
                    if (target === 15) stat.textContent = `+15`;
                    else if (target === 500) stat.textContent = `+500`;
                    else if (target === 24) stat.textContent = `24/7`;
                    else if (target === 100) stat.textContent = `100%`;
                }
            }, stepTime);
        });
    }

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    animateStats();
                    animatedStats = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       6. CARRUSEL AUTOMÁTICO Y MANUAL DE TESTIMONIOS
       ========================================================================== */
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('carouselDots');
    let currentSlide = 0;
    let autoSlideInterval;

    if (testimonialSlides.length > 0) {
        const totalSlides = testimonialSlides.length;

        const updateCarousel = (index) => {
            testimonialSlides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) slide.classList.add('active');
            });

            // Actualizar dots
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === index) dot.classList.add('active');
            });

            currentSlide = index;
        };

        const nextSlide = () => {
            let nextIndex = currentSlide + 1;
            if (nextIndex >= totalSlides) nextIndex = 0;
            updateCarousel(nextIndex);
        };

        const prevSlide = () => {
            let prevIndex = currentSlide - 1;
            if (prevIndex < 0) prevIndex = totalSlides - 1;
            updateCarousel(prevIndex);
        };

        // Iniciar autoplay
        const startAutoplay = () => {
            autoSlideInterval = setInterval(nextSlide, 6000); // Cambia cada 6 segundos
        };

        const stopAutoplay = () => {
            clearInterval(autoSlideInterval);
        };

        // Event Listeners para botones
        nextBtn.addEventListener('click', () => {
            stopAutoplay();
            nextSlide();
            startAutoplay();
        });

        prevBtn.addEventListener('click', () => {
            stopAutoplay();
            prevSlide();
            startAutoplay();
        });

        // Event Listeners para los dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoplay();
                updateCarousel(index);
                startAutoplay();
            });
        });

        // Iniciar
        startAutoplay();
    }

    /* ==========================================================================
       7. BOTÓN VOLVER ARRIBA (BACK TO TOP)
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       8. SIMULACIÓN DE FORMULARIO DE CONTACTO/COTIZACIÓN
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Cambiar estado del botón a cargando
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Procesando tu Solicitud...';
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            // Simulación de envío de datos
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;

                // Mensaje exitoso
                formStatus.classList.add('success');
                formStatus.textContent = '¡Solicitud recibida! Un ingeniero de izaje te contactará en breve.';
                
                // Limpiar formulario
                contactForm.reset();

                // Quitar mensaje en 5 segundos
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);

            }, 1500); // 1.5s de delay simulado
        });
    }
});
