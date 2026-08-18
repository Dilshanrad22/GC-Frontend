export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-50 to-slate-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-blue-900 mb-4">GC Admin Panel</h1>
        <p className="text-xl text-slate-600 mb-8">Printing & Retail Business Management System</p>
        <a
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Go to Login
        </a>
      </div>
    </main>
  );
}
