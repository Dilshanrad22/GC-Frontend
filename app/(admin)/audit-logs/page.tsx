import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getAuditLogs } from '@/actions/audit-logs';
import Link from 'next/link';

async function AuditLogsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const response = await getAuditLogs(page, 10);
  const logs = response?.data?.data || [];
  const pagination = response?.data?.pagination || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Audit Logs</h1>
        <p className="text-slate-600">System activity and change tracking</p>
      </div>

      <Card>
        {logs.length > 0 ? (
          <>
            <Table
              headers={[
                'User',
                'Action',
                'Entity Type',
                'Change',
                'Timestamp',
              ]}
              rows={logs.map((log: any) => [
                log.user?.fullName || 'System',
                <span key={log.id} className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {log.action}
                </span>,
                log.entityType,
                log.changes ? Object.keys(log.changes).join(', ') : '-',
                new Date(log.createdAt).toLocaleString(),
              ])}
            />

            <div className="mt-4 flex justify-center gap-2">
              {pagination.page > 1 && (
                <Link href={`/audit-logs?page=${page - 1}`}>
                  <Button variant="secondary" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.page < pagination.totalPages && (
                <Link href={`/audit-logs?page=${page + 1}`}>
                  <Button variant="secondary" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-slate-600 py-8">No audit logs found</p>
        )}
      </Card>
    </div>
  );
}

export default AuditLogsPage;
