import { useEffect, useState } from "react";
import initSqlJs from "sql.js";

const useSqliteDabase = () => {
  const [db, setDb] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: (file) => `${process.env.PUBLIC_URL}/sql-wasm.wasm`,
        });
        const db = new SQL.Database();
        setDb(db);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initDatabase();
  }, []);

  return { db, loading, error };
};

export default useSqliteDabase;
