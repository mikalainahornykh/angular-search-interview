export interface User {
  id: number;
  name: string;
  email: string;
  city: string;
  role: 'Developer' | 'Designer' | 'Manager' | 'QA' | 'Analyst';
}
