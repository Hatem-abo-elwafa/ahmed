// تنفيذ وظيفة البحث
document.querySelector(".search-box").addEventListener("input", function (e) {
	const searchTerm = e.target.value.trim().toLowerCase();
	const cards = document.querySelectorAll(".card");

	cards.forEach((card) => {
		const title = card.querySelector(".card-title").textContent.toLowerCase();
		const excerpt = card.querySelector(".card-text").textContent.toLowerCase();

		if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
			card.style.display = "block";
			card.classList.add("animate__fadeIn");
		} else {
			card.style.display = "none";
		}
	});
});
