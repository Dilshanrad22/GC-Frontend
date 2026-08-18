import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getCustomers } from '@/actions/customers';
import Link from 'next/link';

async function CustomersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';

  const response = await getCustomers(page, 10, search);
  const customers = response?.data?.data || [];
  const pagination = response?.data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-600">Manage your customer database</p>
        </div>
        <Link href="/customers/new">
          <Button>+ Add Customer</Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search customers by name or email..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={search}
          />
        </div>

        {customers.length > 0 ? (
          <>
            <Table
              headers={['Name', 'Email', 'Phone', 'Type', 'City', 'Status']}
              rows={customers.map((customer: any) => [
                <Link
                  key={customer.id}
                  href={`/customers/${customer.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {customer.name}
                </Link>,
                customer.email,
                customer.phone,
                customer.type,
                customer.city || '-',
                customer.isActive ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-600 font-medium">Inactive</span>
                ),
              ])}
            />

            <div className="mt-4 flex justify-center gap-2">
              {pagination.page > 1 && (
                <Link href={`/customers?page=${page - 1}`}>
                  <Button variant="secondary" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.page < pagination.totalPages && (
                <Link href={`/customers?page=${page + 1}`}>
                  <Button variant="secondary" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-slate-600 py-8">No customers found</p>
        )}
      </Card>
    </div>
  );
}

export default CustomersPage;
