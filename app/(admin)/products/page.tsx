import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getProducts, getCategories } from '@/actions/products';
import Link from 'next/link';

async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string; status?: string }>;
}) {
  const query = await searchParams;
  const page = parseInt(query.page || '1');
  const search = query.search || '';
  const category = query.category || '';
  const status = query.status ?? 'active';

  const [productsResponse, categoriesResponse] = await Promise.all([
    getProducts(page, 10, search, category, status),
    getCategories(),
  ]);

  const products = productsResponse?.data?.data || [];
  const categories = categoriesResponse?.data?.data || [];
  const pagination = productsResponse?.data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600">Manage your product catalog</p>
        </div>
        <Link href="/products/new">
          <Button>+ Add Product</Button>
        </Link>
      </div>

      <Card>
        <form action="/products" method="get" className="mb-4 space-y-3">
          {status && status !== 'active' && <input type="hidden" name="status" value={status} />}
          <input
            type="text"
            name="search"
            placeholder="Search by name or SKU..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            defaultValue={search}
          />
          <div className="flex gap-3">
            <select
              name="category"
              defaultValue={category}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.parentId ? '— ' : ''}
                  {cat.name}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary">
              Filter
            </Button>
          </div>
        </form>

        {products.length > 0 ? (
          <>
            <Table
              headers={['Name', 'Category', 'Price', 'Stock', 'Status']}
              rows={products.map((product: any) => [
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="text-purple-600 hover:underline"
                >
                  {product.name}
                </Link>,
                product.category?.name || '-',
                `Rs.${product.sellingPrice}`,
                product.inventory?.currentStock || 0,
                product.status === 'active' ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-600 font-medium">Inactive</span>
                ),
              ])}
            />

            <div className="mt-4 flex justify-center gap-2">
              {pagination.page > 1 && (
                <Link href={`/products?page=${page - 1}`}>
                  <Button variant="secondary" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.page < pagination.totalPages && (
                <Link href={`/products?page=${page + 1}`}>
                  <Button variant="secondary" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-slate-600 py-8">No products found</p>
        )}
      </Card>
    </div>
  );
}

export default ProductsPage;
