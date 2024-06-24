import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { Button } from "antd";
import { productColumns } from "src/const/product-column";
import useProductStore from "src/store/product/store";
import { createXmlFromRowData } from "src/utils/create-xml-from-row-data";

const ProductInsertModal = () => {
  const { products } = useProductStore();
  const apiRef = useGridApiRef();

  const handleProductInsert = () => {
    const datas = products["productKey"].data;
    if (datas) {
      for (const data of datas) {
        const test = createXmlFromRowData(data);
        console.log(test);

        const rowId = data.id;
        if (apiRef.current) {
          apiRef.current.updateRows([
            { id: rowId, GPI033: "등록", GPI034: "등록", GPI036: "성공" },
          ]);
        }
      }
    }
  };
  return (
    <div>
      <DataGrid
        rows={products["productKey"].data || []}
        apiRef={apiRef}
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
        onProcessRowUpdateError={(error) => {
          console.log("에러발생:", error);
        }}
      />

      <Button
        onClick={() => {
          handleProductInsert();
        }}
      >
        등록
      </Button>
    </div>
  );
};

export default ProductInsertModal;
