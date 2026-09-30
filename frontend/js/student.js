(() => {
	const body = document.body;
	if (body.dataset.portal !== "student") return;

	const page = body.dataset.page || "dashboard";
	const pageTitles = { dashboard: "Student workspace", profile: "My profile", drives: "Placement drives", applications: "My applications", notifications: "Notifications", settings: "Settings" };
	const navigation = [["dashboard", "Dashboard", "D", "dashboard.html"], ["profile", "My Profile", "P", "profile.html"], ["drives", "Placement Drives", "V", "drives.html"], ["applications", "My Applications", "A", "applications.html"], ["notifications", "Notifications", "N", "notifications.html"], ["settings", "Settings", "S", "settings.html"]];
	const sidebar = document.getElementById("portal-sidebar");
	const topbar = document.getElementById("portal-topbar");
	const portalApp = document.getElementById("portal-app");

	if (sidebar) sidebar.innerHTML = `
		<a class="portal-brand" href="dashboard.html"><span class="brand-mark" aria-hidden="true">SP</span><span>Student Placement<strong>STUDENT PORTAL</strong></span></a>
		<p class="sidebar-caption">Workspace</p>
		<nav class="sidebar-nav" aria-label="Student pages">${navigation.map(([key, label, glyph, href]) => `<a class="sidebar-link ${page === key ? "is-active" : ""}" href="${href}" ${page === key ? 'aria-current="page"' : ""}><span class="sidebar-icon" aria-hidden="true">${glyph}</span>${label}</a>`).join("")}</nav>
		<div class="sidebar-footer"><button class="sidebar-logout" type="button" data-logout><span class="sidebar-icon" aria-hidden="true">↗</span>Log out</button></div>`;

	if (topbar) topbar.innerHTML = `
		<button class="mobile-menu-button" type="button" data-sidebar-toggle aria-label="Open navigation" aria-expanded="false">☰</button>
		<div class="topbar-title"><strong>${pageTitles[page] || "Student workspace"}</strong><span>Northfield University · 2026 / 27</span></div>
		<label class="topbar-search"><input type="search" placeholder="Search this page" aria-label="Search this page" data-global-search></label>
		<div class="topbar-actions"><a class="topbar-icon-button" href="notifications.html" aria-label="Notifications">N<span class="notification-dot" aria-hidden="true"></span></a><div class="topbar-user"><span class="avatar" aria-hidden="true">AS</span><span class="topbar-user-copy"><strong>Aanya Sharma</strong><small>Computer Science · 2027</small></span></div></div>`;

	const toastRegion = document.getElementById("toast-region");
	const showToast = (message, tone = "success") => {
		if (!toastRegion) return;
		const toast = document.createElement("div");
		toast.className = `toast ${tone}`;
		toast.setAttribute("role", "status");
		toast.textContent = message;
		toastRegion.append(toast);
		window.setTimeout(() => toast.remove(), 3600);
	};
	window.SPMSDemo = { ...(window.SPMSDemo || {}), showToast };

	const closeSidebar = () => {
		portalApp?.classList.remove("sidebar-open");
		topbar?.querySelector("[data-sidebar-toggle]")?.setAttribute("aria-expanded", "false");
	};
	topbar?.querySelector("[data-sidebar-toggle]")?.addEventListener("click", (event) => {
		const open = portalApp?.classList.toggle("sidebar-open") || false;
		event.currentTarget.setAttribute("aria-expanded", String(open));
	});
	document.querySelector("[data-sidebar-overlay]")?.addEventListener("click", closeSidebar);
	document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeSidebar(); });

	sidebar?.querySelector("[data-logout]")?.addEventListener("click", () => {
		if (!window.confirm("Log out of the student demo portal?")) return;
		try { sessionStorage.removeItem("spms-demo-session"); } catch { /* Storage is optional in this demo. */ }
		window.location.href = "../index.html";
	});
	document.querySelectorAll("[data-demo-action]").forEach((button) => button.addEventListener("click", () => showToast(`${button.dataset.demoAction} is not connected in this frontend preview.`, "info")));

	const profileForm = document.querySelector("[data-profile-form]");
	const profileFields = profileForm?.querySelectorAll("[data-profile-field]");
	const editButton = document.querySelector("[data-profile-edit]");
	const saveButton = document.querySelector("[data-profile-save]");
	const setProfileEditing = (editing) => {
		profileFields?.forEach((field) => { field.readOnly = !editing; });
		if (saveButton) saveButton.disabled = !editing;
		if (editButton) editButton.textContent = editing ? "Editing profile" : "Edit profile";
	};
	editButton?.addEventListener("click", () => setProfileEditing(true));
	profileForm?.addEventListener("submit", (event) => {
		event.preventDefault();
		if (!profileForm.reportValidity()) return;
		const profile = Object.fromEntries(new FormData(profileForm).entries());
		try {
			localStorage.setItem("spms-demo-profile", JSON.stringify(profile));
			setProfileEditing(false);
			showToast("Profile changes saved in this browser.");
		} catch { showToast("Browser storage is unavailable; profile changes were not saved.", "error"); }
	});
	if (profileForm) {
		try {
			const saved = JSON.parse(localStorage.getItem("spms-demo-profile") || "null");
			if (saved) Object.entries(saved).forEach(([key, value]) => {
				const field = profileForm.elements.namedItem(key);
				if (field && typeof value === "string") field.value = value;
			});
		} catch { /* Invalid or unavailable demo storage is ignored. */ }
	}

	document.querySelector("[data-resume-upload]")?.addEventListener("change", (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) { event.target.value = ""; showToast("Resume must be 5 MB or smaller.", "error"); return; }
		showToast(`${file.name} selected. Uploading is not connected in this demo.`, "info");
	});

	const settingsForm = document.querySelector("[data-settings-form]");
	if (settingsForm) {
		try {
			const settings = JSON.parse(localStorage.getItem("spms-student-preferences") || "null");
			if (settings) Object.entries(settings).forEach(([name, checked]) => { const input = settingsForm.elements.namedItem(name); if (input) input.checked = Boolean(checked); });
		} catch { /* Invalid or unavailable demo storage is ignored. */ }
		settingsForm.addEventListener("submit", (event) => {
			event.preventDefault();
			const preferences = Object.fromEntries([...new FormData(settingsForm)].map(([name]) => [name, true]));
			settingsForm.querySelectorAll("input[type='checkbox']").forEach((input) => { preferences[input.name] = input.checked; });
			try { localStorage.setItem("spms-student-preferences", JSON.stringify(preferences)); showToast("Notification preferences saved."); }
			catch { showToast("Browser storage is unavailable; preferences were not saved.", "error"); }
		});
	}
	document.querySelector("[data-clear-demo]")?.addEventListener("click", () => {
		if (!window.confirm("Clear saved profile, applications, and preferences from this browser?")) return;
		["spms-demo-profile", "spms-demo-applications", "spms-student-preferences"].forEach((key) => localStorage.removeItem(key));
		showToast("Saved demo data cleared. Reload the page to reset sample values.", "info");
	});

	document.querySelector("[data-mark-all-read]")?.addEventListener("click", () => {
		document.querySelectorAll("[data-notification].is-unread").forEach((item) => item.classList.remove("is-unread"));
		const count = document.querySelector(".panel-header .status-badge");
		if (count) count.textContent = "All caught up";
		showToast("All notifications marked as read.");
	});
	document.querySelectorAll("[data-notification]").forEach((item) => item.addEventListener("click", () => item.classList.remove("is-unread")));

	topbar?.querySelector("[data-global-search]")?.addEventListener("input", (event) => {
		const input = event.currentTarget;
		const query = input.value.trim().toLowerCase();
		const driveSearch = document.querySelector("[data-drive-search]");
		if (driveSearch) {
			driveSearch.value = input.value;
			driveSearch.dispatchEvent(new Event("input", { bubbles: true }));
			return;
		}
		document.querySelectorAll("[data-notification], .data-list-row, [data-application-row]").forEach((item) => {
			item.hidden = Boolean(query && !item.textContent.toLowerCase().includes(query));
		});
	});

	const chartCanvas = document.getElementById("applicationChart");
	if (chartCanvas && window.Chart) {
		new window.Chart(chartCanvas, { type: "doughnut", data: { labels: ["In progress", "Offer", "Closed"], datasets: [{ data: [3, 1, 1], backgroundColor: ["#3978b3", "#5b946c", "#cbd4dc"], borderWidth: 0 }] }, options: { maintainAspectRatio: false, cutout: "70%", plugins: { legend: { display: false } } } });
		chartCanvas.nextElementSibling?.setAttribute("hidden", "");
	}
})();
