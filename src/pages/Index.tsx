
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import ServerLogs from "@/components/ServerLogs";
import ServerStatus from "@/components/ServerStatus";
import FileExplorer from "@/components/FileExplorer";
import CodeEditor from "@/components/CodeEditor";
import { ServerProvider } from "@/context/ServerContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Mini Web Server</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A simple HTTP server implementation demonstrating socket programming and web communication fundamentals
        </p>
      </header>
      
      <ServerProvider>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-md h-full">
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle className="text-blue-800">Server Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="w-full justify-start border-b px-4">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="code">Code Editor</TabsTrigger>
                    <TabsTrigger value="files">File Explorer</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="p-4">
                    <div className="bg-white border rounded-md min-h-[400px] flex items-center justify-center">
                      <iframe 
                        src="about:blank" 
                        className="w-full h-[400px] border"
                        title="Server Preview"
                        id="preview-frame"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="code" className="p-4">
                    <CodeEditor />
                  </TabsContent>
                  <TabsContent value="files" className="p-4">
                    <FileExplorer />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle className="text-blue-800">Server Control</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ServerStatus />
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle className="text-blue-800">Server Logs</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ServerLogs />
              </CardContent>
            </Card>
          </div>
        </div>
      </ServerProvider>
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Mini Web Server Demonstration Project &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
