import React, { useState, useEffect } from "react";
import useSqliteDatabase from "src/hooks/useSqliteDabase/indext";

const SqliteDatabaseLoader = ({
  onDataLoaded,
}: {
  onDataLoaded: (data: any[]) => void;
}) => {
  const { db, loading, error, loadDatabaseFromFile } = useSqliteDatabase();
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      loadDatabaseFromFile(file);
    }
  };

  useEffect(() => {
    if (db) {
      try {
        const query = "SELECT * FROM products";
        const res = db.exec(query);
        const resultData = res[0]?.values || [];
        onDataLoaded(resultData);
      } catch (err) {
        console.error("Error executing query:", err);
      }
    }
  }, [db, onDataLoaded]);

  return (
    <div>
      <input type="file" accept=".sqlite,.db" onChange={handleFileChange} />
      {fileName && <p>Selected file: {fileName}</p>}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default SqliteDatabaseLoader;
