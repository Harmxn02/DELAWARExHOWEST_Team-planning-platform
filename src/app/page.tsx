"use client";

import { ReactNode, useEffect, useState } from "react";

export default function Home() {
	interface Employee {
		id: number;
		firstname: string;
		lastname: string;
		email: string;
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

	return (
		<div className="m-10 space-y-20">
			<div>
				<h1 className="text-4xl font-bold mb-5">Employees</h1>
				<table>
					<thead>
						<tr>
							<th className="text-left min-w-[150px]">First Name</th>
							<th className="text-left min-w-[150px]">Last Name</th>
							<th className="text-left min-w-[300px]">Email</th>
							<th className="text-left min-w-[150px]">Availability</th>
						</tr>
					</thead>
					<tbody>
						{employees.map((employee) => (
							<tr key={employee.id}>
								<td>{employee.firstname}</td>
								<td>{employee.lastname}</td>
								<td>{employee.email}</td>
								<td>{employee.isAvailable ? "✅" : "❌"}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div>
				<h1 className="text-4xl font-bold mb-5">Projects</h1>
				<table>
					<thead>
						<tr>
							<th className="text-left min-w-[250px]">Project Title</th>
							<th className="text-left min-w-[300px]">Date started</th>
							<th className="text-left min-w-[150px]">Is active</th>
						</tr>
					</thead>
					<tbody>
						{projects.map((project) => (
							<tr key={project.id}>
								<td>{project.projectTitle}</td>
								<td>{new Date(project.dateStarted).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
								<td>{project.isActive ? "✅" : "❌"}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
