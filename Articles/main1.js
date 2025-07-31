function loadScript(url) {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = url;
		script.onload = resolve;
		script.onerror = reject;
		document.head.appendChild(script);
	});
}

async function initializeApp() {
	try {
		await Promise.all([
			loadScript(
				"https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
			),
			loadScript("https://html2canvas.hertzen.com/dist/html2canvas.min.js"),
		]);

		setupServiceWorker();
		setupDarkMode();
		setupEventListeners();
		setupInitialState();
	} catch (error) {
		console.error("Initialization error:", error);
	}
}

// تسجيل Service Worker
function setupServiceWorker() {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
			.register("/sw.js")
			.then((registration) => console.log("ServiceWorker registered"))
			.catch((err) => console.error("ServiceWorker registration failed:", err));
	}
}

// إعداد الوضع الداكن
function setupDarkMode() {
	const toggleDarkMode = () => {
		document.body.classList.toggle("dark-mode");
		localStorage.setItem(
			"darkMode",
			document.body.classList.contains("dark-mode")
		);

		const icon = document.querySelector(".mode-toggle-btn img");
		icon.src = document.body.classList.contains("dark-mode")
			? "https://cdn-icons-png.flaticon.com/128/17511/17511562.png"
			: "https://cdn-icons-png.flaticon.com/128/6853/6853926.png";
	};

	document
		.querySelector(".mode-toggle-btn")
		.addEventListener("click", toggleDarkMode);

	// تحميل الوضع المفضل
	if (localStorage.getItem("darkMode") === "true") {
		document.body.classList.add("dark-mode");
		document.querySelector(".mode-toggle-btn img").src =
			"https://cdn-icons-png.flaticon.com/128/17511/17511562.png";
	}
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
	try {
		// نسخ المقال
		const copyBtn = document.getElementById("copyArticleBtn");
		if (copyBtn) {
			copyBtn.addEventListener("click", copyArticleText);
		}

		// المشاركة الاجتماعية
		document.querySelectorAll('[onclick^="shareSocial"]').forEach((btn) => {
			const platform = btn.getAttribute("onclick").match(/'([^']+)'/)[1];
			btn.addEventListener("click", () => shareSocial(platform));
		});

		// التقييم
		const stars = document.querySelectorAll(".star");
		if (stars.length > 0) {
			stars.forEach((star, index) => {
				// تأثير عند وضع المؤشر
				star.addEventListener("mouseenter", () => {
					highlightStars(index + 1);
				});

				// إعادة النجوم إلى حالتها الأصلية عند إزالة المؤشر
				star.addEventListener("mouseleave", () => {
					resetStars();
				});

				// النقر على النجم
				star.addEventListener("click", () => {
					const currentRating = getUserRating();
					if (currentRating === index + 1) {
						// إذا تم النقر على نفس التقييم، نعرض خيار إلغاء التقييم
						if (confirm("هل تريد إلغاء تقييمك للمقال؟")) {
							removeRating();
						}
					} else {
						// تحديث التقييم
						updateRating(index + 1);
					}
				});
			});
		}

		// البحث
		const searchInput = document.getElementById("searchInput");
		if (searchInput) {
			searchInput.addEventListener("input", debounce(searchArticle, 300));
		}

		// العودة للأعلى
		const backToTopBtn = document.getElementById("backToTop");
		if (backToTopBtn) {
			backToTopBtn.addEventListener("click", () => {
				window.scrollTo({ top: 0, behavior: "smooth" });
			});
		}

		// القراءة الصوتية
		const ttsBtn = document.getElementById("ttsBtn");
		if (ttsBtn) {
			if ("speechSynthesis" in window) {
				ttsBtn.addEventListener("click", toggleSpeech);
				ttsBtn.style.display = "block";
			} else {
				ttsBtn.style.display = "none";
			}
		}

		// الإشارات المرجعية
		const bookmarkBtn = document.getElementById("bookmarkBtn");
		if (bookmarkBtn) {
			bookmarkBtn.addEventListener("click", toggleBookmark);
			updateBookmarkButton();
		}
	} catch (error) {
		console.error("Error in setupEventListeners:", error);
	}
}

// تهيئة الحالة الأولية
function setupInitialState() {
	document.body.classList.add("loaded");
	calculateReadingTime();
	updateViewCount();
	setupLazyLoading();
	setupBackToTop();
	loadArticleRating();
	setupBookmarking();
	initArticleSearch();
}

// دالة مساعدة للتأخير
function debounce(func, delay) {
	let timeout;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), delay);
	};
}

// ===== الوظائف الرئيسية =====

function showCopyAlert() {
	const alert = document.getElementById("copyAlert");
	alert.classList.add("show");
	setTimeout(() => alert.classList.remove("show"), 3000);
}

function shareSocial(platform) {
	const pageUrl = encodeURIComponent(window.location.href);
	const pageTitle = encodeURIComponent(document.title);
	let shareUrl = "";

	const platforms = {
		whatsapp: `https://wa.me/?text=${pageTitle}%0A%0A${pageUrl}`,
		telegram: `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`,
		twitter: `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
	};

	if (platforms[platform]) {
		window.open(platforms[platform], "_blank", "width=600,height=500");
		trackShareEvent(platform);
	}
}

function trackShareEvent(platform) {
	console.log(`تمت المشاركة على ${platform}`);
	if (window.gtag) {
		gtag("event", "share", {
			event_category: "social",
			event_label: platform,
		});
	}
}

function calculateReadingTime() {
	let text = document.getElementById("article-text").innerText;
	let words = text.split(" ").length;
	let time = Math.ceil(words / 200);
	document.getElementById(
		"reading-time"
	).textContent = `الوقت المقدر للقراءة: ${time} دقيقة${time > 1 ? "ات" : ""}`;
}

function updateViewCount() {
	const articleId = window.location.pathname;
	const views = JSON.parse(localStorage.getItem("articleViews") || "{}");

	if (!views[articleId]) {
		views[articleId] = 0;
	}

	views[articleId]++;
	localStorage.setItem("articleViews", JSON.stringify(views));

	document.getElementById(
		"view-count"
	).textContent = `عدد المشاهدات: ${views[articleId]}`;
}

function loadArticleRating() {
	try {
		const articleId = window.location.pathname;
		const ratings = JSON.parse(localStorage.getItem("articleRatings") || "{}");
		const userRatings = JSON.parse(localStorage.getItem("userRatings") || "{}");

		if (ratings[articleId]) {
			const avgRating = (
				ratings[articleId].total / ratings[articleId].count
			).toFixed(1);
			document.getElementById(
				"ratingResult"
			).textContent = `التقييم: ${avgRating} (${ratings[articleId].count} تقييمات)`;

			// عرض تقييم المستخدم إذا كان موجوداً
			if (userRatings[articleId] !== undefined) {
				highlightStars(userRatings[articleId]);
			}
		}
	} catch (error) {
		console.error("Error in loadArticleRating:", error);
	}
}

// الحصول على تقييم المستخدم الحالي
function getUserRating() {
	const articleId = window.location.pathname;
	const userRatings = JSON.parse(localStorage.getItem("userRatings") || "{}");
	return userRatings[articleId];
}

// تحديث التقييم
function updateRating(newRating) {
	try {
		const articleId = window.location.pathname;
		const ratings = JSON.parse(localStorage.getItem("articleRatings") || "{}");
		const userRatings = JSON.parse(localStorage.getItem("userRatings") || "{}");
		const oldRating = userRatings[articleId];

		if (!ratings[articleId]) {
			ratings[articleId] = {
				total: 0,
				count: 0,
			};
		}

		// إذا كان هناك تقييم سابق، نطرحه من المجموع
		if (oldRating !== undefined) {
			ratings[articleId].total -= oldRating;
		} else {
			ratings[articleId].count++;
		}

		// نضيف التقييم الجديد
		ratings[articleId].total += newRating;
		userRatings[articleId] = newRating;

		localStorage.setItem("articleRatings", JSON.stringify(ratings));
		localStorage.setItem("userRatings", JSON.stringify(userRatings));

		const avgRating = (
			ratings[articleId].total / ratings[articleId].count
		).toFixed(1);
		document.getElementById(
			"ratingResult"
		).textContent = `التقييم: ${avgRating} (${ratings[articleId].count} تقييمات)`;

		highlightStars(newRating);
		showAlert(
			oldRating ? "تم تحديث تقييمك للمقال" : "شكراً لتقييمك للمقال",
			"success"
		);
	} catch (error) {
		console.error("Error in updateRating:", error);
		showAlert("حدث خطأ أثناء تحديث التقييم", "error");
	}
}

// إلغاء التقييم
function removeRating() {
	try {
		const articleId = window.location.pathname;
		const ratings = JSON.parse(localStorage.getItem("articleRatings") || "{}");
		const userRatings = JSON.parse(localStorage.getItem("userRatings") || "{}");
		const oldRating = userRatings[articleId];

		if (oldRating !== undefined) {
			// نطرح التقييم القديم
			ratings[articleId].total -= oldRating;
			ratings[articleId].count--;

			// نحذف تقييم المستخدم
			delete userRatings[articleId];

			localStorage.setItem("articleRatings", JSON.stringify(ratings));
			localStorage.setItem("userRatings", JSON.stringify(userRatings));

			// تحديث العرض
			if (ratings[articleId].count > 0) {
				const avgRating = (
					ratings[articleId].total / ratings[articleId].count
				).toFixed(1);
				document.getElementById(
					"ratingResult"
				).textContent = `التقييم: ${avgRating} (${ratings[articleId].count} تقييمات)`;
			} else {
				document.getElementById("ratingResult").textContent =
					"لا يوجد تقييمات بعد";
			}

			resetStars();
			showAlert("تم إلغاء تقييمك للمقال", "success");
		}
	} catch (error) {
		console.error("Error in removeRating:", error);
		showAlert("حدث خطأ أثناء إلغاء التقييم", "error");
	}
}

function highlightStars(rating) {
	const stars = document.querySelectorAll(".star");
	const currentRating = getUserRating();

	stars.forEach((star, index) => {
		if (index < rating) {
			star.classList.add("selected");
			star.style.transform = "scale(1.1)";
			star.style.transition = "transform 0.2s ease";
		} else {
			star.classList.remove("selected");
			star.style.transform = "scale(1)";
		}
	});
}

function resetStars() {
	const stars = document.querySelectorAll(".star");
	const currentRating = getUserRating();

	stars.forEach((star, index) => {
		if (currentRating !== undefined && index < currentRating) {
			star.classList.add("selected");
		} else {
			star.classList.remove("selected");
		}
		star.style.transform = "scale(1)";
	});
}

function showAlert(message, type) {
	// إزالة أي تنبيهات سابقة
	const existingAlerts = document.querySelectorAll(".custom-alert");
	existingAlerts.forEach((alert) => alert.remove());

	// إنشاء عنصر التنبيه
	const alert = document.createElement("div");
	alert.className = `custom-alert ${type}`;

	// إضافة أيقونة حسب نوع التنبيه
	const icon =
		type === "success"
			? '<img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="نجاح" class="alert-icon">'
			: '<img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" alt="خطأ" class="alert-icon">';

	alert.innerHTML = `
		<div class="alert-content">
			${icon}
			<span>${message}</span>
		</div>
		<div class="alert-progress"></div>
	`;

	// إضافة التنبيه للصفحة
	document.body.appendChild(alert);

	// إضافة الأنماط مباشرة
	const style = document.createElement("style");
	style.textContent = `
		.custom-alert {
			position: fixed;
			top: 20px;
			right: 20px;
			min-width: 300px;
			padding: 15px;
			border-radius: 8px;
			background: white;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			z-index: 9999;
			transform: translateX(120%);
			transition: transform 0.3s ease-in-out;
			direction: rtl;
		}

		.custom-alert.show {
			transform: translateX(0);
		}

		.custom-alert .alert-content {
			display: flex;
			align-items: center;
			gap: 10px;
		}

		.custom-alert .alert-icon {
			width: 24px;
			height: 24px;
		}

		.custom-alert.success {
			border-right: 4px solid #2ecc71;
		}

		.custom-alert.error {
			border-right: 4px solid #e74c3c;
		}

		.custom-alert .alert-progress {
			position: absolute;
			bottom: 0;
			left: 0;
			height: 3px;
			background: #2ecc71;
			width: 100%;
			animation: progress 3s linear forwards;
		}

		.custom-alert.error .alert-progress {
			background: #e74c3c;
		}

		@keyframes progress {
			from { width: 100%; }
			to { width: 0%; }
		}

		.dark-mode .custom-alert {
			background: #2c3e50;
			color: white;
		}

		.dark-mode .custom-alert .alert-icon {
			filter: brightness(0) invert(1);
		}
	`;
	document.head.appendChild(style);

	// إظهار التنبيه
	setTimeout(() => alert.classList.add("show"), 100);

	// إزالة التنبيه بعد 3 ثواني
	setTimeout(() => {
		alert.classList.remove("show");
		setTimeout(() => alert.remove(), 300);
	}, 3000);
}

function setupLazyLoading() {
	const images = document.querySelectorAll("img[data-src]");
	const imgObserver = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.dataset.src;
					img.onload = () => {
						img.style.opacity = "1";
					};
					img.removeAttribute("data-src");
					observer.unobserve(img);
				}
			});
		},
		{
			rootMargin: "100px",
		}
	);

	images.forEach((img) => imgObserver.observe(img));
}

function setupBackToTop() {
	const backToTopBtn = document.getElementById("backToTop");

	window.addEventListener("scroll", () => {
		if (window.pageYOffset > 300) {
			backToTopBtn.style.display = "block";
		} else {
			backToTopBtn.style.display = "none";
		}
	});
}

function initArticleSearch() {
	const searchInput = document.getElementById("searchInput");
	searchInput.addEventListener("input", debounce(searchArticle, 300));
}

function searchArticle() {
	const query = document
		.getElementById("searchInput")
		.value.trim()
		.toLowerCase();
	if (query.length < 2) {
		document.getElementById("searchResults").innerHTML = "";
		return;
	}

	const articleText = document
		.getElementById("article-text")
		.innerText.toLowerCase();
	const results = [];

	const paragraphs = document.querySelectorAll(
		"#article-text p, #article-text li"
	);
	paragraphs.forEach((p, i) => {
		const text = p.innerText.toLowerCase();
		if (text.includes(query)) {
			const startIndex = text.indexOf(query);
			const preview = p.innerText.substring(
				Math.max(0, startIndex - 20),
				Math.min(p.innerText.length, startIndex + query.length + 40)
			);

			results.push({
				element: p,
				preview: preview.replace(
					new RegExp(query, "gi"),
					(match) => `<mark>${match}</mark>`
				),
			});
		}
	});

	displaySearchResults(results);
}

function displaySearchResults(results) {
	const resultsContainer = document.getElementById("searchResults");

	if (results.length === 0) {
		resultsContainer.innerHTML = "<p>لا توجد نتائج مطابقة للبحث</p>";
		return;
	}

	let html =
		'<div class="search-results-count">عدد النتائج: ' +
		results.length +
		"</div>";

	results.forEach((result) => {
		html += `
            <div class="search-result-item" onclick="scrollToResult(this)">
                <p>${result.preview}</p>
            </div>
        `;
	});

	resultsContainer.innerHTML = html;
}

function scrollToResult(resultElement) {
	const index = Array.from(
		document.querySelectorAll(".search-result-item")
	).indexOf(resultElement);
	const targetElement = document.querySelectorAll(
		"#article-text p, #article-text li"
	)[index];

	targetElement.scrollIntoView({
		behavior: "smooth",
		block: "center",
	});

	targetElement.style.backgroundColor = "#fff9c4";
	setTimeout(() => {
		targetElement.style.backgroundColor = "";
	}, 2000);
}

function setupBookmarking() {
	const bookmarkBtn = document.getElementById("bookmarkBtn");
	updateBookmarkButton();
	bookmarkBtn.addEventListener("click", toggleBookmark);
}

function toggleBookmark() {
	try {
		const articleId = window.location.pathname;
		const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
		const bookmarkBtn = document.getElementById("bookmarkBtn");

		if (!bookmarkBtn) {
			console.error("Bookmark button not found");
			return;
		}

		const index = bookmarks.indexOf(articleId);
		if (index === -1) {
			bookmarks.push(articleId);
			showAlert("تمت إضافة المقال إلى المحفوظات", "success");
		} else {
			bookmarks.splice(index, 1);
			showAlert("تمت إزالة المقال من المحفوظات", "success");
		}

		localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
		updateBookmarkButton();
	} catch (error) {
		console.error("Error in toggleBookmark:", error);
		showAlert("حدث خطأ أثناء حفظ المقال", "error");
	}
}

function updateBookmarkButton() {
	try {
		const articleId = window.location.pathname;
		const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
		const btn = document.getElementById("bookmarkBtn");

		if (!btn) {
			console.error("Bookmark button not found");
			return;
		}

		if (bookmarks.includes(articleId)) {
			btn.innerHTML = `
                <img src="https://cdn-icons-png.flaticon.com/512/5662/5662990.png" class="social-icon" alt="إزالة من المحفوظات">
                إزالة من المحفوظات
            `;
			btn.style.backgroundColor = "#e74c3c";
		} else {
			btn.innerHTML = `
                <img src="https://cdn-icons-png.flaticon.com/512/5662/5662990.png" class="social-icon" alt="حفظ المقال">
                حفظ المقال
            `;
			btn.style.backgroundColor = "#3498db";
		}
	} catch (error) {
		console.error("Error in updateBookmarkButton:", error);
	}
}

function initTextToSpeech() {
	const ttsBtn = document.getElementById("ttsBtn");

	if (!("speechSynthesis" in window)) {
		ttsBtn.style.display = "none";
		return;
	}

	ttsBtn.addEventListener("click", toggleSpeech);
}

function toggleSpeech() {
	try {
		const ttsBtn = document.getElementById("ttsBtn");
		const articleText = document.getElementById("article-text");

		if (!ttsBtn || !articleText) {
			console.error("Required elements not found");
			return;
		}

		if (speechSynthesis.speaking) {
			speechSynthesis.cancel();
			ttsBtn.innerHTML = `
                <img src="https://cdn-icons-png.flaticon.com/512/3094/3094837.png" class="social-icon" alt="قراءة صوتية">
                استمع إلى المقال
            `;
		} else {
			const utterance = new SpeechSynthesisUtterance();
			utterance.text = articleText.innerText;
			utterance.lang = "ar-SA";
			utterance.rate = 0.9;

			ttsBtn.innerHTML = `
                <img src="https://cdn-icons-png.flaticon.com/512/3094/3094837.png" class="social-icon" alt="إيقاف القراءة">
                إيقاف القراءة
            `;

			utterance.onend = () => {
				ttsBtn.innerHTML = `
                    <img src="https://cdn-icons-png.flaticon.com/512/3094/3094837.png" class="social-icon" alt="قراءة صوتية">
                    استمع إلى المقال
                `;
			};

			utterance.onerror = (event) => {
				console.error("SpeechSynthesis error:", event);
				ttsBtn.innerHTML = `
                    <img src="https://cdn-icons-png.flaticon.com/512/3094/3094837.png" class="social-icon" alt="قراءة صوتية">
                    استمع إلى المقال
                `;
				showAlert("حدث خطأ أثناء القراءة الصوتية", "error");
			};

			speechSynthesis.speak(utterance);
		}
	} catch (error) {
		console.error("Error in toggleSpeech:", error);
		showAlert("حدث خطأ أثناء تشغيل القراءة الصوتية", "error");
	}
}

// بدء التطبيق عند تحميل الصفحة
window.addEventListener("DOMContentLoaded", initializeApp);
// تحسين وظيفة الوضع الداكن
function toggleDarkMode() {
	document.body.classList.toggle("dark-mode");
	localStorage.setItem(
		"darkMode",
		document.body.classList.contains("dark-mode")
	);

	// تحديث أيقونة الوضع
	const icon = document.querySelector(".mode-toggle-btn img");
	if (document.body.classList.contains("dark-mode")) {
		icon.src = "https://cdn-icons-png.flaticon.com/128/17511/17511562.png";
		icon.alt = "تفعيل الوضع الفاتح";
	} else {
		icon.src = "https://cdn-icons-png.flaticon.com/128/6853/6853926.png";
		icon.alt = "تفعيل الوضع الداكن";
	}
}

// تحسين وظيفة نسخ المقال
function copyArticleText() {
	const articleText = document.getElementById("article-text").innerText;

	navigator.clipboard
		.writeText(articleText)
		.then(() => {
			const alert = document.getElementById("copyAlert");
			alert.classList.add("show");
			setTimeout(() => alert.classList.remove("show"), 3000);
		})
		.catch((err) => {
			console.error("Failed to copy: ", err);
			// Fallback for older browsers
			const textarea = document.createElement("textarea");
			textarea.value = articleText;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			document.body.removeChild(textarea);

			const alert = document.getElementById("copyAlert");
			alert.classList.add("show");
			setTimeout(() => alert.classList.remove("show"), 3000);
		});
}

function initializeDarkMode() {
	if (localStorage.getItem("darkMode") === "true") {
		document.body.classList.add("dark-mode");
		const icon = document.querySelector(".mode-toggle-btn img");
		icon.src = "https://cdn-icons-png.flaticon.com/128/17511/17511562.png";
		icon.alt = "تفعيل الوضع الفاتح";
	}
}

window.addEventListener("DOMContentLoaded", () => {
	initializeDarkMode();
	calculateReadingTime();
	updateViewCount();
});

// التحقق مما إذا كان المقال تم تقييمه
function isArticleRated() {
	const articleId = window.location.pathname;
	const ratings = JSON.parse(localStorage.getItem("articleRatings") || "{}");
	const userRatings = JSON.parse(localStorage.getItem("userRatings") || "{}");

	return userRatings[articleId] !== undefined;
}

// تحديث الأنماط CSS للنجوم
const starStyles = document.createElement("style");
starStyles.textContent = `
    .star {
        cursor: pointer;
        transition: all 0.3s ease;
        color: #ddd;
        font-size: 28px;
        margin: 0 4px;
        position: relative;
        display: inline-block;
    }

    .star:hover {
        transform: scale(1.3);
        color: #f1c40f;
    }

    .star.selected {
        color: #f1c40f;
    }

    .star.selected:hover {
        transform: scale(1.3);
    }

    .dark-mode .star {
        color: #555;
    }

    .dark-mode .star:hover {
        color: #f1c40f;
    }

    .dark-mode .star.selected {
        color: #f1c40f;
    }
`;
document.head.appendChild(starStyles);
