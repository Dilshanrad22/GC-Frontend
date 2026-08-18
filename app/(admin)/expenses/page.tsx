import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getExpenses } from '@/actions/expenses';
import Link from 'next/link';

async function ExpensesPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const status = searchParams.status || '';

  const response = await getExpenses(page, 10, status);
  const expenses = response?.data?.data || [];
  const pagination = response?.data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Expenses</h1>
          <p className="text-slate-600">Track business expenses</p>
        </div>
        <Link href="/expenses/new">
          <Button>💸 Add Expense</Button>
        </Link>
      </div>

      <Card>
        {expenses.length > 0 ? (
          <>
            <Table
              headers={[
                'Description',
                'Category',
                'Amount',
                'Status',
                'Date',
              ]}
              rows={expenses.map((expense: any) => [
                expense.description,
                expense.category,
                `Rs.${expense.amount}`,
                expense.status === 'approved' ? (
                  <span className="text-green-600 font-medium">✓ Approved</span>
                ) : (
                  <span className="text-yellow-600 font-medium">⏳ Pending</span>
                ),
                new Date(expense.date).toLocaleDateString(),
              ])}
            />

            <div className="mt-4 flex justify-center gap-2">
              {pagination.page > 1 && (
                <Link href={`/expenses?page=${page - 1}`}>
                  <Button variant="secondary" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.page < pagination.totalPages && (
                <Link href={`/expenses?page=${page + 1}`}>
                  <Button variant="secondary" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-slate-600 py-8">No expenses found</p>
        )}
      </Card>
    </div>
  );
}

export default ExpensesPage;
