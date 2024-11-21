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

	const [employees, setEmployees] = useState<Employee[]>([]);

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

		fetchEmployees();
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
		</div>
	);
}
