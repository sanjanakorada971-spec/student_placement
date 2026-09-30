(() => {
	const showToast = (message, tone) => window.SPMSDemo?.showToast(message, tone);
	const sampleDrives = {
		northstar: { company: "Northstar Systems", industry: "Technology", role: "Graduate Software Engineer", location: "Bengaluru, India · Full-time · Hybrid", workLocation: "Bengaluru / Hybrid", package: "₹12.5 LPA CTC", cgpa: "7.50 / 10", backlogs: "No active backlogs", branches: "Computer Science, Information Technology", deadline: "October 18, 2026", briefingDate: "October 21, 2026", driveDate: "October 24, 2026", description: "Join a product engineering team building dependable tools used by organizations around the world. Graduate engineers contribute to design, implementation, testing, and ongoing product improvements with support from experienced mentors.", eligible: true, applied: true, status: "Shortlisted", skills: ["Java or Python", "Data structures", "SQL", "Git", "Communication"], duties: ["Build and maintain reliable services and user-facing product features.", "Collaborate with design, data, and engineering teams through code review.", "Write tested, documented code and contribute to production quality."], process: [["Online assessment", "Reasoning and coding · 75 minutes"], ["Technical rounds", "Problem solving and project discussion"], ["People conversation", "Team fit and role expectations"]] },
		vertex: { company: "Vertex Analytics", industry: "Analytics", role: "Data Analyst Associate", location: "Hyderabad, India · Full-time", workLocation: "Hyderabad", package: "₹9.2 LPA CTC", cgpa: "7.00 / 10", backlogs: "No active backlogs", branches: "Computer Science, IT, Electronics & Communication", deadline: "October 24, 2026", briefingDate: "October 27, 2026", driveDate: "October 30, 2026", description: "Work with analytics teams to prepare datasets, investigate business questions, and communicate findings. This entry-level role pairs new analysts with experienced mentors and cross-functional project teams.", eligible: true, applied: true, status: "HR interview", skills: ["SQL", "Python", "Statistics", "Data visualization", "Communication"], duties: ["Prepare and validate datasets for analysis.", "Build clear reports and dashboards for partner teams.", "Summarize findings and explain analytical methods."], process: [["Analytics assessment", "SQL and reasoning exercise"], ["Technical interview", "Project and data discussion"], ["HR conversation", "Role expectations and team fit"]] },
		asteron: { company: "Asteron Consulting", industry: "Consulting", role: "Technology Consultant", location: "Mumbai, India · Full-time", workLocation: "Mumbai with client travel", package: "₹8.8 LPA CTC", cgpa: "7.25 / 10", backlogs: "No active backlogs", branches: "Computer Science, IT, Business Administration", deadline: "October 29, 2026", briefingDate: "November 01, 2026", driveDate: "November 04, 2026", description: "Support client teams as they plan and deliver technology improvements. Associates work across structured project teams, contribute research and analysis, and help turn client needs into practical delivery plans.", eligible: true, applied: true, status: "Technical interview", skills: ["Problem solving", "SQL or Python", "Presentation", "Research", "Teamwork"], duties: ["Gather requirements and document project workflows.", "Analyze information and prepare concise recommendations.", "Coordinate delivery tasks with client and technical teams."], process: [["Case exercise", "Structured problem-solving prompt"], ["Technical discussion", "Project and analytical reasoning"], ["HR conversation", "Role expectations and location details"]] },
		meridian: { company: "Meridian Bank", industry: "Financial services", role: "Technology Associate", location: "Pune, India · Full-time", workLocation: "Pune", package: "₹10.4 LPA CTC", cgpa: "8.50 / 10", backlogs: "No active backlogs", branches: "Computer Science, IT, Business Administration", deadline: "November 02, 2026", briefingDate: "November 06, 2026", driveDate: "November 09, 2026", description: "Help build secure digital banking experiences with teams working across software delivery, data, and customer operations. This role combines technical learning with close guidance from experienced engineers.", eligible: false, applied: false, status: "Not eligible", skills: ["Java", "SQL", "Cybersecurity basics", "Analytical thinking"], duties: ["Contribute to secure software features and internal tools.", "Support testing and code review with senior team members.", "Document technical decisions and operational workflows."], process: [["Online assessment", "Reasoning and programming test"], ["Technical interview", "Core concepts and project discussion"], ["HR conversation", "Role and location discussion"]] },
		bluepeak: { company: "Bluepeak Cloud", industry: "Cloud services", role: "Cloud Platform Associate", location: "Remote / Bengaluru · Full-time", workLocation: "Remote / Bengaluru", package: "₹11.8 LPA CTC", cgpa: "7.25 / 10", backlogs: "Maximum 1 active backlog", branches: "Computer Science, IT, Electronics & Communication", deadline: "November 05, 2026", briefingDate: "November 09, 2026", driveDate: "November 12, 2026", description: "Join a platform team helping engineering groups deploy and observe cloud services. Associates learn infrastructure fundamentals while contributing to automation, reliability, and developer tooling.", eligible: true, applied: false, status: "Eligible", skills: ["Linux", "Python", "Cloud fundamentals", "Git", "Networking"], duties: ["Improve automation for cloud deployment workflows.", "Help monitor platform health and investigate service issues.", "Document operational processes and engineering tools."], process: [["Online assessment", "Technical fundamentals and reasoning"], ["Platform interview", "Systems and troubleshooting discussion"], ["People conversation", "Team fit and work preferences"]] },
	};

	const detailPage = document.querySelector("[data-drive-detail]");
	if (detailPage) {
		const companyKey = new URLSearchParams(window.location.search).get("company") || "northstar";
		const drive = sampleDrives[companyKey] || sampleDrives.northstar;
		detailPage.querySelectorAll("[data-drive-field]").forEach((field) => {
			const value = drive[field.dataset.driveField];
			if (value) field.textContent = value;
		});
		const mark = detailPage.querySelector("[data-drive-mark]");
		if (mark) mark.textContent = drive.company.slice(0, 1);
		const eligibility = detailPage.querySelector("[data-drive-eligibility]");
		if (eligibility) {
			eligibility.textContent = drive.eligible ? (drive.applied ? `Application: ${drive.status}` : "Eligible for you") : "Not eligible · CGPA below requirement";
			eligibility.className = `status-badge ${drive.eligible ? (drive.applied ? "warning" : "success") : "danger"}`;
		}
		const skills = detailPage.querySelector("[data-drive-skills]");
		if (skills) {
			skills.replaceChildren(...drive.skills.map((skill) => { const chip = document.createElement("span"); chip.className = "skill-chip"; chip.textContent = skill; return chip; }));
		}
		const duties = detailPage.querySelector("[data-drive-duties]");
		if (duties) duties.replaceChildren(...drive.duties.map((duty) => { const item = document.createElement("li"); item.textContent = duty; return item; }));
		const process = detailPage.querySelector("[data-drive-process]");
		if (process) process.replaceChildren(...drive.process.map(([title, description], index) => {
			const step = document.createElement("article");
			const number = document.createElement("span"); number.textContent = String(index + 1).padStart(2, "0");
			const heading = document.createElement("h3"); heading.textContent = title;
			const detail = document.createElement("p"); detail.textContent = description;
			step.append(number, heading, detail); return step;
		}));
		const action = detailPage.querySelector("[data-drive-action]");
		if (action) {
			if (drive.applied) {
				const link = document.createElement("a"); link.className = "action-button secondary"; link.href = "applications.html"; link.textContent = "View current application"; action.replaceChildren(link);
			} else if (!drive.eligible) {
				const badge = document.createElement("span"); badge.className = "status-badge danger"; badge.textContent = "You do not currently meet the listed CGPA requirement"; action.replaceChildren(badge);
			} else {
				const button = document.createElement("button"); button.className = "action-button"; button.type = "button"; button.dataset.applyDrive = ""; button.dataset.company = drive.company; button.dataset.role = drive.role; button.textContent = "Apply for this drive →"; action.replaceChildren(button);
			}
		}
	}

	const cards = [...document.querySelectorAll("[data-drive-card]")];
	const search = document.querySelector("[data-drive-search]");
	const filters = [...document.querySelectorAll("[data-drive-filter]")];
	const sort = document.querySelector("[data-drive-sort]");
	const list = document.querySelector("[data-drive-list]");
	const empty = document.querySelector("[data-drives-empty]");

	const render = () => {
		const query = (search?.value || "").trim().toLowerCase();
		const selected = Object.fromEntries(filters.map((filter) => [filter.dataset.driveFilter, filter.value]));
		let visibleCount = 0;
		cards.forEach((card) => {
			const matches = (!query || card.textContent.toLowerCase().includes(query)) && (!selected.company || card.dataset.company === selected.company) && (!selected.branch || card.dataset.branch.includes(selected.branch)) && (!selected.package || Number(card.dataset.package) >= Number(selected.package)) && (!selected.eligibility || card.dataset.eligible === selected.eligibility);
			card.hidden = !matches;
			if (matches) visibleCount += 1;
		});
		if (list && sort?.value) {
			cards.filter((card) => !card.hidden).sort((first, second) => {
				if (sort.value === "package") return Number(second.dataset.package) - Number(first.dataset.package);
				if (sort.value === "company") return first.dataset.company.localeCompare(second.dataset.company);
				return first.dataset.deadline.localeCompare(second.dataset.deadline);
			}).forEach((card) => list.append(card));
		}
		if (empty) empty.hidden = visibleCount > 0;
	};
	if (cards.length) {
		search?.addEventListener("input", render);
		filters.forEach((filter) => filter.addEventListener("change", render));
		sort?.addEventListener("change", render);
		render();
	}

	const readApplications = () => { try { return JSON.parse(localStorage.getItem("spms-demo-applications") || "[]"); } catch { return []; } };
	const updateApplyButtons = () => document.querySelectorAll("[data-apply-drive]").forEach((button) => {
		if (readApplications().some((application) => application.company === button.dataset.company && application.role === button.dataset.role)) {
			button.textContent = "Application saved";
			button.disabled = true;
		}
	});
	updateApplyButtons();
	document.querySelectorAll("[data-apply-drive]").forEach((button) => button.addEventListener("click", () => {
		const applications = readApplications();
		if (applications.some((application) => application.company === button.dataset.company && application.role === button.dataset.role)) { showToast("You already applied to this sample drive.", "info"); return; }
		applications.unshift({ company: button.dataset.company, role: button.dataset.role, appliedDate: new Date().toISOString().slice(0, 10), status: "Applied" });
		try {
			localStorage.setItem("spms-demo-applications", JSON.stringify(applications));
			button.textContent = "Application saved";
			button.disabled = true;
			showToast(`Sample application saved for ${button.dataset.company}.`);
		} catch { showToast("Browser storage is unavailable; the sample application was not saved.", "error"); }
	}));
})();
