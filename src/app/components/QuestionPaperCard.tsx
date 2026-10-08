import { useState } from 'react';
import { FileText, ExternalLink, Calendar, BookOpen, GraduationCap, Eye } from 'lucide-react';
import { QuestionPaper } from '../types';
import { getApiBaseUrl } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface QuestionPaperCardProps {
  paper: QuestionPaper;
}

export default function QuestionPaperCard({ paper }: QuestionPaperCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const resolveFileUrl = (url?: string) => {
    if (!url) {
      return '';
    }

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }

    return `${getApiBaseUrl()}${url}`;
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const getDriveEmbedUrl = (url: string) => {
    const fileId = url.match(/[-\w]{25,}/)?.[0];
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
  };

  const getYoutubeThumbnail = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  const renderThumbnail = () => {
    switch (paper.uploadType) {
      case 'file':
        if (paper.fileUrl && paper.fileName) {
          const resolvedFileUrl = resolveFileUrl(paper.fileUrl);
          const isImage = paper.fileName.match(/\.(jpg|jpeg|png|gif)$/i);
          const isPdf = paper.fileName.match(/\.pdf$/i);

          if (isImage) {
            return <img src={resolvedFileUrl} alt={paper.fileName} className="h-48 w-full object-cover" />;
          }

          if (isPdf) {
            return (
              <div className="relative h-48 w-full overflow-hidden border-b bg-white">
                <iframe
                  src={`${resolvedFileUrl}#page=1&view=FitH`}
                  className="h-[600px] w-full origin-top-left scale-[0.4] pointer-events-none"
                  title="PDF Preview"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
            );
          }

          return (
            <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <FileText className="h-16 w-16 text-gray-600" />
            </div>
          );
        }
        break;

      case 'drive':
        if (paper.driveLink) {
          return (
            <div className="relative h-48 w-full overflow-hidden bg-white">
              <iframe
                src={getDriveEmbedUrl(paper.driveLink)}
                className="h-[600px] w-full origin-top-left scale-[0.4] pointer-events-none"
                title="Drive Preview"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          );
        }

        return (
          <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <svg className="h-16 w-16 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.01 1.485L2.998 17.513h6.004l3.008-5.207 3.008 5.207h6.004L12.01 1.485z" />
              <path d="M8.5 18.5l-3.5 6.07h14l-3.5-6.07H8.5z" />
            </svg>
          </div>
        );

      case 'youtube':
        if (paper.youtubeLink) {
          return (
            <div className="relative h-48 w-full">
              <img src={getYoutubeThumbnail(paper.youtubeLink)} alt="YouTube thumbnail" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
                  <svg className="ml-1 h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          );
        }
        break;
    }

    return (
      <div className="flex h-48 w-full items-center justify-center bg-gray-100">
        <FileText className="h-16 w-16 text-gray-400" />
      </div>
    );
  };

  const renderFullPreview = () => {
    switch (paper.uploadType) {
      case 'file':
        if (paper.fileUrl && paper.fileName) {
          const resolvedFileUrl = resolveFileUrl(paper.fileUrl);
          const isImage = paper.fileName.match(/\.(jpg|jpeg|png|gif)$/i);
          const isPdf = paper.fileName.match(/\.pdf$/i);

          if (isImage) {
            return (
              <div className="relative h-[600px] w-full overflow-hidden rounded-lg bg-gray-100">
                <img src={resolvedFileUrl} alt={paper.fileName} className="h-full w-full object-contain" />
              </div>
            );
          }

          if (isPdf) {
            return (
              <div className="relative h-[700px] w-full overflow-hidden rounded-lg bg-gray-100">
                <iframe src={resolvedFileUrl} className="h-full w-full" title={paper.fileName} />
              </div>
            );
          }

          return (
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-12">
              <FileText className="mb-4 h-16 w-16 text-gray-400" />
              <p className="mb-2 text-lg">{paper.fileName}</p>
              <a href={resolvedFileUrl} download={paper.fileName} className="flex items-center gap-2 text-blue-600 hover:underline">
                Download File <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          );
        }
        break;

      case 'drive':
        if (paper.driveLink) {
          return (
            <div className="space-y-4">
              <div className="relative h-[700px] w-full overflow-hidden rounded-lg bg-gray-100">
                <iframe src={getDriveEmbedUrl(paper.driveLink)} className="h-full w-full" title="Google Drive Preview" allow="autoplay" />
              </div>
              <a href={paper.driveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                Open in Google Drive <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          );
        }
        break;

      case 'youtube':
        if (paper.youtubeLink) {
          return (
            <div className="space-y-4">
              <div className="relative h-0 w-full overflow-hidden rounded-lg bg-gray-100 pb-[56.25%]">
                <iframe
                  src={getYoutubeEmbedUrl(paper.youtubeLink)}
                  className="absolute left-0 top-0 h-full w-full"
                  title="YouTube Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {paper.description && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm">{paper.description}</p>
                </div>
              )}
              <a href={paper.youtubeLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                Watch on YouTube <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          );
        }
        break;
    }

    return <div className="py-12 text-center text-muted-foreground">Preview not available</div>;
  };

  const getTypeColor = () => {
    switch (paper.uploadType) {
      case 'file':
        return 'bg-blue-500';
      case 'drive':
        return 'bg-green-500';
      case 'youtube':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative overflow-hidden">
          {renderThumbnail()}
          <div className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase text-white ${getTypeColor()}`}>
            {paper.uploadType}
          </div>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="line-clamp-2 text-lg">{paper.subject}</CardTitle>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {paper.department}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {paper.batch}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(paper.uploadedAt).toLocaleDateString()}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <Button onClick={() => setShowPreview(true)} className="w-full" variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            View Preview
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div>
                <div className="text-xl">{paper.subject}</div>
                <div className="mt-1 text-sm font-normal text-muted-foreground">
                  {paper.department} • {paper.batch}
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {paper.uploadType}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">{renderFullPreview()}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
