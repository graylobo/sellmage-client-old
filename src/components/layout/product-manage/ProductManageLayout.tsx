// ProductManage.tsx

import { DataGrid, GridRowModel } from "@mui/x-data-grid";
import { Button } from "antd";
import { saveAs } from "file-saver";
import { useState } from "react";
import SqliteDatabaseLoader from "src/components/common/input/SqliteDatabaseLoader";
import { productColumns } from "src/const/product-column";
import useSqliteDatabase from "src/hooks/useSqliteDabase";
import { Product } from "src/store/product/store";
import * as XLSX from "xlsx";

const ProductManageLayout: React.FC = () => {
  const [productData, setProductData] = useState<Product[]>([]);

  const { db, loading, error } = useSqliteDatabase();

  const handleDataLoaded = (loadedData: any[]) => {
    const formattedData: Product[] = loadedData.map((item, index) => {
      const obj: Product = { id: index + 1 };
      productColumns.forEach((col, idx) => {
        obj[col.field] = item[idx];
      });
      return obj;
    });
    setProductData(formattedData);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(productData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "products.xlsx");
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRows = productData.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    ) as Product[];
    setProductData(updatedRows);

    if (db) {
      const keys = Object.keys(newRow).filter((key) => key !== "id");
      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      const values = keys.map((key) => (newRow as any)[key]);
      values.push((newRow as any).id);

      const query = `UPDATE products SET ${setClause} WHERE id = ?`;
      db.run(query, values);
    }
    return newRow;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log("db", db);

  return (
    <div>
      <Button
        type="primary"
        onClick={handleExport}
        style={{ marginBottom: 16 }}
      >
        Export to Excel
      </Button>
      <Button
        onClick={() => {
          if (db) {
            const query = "SELECT name FROM sqlite_master WHERE type='table';";
            const result = db.exec(query);
            console.log(result);
          }
        }}
      >
        데이터읽기
      </Button>
      <SqliteDatabaseLoader onDataLoaded={handleDataLoaded} />
      <DataGrid
        rows={productData}
        columns={productColumns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(newSelection) => {
          console.log(newSelection);
        }}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => {
          console.log("에러발생:", error);
        }}
      />
    </div>
  );
};

export default ProductManageLayout;
