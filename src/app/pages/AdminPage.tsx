import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import AdminUploadForm from '../components/AdminUploadForm';
import DashboardStatus from '../components/DashboardStatus';
import { QuestionPaper } from '../types';
import { Toaster } from '../components/ui/sonner';
import { clearAuthToken, fetchQuestionPapers } from '../utils/api';
import { toast } from 'sonner';

export default function AdminPage() {
  const navigate = useNavigate();
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPapers = async () => {
    try {
      const loadedPapers = await fetchQuestionPapers();
      setPapers(loadedPapers);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load papers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPapers();
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage question papers</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="rounded-2xl border bg-white p-10 text-center text-muted-foreground">
            Loading admin data...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <AdminUploadForm onUploadSuccess={loadPapers} />
            </div>
            <div>
              <DashboardStatus papers={papers} onUpdate={loadPapers} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
