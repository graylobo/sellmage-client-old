import { DataGrid, GridRowModel } from "@mui/x-data-grid";
import { Button } from "antd";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import SqliteDatabaseLoader from "src/components/common/input/SqliteDatabaseLoader";
import ProductInsertModal from "src/components/common/modeless/ProductInsertModal";
import { BrowserPopup } from "src/components/common/browser-popup/BrowserPopup";
import { productColumns } from "src/const/product-column";
import useProductStore, { Product } from "src/store/product/store";
import useSqliteDatabaseStore from "src/store/sqlite-database/store";
import * as XLSX from "xlsx";

const ProductManageLayout: React.FC = () => {
  const [productData, setProductData] = useState<Product[]>([]);
  const { db, loading, initDatabase, error } = useSqliteDatabaseStore();
  const {
    setProductData: setZustandProductData,
    getSelectedRows,
    setSelectedRows,
  } = useProductStore();

  useEffect(() => {
    initDatabase();
  }, []);

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
    const selectedRows = getSelectedRows("productKey");
    const selectedData = productData.filter((row) =>
      selectedRows.includes(row.id)
    );

    const worksheet = XLSX.utils.json_to_sheet(selectedData);
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
  const saveDatabaseToFile = (db: any, fileName: string) => {
    const data = db.export();
    const buffer = new Uint8Array(data);
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  };
  const handleRowSelection = (newSelection: number[]) => {
    setSelectedRows("productKey", newSelection);
    const selectedData = productData.filter((row) =>
      newSelection.includes(row.id)
    );
    setZustandProductData("productKey", selectedData);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
            const query = "SELECT * FROM products;";
            const result = db.exec(query);
            console.log(result);
          }
        }}
      >
        데이터읽기
      </Button>
      <Button
        onClick={() => {
          saveDatabaseToFile(db, "products.db");
        }}
      >
        수정사항 반영
      </Button>
      <BrowserPopup
        disabled={productData.length === 0}
        name="ㅌㅌㅌ"
        config={{ width: "80%", height: "80%" }}
        children={<ProductInsertModal />}
      />

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
          handleRowSelection(newSelection as number[]);
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
