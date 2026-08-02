import { readFile, writeFile } from "fs/promises";
import path from "path";

type Column = {
  id: string;
  name: string;
  type: string;
  primaryKey: boolean;
  nullable: boolean;
};

type Table = {
  id: string;
  name: string;
  columns: Column[];
  position: {
    x: number;
    y: number;
  };
};

type DatabaseSchema = {
  databaseId: string;
  tables: Table[];
  updatedAt: string;
};

const dataFile = path.join(process.cwd(), "data", "database-schemas.json");

async function readSchemas(): Promise<DatabaseSchema[]> {
  try {
    const content = await readFile(dataFile, "utf8");
    const data = JSON.parse(content);

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeSchemas(schemas: DatabaseSchema[]) {
  await writeFile(dataFile, JSON.stringify(schemas, null, 2), "utf8");
}

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;

    const schemas = await readSchemas();

    const schema = schemas.find((item) => item.databaseId === id);

    return Response.json({
      success: true,
      schema: schema ?? {
        databaseId: id,
        tables: [],
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Schema GET error:", error);

    return Response.json(
      {
        success: false,
        error: "Gagal mengambil schema.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const tables: Table[] = Array.isArray(body.tables) ? body.tables : [];

    const schemas = await readSchemas();

    const schema: DatabaseSchema = {
      databaseId: id,
      tables,
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = schemas.findIndex((item) => item.databaseId === id);

    if (existingIndex >= 0) {
      schemas[existingIndex] = schema;
    } else {
      schemas.push(schema);
    }

    await writeSchemas(schemas);

    return Response.json({
      success: true,
      schema,
    });
  } catch (error) {
    console.error("Schema PUT error:", error);

    return Response.json(
      {
        success: false,
        error: "Gagal menyimpan schema.",
      },
      { status: 500 },
    );
  }
}
