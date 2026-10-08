import { QuestionPaper } from '../types';

const STORAGE_KEY = 'question_papers';

export const getQuestionPapers = (): QuestionPaper[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveQuestionPaper = (paper: QuestionPaper): void => {
  const papers = getQuestionPapers();
  papers.push(paper);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
};

export const deleteQuestionPaper = (id: string): void => {
  const papers = getQuestionPapers();
  const filtered = papers.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
