import { useEffect, useState } from "react";
import initSqlJs from "sql.js";

const useSqliteDatabase = () => {
  const [db, setDb] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const initDatabase = async (fileData?: ArrayBuffer) => {
    try {
      const SQL = await initSqlJs({
        locateFile: (file) => `${process.env.PUBLIC_URL}/sql-wasm.wasm`,
      });
       let database;
      if (fileData) {
        database = new SQL.Database(new Uint8Array(fileData));
      } else {
        database = new SQL.Database();
      }
      setDb(database);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDatabaseFromFile = (file: File) => {  
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target?.result;
      if (fileData) {
        initDatabase(fileData as ArrayBuffer);
      }
    };
    reader.onerror = (err) => {
      setError(err);
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    initDatabase();
  }, []);

  return { db, loading, error, loadDatabaseFromFile };
};

export default useSqliteDatabase;
