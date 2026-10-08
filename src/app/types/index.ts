export type UploadType = 'file' | 'drive' | 'youtube';

export interface QuestionPaper {
  id: string;
  department: string;
  batch: string;
  subject: string;
  uploadType: UploadType;
  fileUrl?: string;
  fileName?: string;
  driveLink?: string;
  youtubeLink?: string;
  description?: string;
  uploadedAt: string;
}
