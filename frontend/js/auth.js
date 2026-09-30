(() => {
	const showMessage = (element, message, tone = "success") => {
		if (!element) return;
		element.textContent = message;
		element.classList.add("is-visible");
		element.dataset.tone = tone;
	};

	document.querySelectorAll("[data-password-toggle]").forEach((button) => {
		button.addEventListener("click", () => {
			const input = document.getElementById(button.dataset.passwordToggle);
			if (!input) return;
			const reveal = input.type === "password";
			input.type = reveal ? "text" : "password";
			button.textContent = reveal ? "Hide" : "Show";
			button.setAttribute("aria-label", `${reveal ? "Hide" : "Show"} password`);
		});
	});

	const loginForm = document.getElementById("login-form");
	if (loginForm) {
		const message = document.getElementById("login-message");
		loginForm.addEventListener("submit", (event) => {
			event.preventDefault();
			if (!loginForm.reportValidity()) return;
			const formData = new FormData(loginForm);
			const role = formData.get("role");
			const email = formData.get("email");
			const destination = role === "student" ? "student/dashboard.html" : "officer/dashboard.html";
			try {
				sessionStorage.setItem("spms-demo-session", JSON.stringify({ role, email }));
			} catch {
				showMessage(message, "Your browser blocked local demo storage. Continuing to the sample portal.", "warning");
			}
			window.location.href = destination;
		});

		document.getElementById("forgot-password")?.addEventListener("click", () => {
			showMessage(message, "Password recovery is not connected in this frontend preview. Contact your placement office for account help.", "info");
		});
	}

	const registerForm = document.getElementById("register-form");
	if (registerForm) {
		const message = document.getElementById("register-message");
		const password = document.getElementById("register-password");
		const confirmPassword = document.getElementById("confirm-password");

		const validatePasswordMatch = () => {
			confirmPassword.setCustomValidity(confirmPassword.value && password.value !== confirmPassword.value ? "Passwords do not match." : "");
		};
		password.addEventListener("input", validatePasswordMatch);
		confirmPassword.addEventListener("input", validatePasswordMatch);

		registerForm.addEventListener("submit", (event) => {
			event.preventDefault();
			validatePasswordMatch();
			if (!registerForm.reportValidity()) return;

			const resume = document.getElementById("resume").files[0];
			if (resume && resume.size > 5 * 1024 * 1024) {
				showMessage(message, "The selected resume is larger than 5 MB. Choose a smaller file to continue.", "error");
				return;
			}

			const profile = Object.fromEntries(new FormData(registerForm).entries());
			delete profile.password;
			delete profile.confirmPassword;
			delete profile.terms;
			delete profile.resume;
			try {
				localStorage.setItem("spms-demo-profile", JSON.stringify(profile));
			} catch {
				showMessage(message, "Your browser could not save demo data. Your form is valid; continue to sign in.", "warning");
				return;
			}
			showMessage(message, "Registration preview complete. Your sample profile is saved in this browser. You can now sign in to the student demo.");
			registerForm.querySelector("button[type='submit']").textContent = "Registration preview saved";
		});
	}
})();