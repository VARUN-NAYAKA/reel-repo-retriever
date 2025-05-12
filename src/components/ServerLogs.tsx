
import { useRef, useEffect } from "react";
import { useServer } from "@/context/ServerContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Server, ArrowUp, ArrowDown } from "lucide-react";

const ServerLogs = () => {
  const { logs, clearLogs } = useServer();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogClass = (type: string) => {
    switch (type) {
      case "info": return "text-blue-600";
      case "error": return "text-red-600";
      case "success": return "text-green-600";
      case "request": return "text-purple-600";
      case "response": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "info": return <Server className="h-3 w-3" />;
      case "error": return <AlertTriangle className="h-3 w-3" />;
      case "success": return <Check className="h-3 w-3" />;
      case "request": return <ArrowUp className="h-3 w-3" />;
      case "response": return <ArrowDown className="h-3 w-3" />;
      default: return null;
    }
  };

  const renderLogMessage = (log) => {
    // Check if the log contains an HTTP status code
    if (log.type === "response" && log.message.includes("HTTP")) {
      const statusMatch = log.message.match(/HTTP\/1\.1 (\d{3})/);
      if (statusMatch) {
        const statusCode = statusMatch[1];
        const statusClass = 
          statusCode.startsWith('2') ? 'text-green-600' :
          statusCode.startsWith('4') ? 'text-red-600' :
          statusCode.startsWith('3') ? 'text-yellow-600' : 'text-gray-600';
        
        return (
          <span>
            HTTP/1.1 <span className={`font-bold ${statusClass}`}>{statusCode}</span>
            {log.message.replace(`HTTP/1.1 ${statusCode}`, '')}
          </span>
        );
      }
    }
    return log.message;
  };

  return (
    <div className="flex flex-col h-[300px]">
      <div className="bg-gray-900 text-white text-xs px-2 py-1 flex items-center">
        <Server className="h-3 w-3 mr-1" /> Server Logs
      </div>
      <ScrollArea className="flex-1 p-2 bg-gray-950" ref={scrollRef}>
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
            No logs available. Start the server to see request and response logs.
          </div>
        ) : (
          <div className="space-y-1 font-mono text-xs">
            {logs.map((log, index) => (
              <div key={index} className={`${getLogClass(log.type)} flex items-start`}>
                <span className="text-gray-400 mr-1 inline-block w-16">[{log.timestamp}]</span>
                <span className="mr-1">{getLogIcon(log.type)}</span>
                <span className="flex-1">{renderLogMessage(log)}</span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="p-2 bg-gray-800 border-t border-gray-700 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearLogs} 
          className="text-xs h-7 text-gray-300"
          disabled={logs.length === 0}
        >
          Clear Logs
        </Button>
      </div>
    </div>
  );
};

export default ServerLogs;
