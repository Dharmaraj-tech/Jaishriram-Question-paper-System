import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { QuestionPaper } from '../types';
import { FileText, Link as LinkIcon, Youtube, Trash2 } from 'lucide-react';
import { removeQuestionPaper } from '../utils/api';
import { toast } from 'sonner';

interface DashboardStatusProps {
  papers: QuestionPaper[];
  onUpdate: () => void;
}

export default function DashboardStatus({ papers, onUpdate }: DashboardStatusProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question paper?')) {
      return;
    }

    try {
      await removeQuestionPaper(id);
      toast.success('Question paper deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <FileText className="h-4 w-4" />;
      case 'drive':
        return <LinkIcon className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      file: 'default',
      drive: 'secondary',
      youtube: 'destructive',
    };

    return (
      <Badge variant={variants[type] || 'outline'} className="capitalize">
        {type}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Status</CardTitle>
      </CardHeader>
      <CardContent>
        {papers.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No question papers uploaded yet</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {papers.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell>{paper.department}</TableCell>
                    <TableCell>{paper.batch}</TableCell>
                    <TableCell>{paper.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(paper.uploadType)}
                        {getTypeBadge(paper.uploadType)}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(paper.uploadedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(paper.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{papers.length}</div>
              <p className="text-sm text-muted-foreground">Total Papers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{new Set(papers.map((paper) => paper.department)).size}</div>
              <p className="text-sm text-muted-foreground">Departments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{new Set(papers.map((paper) => paper.batch)).size}</div>
              <p className="text-sm text-muted-foreground">Batches</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
