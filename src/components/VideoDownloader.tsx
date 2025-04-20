
import React, { useState } from 'react';
import { Youtube, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import VideoPreview from './VideoPreview';
import { useToast } from "@/components/ui/use-toast";

const VideoDownloader = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Here we'll implement the actual download logic later
      toast({
        title: "Coming soon!",
        description: "Download functionality will be implemented in the next version.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process video",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Youtube className="text-red-600" size={40} />
            YouTube Downloader
          </h1>
          <p className="text-gray-600">Enter a YouTube video URL to download</p>
        </div>

        <Card className="p-6 shadow-lg">
          <div className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="Paste YouTube URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleDownload}
                disabled={loading || !url}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
            </div>
            
            <VideoPreview url={url} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VideoDownloader;
