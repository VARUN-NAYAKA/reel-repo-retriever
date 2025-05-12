
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useServer } from "@/context/ServerContext";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const ServerStatus = () => {
  const { isRunning, startServer, stopServer, serverPort, setServerPort } = useServer();
  const [portInput, setPortInput] = useState("8080");

  const handleStartServer = () => {
    const port = parseInt(portInput);
    if (isNaN(port) || port < 1024 || port > 65535) {
      toast.error("Please enter a valid port number between 1024 and 65535");
      return;
    }
    setServerPort(port);
    startServer();
    toast.success(`Server started on port ${port}`);
  };

  const handleStopServer = () => {
    stopServer();
    toast.info("Server stopped");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Status</p>
          <div className="flex items-center mt-1">
            {isRunning ? (
              <Badge variant="default" className="bg-green-500">Running</Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">Stopped</Badge>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Port</p>
          <p className="mt-1">{isRunning ? serverPort : "—"}</p>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="port">Port Number</Label>
          <Input
            id="port"
            type="text"
            value={portInput}
            onChange={(e) => setPortInput(e.target.value)}
            placeholder="8080"
            disabled={isRunning}
          />
        </div>
        
        {isRunning ? (
          <Button 
            onClick={handleStopServer} 
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Stop Server
          </Button>
        ) : (
          <Button 
            onClick={handleStartServer} 
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Start Server
          </Button>
        )}
      </div>
      
      {isRunning && (
        <div className="text-xs text-gray-500 text-center mt-2">
          Server running at http://localhost:{serverPort}
        </div>
      )}
    </div>
  );
};

export default ServerStatus;
