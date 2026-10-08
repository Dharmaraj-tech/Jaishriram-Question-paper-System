import { QuestionPaper } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { FileText, ExternalLink, Calendar, BookOpen, GraduationCap } from 'lucide-react';

interface QuestionPaperPreviewProps {
  paper: QuestionPaper;
}

export default function QuestionPaperPreview({ paper }: QuestionPaperPreviewProps) {
  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const getDriveEmbedUrl = (url: string) => {
    // Convert Drive link to embed format
    const fileId = url.match(/[-\w]{25,}/)?.[0];
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
  };

  const renderPreview = () => {
    switch (paper.uploadType) {
      case 'file':
        if (paper.fileUrl && paper.fileName) {
          const isImage = paper.fileName.match(/\.(jpg|jpeg|png|gif)$/i);
          const isPdf = paper.fileName.match(/\.pdf$/i);

          if (isImage) {
            return (
              <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={paper.fileUrl}
                  alt={paper.fileName}
                  className="w-full h-full object-contain"
                />
              </div>
            );
          } else if (isPdf) {
            return (
              <div className="relative w-full h-[700px] bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={paper.fileUrl}
                  className="w-full h-full"
                  title={paper.fileName}
                />
              </div>
            );
          } else {
            return (
              <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
                <FileText className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-lg mb-2">{paper.fileName}</p>
                <a
                  href={paper.fileUrl}
                  download={paper.fileName}
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  Download File <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          }
        }
        break;

      case 'drive':
        if (paper.driveLink) {
          return (
            <div className="space-y-4">
              <div className="relative w-full h-[700px] bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={getDriveEmbedUrl(paper.driveLink)}
                  className="w-full h-full"
                  title="Google Drive Preview"
                  allow="autoplay"
                />
              </div>
              <a
                href={paper.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                Open in Google Drive <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          );
        }
        break;

      case 'youtube':
        if (paper.youtubeLink) {
          return (
            <div className="space-y-4">
              <div className="relative w-full h-0 pb-[56.25%] bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={getYoutubeEmbedUrl(paper.youtubeLink)}
                  className="absolute top-0 left-0 w-full h-full"
                  title="YouTube Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {paper.description && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">{paper.description}</p>
                </div>
              )}
              <a
                href={paper.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                Watch on YouTube <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          );
        }
        break;
    }

    return (
      <div className="text-center py-12 text-muted-foreground">
        Preview not available
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{paper.subject}</CardTitle>
            <CardDescription className="flex flex-wrap gap-4 text-base">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                {paper.department}
              </span>
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {paper.batch}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(paper.uploadedAt).toLocaleDateString()}
              </span>
            </CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            {paper.uploadType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {renderPreview()}
      </CardContent>
    </Card>
  );
}
