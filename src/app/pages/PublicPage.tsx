import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ShieldCheck, Search, Home, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import QuestionPaperCard from '../components/QuestionPaperCard';
import { QuestionPaper } from '../types';
import { fetchQuestionPapers } from '../utils/api';

export default function PublicPage() {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<QuestionPaper[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPapers = async () => {
      try {
        const loadedPapers = await fetchQuestionPapers();
        setPapers(loadedPapers);
        setFilteredPapers(loadedPapers);
      } finally {
        setIsLoading(false);
      }
    };

    loadPapers();
  }, []);

  useEffect(() => {
    let filtered = papers;

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter((paper) => paper.department === selectedDepartment);
    }

    if (selectedBatch !== 'all') {
      filtered = filtered.filter((paper) => paper.batch === selectedBatch);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (paper) =>
          paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper.batch.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredPapers(filtered);
  }, [papers, selectedDepartment, selectedBatch, searchTerm]);

  const departments = ['all', ...Array.from(new Set(papers.map((paper) => paper.department)))];
  const batches = ['all', ...Array.from(new Set(papers.map((paper) => paper.batch)))];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Question Paper Repository</h1>
              <p className="mt-1 text-muted-foreground">Browse and access previous year question papers</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by subject, department, or batch..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department === 'all' ? 'All Departments' : department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch} value={batch}>
                    {batch === 'all' ? 'All Batches' : batch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground">Loading question papers...</div>
        ) : filteredPapers.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-semibold">No Question Papers Found</h2>
            <p className="text-muted-foreground">
              {papers.length === 0 ? 'No question papers have been uploaded yet.' : 'Try adjusting your filters or search terms.'}
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6 text-sm text-muted-foreground">
              Showing {filteredPapers.length} {filteredPapers.length === 1 ? 'paper' : 'papers'}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPapers.map((paper) => (
                <QuestionPaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 border-t bg-white">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Question Paper Repository &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
