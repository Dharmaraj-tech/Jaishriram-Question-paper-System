import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Upload, Link as LinkIcon, Youtube } from 'lucide-react';
import { UploadType } from '../types';
import { createQuestionPaper, fileToDataUrl } from '../utils/api';
import { toast } from 'sonner';

export default function AdminUploadForm({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');
  const [subject, setSubject] = useState('');
  const [uploadType, setUploadType] = useState<UploadType>('file');
  const [file, setFile] = useState<File | null>(null);
  const [driveLink, setDriveLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  const resetForm = () => {
    setDepartment('');
    setBatch('');
    setSubject('');
    setFile(null);
    setDriveLink('');
    setYoutubeLink('');
    setDescription('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!department || !batch || !subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (uploadType === 'file' && !file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (uploadType === 'drive' && !driveLink) {
      toast.error('Please provide a Google Drive link');
      return;
    }

    if (uploadType === 'youtube' && !youtubeLink) {
      toast.error('Please provide a YouTube link');
      return;
    }

    setIsSubmitting(true);

    try {
      if (uploadType === 'file' && file) {
        const fileContent = await fileToDataUrl(file);
        await createQuestionPaper({ department, batch, subject, uploadType, fileContent, fileName: file.name });
      }

      if (uploadType === 'drive') {
        await createQuestionPaper({ department, batch, subject, uploadType, driveLink });
      }

      if (uploadType === 'youtube') {
        await createQuestionPaper({ department, batch, subject, uploadType, youtubeLink, description });
      }

      toast.success('Question paper uploaded successfully');
      resetForm();
      onUploadSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Question Paper</CardTitle>
        <CardDescription>Fill in the details and upload a question paper</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="department">Department *</Label>
              <Input id="department" placeholder="e.g., Computer Science" value={department} onChange={(event) => setDepartment(event.target.value)} required />
            </div>

            <div>
              <Label htmlFor="batch">Batch *</Label>
              <Input id="batch" placeholder="e.g., 2023-2024" value={batch} onChange={(event) => setBatch(event.target.value)} required />
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input id="subject" placeholder="e.g., Data Structures" value={subject} onChange={(event) => setSubject(event.target.value)} required />
            </div>
          </div>

          <div>
            <Label>Upload Type</Label>
            <Tabs value={uploadType} onValueChange={(value) => setUploadType(value as UploadType)} className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="file">
                  <Upload className="mr-2 h-4 w-4" />
                  File
                </TabsTrigger>
                <TabsTrigger value="drive">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Drive Link
                </TabsTrigger>
                <TabsTrigger value="youtube">
                  <Youtube className="mr-2 h-4 w-4" />
                  YouTube
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-4">
                <div>
                  <Label htmlFor="file">Upload File</Label>
                  <Input id="file" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="cursor-pointer" />
                  <p className="mt-1 text-sm text-muted-foreground">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
                  {file && <p className="mt-2 text-sm">Selected: {file.name}</p>}
                </div>
              </TabsContent>

              <TabsContent value="drive" className="space-y-4">
                <div>
                  <Label htmlFor="driveLink">Google Drive Link</Label>
                  <Input id="driveLink" placeholder="https://drive.google.com/..." value={driveLink} onChange={(event) => setDriveLink(event.target.value)} />
                  <p className="mt-1 text-sm text-muted-foreground">Make sure the link is publicly accessible</p>
                </div>
              </TabsContent>

              <TabsContent value="youtube" className="space-y-4">
                <div>
                  <Label htmlFor="youtubeLink">YouTube Video Link</Label>
                  <Input id="youtubeLink" placeholder="https://www.youtube.com/watch?v=..." value={youtubeLink} onChange={(event) => setYoutubeLink(event.target.value)} />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea id="description" placeholder="Add details about the video..." value={description} onChange={(event) => setDescription(event.target.value)} rows={4} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Uploading...' : 'Upload Question Paper'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
