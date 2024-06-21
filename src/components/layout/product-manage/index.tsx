import { DataGrid } from "@mui/x-data-grid";
import { Button } from "antd";
import { saveAs } from "file-saver";
import { useState } from "react";
import SqliteDatabaseLoader from "src/components/common/input/SqliteDatabaseLoader";
import { productColumns } from "src/const/product-column";
import * as XLSX from "xlsx";

function ProductManage() {
  const [productData, setProductData] = useState<any[]>([]);

  const handleDataLoaded = (loadedData: any[]) => {
    const formattedData = loadedData.map((item, index) => {
      const obj: any = {};
      productColumns.forEach((col, idx) => {
        obj[col.field] = item[idx];
      });
      obj.id = index + 1;
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
      />
    </div>
  );
}

export default ProductManage;
