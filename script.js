// Select the navbar and its components
const navbar = document.getElementById("navbar");
const logo = document.getElementById("logo");  // The logo element
const menuLinks = document.getElementById("menu-links"); // Menu links container (Home, About Us, etc.)

let lastScrollY = window.scrollY; // Tracks the last scroll position

// Scroll event listener to hide/show navbar and adjust transparency
window.addEventListener("scroll", () => {
    // Get the current scroll position
    let currentScrollY = window.scrollY;

    // If scrolling down and past a threshold, make navbar solid
    if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        navbar.classList.add("solid"); // Add solid class
        navbar.classList.remove("transparent"); // Remove transparent class
    } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        navbar.classList.add("transparent"); // Keep transparent class
        navbar.classList.remove("solid"); // Remove solid class
    }

    // Update the last scroll position
    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
});
document.getElementById('logout-button').addEventListener('click', function() {
    // Simulate a logout action (you can clear session storage or cookies if needed)
    alert("You have been logged out.");

    // Redirect to the login page or home page (adjust URL as needed)
    window.location.href = "login.html"; // You can change this to wherever the login page is
});