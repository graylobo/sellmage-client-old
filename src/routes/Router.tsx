import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateRouter from "./PrivateRouter";
import PublicRouter from "./PublicRouter";
import ProductFetch from "src/components/pages/products/ProductFetch";
import GlobalErrorFallBack from "src/components/pages/errors/GlobalErrorFallBack";

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