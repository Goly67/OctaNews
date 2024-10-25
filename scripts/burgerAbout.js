const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');
const closeMenu = document.querySelector('.close-menu');

burgerMenu.addEventListener('click', () => {
    navMenu.classList.add('active');
});

closeMenu.addEventListener('click', () => {
    navMenu.classList.remove('active');
});

const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');
const closeMenu = document.querySelector('.close-menu');

burgerMenu.addEventListener('click', () => {
    navMenu.classList.add('active');
});

closeMenu.addEventListener('click', () => {
    navMenu.classList.remove('active');
});

// Your existing JavaScript for burger menu
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const closeMenu = document.querySelector('.close-menu');
    const navMenu = document.querySelector('.nav-menu');

    burgerMenu.addEventListener('click', function() {
        navMenu.classList.add('show');
    });

    closeMenu.addEventListener('click', function() {
        navMenu.classList.remove('show');
    });
});

// New JavaScript for profile image hover effect
document.getElementById('profileImage').addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.1)';
});

document.getElementById('profileImage').addEventListener('mouseout', function() {
    this.style.transform = 'scale(1)';
});
