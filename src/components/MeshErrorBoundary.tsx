import React, { Component, ErrorInfo, ReactNode } from 'react';

// =========================================================================
// CHALO NE! CORE MESH ERROR BOUNDARY
// =========================================================================
// Implements an enterprise-grade fail-safe to prevent application-wide
// rendering halts during asynchronous data mesh updates.
// =========================================================================

interface Props { 
  children: ReactNode; 
}

interface State { 
  hasError: boolean; 
  errorInfo: ErrorInfo | null; 
}

export class MeshErrorBoundary extends Component<Props, State> {
  public state: State = { 
    hasError: false, 
    errorInfo: null 
  };

  // Lifecycle hook to update state when a child component throws
  public static getDerivedStateFromError(_: Error): State { 
    return { hasError: true, errorInfo: null }; 
  }

  // Telemetry capture hook
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real-world scenario, you would send this to Sentry, LogRocket, or Datadog.
    // For this deployment, we log to the browser console for developer inspection.
    console.error("📊 CRITICAL_MESH_FAILURE_REPORT:", {
      error,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
    
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      // High-Contrast "Critical System" UI Fallback
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-950 p-6 text-center animate-fadeIn">
          <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mb-6"></div>
          
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            Mesh Infrastructure Alert
          </h2>
          <p className="mt-2 text-slate-400 max-w-sm">
            The Chalo Ne! transit pipeline encountered an unexpected runtime anomaly.
          </p>
          
          <div className="mt-8 flex gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20"
            >
              Re-Initialize Mesh
            </button>
            <button 
              onClick={() => console.log(this.state.errorInfo)} 
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-all"
            >
              Diagnostic Log
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
