import ProtectedRoute from '@/components/ProtectedRoute';

export default function AssistantLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRole="assistant">
      {children}
    </ProtectedRoute>
  );
}