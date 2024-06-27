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
import { useParams } from "react-router-dom";
import { useGetProducts } from "src/hooks/useProducts";

const ProductManageLayout: React.FC = () => {
  const [productData, setProductData] = useState<Product[]>([]);
  const { db, loading, initDatabase, error } = useSqliteDatabaseStore();
  const { vendor } = useParams();
  const { data } = useGetProducts(vendor);

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
