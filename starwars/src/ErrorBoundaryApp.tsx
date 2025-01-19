import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import styles from './css/App.module.css'

// Fallback UI Component
const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
    return (
        <div className={styles.error}>
            <h1>Something went wrong!</h1>
            <p>Error: {error.message}</p>
            {/* <button onClick={resetErrorBoundary}>Retry Render</button> */}
        </div>
    );
};


// Main Component
const ErrorBoundaryApp: React.FC = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => {
                    // Reset logic if needed
                    console.log("Resetting Error Boundary");
                }}
            >
                {children}
            </ErrorBoundary>
        </div>
    );
};

export default ErrorBoundaryApp;
