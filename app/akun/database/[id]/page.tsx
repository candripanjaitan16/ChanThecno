"use client";

import { ArrowLeft, Database, Play, Plus, Save, Trash2, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Column = {
  id: string;
  name: string;
  type: string;
  primaryKey: boolean;
  nullable: boolean;
};

type Row = {
  id: string;
  values: Record<string, string>;
};

type Table = {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
  position: {
    x: number;
    y: number;
  };
};

type DatabaseRecord = {
  id: string;
  name: string;
  engine: string;
  storage: number;
  status: "active";
  createdAt: string;
};

const columnTypes = [
  "UUID",
  "VARCHAR",
  "TEXT",
  "INTEGER",
  "BOOLEAN",
  "DATE",
  "TIMESTAMP",
];

export default function DatabaseDetailPage() {
  const router = useRouter();
  const params = useParams();

  const databaseId = params.id as string;

  const [database, setDatabase] = useState<DatabaseRecord | null>(null);
  const [tables, setTables] = useState<Table[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showAddTable, setShowAddTable] = useState(false);
  const [tableName, setTableName] = useState("");

  const [showTest, setShowTest] = useState(false);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);

  /*
   * LOAD DATABASE
   */
  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const databaseResponse = await fetch("/api/database");

        if (!databaseResponse.ok) {
          throw new Error("Gagal mengambil database.");
        }

        const databaseData = await databaseResponse.json();

        const found = databaseData.databases?.find(
          (item: DatabaseRecord) => item.id === databaseId,
        );

        setDatabase(found ?? null);

        /*
         * LOAD SCHEMA
         */
        const schemaResponse = await fetch(
          `/api/database/${databaseId}/schema`,
        );

        if (!schemaResponse.ok) {
          throw new Error("Gagal mengambil schema.");
        }

        const schemaData = await schemaResponse.json();

        if (schemaData.success) {
          const loadedTables = (schemaData.schema.tables ?? []).map(
            (table: Table) => ({
              ...table,
              rows: table.rows ?? [],
            }),
          );

          setTables(loadedTables);
        }
      } catch (error) {
        console.error("Gagal memuat database:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDatabase();
  }, [databaseId]);

  /*
   * ADD TABLE
   */
  const handleAddTable = () => {
    const cleanName = tableName.trim();

    if (!cleanName) return;

    const newTable: Table = {
      id: crypto.randomUUID(),

      name: cleanName,

      columns: [
        {
          id: crypto.randomUUID(),
          name: "id",
          type: "UUID",
          primaryKey: true,
          nullable: false,
        },
        {
          id: crypto.randomUUID(),
          name: "nama",
          type: "TEXT",
          primaryKey: false,
          nullable: false,
        },
        {
          id: crypto.randomUUID(),
          name: "deskripsi",
          type: "TEXT",
          primaryKey: false,
          nullable: true,
        },
        {
          id: crypto.randomUUID(),
          name: "gambar",
          type: "TEXT",
          primaryKey: false,
          nullable: true,
        },
      ],

      rows: [],

      position: {
        x: 100 + tables.length * 40,
        y: 100 + tables.length * 40,
      },
    };

    setTables((current) => [...current, newTable]);

    setTableName("");
    setShowAddTable(false);
    setActiveTableId(newTable.id);
  };

  /*
   * DELETE TABLE
   */
  const handleDeleteTable = (tableId: string) => {
    const confirmed = window.confirm(
      "Hapus table ini? Data di dalam table juga akan hilang dari editor.",
    );

    if (!confirmed) return;

    setTables((current) => current.filter((table) => table.id !== tableId));

    if (activeTableId === tableId) {
      setActiveTableId(null);
    }
  };

  /*
   * RENAME TABLE
   */
  const updateTableName = (tableId: string, name: string) => {
    setTables((current) =>
      current.map((table) =>
        table.id === tableId
          ? {
              ...table,
              name,
            }
          : table,
      ),
    );
  };

  /*
   * ADD COLUMN
   */
  const handleAddColumn = (tableId: string) => {
    setTables((current) =>
      current.map((table) => {
        if (table.id !== tableId) {
          return table;
        }

        const newColumn: Column = {
          id: crypto.randomUUID(),
          name: `column_${table.columns.length + 1}`,
          type: "VARCHAR",
          primaryKey: false,
          nullable: true,
        };

        return {
          ...table,
          columns: [...table.columns, newColumn],
        };
      }),
    );
  };

  /*
   * UPDATE COLUMN
   */
  const updateColumn = (
    tableId: string,
    columnId: string,
    field: keyof Column,
    value: string | boolean,
  ) => {
    setTables((current) =>
      current.map((table) => {
        if (table.id !== tableId) {
          return table;
        }

        return {
          ...table,

          columns: table.columns.map((column) => {
            if (column.id !== columnId) {
              return column;
            }

            return {
              ...column,
              [field]: value,
            };
          }),
        };
      }),
    );
  };

  /*
   * DELETE COLUMN
   */
  const handleDeleteColumn = (tableId: string, columnId: string) => {
    setTables((current) =>
      current.map((table) => {
        if (table.id !== tableId) {
          return table;
        }

        const column = table.columns.find((item) => item.id === columnId);

        if (column?.primaryKey) {
          const confirmed = window.confirm(
            "Column ini adalah Primary Key. Tetap hapus?",
          );

          if (!confirmed) {
            return table;
          }
        }

        return {
          ...table,
          columns: table.columns.filter((column) => column.id !== columnId),
        };
      }),
    );
  };

  /*
   * ADD DATA ROW
   */
  const handleAddRow = (tableId: string) => {
    setTables((current) =>
      current.map((table) => {
        if (table.id !== tableId) {
          return table;
        }

        const values: Record<string, string> = {};

        for (const column of table.columns) {
          if (column.name === "id" && column.type === "UUID") {
            values[column.name] = crypto.randomUUID();
          } else {
            values[column.name] = "";
          }
        }

        return {
          ...table,

          rows: [
            ...table.rows,
            {
              id: crypto.randomUUID(),
              values,
            },
          ],
        };
      }),
    );
  };

  /*
   * UPDATE DATA ROW
   */
  const updateRowValue = (
    tableId: string,
    rowId: string,
    columnName: string,
    value: string,
  ) => {
    setTables((current) =>
      current.map((table) => {
        if (table.id !== tableId) {
          return table;
        }

        return {
          ...table,

          rows: table.rows.map((row) => {
            if (row.id !== rowId) {
              return row;
            }

            return {
              ...row,

              values: {
                ...row.values,
                [columnName]: value,
              },
            };
          }),
        };
      }),
    );
  };

  /*
   * DELETE ROW
   */
  const handleDeleteRow = (tableId: string, rowId: string) => {
    setTables((current) =>
      current.map((table) => {
        if (table.id !== tableId) {
          return table;
        }

        return {
          ...table,
          rows: table.rows.filter((row) => row.id !== rowId),
        };
      }),
    );
  };

  /*
   * SAVE SCHEMA
   */
  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch(`/api/database/${databaseId}/schema`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          tables,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Gagal menyimpan schema.");
      }

      alert("Schema berhasil disimpan.");
    } catch (error) {
      console.error(error);

      alert("Gagal menyimpan schema.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * LOADING
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm text-zinc-500">Memuat database...</p>
      </main>
    );
  }

  /*
   * DATABASE NOT FOUND
   */
  if (!database) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <Database size={40} className="text-zinc-600" />

        <h1 className="mt-5 text-xl font-semibold">Database tidak ditemukan</h1>

        <button
          onClick={() => router.push("/akun/database")}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
        >
          Kembali
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zinc-800 bg-black px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/akun/database")}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">{database.name}</h1>

              <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs text-green-400">
                {database.status}
              </span>
            </div>

            <p className="text-xs text-zinc-500">
              {database.engine} • {database.storage} GB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddTable(true)}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">Add Table</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white disabled:opacity-50"
          >
            <Save size={17} />

            <span className="hidden sm:inline">
              {saving ? "Saving..." : "Save"}
            </span>
          </button>

          <button
            onClick={() => setShowTest(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-500"
          >
            <Play size={17} />
            <span className="hidden sm:inline">Test</span>
          </button>
        </div>
      </header>

      {/* CANVAS */}
      <section className="relative min-h-[calc(100vh-5rem)] overflow-auto bg-[#050505]">
        {/* GRID */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(#27272a 1px, transparent 1px), linear-gradient(90deg, #27272a 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* EMPTY STATE */}
        {tables.length === 0 && (
          <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center p-8">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                <Database size={30} />
              </div>

              <h2 className="mt-5 text-xl font-semibold">Database Canvas</h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Buat table pertama untuk mulai menyusun database kamu.
              </p>

              <button
                onClick={() => setShowAddTable(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
              >
                <Plus size={18} />
                Add Table
              </button>
            </div>
          </div>
        )}

        {/* TABLES */}
        <div className="relative min-h-[calc(100vh-5rem)] p-12">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`mb-8 w-[380px] rounded-2xl border bg-zinc-950 shadow-2xl ${
                activeTableId === table.id
                  ? "border-blue-600"
                  : "border-zinc-700"
              }`}
            >
              {/* TABLE HEADER */}
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Database size={17} className="shrink-0 text-blue-500" />

                  <input
                    value={table.name}
                    onFocus={() => setActiveTableId(table.id)}
                    onChange={(event) =>
                      updateTableName(table.id, event.target.value)
                    }
                    className="w-full bg-transparent text-sm font-semibold outline-none"
                  />
                </div>

                <button
                  onClick={() => handleDeleteTable(table.id)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* COLUMNS */}
              <div className="divide-y divide-zinc-900">
                {table.columns.map((column) => (
                  <div
                    key={column.id}
                    className="flex items-center gap-2 px-4 py-2.5"
                  >
                    <input
                      type="text"
                      value={column.name}
                      onChange={(event) =>
                        updateColumn(
                          table.id,
                          column.id,
                          "name",
                          event.target.value,
                        )
                      }
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    />

                    <select
                      value={column.type}
                      onChange={(event) =>
                        updateColumn(
                          table.id,
                          column.id,
                          "type",
                          event.target.value,
                        )
                      }
                      className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 outline-none"
                    >
                      {columnTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    <button
                      title="Primary key"
                      onClick={() =>
                        updateColumn(
                          table.id,
                          column.id,
                          "primaryKey",
                          !column.primaryKey,
                        )
                      }
                      className={`rounded px-1.5 py-1 text-xs ${
                        column.primaryKey
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "text-zinc-600 hover:text-zinc-400"
                      }`}
                    >
                      PK
                    </button>

                    <button
                      onClick={() => handleDeleteColumn(table.id, column.id)}
                      className="text-zinc-600 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* ADD COLUMN */}
              <div className="border-t border-zinc-800 p-3">
                <button
                  onClick={() => handleAddColumn(table.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <Plus size={14} />
                  Add Column
                </button>
              </div>

              {/* DATA BUTTON */}
              <div className="border-t border-zinc-800 p-3">
                <button
                  onClick={() => setActiveTableId(table.id)}
                  className="w-full rounded-lg border border-zinc-800 py-2 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white"
                >
                  Open Data ({table.rows.length})
                </button>
              </div>

              {/* DATA EDITOR */}
              {activeTableId === table.id && (
                <div className="border-t border-blue-600/30 bg-black p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{table.name} Data</p>

                      <p className="text-xs text-zinc-600">
                        Isi data untuk table ini.
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddRow(table.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold hover:bg-blue-500"
                    >
                      <Plus size={14} />
                      Add Row
                    </button>
                  </div>

                  {table.rows.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center">
                      <p className="text-xs text-zinc-600">Belum ada data.</p>

                      <button
                        onClick={() => handleAddRow(table.id)}
                        className="mt-3 text-xs text-blue-500 hover:text-blue-400"
                      >
                        + Tambahkan data pertama
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {table.rows.map((row, rowIndex) => (
                        <div
                          key={row.id}
                          className="rounded-xl border border-zinc-800 bg-zinc-950 p-3"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs text-zinc-600">
                              Row {rowIndex + 1}
                            </span>

                            <button
                              onClick={() => handleDeleteRow(table.id, row.id)}
                              className="text-zinc-600 hover:text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="space-y-2">
                            {table.columns.map((column) => (
                              <div key={column.id}>
                                <label className="mb-1 block text-[11px] text-zinc-600">
                                  {column.name}
                                </label>

                                <input
                                  value={row.values[column.name] ?? ""}
                                  disabled={
                                    column.primaryKey && column.type === "UUID"
                                  }
                                  onChange={(event) =>
                                    updateRowValue(
                                      table.id,
                                      row.id,
                                      column.name,
                                      event.target.value,
                                    )
                                  }
                                  placeholder={
                                    column.name === "gambar"
                                      ? "URL/path gambar"
                                      : `Isi ${column.name}`
                                  }
                                  className="w-full rounded-lg border border-zinc-800 bg-black px-3 py-2 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-blue-600 disabled:cursor-not-allowed disabled:text-zinc-600"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ADD TABLE MODAL */}
      {showAddTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Table</h2>

              <button
                onClick={() => {
                  setShowAddTable(false);
                  setTableName("");
                }}
                className="text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              Table baru otomatis memiliki:
            </p>

            <div className="mt-4 rounded-xl border border-zinc-800 bg-black p-4">
              <div className="space-y-2 text-xs">
                <p>
                  <span className="text-white">id</span>{" "}
                  <span className="text-blue-500">UUID</span>{" "}
                  <span className="text-yellow-500">PK</span>
                </p>

                <p>
                  <span className="text-white">nama</span>{" "}
                  <span className="text-blue-500">TEXT</span>
                </p>

                <p>
                  <span className="text-white">deskripsi</span>{" "}
                  <span className="text-blue-500">TEXT</span>
                </p>

                <p>
                  <span className="text-white">gambar</span>{" "}
                  <span className="text-blue-500">TEXT</span>
                </p>
              </div>
            </div>

            <input
              autoFocus
              value={tableName}
              onChange={(event) => setTableName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAddTable();
                }
              }}
              placeholder="contoh: products"
              className="mt-5 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none placeholder:text-zinc-700 focus:border-blue-600"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddTable(false);
                  setTableName("");
                }}
                className="rounded-xl px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleAddTable}
                disabled={!tableName.trim()}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEST PLAYGROUND */}
      {showTest && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/80 p-5">
          <div className="mx-auto mt-10 w-full max-w-6xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <div>
                <h2 className="font-semibold">Database Playground</h2>

                <p className="text-xs text-zinc-500">
                  Preview schema dan data database kamu.
                </p>
              </div>

              <button
                onClick={() => setShowTest(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2">
              {/* TABLE LIST */}
              <div className="border-b border-zinc-800 p-6 md:border-b-0 md:border-r">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Database
                </p>

                <h3 className="mt-2 text-lg font-semibold">{database.name}</h3>

                <p className="mt-1 text-xs text-zinc-600">{database.engine}</p>

                <div className="mt-5 space-y-2">
                  {tables.length === 0 ? (
                    <p className="text-sm text-zinc-600">Belum ada table.</p>
                  ) : (
                    tables.map((table) => (
                      <button
                        key={table.id}
                        onClick={() => setActiveTableId(table.id)}
                        className={`w-full rounded-xl border p-3 text-left ${
                          activeTableId === table.id
                            ? "border-blue-600 bg-blue-600/5"
                            : "border-zinc-800 bg-black hover:bg-zinc-900"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{table.name}</p>

                          <span className="text-xs text-zinc-600">
                            {table.rows.length} rows
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-zinc-600">
                          {table.columns.length} columns
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* JSON */}
              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  JSON Preview
                </p>

                <pre className="mt-4 max-h-[500px] overflow-auto rounded-xl border border-zinc-800 bg-black p-4 text-xs leading-6 text-zinc-400">
                  {JSON.stringify(
                    {
                      database: database.name,
                      engine: database.engine,
                      tables,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
