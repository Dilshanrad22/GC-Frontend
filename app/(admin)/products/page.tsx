import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getProducts, getCategories } from '@/actions/products';
import Link from 'next/link';

async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';
  const category = searchParams.category || '';

  const [productsResponse, categoriesResponse] = await Promise.all([
    getProducts(page, 10, search, category),
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
        <div className="mb-4 space-y-3">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={search}
          />
          <select
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={category}
          >
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {products.length > 0 ? (
          <>
            <Table
              headers={['SKU', 'Name', 'Category', 'Price', 'Stock', 'Status']}
              rows={products.map((product: any) => [
                product.sku,
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="text-blue-600 hover:underline"
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
