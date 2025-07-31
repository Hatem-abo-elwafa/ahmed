const articles = [
	{
		id: 1,
		title: "أفضل معلم خصوصي في الرياض مع تقييمات حقيقية",
		excerpt: "اكتشف أفضل معلم خصوصي في الرياض من خلال تقييمات حقيقية ومراجعات موثوقة. دليل شامل لاختيار المعلم المناسب لتحقيق أفضل النتائج الأكاديمية.",
		image: "material/1.jpg",
		link: "Articles/html/best-private-tutor-riyadh.html",
	},
	{
		id: 3,
		title: "أفضل معلم تحصيلي للأطفال في مكة مع تقييمات أولياء الأمور",
		excerpt: "اكتشف أفضل معلم تحصيلي للأطفال في مكة من خلال تقييمات أولياء الأمور الحقيقية. دليل شامل لاختيار المعلم المناسب لتحضير طفلك للاختبار التحصيلي.",
		image: "material/11.jpg",
		link: "Articles/html/best-tahseeli-tutor-children-makkah.html",
	},
	{
		id: 4,
		title: "أفضل مدرس تحصيلي في جدة – من تجارب أولياء الأمور",
		excerpt: "اكتشف أفضل مدرس تحصيلي في جدة من خلال تجارب أولياء الأمور الحقيقية. تقييمات موثوقة وأسعار مناسبة لتحضير طفلك للاختبار التحصيلي.",
		image: "material/12.jpg",
		link: "Articles/html/best-tahseeli-tutor-jeddah.html",
	},
	{
		id: 5,
		title: "دليل شامل للدروس الخصوصية في السعودية - أفضل المعلمين والمراكز التعليمية",
		excerpt: "دليل شامل للدروس الخصوصية في السعودية. اكتشف أفضل المعلمين والمراكز التعليمية، أسعار الدروس الخصوصية، وكيفية اختيار المعلم المناسب لتحقيق أفضل النتائج الأكاديمية.",
		image: "material/13.jpg",
		link: "Articles/html/doros-khassosia-saudi-arabia.html",
	},
	{
		id: 6,
		title: "كيف أحجز معلم خصوصي لأطفالي؟ – دليل ولي الأمر الشامل",
		excerpt: "تعلم كيف أحجز معلم خصوصي لأطفالي بخطوات بسيطة وفعالة. دليل شامل لولي الأمر لاختيار المعلم المناسب وحجز الدروس الخصوصية.",
		image: "material/4.jpg",
		link: "Articles/html/how-to-book-private-tutor-guide.html",
	},
	{
		id: 7,
		title: "كيفية حجز مدرس خصوصي في السعودية بخطوات بسيطة - دليل شامل",
		excerpt: "تعلم كيفية حجز مدرس خصوصي في السعودية بخطوات بسيطة وسهلة. دليل شامل لاختيار المعلم المناسب وحجز الدروس الخصوصية بأفضل الأسعار والجودة.",
		image: "material/1.jpg",
		link: "Articles/html/how-to-book-private-tutor-saudi-arabia.html",
	},
	{
		id: 9,
		title: "أفضل طرق للاستفادة من دروس القدرات أونلاين من المنزل",
		excerpt: "تعلم أفضل طرق الاستفادة من دروس القدرات أونلاين من المنزل. دليل شامل لتحضير الاختبار التحصيلي والقدرات عبر الإنترنت بفعالية عالية.",
		image: "material/2.jpg",
		link: "Articles/html/online-capacity-tutoring-home.html",
	},
	{
		id: 10,
		title: "هل الدروس الخصوصية أونلاين فعالة؟ تجارب وآراء | معلمون",
		excerpt: "اكتشف فعالية الدروس الخصوصية أونلاين من خلال تجارب حقيقية وآراء الطلاب. تعرف على مميزات وعيوب التعليم عن بعد وكيفية حجز مدرس خصوصي في السعودية.",
		image: "material/14.jpg",
		link: "Articles/html/online-private-lessons-effectiveness.html",
	},
	/// not css 
	{
		id: 11,
		title: "مدرس خصوصي Online – المزايا والتحديات",
		excerpt: "اكتشف مزايا وتحديات مدرس خصوصي online. تعرف على أفضل منصات التعليم الافتراضي وكيفية اختيار مدرس خصوصي online مناسب.",
		image: "material/9.jpg",
		link: "Articles/html/online-private-tutor-advantages-challenges.html",
	},
	{
		id: 12,
		title: "مزايا حجز مدرس خصوصي عن بعد في السعودية - دليل شامل",
		excerpt: "اكتشف مزايا حجز مدرس خصوصي عن بعد في السعودية. تعرف على الفوائد والتوفير والمرونة التي توفرها الدروس الإلكترونية مع أفضل المعلمين.",
		image: "material/11.jpg",
		link: "Articles/html/online-private-tutor-booking-saudi.html",
	},
	{
		id: 13,
		title: "كم تكلفة حصة الدرس الخصوصي في الدمام؟ - دليل شامل للأسعار",
		excerpt: "تعرف على تكلفة حصة الدرس الخصوصي في الدمام. دليل شامل للأسعار حسب المادة الدراسية والمستوى التعليمي مع نصائح لتوفير المال.",
		image: "material/1.jpg",
		link: "Articles/html/private-lesson-cost-dammam.html",
	},
	{
		id: 14,
		title: "ما هي تكلفة الدروس الخصوصية في السعودية؟ - دليل شامل للأسعار",
		excerpt: "تعرف على تكلفة الدروس الخصوصية في السعودية. دليل شامل للأسعار حسب المدينة والمادة الدراسية والمستوى التعليمي مع نصائح لتوفير المال.",
		image: "material/2.jpg",
		link: "Articles/html/private-lessons-cost-saudi-arabia.html",
	},
	{
		id: 15,
		title: "كيف يساعدك مدرس خصوصي للثانوية على التفوق؟ - دليل شامل",
		excerpt: "اكتشف كيف يساعدك مدرس خصوصي للثانوية على التفوق والنجاح. تعرف على الفوائد والطرق الفعالة لتحسين مستواك الأكاديمي في المرحلة الثانوية.",
		image: "material/3.jpg",
		link: "Articles/html/private-tutor-high-school-success.html",
	},
	{
		id: 16,
		title: "أهمية التعليم الخصوصي في تحسين الأداء الدراسي",
		excerpt: "اكتشف أهمية التعليم الخصوصي في تعزيز التحصيل الدراسي وتحسين الأداء الأكاديمي للطلاب من خلال أساليب مخصصة وبيئة تعليمية داعمة.",
		image: "material/logo.png",
		link: "Articles/html/أهمية التعليم الخصوصي في تحسين الأداء الدراسي.html",
	},
	{
		id: 17,
		title: "الفرق بين القدرات والتحصيلي وكيفية الاستعداد لكل منهما",
		excerpt: "تعرف على الفرق بين اختبار القدرات واختبار التحصيلي في السعودية، مع دليل شامل حول كيفية الاستعداد لكل منهما لتحقيق أفضل النتائج في القبول الجامعي.",
		image: "material/logo.png",
		link: "Articles/html/الفرق بين القدرات والتحصيلي وكيفية الاستعداد لكل منهما.html",
	},
	{
		id: 18,
		title: "دليل شامل لـ Tutor قدرات – خيارات ومراجعات | معلمون",
		excerpt: "اكتشف أفضل tutor قدرات في السعودية. دليل شامل لاختيار مدرس القدرات المناسب مع مراجعات وتقييمات حقيقية.",
		image: "material/logo.png",
		link: "Articles/html/tutor-capacity-comprehensive-guide.html",
	},
	{
		id: 19,
		title: "كيف تختار أفضل مدرس خصوصي لجميع المراحل؟ | معلمون",
		excerpt: "اكتشف أهم المعايير التي يجب مراعاتها عند اختيار مدرس خصوصي لجميع المراحل الدراسية، وكيفية التمييز بين المدرسين المؤهلين والطرق الذكية لتقييم الأداء وتحقيق نتائج فعالة.",
		image: "material/logo.png",
		link: "Articles/html/كيف تختار أفضل مدرس خصوصي لجميع المراحل.html",
	},
	{
		id: 20,
		title: "متى يحتاج الطالب إلى مدرس خصوصي؟ | متى أحتاج مدرس خصوصي؟",
		excerpt: "اكتشف متى يحتاج الطالب إلى مدرس خصوصي؟ تعرف على العلامات التي تدل على الحاجة للدروس الخصوصية وأفضل التوقيتات للبدء",
		image: "material/logo.png",
		link: "Articles/html/متى-يحتاج-الطالب-إلى-مدرس-خصوصي.html",
	},
];

document.addEventListener("DOMContentLoaded", function () {
	console.log("صفحة DOM محملة بالكامل");

	const elements = {
		searchBox: document.querySelector(".search-box"),
		articlesContainer: document.getElementById("articles-container"),
		currentYear: document.getElementById("current-year"),
	};
	document.addEventListener("DOMContentLoaded", function () {
		const yearElement = document.getElementById("currentYear");
		if (yearElement) {
			yearElement.textContent = new Date().getFullYear();
		}
	});

	function displayArticles(articlesToDisplay) {
		elements.articlesContainer.innerHTML = "";
		articlesToDisplay.forEach((article) => {
			const articleElement = document.createElement("article");
			articleElement.className = "card animate__animated animate__fadeInUp";
			articleElement.innerHTML = `
			<a href="${article.link}">
				<img src="${article.image}" alt="${article.title}" loading="lazy">
				</a>
				<div class="card-body">
					<h2 class="card-title">${article.title}</h2>
					<p class="card-text">${article.excerpt}</p>
					<a href="${article.link}" class="read-more">اقرأ المزيد</a>
				</div>
				
			`;
			elements.articlesContainer.appendChild(articleElement);
		});
	}

	function searchArticles() {
		const searchTerm = elements.searchBox.value.toLowerCase();
		const filteredArticles = articles.filter(
			(article) =>
				article.title.toLowerCase().includes(searchTerm) ||
				article.excerpt.toLowerCase().includes(searchTerm)
		);
		displayArticles(filteredArticles);
	}

	function debounce(func, wait) {
		let timeout;
		return function (...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	elements.searchBox.addEventListener("input", debounce(searchArticles, 300));

	displayArticles(articles);
});
