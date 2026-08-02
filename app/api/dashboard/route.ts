import { readFile } from "fs/promises";
import path from "path";

type DatabaseRecord = {
  id: string;
  name: string;
  engine: string;
  storage: number;
  status: "active";
  createdAt: string;
};

const dataFile = path.join(process.cwd(), "data", "databases.json");

async function getDatabases(): Promise<DatabaseRecord[]> {
  try {
    const content = await readFile(dataFile, "utf8");

    const databases = JSON.parse(content);

    if (!Array.isArray(databases)) {
      return [];
    }

    return databases;
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const databases = await getDatabases();

    const databaseCount = databases.length;

    const storageUsed = databases.reduce(
      (total, database) => total + Number(database.storage || 0),
      0,
    );

    return Response.json({
      success: true,

      stats: {
        projects: 0,
        databases: databaseCount,
        storageUsed,
        storageLimit: 1024,
        status: "active",
      },

      databases: databases.map((database) => ({
        id: database.id,
        name: database.name,
        engine: database.engine,
        storage: database.storage,
        status: database.status,
        createdAt: database.createdAt,
      })),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return Response.json(
      {
        success: false,
        error: "Gagal mengambil data dashboard.",
      },
      {
        status: 500,
      },
    );
  }
}
