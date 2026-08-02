import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "databases.json");

type DatabaseRecord = {
  id: string;
  name: string;
  engine: string;
  storage: number;
  status: "active";
  createdAt: string;
};

async function getDatabases(): Promise<DatabaseRecord[]> {
  try {
    const content = await readFile(dataFile, "utf8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function GET() {
  const databases = await getDatabases();

  return Response.json({
    success: true,
    databases,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const engine = String(body.engine ?? "").trim();
    const storage = Number(body.storage ?? 0);

    if (!name) {
      return Response.json(
        { error: "Nama database wajib diisi." },
        { status: 400 },
      );
    }

    if (!engine) {
      return Response.json(
        { error: "Engine database wajib dipilih." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(storage) || storage <= 0) {
      return Response.json(
        { error: "Storage harus lebih dari 0." },
        { status: 400 },
      );
    }

    const databases = await getDatabases();

    const duplicate = databases.some(
      (database) => database.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicate) {
      return Response.json(
        { error: "Nama database sudah digunakan." },
        { status: 409 },
      );
    }

    const database: DatabaseRecord = {
      id: randomUUID(),
      name,
      engine,
      storage,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    databases.push(database);

    await mkdir(dataDirectory, { recursive: true });
    await writeFile(dataFile, JSON.stringify(databases, null, 2), "utf8");

    return Response.json(
      {
        success: true,
        database,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Gagal membuat database:", error);

    return Response.json({ error: "Gagal membuat database." }, { status: 500 });
  }
}
