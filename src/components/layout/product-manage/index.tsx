import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useGetProducts } from "src/hooks/useProducts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "antd";

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "productName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "productPrice",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "productStatus",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "godomallStatus",
    headerName: "고도몰 상태",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
  },
];

const rows = [
  { id: 1, productCode: "Snow", productPrice: "Jon", productStatus: 14 },
  {
    id: 2,
    productCode: "Lannister",
    productPrice: "Cersei",
    productStatus: 31,
  },
  { id: 3, productCode: "Lannister", productPrice: "Jaime", productStatus: 31 },
  { id: 4, productCode: "Stark", productPrice: "Arya", productStatus: 11 },
  {
    id: 5,
    productCode: "Targaryen",
    productPrice: "Daenerys",
    productStatus: null,
  },
  { id: 6, productCode: "Melisandre", productPrice: null, productStatus: 150 },
  {
    id: 7,
    productCode: "Clifford",
    productPrice: "Ferrara",
    productStatus: 44,
  },
  { id: 8, productCode: "Frances", productPrice: "Rossini", productStatus: 36 },
  { id: 9, productCode: "Roxie", productPrice: "Harvey", productStatus: 65 },
];

function ProductManage() {
  const [pageSize, setPageSize] = useState(5);
  const { data } = useGetProducts("zentrade");
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
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
    <div style={{ height: 400, width: "100%" }}>
      <Button
        type="primary"
        onClick={handleExport}
        style={{ marginBottom: 16 }}
      >
        Export to Excel
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
}

export default ProductManage;
