document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        gsap.to(follower, {
            x: e.clientX - 10,
            y: e.clientY - 10,
            duration: 0.3
        });
    });

    // 1.1 Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navList.classList.toggle('active');
            document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // 2. GSAP Animations - Hero
    const tl = gsap.timeline();
    
    tl.from('.hero-bg', {
        scale: 1.2,
        duration: 2.5,
        ease: 'power2.out'
    })
    .from('.hero-tagline', {
        y: 20,
        opacity: 0,
        duration: 1
    }, '-=1.5')
    .from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
    }, '-=1')
    .from('.hero-description', {
        y: 30,
        opacity: 0,
        duration: 1
    }, '-=0.8')
    .from('.hero-actions', {
        y: 20,
        opacity: 0,
        duration: 0.8
    }, '-=0.6');

    // 3. Header Scroll Effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Reveal Animations on Scroll
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.section-padding').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 1.2,
            ease: 'power2.out'
        });
    });

    // 5. Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 90%',
            onEnter: () => {
                let count = 0;
                const updateCount = () => {
                    const increment = target / 100;
                    if (count < target) {
                        count += increment;
                        stat.innerText = Math.ceil(count);
                        setTimeout(updateCount, 20);
                    } else {
                        stat.innerText = target;
                    }
                };
                updateCount();
            }
        });
    });

    // 6. Contact Form Submission (Integration with n8n)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Alterar botão para estado de carregamento
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'ENVIANDO...';

            // Coletar dados
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            data.source = 'website_form';

            try {
                // Substitua 'N8N_WEBHOOK_URL' pela URL real do Webhook do seu n8n
                const response = await fetch('N8N_WEBHOOK_URL', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Sua solicitação foi enviada com sucesso! Em breve, um especialista do Chico\'s entrará em contato.');
                    contactForm.reset();
                } else {
                    throw new Error('Erro ao enviar formulário');
                }
            } catch (err) {
                console.error(err);
                alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente ou entre em contato via WhatsApp.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        });
    }
    // 7. Gallery Stagger Animation
    gsap.from('.gallery-item', {
        scrollTrigger: {
            trigger: '.events-gallery',
            start: 'top 80%',
        },
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 1,
        ease: 'power2.out'
    });
});
