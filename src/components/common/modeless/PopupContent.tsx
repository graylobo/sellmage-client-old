import { DataGrid } from "@mui/x-data-grid";
import { createStyles, css } from "antd-style";
import { productColumns } from "src/const/product-column";
import useProductStore from "src/store/product/store";

const PopupContent = () => {
  const { products } = useProductStore();
  return (
    <div>
      <DataGrid
        rows={products["productKey"].data || []}
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
    </div>
  );
};

export default PopupContent;
