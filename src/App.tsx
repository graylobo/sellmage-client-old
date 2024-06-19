import { Suspense } from "react";
import "./App.css";
import Router from "./routes/Router";
import { Spin } from "antd";
import { createStyles } from "antd-style";
import { ErrorBoundary } from "react-error-boundary";
import GlobalErrorFallBack from "./components/pages/errors/GlobalErrorFallBack";
const useStyles = createStyles(() => ({
  customSpinner: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));
function App() {
  const { styles } = useStyles();
  const handleError = (error: any) => {
    console.error("Global :", error);
  };

  return (
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallBack}
      onError={handleError}
    >
      <Suspense
        fallback={
          <Spin
            className={styles.customSpinner}
            tip="Loading..."
            size="large"
          />
        }
      >
        <Router />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
