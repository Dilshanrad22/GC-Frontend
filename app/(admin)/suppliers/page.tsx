import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getSuppliers } from '@/actions/suppliers';
import Link from 'next/link';

async function SuppliersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const response = await getSuppliers(page, 10);
  const suppliers = response?.data?.data || [];
  const pagination = response?.data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-slate-600">Manage your supplier network</p>
        </div>
        <Link href="/suppliers/new">
          <Button>+ Add Supplier</Button>
        </Link>
      </div>

      <Card>
        {suppliers.length > 0 ? (
          <>
            <Table
              headers={['Name', 'Email', 'Phone', 'City', 'Purchases']}
              rows={suppliers.map((supplier: any) => [
                <Link
                  key={supplier.id}
                  href={`/suppliers/${supplier.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {supplier.name}
                </Link>,
                supplier.email,
                supplier.phone,
                supplier.city || '-',
                supplier.purchases?.length || 0,
              ])}
            />

            <div className="mt-4 flex justify-center gap-2">
              {pagination.page > 1 && (
                <Link href={`/suppliers?page=${page - 1}`}>
                  <Button variant="secondary" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.page < pagination.totalPages && (
                <Link href={`/suppliers?page=${page + 1}`}>
                  <Button variant="secondary" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-slate-600 py-8">No suppliers found</p>
        )}
      </Card>
    </div>
  );
}

export default SuppliersPage;
