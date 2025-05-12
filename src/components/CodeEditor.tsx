
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const CodeEditor = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("server");
  
  const serverCode = `import socket
import os
import threading
from datetime import datetime

# Server configuration
HOST = '127.0.0.1'  # localhost
PORT = 8080         # port to listen on

# Function to handle client requests
def handle_client(client_socket):
    # Receive the client request
    request = client_socket.recv(1024).decode('utf-8')
    
    # Parse the request to get the requested file
    headers = request.split('\\n')
    if len(headers) > 0:
        request_line = headers[0]
        parts = request_line.split(' ')
        
        if len(parts) > 1:
            method = parts[0]
            path = parts[1]
            
            if path == '/':
                path = '/index.html'  # Default file
            
            # Remove leading slash
            file_path = path[1:]
            
            try:
                # Check if file exists
                if os.path.isfile(file_path):
                    with open(file_path, 'rb') as f:
                        content = f.read()
                    
                    # Determine content type
                    content_type = "text/html"
                    if file_path.endswith('.css'):
                        content_type = "text/css"
                    elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
                        content_type = "image/jpeg"
                    elif file_path.endswith('.png'):
                        content_type = "image/png"
                    
                    # Create HTTP response
                    response = f"HTTP/1.1 200 OK\\r\\nContent-Type: {content_type}\\r\\n\\r\\n".encode() + content
                    
                else:
                    # File not found - return 404
                    response = """HTTP/1.1 404 Not Found
Content-Type: text/html

<!DOCTYPE html>
<html>
<head>
    <title>404 Not Found</title>
</head>
<body>
    <h1>404 Not Found</h1>
    <p>The requested resource could not be found on this server.</p>
</body>
</html>
""".encode()
                    
            except Exception as e:
                # Internal server error - return 500
                response = f"""HTTP/1.1 500 Internal Server Error
Content-Type: text/html

<!DOCTYPE html>
<html>
<head>
    <title>500 Internal Server Error</title>
</head>
<body>
    <h1>500 Internal Server Error</h1>
    <p>An error occurred: {str(e)}</p>
</body>
</html>
""".encode()
        else:
            # Bad request - return 400
            response = """HTTP/1.1 400 Bad Request
Content-Type: text/html

<!DOCTYPE html>
<html>
<head>
    <title>400 Bad Request</title>
</head>
<body>
    <h1>400 Bad Request</h1>
    <p>Your browser sent a request that this server could not understand.</p>
</body>
</html>
""".encode()
    else:
        # Bad request - return 400
        response = """HTTP/1.1 400 Bad Request
Content-Type: text/html

<!DOCTYPE html>
<html>
<head>
    <title>400 Bad Request</title>
</head>
<body>
    <h1>400 Bad Request</h1>
    <p>Your browser sent a request that this server could not understand.</p>
</body>
</html>
""".encode()
    
    # Send the response back to the client
    client_socket.send(response)
    client_socket.close()

def start_server():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Starting server on {HOST}:{PORT}")
    
    # Create a socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    # Allow reuse of addresses
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    # Bind the socket
    server_socket.bind((HOST, PORT))
    
    # Start listening (5 is the max queued connections)
    server_socket.listen(5)
    
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Server is listening on {HOST}:{PORT}")
    
    try:
        while True:
            # Accept connection
            client_socket, addr = server_socket.accept()
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Connection from {addr[0]}:{addr[1]}")
            
            # Create a thread to handle the client request
            client_handler = threading.Thread(target=handle_client, args=(client_socket,))
            client_handler.daemon = True
            client_handler.start()
    
    except KeyboardInterrupt:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Shutting down server...")
    finally:
        server_socket.close()

if __name__ == "__main__":
    start_server()
`;

  const instructionsContent = `# How to Run the Mini Web Server

## Windows Setup Instructions

### Prerequisites
1. Python 3.x installed on your computer
   - You can download Python from [python.org](https://www.python.org/downloads/)
   - During installation, make sure to check "Add Python to PATH"

### Step 1: Create a Project Folder
1. Create a new folder for your project (e.g., "mini_web_server")
2. Inside this folder, create a file named \`server.py\`
3. Copy the server code from the "Server Code" tab into this file
4. Create some HTML files to serve (at minimum, create an \`index.html\` file)

### Step 2: Run the Server
1. Open Command Prompt (cmd)
2. Navigate to your project folder using the \`cd\` command
   \`\`\`
   cd path\\to\\your\\mini_web_server
   \`\`\`
3. Run the server with Python
   \`\`\`
   python server.py
   \`\`\`
4. You should see output indicating that the server has started:
   \`\`\`
   [HH:MM:SS] Starting server on 127.0.0.1:8080
   [HH:MM:SS] Server is listening on 127.0.0.1:8080
   \`\`\`

### Step 3: Connect to Your Server
1. Open a web browser
2. Navigate to \`http://localhost:8080\` or \`http://127.0.0.1:8080\`
3. You should see your index.html page displayed

### Step 4: Stop the Server
1. To stop the server, press \`Ctrl+C\` in the Command Prompt window

## Troubleshooting
- If you get "Address already in use" error, change the PORT value in the code
- If you get "Permission denied" errors, try running Command Prompt as administrator
- Make sure your HTML files are in the same directory as the server.py file

## Notes
- This is a simple server for educational purposes only
- It does not include security features required for production use
- The server serves files from the same directory where the script is located
`;

  return (
    <div className="border rounded-md">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b px-3">
          <TabsList className="bg-transparent border-b-0">
            <TabsTrigger value="server">Server Code</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="server" className="p-0 mt-0">
          <div className="bg-gray-50 p-2 border-b flex justify-between items-center">
            <span className="text-sm font-medium">server.py</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => {
                navigator.clipboard.writeText(serverCode);
                toast({
                  title: "Code copied to clipboard",
                  description: "You can now paste it into your Python file"
                });
              }}
            >
              Copy Code
            </Button>
          </div>
          <pre className="p-4 text-xs overflow-auto bg-white h-[400px] font-mono">
            {serverCode}
          </pre>
        </TabsContent>
        
        <TabsContent value="instructions" className="mt-0 p-4 max-h-[450px] overflow-auto">
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: instructionsContent.replace(/\n/g, '<br />').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\#\#\# ([^\n]+)/g, '<h3>$1</h3>').replace(/\#\# ([^\n]+)/g, '<h2>$1</h2>').replace(/\# ([^\n]+)/g, '<h1>$1</h1>') }} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeEditor;
