
import React from "react";

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg border border-border">
        <h1 className="text-2xl font-bold text-center mb-6">My Application</h1>
        <p className="text-center text-muted-foreground">
          Welcome to your new project! This is a basic starter template.
        </p>
      </div>
    </div>
  );
};

export default App;
