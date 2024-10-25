// Select DOM elements once at the top
const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');
const closeMenu = document.querySelector('.close-menu');

// Add event listeners for burger menu actions
burgerMenu.addEventListener('click', () => {
    navMenu.classList.add('active');
});

closeMenu.addEventListener('click', () => {
    navMenu.classList.remove('active');
});

// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', function () {
    // No need to redeclare the same variables here again.
    burgerMenu.addEventListener('click', function () {
        navMenu.classList.add('show');
    });

    closeMenu.addEventListener('click', function () {
        navMenu.classList.remove('show');
    });
});

// Add hover effect to the profile image
document.getElementById('profileImage').addEventListener('mouseover', function () {
    this.style.transform = 'scale(1.1)';
});

document.getElementById('profileImage').addEventListener('mouseout', function () {
    this.style.transform = 'scale(1)';
});
