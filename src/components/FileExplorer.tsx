
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServer } from "@/context/ServerContext";
import { toast } from "sonner";
import { FolderIcon, FileIcon, Code2Icon, ImageIcon, FileTextIcon } from "lucide-react";

const FileExplorer = () => {
  const { files, addFile, deleteFile } = useServer();
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const getFileIcon = (filename: string) => {
    if (filename.endsWith(".html")) return <Code2Icon className="h-4 w-4" />;
    if (filename.endsWith(".css")) return <FileTextIcon className="h-4 w-4" />;
    if (filename.endsWith(".jpg") || filename.endsWith(".png")) return <ImageIcon className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
  };

  const handleCreateFile = () => {
    if (!newFileName) {
      toast.error("Please enter a file name");
      return;
    }
    
    // Add extension if not provided
    let filename = newFileName;
    if (!filename.includes(".")) {
      filename += ".html";
    }
    
    if (files.some(f => f.name === filename)) {
      toast.error(`File ${filename} already exists`);
      return;
    }
    
    addFile({
      name: filename,
      content: newFileContent || `<!DOCTYPE html>
<html>
<head>
    <title>${filename}</title>
</head>
<body>
    <h1>Hello from ${filename}</h1>
    <p>This is a new file created in the Mini Web Server.</p>
</body>
</html>`
    });
    
    setNewFileName("");
    setNewFileContent("");
    toast.success(`File ${filename} created`);
  };

  const handleDeleteFile = (filename: string) => {
    deleteFile(filename);
    if (selectedFile === filename) {
      setSelectedFile(null);
    }
    toast.success(`File ${filename} deleted`);
  };

  return (
    <div className="border rounded-md">
      <div className="p-3 bg-gray-50 border-b">
        <h3 className="font-medium text-sm flex items-center">
          <FolderIcon className="h-4 w-4 mr-2" /> Server Files
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
        <div className="border-r p-3 overflow-auto">
          <div className="space-y-2">
            {files.length === 0 ? (
              <div className="text-gray-500 text-sm italic p-2">
                No files available. Create a new file to begin.
              </div>
            ) : (
              files.map(file => (
                <div 
                  key={file.name}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${selectedFile === file.name ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedFile(file.name)}
                >
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.name)}
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 opacity-60 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.name);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="p-3 overflow-auto">
          <Tabs defaultValue="create">
            <TabsList className="w-full">
              <TabsTrigger value="create" className="flex-1">New File</TabsTrigger>
              <TabsTrigger value="view" className="flex-1" disabled={selectedFile === null}>
                View File
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="mt-4 space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">File Name</label>
                <Input 
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g., index.html"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <textarea
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="File content..."
                  className="w-full h-32 p-2 border rounded text-sm font-mono"
                />
              </div>
              
              <Button 
                onClick={handleCreateFile} 
                className="w-full"
              >
                Create File
              </Button>
            </TabsContent>
            
            <TabsContent value="view" className="mt-4">
              {selectedFile && (
                <div className="space-y-2">
                  <h3 className="font-medium">{selectedFile}</h3>
                  <pre className="border rounded p-3 bg-gray-50 overflow-auto text-xs h-48">
                    {files.find(f => f.name === selectedFile)?.content}
                  </pre>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
