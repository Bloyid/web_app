import { AuthGuard } from '@/components/layout/AuthGuard';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>;
}