import { createConnection } from "../../../../lib/db.js";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const db = await createConnection();
		const sql = "SELECT * FROM projects ORDER BY dateStarted DESC";
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