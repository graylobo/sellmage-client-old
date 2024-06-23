import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateRouter from "./PrivateRouter";
import PublicRouter from "./PublicRouter";
import ProductFetch from "src/components/pages/product-fetch/ProductFetch";
import GlobalErrorFallBack from "src/components/pages/errors/GlobalErrorFallBack";
import ProductManageLayout from "src/components/layout/product-manage/ProductManageLayout";

function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PrivateRouter />,
      errorElement: <GlobalErrorFallBack />,
      children: [
        {
          path: "/product-fetch",
          element: <ProductFetch />,
        },
        {
          path: "/product-manage/:vendor",
          element: <ProductManageLayout />,
        },
      ],
    },
    {
      element: <PublicRouter />,
      children: [],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
