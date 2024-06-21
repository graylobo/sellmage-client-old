import React, { useState } from "react";
import { Button } from "antd";
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

  const handleSelect = () => {
    if (db) {
      const query = "SELECT * FROM products";
      const res = db.exec(query);
      const resultData = res[0]?.values || [];
      onDataLoaded(resultData);
    }
  };

  return (
    <div>
      <input type="file" accept=".sqlite,.db" onChange={handleFileChange} />
      {fileName && <p>Selected file: {fileName}</p>}
      <Button onClick={handleSelect} disabled={!db || loading}>
        데이터 조회
      </Button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default SqliteDatabaseLoader;
