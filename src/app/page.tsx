"use client";

import { ReactNode, useEffect, useState } from "react";
import React from "react";

export default function Home() {
	interface Employee {
		id: number;
		firstname: string;
		lastname: string;
		email: string;
		role: string;
		isAvailable: boolean;
	}

	interface Project {
		id: number;
		projectTitle: string;
		dateStarted: string;
		isActive: boolean;
	}

	const [employees, setEmployees] = useState<Employee[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProjects, setSelectedProjects] = useState<{ [key: number]: number }>({});

	const addProjectToDatabase = async ({ projectTitle }: { projectTitle: string }) => {
		try {
			const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format as 'YYYY-MM-DD HH:mm:ss'
			const data = await fetch("/api/projects", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					projectTitle: projectTitle,
					dateStarted: formattedDate,
					isActive: true,
				}),
			});
			const response = await data.json();

			console.log(response);

			// Optionally refetch projects to update list
			const fetchProjects = async () => {
				const data = await fetch("/api/projects");
				const response = await data.json();
				setProjects(response.projects);
			};
			fetchProjects();


		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		const fetchEmployees = async () => {
			try {
				const data = await fetch("/api/employees");
				const response = await data.json();

				setEmployees(response.employees);
				console.log(response.employees);
			} catch (error) {
				console.error(error);
			}
		};

		const fetchProjects = async () => {
			try {
				const data = await fetch("/api/projects");
				const response = await data.json();

				setProjects(response.projects);
				console.log(response.projects);
			} catch (error) {
				console.error(error);
			}
		};

		fetchEmployees();
		fetchProjects();
	}, []);


	// Handle project selection
	const handleProjectSelect = (employeeId: number, projectId: number) => {
		setSelectedProjects((prev) => ({
			...prev,
			[employeeId]: projectId,
		}));
	};

	// Handle assignment
	const assignProject = async (employeeId: number) => {
		const projectId = selectedProjects[employeeId];
		if (!projectId) {
			alert("Please select a project!");
			return;
		}

		try {
			const response = await fetch("/api/project_assignments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ employeeId, projectId }),
			});

			const result = await response.json();
			console.log(result);

			// Optionally refetch employees to update availability
			const fetchEmployees = async () => {
				try {
					const data = await fetch("/api/employees");
					const response = await data.json();
					setEmployees(response.employees);
					
				} catch (error) {
					console.error("Failed to fetch employees after assignment", error);
				}
			};
			
			await fetchEmployees();

			alert("Project assigned successfully!");
		} catch (error) {
			console.error(error);
			alert("Failed to assign project!");
		}
	};






	return (
		<div className="m-10 space-y-20">
			<div>
				<h1 className="text-4xl font-bold mb-5">Available Employees (GET)</h1>
				<table>
					<thead>
						<tr>
							<th className="text-left min-w-[150px]">Name</th>
							<th className="text-left min-w-[300px]">Email</th>
							<th className="text-left min-w-[200px]">Role</th>
							<th className="text-left min-w-[200px]">Assign to Project</th>
							<th className="text-left min-w-[150px]">Action</th>
						</tr>
					</thead>
					<tbody>
						{employees.map((employee) => (
							<tr key={employee.id}>
								<td>{employee.lastname.toUpperCase() + ", " + employee.firstname}</td>
								<td>{employee.email}</td>
								<td>{employee.role}</td>
								<td>
									<select
										name="project"
										title="project"
										value={selectedProjects[employee.id] || ""}
										onChange={(e) => handleProjectSelect(employee.id, Number(e.target.value))}
										className="border border-gray-300 rounded p-2"
										disabled={!employee.isAvailable} // Disable if employee is unavailable
									>
										<option value="">Select Project</option>
										{projects.map((project) => (
											<option key={project.id} value={project.id}>
												{project.projectTitle}
											</option>
										))}
									</select>
								</td>
								<td>
									<button
										type="button"
										onClick={() => assignProject(employee.id)}
										className="bg-blue-500 text-white rounded px-3 py-2"
										disabled={!employee.isAvailable} // Disable if employee is unavailable
									>
										Confirm
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div>
				<h1 className="text-4xl font-bold mb-5">Active Projects (GET)</h1>
				<table>
					<thead>
						<tr>
							<th className="text-left min-w-[250px]">Project Title</th>
							<th className="text-left min-w-[200px]">Date started</th>
						</tr>
					</thead>
					<tbody>
						{projects.map((project) => (
							<tr key={project.id}>
								<td>{project.projectTitle}</td>
								<td>{new Date(project.dateStarted).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div>
				<h1 className="text-4xl font-bold mb-5">Add Project (POST)</h1>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						const formData = new FormData(e.target as HTMLFormElement);
						const projectTitle = formData.get("projectTitle") as string;

						addProjectToDatabase({ projectTitle });
					}}
				>
					<label htmlFor="projectTitle" className="block mb-2">
						Project Title
					</label>
					<input type="text" id="projectTitle" name="projectTitle" className="w-full border border-gray-300 rounded p-2 mb-5" />

					<button type="submit" className="bg-blue-500 text-white rounded px-3 py-2">
						Add Project
					</button>
				</form>
			</div>

			<div>
				<h1 className="text-4xl font-bold mb-5">Close Project (DELETE)</h1>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						const formData = new FormData(e.target as HTMLFormElement);
						const projectTitle = formData.get("projectTitle") as string;
						
						if (!projectTitle) {
							alert("Please select a project!");
							return;
						}

						try {
							// Send DELETE request with projectTitle as a query parameter
							const response = await fetch(`/api/projects?projectTitle=${encodeURIComponent(projectTitle)}`, {
								method: "DELETE",
							});
							const result = await response.json();
							console.log(result);
			
							// Optionally refetch projects to update list
							const fetchProjects = async () => {
								const data = await fetch("/api/projects");
								const response = await data.json();
								setProjects(response.projects);
							};
							await fetchProjects();

							// Optionally refetch employees to update availability
							const fetchEmployees = async () => {
								const data = await fetch("/api/employees");
								const response = await data.json();
								setEmployees(response.employees);
							};
							await fetchEmployees();
			
							alert("Project closed successfully!");
						} catch (error) {
							console.error(error);
							alert("Failed to close project!");
						}
					}}
				>
					<label htmlFor="projectTitle" className="block mb-2">
						Project Title
					</label>
					<select id="projectTitle" name="projectTitle" className="w-full border border-gray-300 rounded p-2 mb-5">
						<option value="">Select Project</option>
						{projects.map((project) => (
							<option key={project.id} value={project.projectTitle}>
								{project.projectTitle}
							</option>
						))}
					</select>
					<button type="submit" className="bg-red-500 text-white rounded px-3 py-2">
						Close Project
					</button>
				</form>
			</div>
		</div>
	);
}
