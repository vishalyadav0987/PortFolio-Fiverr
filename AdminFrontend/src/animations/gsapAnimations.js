import gsap from 'gsap';

export const sidebarAnimation = () => {
    gsap.from('.sidebar', {
        x: -250,
        duration: 1,
        ease: 'power2.out',
    });
};

export const pageTransition = () => {
    gsap.fromTo(
        '.page-content',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
};
