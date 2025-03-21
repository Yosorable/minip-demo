import { Kysely, openSqliteDB, setMemoryStorageIfNotExist } from "minip-bridge";
import { createSignal, onMount } from "solid-js";
import { Database } from "./database";
import migrations from "./migrations";

export default function SQLiteView() {
  const [msg, setMsg] = createSignal("");
  const [db, setDB] = createSignal<Kysely<Database>>();
  onMount(async () => {
    const start = Date.now();
    const { db: database, migrator } = openSqliteDB<Database>({
      path: "db.sqlite3",
      debug: true,
      migratorProps: {
        provider: {
          getMigrations() {
            return Promise.resolve(migrations);
          },
        },
      },
    });

    const once = await setMemoryStorageIfNotExist("migration-once", "1");
    if (once.data) {
      const res = await migrator?.migrateToLatest();
      if (res?.results) {
        console.debug(res?.results);
        setMsg(JSON.stringify(res?.results) + ". ");
      } else if (res?.error) {
        // @ts-ignore
        const message = res?.error?.message;
        console.debug(message);
        setMsg(message + ". ");
      }
    } else {
      setMsg("already migrated. ");
    }

    setDB(database);
    const elapsed = Date.now() - start;
    setMsg((curr) => curr + `init cost: ${elapsed} ms`);
  });

  async function insert() {
    const start = Date.now();
    const res = await db()!
      .insertInto("person")
      .values([
        {
          first_name: "Jennifer",
          last_name: "Aniston",
          gender: "woman",
          age: 20,
        },
        {
          first_name: "Mike",
          last_name: "John",
          gender: "man",
          age: 22,
        },
      ])
      .executeTakeFirst();
    const elapsed = Date.now() - start;
    const obj = {
      insertId: res.insertId?.toString(),
      numInsertedOrUpdatedRows: res.numInsertedOrUpdatedRows?.toString(),
    };
    console.log(obj);
    setMsg(`cost: ${elapsed} ms, res: ` + JSON.stringify(obj, null, "  "));
  }

  async function duplicateID() {
    const start = Date.now();
    try {
      const res = await db()!
        .insertInto("person")
        .values([
          {
            id: 10,
            first_name: "Jennifer",
            last_name: "Aniston",
            gender: "woman",
            age: 20,
          },
          {
            id: 10,
            first_name: "Mike",
            last_name: "John",
            gender: "man",
            age: 22,
          },
        ])
        .executeTakeFirst();
      const elapsed = Date.now() - start;
      const obj = {
        insertId: res.insertId?.toString(),
        numInsertedOrUpdatedRows: res.numInsertedOrUpdatedRows?.toString(),
      };
      setMsg(`cost: ${elapsed} ms, res: ` + JSON.stringify(obj, null, "  "));
      console.log(obj);
    } catch (err) {
      const msg = (err as Error).message;
      setMsg(`error: ${msg}`);
      console.log(msg);
    }
  }

  async function select() {
    const start = Date.now();
    await db()!
      .selectFrom("person")
      .selectAll()
      .execute()
      .then((res) => {
        const elapsed = Date.now() - start;
        console.log(res);
        setMsg(`cost: ${elapsed} ms, res: ` + JSON.stringify(res, null, "  "));
      });
  }

  async function update() {
    const start = Date.now();
    await db()!
      .updateTable("person")
      .set({ first_name: Math.random().toString() })
      .where("id", "=", 1)
      .executeTakeFirst()
      .then((res) => {
        const elapsed = Date.now() - start;
        const obj = {
          numChangedRows: res.numChangedRows?.toString(),
          numUpdatedRows: res.numUpdatedRows.toString(),
        };
        console.log(obj);
        setMsg(`cost: ${elapsed} ms, res: ` + JSON.stringify(obj, null, "  "));
      });
  }

  async function deleteFunc() {
    const start = Date.now();
    const result = await db()!.deleteFrom("person").limit(1).executeTakeFirst();
    const elapsed = Date.now() - start;
    const obj = {
      numDeletedRows: result.numDeletedRows.toString(),
    };
    console.log(obj);
    setMsg(`cost: ${elapsed} ms, res: ` + JSON.stringify(obj, null, "  "));
  }

  async function deleteAll() {
    const start = Date.now();
    const result = await db()!.deleteFrom("person").executeTakeFirst();
    const elapsed = Date.now() - start;
    const obj = {
      numDeletedRows: result.numDeletedRows.toString(),
    };
    console.log(obj);
    setMsg(`cost: ${elapsed} ms, res: ` + JSON.stringify(obj, null, "  "));
  }

  return (
    <div>
      <div
        class="res-div"
        style={{
          height: "300px",
        }}
      >
        <div>{msg()}</div>
      </div>
      <div
        style={{
          "margin-top": ".5rem",
          display: "flex",
          gap: "5px",
        }}
      >
        <button onClick={select}>select</button>
        <button onClick={insert}>insert</button>
        <button onClick={update}>update</button>
        <button onClick={deleteFunc}>delete</button>
        <button onClick={deleteAll}>delete all</button>
      </div>
      <div
        style={{
          "margin-top": ".5rem",
          display: "flex",
          gap: "5px",
        }}
      >
        <button onClick={duplicateID}>duplicate id</button>
      </div>
    </div>
  );
}
