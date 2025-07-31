document.addEventListener("DOMContentLoaded", function () {
	const contactForm = document.getElementById("contactForm");

	if (contactForm) {
		contactForm.addEventListener("submit", function (event) {
			event.preventDefault();

			// Get form values
			const name = document.getElementById("name").value;
			const phone = document.getElementById("phone").value;
			const email = document.getElementById("email").value;
			const subject = document.getElementById("subject").value;
			const message = document.getElementById("message").value;

			// Validate form
			let isValid = true;
			let errorMessage = "";

			if (!name) {
				isValid = false;
				errorMessage += "الرجاء إدخال الاسم\n";
			}

			if (!phone) {
				isValid = false;
				errorMessage += "الرجاء إدخال رقم الهاتف\n";
			} else if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
				isValid = false;
				errorMessage += "الرجاء إدخال رقم هاتف صحيح\n";
			}

			if (!email) {
				isValid = false;
				errorMessage += "الرجاء إدخال البريد الإلكتروني\n";
			} else if (!/\S+@\S+\.\S+/.test(email)) {
				isValid = false;
				errorMessage += "الرجاء إدخال بريد إلكتروني صحيح\n";
			}

			if (!subject) {
				isValid = false;
				errorMessage += "الرجاء إدخال الموضوع\n";
			}

			if (!message) {
				isValid = false;
				errorMessage += "الرجاء إدخال الرسالة\n";
			}

			if (!isValid) {
				alert("يرجى تصحيح الأخطاء التالية:\n" + errorMessage);
				return;
			}

			// In a real application, you would send this data to a server
			// For demonstration, we'll just show a success message
			alert("تم إرسال رسالتك بنجاح! سنقوم بالرد عليك في أقرب وقت ممكن.");
			contactForm.reset();
		});
	}

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
});
