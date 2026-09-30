(() => {
	const body = document.body;
	if (body.dataset.portal !== "officer") return;

	const page = body.dataset.page || "dashboard";
	const titles = { dashboard: "Officer workspace", companies: "Companies", drives: "Placement drives", students: "Students", applications: "Applications", results: "Results management", reports: "Placement reports", settings: "Settings" };
	const links = [["dashboard", "Dashboard", "D", "dashboard.html"], ["companies", "Companies", "C", "companies.html"], ["drives", "Placement Drives", "V", "drives.html"], ["students", "Students", "S", "students.html"], ["applications", "Applications", "A", "applications.html"], ["results", "Results", "R", "results.html"], ["reports", "Reports", "P", "reports.html"], ["settings", "Settings", "T", "settings.html"]];
	const sidebar = document.getElementById("portal-sidebar");
	const topbar = document.getElementById("portal-topbar");
	const portalApp = document.getElementById("portal-app");
	if (sidebar) sidebar.innerHTML = `
		<a class="portal-brand" href="dashboard.html"><span class="brand-mark" aria-hidden="true">SP</span><span>Student Placement<strong>OFFICER PORTAL</strong></span></a>
		<p class="sidebar-caption">Administration</p>
		<nav class="sidebar-nav" aria-label="Officer pages">${links.map(([key, label, glyph, href]) => `<a class="sidebar-link ${page === key ? "is-active" : ""}" href="${href}" ${page === key ? 'aria-current="page"' : ""}><span class="sidebar-icon" aria-hidden="true">${glyph}</span>${label}</a>`).join("")}</nav>
		<div class="sidebar-footer"><button class="sidebar-logout" type="button" data-logout><span class="sidebar-icon" aria-hidden="true">↗</span>Log out</button></div>`;
	if (topbar) topbar.innerHTML = `
		<button class="mobile-menu-button" type="button" data-sidebar-toggle aria-label="Open navigation" aria-expanded="false">☰</button>
		<div class="topbar-title"><strong>${titles[page] || "Officer workspace"}</strong><span>Northfield University · 2026 / 27</span></div>
		<label class="topbar-search"><input type="search" placeholder="Search this page" aria-label="Search this page" data-global-search></label>
		<div class="topbar-actions"><button class="topbar-icon-button" type="button" aria-label="Officer alerts" data-demo-action="Officer alerts">N<span class="notification-dot" aria-hidden="true"></span></button><div class="topbar-user"><span class="avatar" aria-hidden="true">MK</span><span class="topbar-user-copy"><strong>Mira Kapoor</strong><small>Placement Officer</small></span></div></div>`;

	const toastRegion = document.getElementById("toast-region");
	const toast = (message, tone = "success") => {
		if (!toastRegion) return;
		const item = document.createElement("div");
		item.className = `toast ${tone}`;
		item.setAttribute("role", "status");
		item.textContent = message;
		toastRegion.append(item);
		window.setTimeout(() => item.remove(), 3600);
	};
	window.SPMSDemo = { ...(window.SPMSDemo || {}), showToast: toast };

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
		if (!window.confirm("Log out of the officer demo portal?")) return;
		try { sessionStorage.removeItem("spms-demo-session"); } catch { /* Storage is optional in this demo. */ }
		window.location.href = "../index.html";
	});
	document.querySelectorAll("[data-demo-action]").forEach((button) => button.addEventListener("click", () => toast(`${button.dataset.demoAction} are not connected in this frontend preview.`, "info")));

	const searchFields = [...document.querySelectorAll("[data-table-search]")];
	const filters = [...document.querySelectorAll("[data-table-filter]")];
	const sortControl = document.querySelector("[data-table-sort]");
	const lists = [...document.querySelectorAll("[data-record-list]")];
	const applyTableFilters = () => {
		const query = searchFields.map((input) => input.value.trim().toLowerCase()).find(Boolean) || "";
		let visible = 0;
		document.querySelectorAll("[data-record-row]").forEach((row) => {
			const matchesSearch = !query || row.textContent.toLowerCase().includes(query);
			const matchesFilters = filters.every((filter) => !filter.value || (row.dataset[filter.dataset.tableFilter] || "").toLowerCase().includes(filter.value.toLowerCase()));
			row.hidden = !(matchesSearch && matchesFilters);
			if (!row.hidden) visible += 1;
		});
		const empty = document.querySelector("[data-table-empty]");
		if (empty) empty.hidden = visible > 0;
	};
	searchFields.forEach((input) => input.addEventListener("input", applyTableFilters));
	filters.forEach((filter) => filter.addEventListener("change", applyTableFilters));
	document.querySelectorAll("[data-global-search]").forEach((input) => input.addEventListener("input", () => {
		searchFields.forEach((field) => { field.value = input.value; });
		applyTableFilters();
	}));
	sortControl?.addEventListener("change", () => {
		const key = sortControl.value;
		const list = lists[0];
		if (!list || !key) return;
		[...list.querySelectorAll("[data-record-row]")].sort((first, second) => {
			if (key === "cgpa") return Number(second.dataset.cgpa) - Number(first.dataset.cgpa);
			return (first.dataset[key] || "").localeCompare(second.dataset[key] || "");
		}).forEach((row) => list.append(row));
	});

	const dialog = document.querySelector("[data-record-dialog]");
	const openRecordDialog = (row) => {
		if (!dialog) return;
		const title = row.querySelector(".table-primary")?.textContent || row.cells[0]?.textContent.trim() || "Record details";
		const titleElement = dialog.querySelector("[data-dialog-title]");
		const content = dialog.querySelector("[data-dialog-content]");
		titleElement.textContent = title;
		content.replaceChildren();
		[...row.cells].forEach((cell, index) => {
			if (index === row.cells.length - 1 && cell.querySelector("button")) return;
			const line = document.createElement("p");
			line.className = "section-note";
			line.textContent = cell.textContent.trim().replace(/\s+/g, " · ");
			content.append(line);
		});
		dialog.showModal();
	};
	document.querySelectorAll("[data-view-record]").forEach((button) => { button.dataset.bound = "true"; button.addEventListener("click", () => openRecordDialog(button.closest("tr"))); });
	document.querySelectorAll("[data-edit-record]").forEach((button) => { button.dataset.bound = "true"; button.addEventListener("click", () => {
		const row = button.closest("tr");
		const primary = row?.querySelector(".table-primary");
		if (!primary) return;
		const updated = window.prompt("Edit the displayed record name:", primary.textContent.trim());
		if (updated?.trim()) { primary.textContent = updated.trim(); toast("Sample record name updated in this view."); }
	}); });
	document.querySelectorAll("[data-delete-record]").forEach((button) => { button.dataset.bound = "true"; button.addEventListener("click", () => {
		if (!window.confirm("Delete this sample company from the current view?")) return;
		button.closest("tr")?.remove();
		toast("Sample company removed from the current view.", "info");
	}); });
	document.querySelectorAll("[data-close-drive]").forEach((button) => { button.dataset.bound = "true"; button.addEventListener("click", () => {
		if (button.disabled || !window.confirm("Close this sample placement drive?")) return;
		const row = button.closest("tr");
		row.dataset.status = "Closed";
		const badge = row.querySelector(".status-badge");
		if (badge) { badge.textContent = "Closed"; badge.className = "status-badge neutral"; }
		button.textContent = "Closed";
		button.disabled = true;
		applyTableFilters();
		toast("Drive closed in this browser preview.", "info");
	}); });

	document.querySelectorAll("[data-status-update]").forEach((select) => select.addEventListener("change", () => {
		const row = select.closest("tr");
		row.dataset.status = select.value;
		try {
			const statuses = JSON.parse(localStorage.getItem("spms-officer-application-statuses") || "{}");
			const identity = row.cells[0]?.textContent.trim() || "sample";
			statuses[identity] = select.value;
			localStorage.setItem("spms-officer-application-statuses", JSON.stringify(statuses));
		} catch { /* Status remains changed in this view if storage is unavailable. */ }
		applyTableFilters();
		toast(`Application status updated to ${select.value}.`);
	}));
	document.querySelectorAll("[data-result-update], [data-final-result]").forEach((select) => select.addEventListener("change", () => {
		const row = select.closest("tr");
		if (select.hasAttribute("data-final-result")) row.dataset.result = select.value;
		try {
			const results = JSON.parse(localStorage.getItem("spms-officer-results") || "{}");
			const identity = row.cells[0]?.textContent.trim() || "sample";
			results[identity] = results[identity] || {};
			results[identity][select.getAttribute("aria-label") || "stage"] = select.value;
			localStorage.setItem("spms-officer-results", JSON.stringify(results));
		} catch { /* Result remains changed in this view if storage is unavailable. */ }
		applyTableFilters();
		toast("Sample result updated.");
	}));
	document.querySelector("[data-publish-results]")?.addEventListener("click", () => {
		if (!window.confirm("Publish the visible sample results? This will not notify students.")) return;
		toast("Sample results marked as published in this view.", "info");
	});

	const readList = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
	const saveList = (key, records) => localStorage.setItem(key, JSON.stringify(records));
	const companyForm = document.querySelector("[data-company-form]");
	companyForm?.addEventListener("submit", (event) => {
		event.preventDefault();
		if (!companyForm.reportValidity()) return;
		const record = Object.fromEntries(new FormData(companyForm).entries());
		record.status = "Prospect";
		record.openRoles = "0";
		record.package = "To be confirmed";
		record.driveDate = "Not scheduled";
		try { saveList("spms-officer-companies", [...readList("spms-officer-companies"), record]); }
		catch { toast("Browser storage is unavailable; the company was not saved.", "error"); return; }
		window.location.href = "companies.html";
	});

	const driveForm = document.querySelector("[data-drive-form]");
	driveForm?.addEventListener("submit", (event) => {
		event.preventDefault();
		if (!driveForm.reportValidity()) return;
		const branches = [...driveForm.querySelectorAll("input[name='branches']:checked")].map((input) => input.value);
		if (!branches.length) { toast("Choose at least one eligible branch.", "error"); return; }
		const record = Object.fromEntries(new FormData(driveForm).entries());
		record.branches = branches;
		record.status = "Draft";
		record.applications = 0;
		try { saveList("spms-officer-drives", [...readList("spms-officer-drives"), record]); }
		catch { toast("Browser storage is unavailable; the drive was not saved.", "error"); return; }
		window.location.href = "drives.html";
	});

	const companiesList = document.querySelector("[data-record-list]");
	if (page === "companies" && companiesList) readList("spms-officer-companies").forEach((record) => {
		const row = document.createElement("tr");
		row.dataset.recordRow = ""; row.dataset.industry = record.industry || "Other"; row.dataset.status = record.status || "Prospect";
		const cell = document.createElement("td");
		const company = document.createElement("div"); company.className = "company-cell";
		const mark = document.createElement("span"); mark.className = "company-monogram company-blue"; mark.textContent = (record.name || "?").slice(0, 1).toUpperCase();
		const text = document.createElement("span");
		const name = document.createElement("span"); name.className = "table-primary"; name.textContent = record.name;
		const website = document.createElement("span"); website.className = "table-secondary"; website.textContent = record.website || record.email || "New partner";
		text.append(name, website); company.append(mark, text); cell.append(company); row.append(cell);
		[record.industry, record.location, record.openRoles, record.package, record.driveDate].forEach((value) => { const data = document.createElement("td"); data.textContent = value || "—"; row.append(data); });
		const status = document.createElement("td"); const badge = document.createElement("span"); badge.className = "status-badge warning"; badge.textContent = record.status || "Prospect"; status.append(badge); row.append(status);
		const actions = document.createElement("td"); actions.innerHTML = '<div class="officer-table-actions"><button class="action-button secondary small" type="button" data-view-record>View</button><button class="action-button secondary small" type="button" data-edit-record>Edit</button><button class="action-button danger small" type="button" data-delete-record>Delete</button></div>'; row.append(actions);
		companiesList.append(row);
	});

	const drivesList = page === "drives" ? document.querySelector("[data-record-list]") : null;
	if (drivesList) readList("spms-officer-drives").forEach((record) => {
		const row = document.createElement("tr"); row.dataset.recordRow = ""; row.dataset.status = record.status || "Draft"; row.dataset.company = record.company;
		const roleCell = document.createElement("td"); const company = document.createElement("span"); company.className = "table-primary"; company.textContent = record.company; const role = document.createElement("span"); role.className = "table-secondary"; role.textContent = record.role; roleCell.append(company, role); row.append(roleCell);
		[record.package ? `₹${record.package} LPA` : "—", `CGPA ${record.minimumCgpa} · ${(record.branches || []).join(", ")}`, "0", record.deadline, record.driveDate].forEach((value) => { const cell = document.createElement("td"); cell.textContent = value || "—"; row.append(cell); });
		const statusCell = document.createElement("td"); const badge = document.createElement("span"); badge.className = "status-badge neutral"; badge.textContent = record.status || "Draft"; statusCell.append(badge); row.append(statusCell);
		const actions = document.createElement("td"); actions.innerHTML = '<div class="officer-table-actions"><button class="action-button secondary small" type="button" data-view-record>View</button><button class="action-button secondary small" type="button" data-edit-record>Edit</button><button class="action-button danger small" type="button" data-close-drive>Close</button></div>'; row.append(actions);
		drivesList.append(row);
	});

	const bindAddedRows = () => {
		document.querySelectorAll("[data-view-record]").forEach((button) => { if (button.dataset.bound) return; button.dataset.bound = "true"; button.addEventListener("click", () => openRecordDialog(button.closest("tr"))); });
		document.querySelectorAll("[data-edit-record]").forEach((button) => { if (button.dataset.bound) return; button.dataset.bound = "true"; button.addEventListener("click", () => { const primary = button.closest("tr")?.querySelector(".table-primary"); const next = primary && window.prompt("Edit the displayed record name:", primary.textContent.trim()); if (next?.trim()) { primary.textContent = next.trim(); toast("Sample record name updated in this view."); } }); });
		document.querySelectorAll("[data-delete-record]").forEach((button) => { if (button.dataset.bound) return; button.dataset.bound = "true"; button.addEventListener("click", () => { if (window.confirm("Delete this sample company from the current view?")) { button.closest("tr")?.remove(); applyTableFilters(); toast("Sample company removed from the current view.", "info"); } }); });
		document.querySelectorAll("[data-close-drive]").forEach((button) => { if (button.dataset.bound) return; button.dataset.bound = "true"; button.addEventListener("click", () => { if (button.disabled || !window.confirm("Close this sample placement drive?")) return; const row = button.closest("tr"); row.dataset.status = "Closed"; const badge = row.querySelector(".status-badge"); if (badge) { badge.textContent = "Closed"; badge.className = "status-badge neutral"; } button.textContent = "Closed"; button.disabled = true; applyTableFilters(); toast("Drive closed in this browser preview.", "info"); }); });
	};
	bindAddedRows();
	applyTableFilters();

	document.querySelectorAll("[data-export-report]").forEach((button) => button.addEventListener("click", () => {
		const rows = [["Metric", "Sample value"], ["Total students", "1248"], ["Total placed", "536"], ["Placement percentage", "74.3%"], ["Highest package", "32 LPA"], ["Average package", "8.6 LPA"], ["Companies visited", "52"]];
		const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
		const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
		const link = document.createElement("a"); link.href = url; link.download = "placement-report-demo.csv"; link.click(); URL.revokeObjectURL(url);
		toast("Sample report exported as CSV.");
	}));

	const saveSettings = (form, key, message) => form?.addEventListener("submit", (event) => {
		event.preventDefault();
		const values = Object.fromEntries(new FormData(form).entries());
		form.querySelectorAll("input[type='checkbox']").forEach((input) => { values[input.name] = input.checked; });
		try { localStorage.setItem(key, JSON.stringify(values)); toast(message); }
		catch { toast("Browser storage is unavailable; settings were not saved.", "error"); }
	});
	saveSettings(document.querySelector("[data-officer-profile]"), "spms-officer-profile", "Officer profile saved in this browser.");
	saveSettings(document.querySelector("[data-officer-settings]"), "spms-officer-notifications", "Notification preferences saved.");
	saveSettings(document.querySelector("[data-system-settings]"), "spms-officer-system-settings", "System preferences saved.");

	const chart = (id, type, labels, values, colors, extra = {}) => {
		const canvas = document.getElementById(id);
		if (!canvas || !window.Chart) return;
		new window.Chart(canvas, { type, data: { labels, datasets: [{ label: "Students", data: values, backgroundColor: colors, borderColor: colors, borderWidth: type === "line" ? 2 : 0, tension: 0.35, fill: type === "line" ? true : undefined }] }, options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { display: type === "doughnut", position: "bottom", labels: { boxWidth: 9, font: { size: 9 } } } }, scales: type === "doughnut" ? {} : { y: { beginAtZero: true, grid: { color: "#edf1f4" }, ticks: { font: { size: 9 } } }, x: { grid: { display: false }, ticks: { font: { size: 9 } } } }, ...extra } });
		canvas.nextElementSibling?.setAttribute("hidden", "");
	};
	chart("branchChart", "bar", ["Computer Science", "Information Tech", "Electronics", "Mechanical", "Electrical"], [176, 122, 86, 74, 52], "#4f82b1");
	chart("companyChart", "bar", ["Northstar", "Vertex", "Asteron", "Meridian", "Cedar"], [62, 48, 39, 31, 24], "#6b9bc2", { indexAxis: "y", scales: { x: { beginAtZero: true, grid: { color: "#edf1f4" }, ticks: { font: { size: 9 } } }, y: { grid: { display: false }, ticks: { font: { size: 9 } } } } });
	chart("trendChart", "line", ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"], [18, 34, 29, 55, 67, 88, 74], "#3978b3", { plugins: { legend: { display: false } } });
	chart("departmentReportChart", "bar", ["CS", "IT", "ECE", "ME", "EE"], [176, 122, 86, 74, 52], "#4f82b1");
	chart("companyReportChart", "bar", ["Northstar", "Vertex", "Asteron", "Meridian", "Cedar"], [62, 48, 39, 31, 24], "#6b9bc2", { indexAxis: "y" });
	chart("packageReportChart", "doughnut", ["<5 LPA", "5–8 LPA", "8–12 LPA", "12–20 LPA", "20+ LPA"], [54, 148, 176, 112, 46], ["#a9c1d7", "#7399bb", "#3d73a5", "#dbad54", "#c96a54"]);
	chart("placementReportChart", "line", ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"], [18, 34, 29, 55, 67, 88, 74], "#3978b3", { plugins: { legend: { display: false } } });
})();