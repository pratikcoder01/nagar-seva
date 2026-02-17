import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const issueSchema = z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    userId: z.string(), // In real app, get from session
    latitude: z.number().optional().default(0),
    longitude: z.number().optional().default(0),
});

export async function GET(req: Request) {
    try {
        const issues = await prisma.issue.findMany({
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true } } },
        });
        return NextResponse.json(issues);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = issueSchema.parse(body);

        const issue = await prisma.issue.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                category: validatedData.category,
                userId: validatedData.userId,
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
                status: "REPORTED",
            },
        });

        return NextResponse.json(issue);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create issue" }, { status: 400 });
    }
}
