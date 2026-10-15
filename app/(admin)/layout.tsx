import { Sidebar } from '@/components/sidebar';
import { Navbar } from '@/components/navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 print:h-auto print:block">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible print:block">
        <Navbar />
        <main className="flex-1 overflow-auto p-6 md:p-8 print:overflow-visible print:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
