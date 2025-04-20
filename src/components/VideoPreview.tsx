
import React from 'react';
import { Card } from "@/components/ui/card";

interface VideoPreviewProps {
  url: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ url }) => {
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
    </Card>
  );
};

export default VideoPreview;
