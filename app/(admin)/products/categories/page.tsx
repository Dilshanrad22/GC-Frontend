import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getCategories } from '@/actions/products';
import Link from 'next/link';

async function CategoriesPage() {
  const response = await getCategories();
  const categories = response?.data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-600">Organize products into categories</p>
        </div>
        <div className="flex gap-2">
          <Link href="/products">
            <Button variant="secondary">← Back to Products</Button>
          </Link>
          <Link href="/products/categories/new">
            <Button>+ Add Category</Button>
          </Link>
        </div>
      </div>

      <Card>
        {categories.length > 0 ? (
          <Table
            headers={['Name', 'Slug', 'Parent', 'Status', '']}
            rows={categories.map((cat: any) => [
              cat.name,
              cat.slug,
              categories.find((c: any) => c.id === cat.parentId)?.name || '-',
              cat.isActive ? (
                <span className="text-green-600 font-medium">Active</span>
              ) : (
                <span className="text-red-600 font-medium">Inactive</span>
              ),
              <Link
                key={cat.id}
                href={`/products/categories/${cat.id}`}
                className="text-purple-600 hover:underline"
              >
                Edit
              </Link>,
            ])}
          />
        ) : (
          <p className="text-center text-slate-600 py-8">No categories yet</p>
        )}
      </Card>
    </div>
  );
}

export default CategoriesPage;
