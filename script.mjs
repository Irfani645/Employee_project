(async function () {
	let employees = [];
	let selectedEmployeeId = null;
	let selectedEmployee = null;

	const employeeList = document.querySelector(
		".employees__names--list"
	);
	const employeeInfo = document.querySelector(
		".employees__single--info"
	);

	// Add Employee - START
	const createEmployee = document.querySelector(
		".createEmployee"
	);
	const addEmployeeModal = document.querySelector(".addEmployee");
	const addEmployeeForm = document.querySelector(
		".addEmployee_create"
	);

	createEmployee.addEventListener("click", () => {
		addEmployeeModal.style.display = "flex";
	});

	addEmployeeModal.addEventListener("click", (e) => {
		if (e.target.className === "addEmployee") {
			addEmployeeModal.style.display = "none";
		}
	});

	// Set Employee age to be entered minimum 18 years
	const dobInput = document.querySelector(
		".addEmployee_create--dob"
	);
	dobInput.max = `${new Date().getFullYear() - 18}-${new Date().toISOString().slice(5, 10)}`;

	addEmployeeForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const formData = new FormData(addEmployeeForm);
		const values = [...formData.entries()];
		let empData = {};
		values.forEach((val) => {
			empData[val[0]] = val[1];
		});
		empData.id = employees.length > 0 ? employees[employees.length - 1].id + 1 : 1001;
		empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
		empData.imageUrl = empData.imageUrl || "gfg.png";
		employees.push(empData);
		renderEmployees();
		addEmployeeForm.reset();
		addEmployeeModal.style.display = "none";
	});
	// Add Employee - END

	// Select Employee Logic - START
	employeeList.addEventListener("click", (e) => {
		if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
			selectedEmployeeId = e.target.id;
			renderEmployees();
			renderSingleEmployee();
		}
		// Employee Delete Logic - START
		if (e.target.tagName === "I") {
			employees = employees.filter(
				(emp) => String(emp.id) !== e.target.parentNode.id
			);
			if (String(selectedEmployeeId) === e.target.parentNode.id) {
				selectedEmployeeId = employees[0]?.id || null;
				selectedEmployee = employees[0] || null;
				renderSingleEmployee();
			}
			renderEmployees();
		}
		// Employee Delete Logic - END
	});
	// Select Employee Logic - END

	// Render All Employees Logic - START
	const renderEmployees = () => {
		employeeList.innerHTML = "";
		employees.forEach((emp) => {
			const employee = document.createElement("span");
			employee.classList.add("employees__names--item");
			if (parseInt(selectedEmployeeId, 10) === emp.id) {
				employee.classList.add("selected");
				selectedEmployee = emp;
			}
			employee.setAttribute("id", emp.id);
			employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">&#10060;</i>`;
			employeeList.append(employee);
		});
	};
	// Render All Employees Logic - END

	// Render Single Employee Logic - START
	const renderSingleEmployee = () => {
		// Employee Delete Logic - START
		if (!selectedEmployeeId) {
			employeeInfo.innerHTML = "";
			return;
		}
		// Employee Delete Logic - END

		employeeInfo.innerHTML = `
		<img src="${selectedEmployee.imageUrl}" />
		<span class="employees__single--heading">
		${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
		</span>
		<span>${selectedEmployee.address}</span>
		<span>${selectedEmployee.email}</span>
		<span>Mobile - ${selectedEmployee.contactNumber}</span>
		<span>DOB - ${selectedEmployee.dob}</span>
		`;
	};
	// Render Single Employee Logic - END

	renderEmployees();

	// Save Data and Generate PDF
	const saveDataButton = document.querySelector('.saveData');
	saveDataButton.addEventListener('click', () => {
		const { jsPDF } = window.jspdf;
		const doc = new jsPDF();

		// Add logo and title
		const logo = new Image();
		logo.src = 'pimslogo.png';
		logo.onload = () => {
			doc.addImage(logo, 'PNG', 10, 10, 25, 25);
			doc.setFontSize(18);
			doc.text('PIMS Employees Database Management', 40, 25);

			// Add table headers
			doc.setFontSize(10);
			doc.setTextColor(255, 255, 255);
			doc.setFillColor(0, 102, 204);
			doc.rect(10, 45, 190, 10, 'F');
			doc.text('ID', 12, 52);
			doc.text('Name', 30, 52);
			doc.text('Email', 70, 52);
			doc.text('Contact', 110, 52);
			doc.text('Address', 150, 52);
			doc.text('DOB', 190, 52);

			// Add employee data
			doc.setFontSize(8);
			doc.setTextColor(0, 0, 0);
			let yOffset = 60;
			employees.forEach((emp) => {
				doc.text(String(emp.id), 12, yOffset);
				doc.text(`${emp.firstName} ${emp.lastName}`, 30, yOffset);
				doc.text(emp.email, 70, yOffset);
				doc.text(String(emp.contactNumber), 110, yOffset);
				doc.text(emp.address, 150, yOffset);
				doc.text(emp.dob, 190, yOffset);
				yOffset += 10;
			});

			doc.save('employees.pdf');
		};
	});
})();
