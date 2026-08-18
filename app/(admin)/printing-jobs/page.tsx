import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getPrintingJobs } from '@/actions/printing-jobs';
import Link from 'next/link';

async function PrintingJobsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const status = searchParams.status || '';

  const response = await getPrintingJobs(page, 10, status);
  const jobs = response?.data?.data || [];
  const pagination = response?.data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Printing Jobs</h1>
          <p className="text-slate-600">Track printing project orders</p>
        </div>
        <Link href="/printing-jobs/new">
          <Button>🖨️ New Job</Button>
        </Link>
      </div>

      <Card>
        {jobs.length > 0 ? (
          <>
            <Table
              headers={['Job #', 'Customer', 'Description', 'Status', 'Date']}
              rows={jobs.map((job: any) => [
                <Link
                  key={job.id}
                  href={`/printing-jobs/${job.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {job.jobNumber}
                </Link>,
                job.customer?.name || '-',
                job.description?.substring(0, 30) + '...',
                <span key={`${job.id}-status`} className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {job.currentStatus}
                </span>,
                new Date(job.createdAt).toLocaleDateString(),
              ])}
            />

            <div className="mt-4 flex justify-center gap-2">
              {pagination.page > 1 && (
                <Link href={`/printing-jobs?page=${page - 1}`}>
                  <Button variant="secondary" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.page < pagination.totalPages && (
                <Link href={`/printing-jobs?page=${page + 1}`}>
                  <Button variant="secondary" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-slate-600 py-8">No printing jobs found</p>
        )}
      </Card>
    </div>
  );
}

export default PrintingJobsPage;
