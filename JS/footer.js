import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";

// Initialize the main page content
document.addEventListener("DOMContentLoaded", function () {
	// Add smooth scrolling for navigation links
	const links = document.querySelectorAll('a[href^="#"]');

	links.forEach((link) => {
		link.addEventListener("click", function (e) {
			const href = this.getAttribute("href");

			if (href !== "#") {
				e.preventDefault();

				const targetElement = document.querySelector(href);
				if (targetElement) {
					window.scrollTo({
						top: targetElement.offsetTop - 80,
						behavior: "smooth",
					});
				}
			}
		});
	});

	// Add scroll animation for service cards
	const serviceCards = document.querySelectorAll(".service-card");

	if (serviceCards.length > 0) {
		const animateOnScroll = () => {
			serviceCards.forEach((card) => {
				const cardPosition = card.getBoundingClientRect().top;
				const screenPosition = window.innerHeight / 1.3;

				if (cardPosition < screenPosition) {
					card.style.opacity = "1";
					card.style.transform = "translateY(0)";
				}
			});
		};

		// Set initial state
		serviceCards.forEach((card) => {
			card.style.opacity = "0";
			card.style.transform = "translateY(20px)";
			card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
		});

		// Run on load
		animateOnScroll();

		// Run on scroll
		window.addEventListener("scroll", animateOnScroll);
	}
});
