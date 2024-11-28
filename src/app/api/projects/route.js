import { createConnection } from "../../../../lib/db.js";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const db = await createConnection();
		const sql = "SELECT * FROM projects WHERE isActive = True ORDER BY dateStarted DESC";
		const [projects] = await db.query(sql);
		
		return NextResponse.json({ projects: projects });
		
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error.message });
	}
}

export async function POST(request) {
	try {
		const body = await request.json()
		const db = await createConnection();
		const sql = "INSERT INTO projects (projectTitle, dateStarted, isActive) VALUES (?, ?, ?)";
		const [result] = await db.query(sql, [body.projectTitle,body.dateStarted, body.isActive]);
		
		return NextResponse.json({ result: result });
		
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error.message });
	}
}

export async function DELETE(request) {
	try {
		// Get the search parameters from the request
		const { searchParams } = new URL(request.url);
		const projectTitle = searchParams.get("projectTitle");

		if (!projectTitle) {
			return NextResponse.json({ error: "Project title is required" }, { status: 400 });
		}

		const db = await createConnection();
		const sql = "UPDATE projects SET isActive = FALSE WHERE projectTitle = ?";
		const [result] = await db.query(sql, [projectTitle]);

		if (result.affectedRows === 0) {
			return NextResponse.json({ error: "Project not found or already inactive" }, { status: 404 });
		}

		return NextResponse.json({ message: "Project marked as inactive successfully", result });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}