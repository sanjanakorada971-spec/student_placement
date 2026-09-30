(() => {
	const list = document.querySelector("[data-application-list]");
	if (!list) return;
	const filter = document.querySelector("[data-application-filter]");
	const rows = [...list.querySelectorAll("[data-application-row]")];
	const statusClasses = { Applied: "neutral", Shortlisted: "info", "Online Test": "info", "Technical Interview": "warning", "HR Interview": "warning", Selected: "success", Rejected: "danger" };
	let addedRows = [];
	const readApplications = () => { try { return JSON.parse(localStorage.getItem("spms-demo-applications") || "[]"); } catch { return []; } };

	readApplications().forEach((application) => {
		const alreadyListed = rows.some((row) => {
			const company = row.dataset.company || row.cells[0]?.querySelector(".table-primary")?.textContent.trim();
			const role = row.dataset.role || row.cells[0]?.querySelector(".table-secondary")?.textContent.trim();
			return company === application.company && role === application.role;
		});
		if (alreadyListed) return;
		const row = document.createElement("tr");
		row.dataset.applicationRow = "";
		row.dataset.status = application.status;
		row.dataset.company = application.company;
		row.dataset.role = application.role;
		const companyCell = document.createElement("td");
		const company = document.createElement("span");
		company.className = "table-primary";
		company.textContent = application.company;
		const role = document.createElement("span");
		role.className = "table-secondary";
		role.textContent = application.role;
		companyCell.append(company, role);
		const dateCell = document.createElement("td");
		dateCell.textContent = new Date(`${application.appliedDate}T00:00:00`).toLocaleDateString("en", { month: "short", day: "2-digit", year: "numeric" });
		const statusCell = document.createElement("td");
		const badge = document.createElement("span");
		badge.className = `status-badge ${statusClasses[application.status] || "neutral"}`;
		badge.textContent = application.status;
		statusCell.append(badge);
		const nextCell = document.createElement("td");
		nextCell.textContent = "Awaiting review";
		const progressCell = document.createElement("td");
		const progress = document.createElement("span");
		progress.className = "status-badge info";
		progress.textContent = "1 of 6";
		progressCell.append(progress);
		row.append(companyCell, dateCell, statusCell, nextCell, progressCell);
		list.prepend(row);
		addedRows.push(row);
	});

	const applyFilter = () => {
		const selected = filter?.value || "";
		const query = document.querySelector("[data-global-search]")?.value.trim().toLowerCase() || "";
		[...rows, ...addedRows].forEach((row) => {
			const matchesStatus = !selected || row.dataset.status === selected;
			const matchesSearch = !query || row.textContent.toLowerCase().includes(query);
			row.hidden = !(matchesStatus && matchesSearch);
		});
	};
	filter?.addEventListener("change", applyFilter);
	document.querySelector("[data-global-search]")?.addEventListener("input", applyFilter);
	applyFilter();
})();