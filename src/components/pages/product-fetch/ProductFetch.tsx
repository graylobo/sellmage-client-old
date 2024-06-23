import { Button, Checkbox } from "antd";
import axios from "axios";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import TestModal from "src/components/common/modal/some";
import { useModalStack } from "src/hooks/useModalStack";
import useSqliteDatabaseStore from "src/store/sqlite-database/store";

function ProductFetch() {
  const { db, loading, error, initDatabase, loadDatabaseFromFile } =
    useSqliteDatabaseStore();
  const [data, setData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    initDatabase();
  }, []);

  // 데이터 가져오기
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/zentrade");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInsert = () => {
    if (db && data.length > 0) {
      // 데이터베이스 초기화 및 테이블 생성
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        GPI001 TEXT,
        GPI002 TEXT,
        GPI003 TEXT,
        GPI004 TEXT,
        GPI005 TEXT,
        GPI006 TEXT,
        GPI007 INTEGER,
        GPI008 TEXT,
        GPI009 TEXT,
        GPI010 TEXT,
        GPI011 TEXT,
        GPI012 TEXT,
        GPI013 TEXT,
        GPI014 TEXT,
        GPI015 TEXT,
        GPI016 TEXT,
        GPI017 TEXT,
        GPI018 TEXT,
        GPI019 TEXT,
        GPI020 TEXT,
        GPI021 TEXT,
        GPI022 TEXT,
        GPI023 TEXT,
        GPI024 TEXT,
        GPI025 TEXT,
        GPI026 TEXT,
        GPI027 TEXT,
        GPI028 TEXT,
        GPI029 TEXT,
        GPI030 TEXT,
        GPI031 TEXT,
        GPI032 TEXT,
        GPI033 TEXT,
        GPI034 TEXT,
        GPI035 TEXT,
        GPI036 TEXT,
        GPI037 TEXT,
        GPI038 TEXT,
        GPI039 TEXT,
        GPI040 TEXT,
        GPI041 TEXT,
        GPI042 TEXT,
        GPI043 TEXT,
        GPI044 TEXT,
        GPI045 TEXT,
        GPI046 TEXT,
        GPI047 TEXT,
        GPI048 TEXT,
        GPI049 TEXT,
        GPI050 TEXT,
        GPI051 TEXT,
        GPI052 TEXT,
        GPI053 TEXT,
        GPI054 TEXT
      )`);

      // 데이터 삽입
      const stmt = db.prepare(`INSERT INTO products (
        id, GPI001, GPI002, GPI003, GPI004, GPI005, GPI006, GPI007, GPI008, GPI009,
        GPI010, GPI011, GPI012, GPI013, GPI014, GPI015, GPI016, GPI017, GPI018, GPI019,
        GPI020, GPI021, GPI022, GPI023, GPI024, GPI025, GPI026, GPI027, GPI028, GPI029,
        GPI030, GPI031, GPI032, GPI033, GPI034, GPI035, GPI036, GPI037, GPI038, GPI039,
        GPI040, GPI041, GPI042, GPI043, GPI044, GPI045, GPI046, GPI047, GPI048, GPI049,
        GPI050, GPI051, GPI052, GPI053, GPI054
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

      data.forEach((product) => {
        stmt.run([
          product.id,
          product.GPI001,
          product.GPI002,
          product.GPI003,
          product.GPI004,
          product.GPI005,
          product.GPI006,
          product.GPI007,
          product.GPI008,
          product.GPI009,
          product.GPI010,
          product.GPI011,
          product.GPI012,
          product.GPI013,
          product.GPI014,
          product.GPI015,
          product.GPI016,
          product.GPI017,
          product.GPI018,
          product.GPI019,
          product.GPI020,
          product.GPI021,
          product.GPI022,
          product.GPI023,
          product.GPI024,
          product.GPI025,
          product.GPI026,
          product.GPI027,
          product.GPI028,
          product.GPI029,
          product.GPI030,
          product.GPI031,
          product.GPI032,
          product.GPI033,
          product.GPI034,
          product.GPI035,
          product.GPI036,
          product.GPI037,
          product.GPI038,
          product.GPI039,
          product.GPI040,
          product.GPI041,
          product.GPI042,
          product.GPI043,
          product.GPI044,
          product.GPI045,
          product.GPI046,
          product.GPI047,
          product.GPI048,
          product.GPI049,
          product.GPI050,
          product.GPI051,
          product.GPI052,
          product.GPI053,
          product.GPI054,
        ]);
      });
      stmt.free();

      // 데이터 조회 예제
      const results = db.exec("SELECT * FROM products");
    }
  };

  const saveDatabase = () => {
    if (db) {
      const data = db.export();
      const blob = new Blob([data], { type: "application/octet-stream" });
      saveAs(blob, "products.db");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      loadDatabaseFromFile(file);
    }
  };
  const { openModal, closeModal } = useModalStack();
  const handleOpenKoreaLocationSelectorModal = () => {
    openModal({
      title: "testmodal",
      element: <TestModal />,
      handleConfirm: (data) => {
        closeModal();
      },
    });
  };

  return (
    <div>
      <input type="file" accept=".sqlite,.db" onChange={handleFileChange} />
      {fileName && <p>Selected file: {fileName}</p>}
      <Checkbox>젠트레이드</Checkbox>
      <Button onClick={fetchData}>가져오기</Button>
      <Button onClick={handleInsert}>저장하기</Button>
      <Button onClick={saveDatabase}>데이터베이스 저장</Button>
      <Button onClick={handleOpenKoreaLocationSelectorModal}>모달</Button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}

export default ProductFetch;
