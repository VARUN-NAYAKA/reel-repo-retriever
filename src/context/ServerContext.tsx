
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the log structure
interface Log {
  type: "info" | "error" | "success" | "request" | "response";
  message: string;
  timestamp: string;
}

// Define the server file structure
interface ServerFile {
  name: string;
  content: string;
}

// Define the context value type
interface ServerContextType {
  isRunning: boolean;
  serverPort: number;
  logs: Log[];
  files: ServerFile[];
  startServer: () => void;
  stopServer: () => void;
  addLog: (log: Omit<Log, "timestamp">) => void;
  clearLogs: () => void;
  setServerPort: (port: number) => void;
  addFile: (file: ServerFile) => void;
  deleteFile: (fileName: string) => void;
}

// Create the context with a default value
const ServerContext = createContext<ServerContextType>({
  isRunning: false,
  serverPort: 8080,
  logs: [],
  files: [],
  startServer: () => {},
  stopServer: () => {},
  addLog: () => {},
  clearLogs: () => {},
  setServerPort: () => {},
  addFile: () => {},
  deleteFile: () => {},
});

// Provider component
export const ServerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [serverPort, setServerPort] = useState(8080);
  const [logs, setLogs] = useState<Log[]>([]);
  const [files, setFiles] = useState<ServerFile[]>([
    {
      name: "index.html",
      content: `<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Mini Web Server</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { color: #0066cc; }
        .container { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Mini Web Server!</h1>
        <p>This is a simple HTTP server implemented with Python socket programming.</p>
        <p>It demonstrates basic concepts of web servers and network communication.</p>
        <hr>
        <p><strong>Server Status:</strong> Running</p>
        <p><em>Created for educational purposes</em></p>
    </div>
</body>
</html>`
    },
    {
      name: "about.html",
      content: `<!DOCTYPE html>
<html>
<head>
    <title>About Mini Web Server</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { color: #0066cc; }
        .container { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>About This Project</h1>
        <p>The Mini Web Server is a simple HTTP server implemented with Python socket programming.</p>
        <p>Features include:</p>
        <ul>
            <li>Static HTML file serving</li>
            <li>Basic HTTP request handling</li>
            <li>Error handling (404 Not Found)</li>
            <li>Multi-threaded client handling</li>
        </ul>
        <p><a href="index.html">Back to Home</a></p>
    </div>
</body>
</html>`
    },
    {
      name: "404.html",
      content: `<!DOCTYPE html>
<html>
<head>
    <title>404 Not Found</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { color: #cc0000; }
        .container { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>404 Not Found</h1>
        <p>The requested resource could not be found on this server.</p>
        <p>Please check the URL and try again.</p>
        <p><a href="index.html">Return to Homepage</a></p>
    </div>
</body>
</html>`
    }
  ]);

  // Function to simulate HTTP request and response
  const simulateHTTPInteraction = (path: string) => {
    const timestamp = new Date().toLocaleTimeString();
    
    // Simulate a GET request for a specific path
    addLog({ 
      type: "request", 
      message: `GET ${path} HTTP/1.1\nHost: localhost:${serverPort}\nUser-Agent: Mozilla/5.0\nAccept: text/html`
    });
    
    // Simulate server processing the request
    addLog({ type: "info", message: `Processing request for ${path}` });
    
    // Check if file exists and simulate response
    setTimeout(() => {
      const file = files.find(f => f.name === path.substring(1) || (path === "/" && f.name === "index.html"));
      
      if (file) {
        // File found - return 200 OK
        addLog({ 
          type: "response", 
          message: `HTTP/1.1 200 OK\nContent-Type: text/html\nContent-Length: ${file.content.length}\n\n[HTML content served]`
        });
        
        // Update the preview with the file content
        const iframe = document.getElementById("preview-frame") as HTMLIFrameElement;
        if (iframe) {
          iframe.srcdoc = file.content;
        }
      } else {
        // File not found - return 404
        const notFoundPage = files.find(f => f.name === "404.html");
        addLog({ 
          type: "response", 
          message: `HTTP/1.1 404 Not Found\nContent-Type: text/html\n\n[404 Page content served]`
        });
        
        // Update the preview with the 404 page
        const iframe = document.getElementById("preview-frame") as HTMLIFrameElement;
        if (iframe) {
          iframe.srcdoc = notFoundPage ? notFoundPage.content : "<h1>404 Not Found</h1>";
        }
      }
    }, 500);
  };

  // Function to start the server
  const startServer = () => {
    setIsRunning(true);
    addLog({ type: "info", message: `Server started on port ${serverPort}` });
    addLog({ type: "success", message: `Socket bound to 127.0.0.1:${serverPort}` });
    addLog({ type: "info", message: "Server is listening for connections..." });
    
    // Simulate initial request to root
    setTimeout(() => {
      simulateHTTPInteraction("/");
    }, 1000);
    
    // Simulate a request to a non-existent page after some time
    setTimeout(() => {
      simulateHTTPInteraction("/nonexistent.html");
    }, 3000);
  };

  // Function to stop the server
  const stopServer = () => {
    setIsRunning(false);
    addLog({ type: "info", message: "Socket closed" });
    addLog({ type: "info", message: "Server stopped" });
    
    // Clear the preview iframe
    const iframe = document.getElementById("preview-frame") as HTMLIFrameElement;
    if (iframe) {
      iframe.srcdoc = `<div style="display:flex;justify-content:center;align-items:center;height:100vh;color:#666;font-family:sans-serif;">
        <div style="text-align:center;">
          <h2>Server is not running</h2>
          <p>Start the server to see the preview</p>
        </div>
      </div>`;
    }
  };

  // Function to add a log entry
  const addLog = (log: Omit<Log, "timestamp">) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prevLogs) => [...prevLogs, { ...log, timestamp }]);
  };

  // Function to clear all logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Function to add a new file
  const addFile = (file: ServerFile) => {
    setFiles((prevFiles) => [...prevFiles, file]);
    addLog({ type: "info", message: `File ${file.name} created` });
    
    // If the server is running and this is index.html, update the preview
    if (isRunning && file.name === "index.html") {
      simulateHTTPInteraction("/index.html");
    }
  };

  // Function to delete a file
  const deleteFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    addLog({ type: "info", message: `File ${fileName} deleted` });
  };

  // Create the value object to be provided by the context
  const value: ServerContextType = {
    isRunning,
    serverPort,
    logs,
    files,
    startServer,
    stopServer,
    addLog,
    clearLogs,
    setServerPort,
    addFile,
    deleteFile,
  };

  return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>;
};

// Custom hook for using the context
export const useServer = () => {
  const context = useContext(ServerContext);
  if (context === undefined) {
    throw new Error("useServer must be used within a ServerProvider");
  }
  return context;
};
