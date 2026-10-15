import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProduct, getCategories } from '@/actions/products';
import { ProductEditForm } from './ProductEditForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [productResponse, categoriesResponse] = await Promise.all([
    getProduct(id),
    getCategories(),
  ]);

  if (!productResponse?.success || !productResponse?.data) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-purple-600 hover:underline">
        <ArrowLeft className="w-4 h-4" /> All products
      </Link>
      <ProductEditForm
        product={productResponse.data}
        categories={categoriesResponse?.data?.data || []}
      />
    </div>
  );
}
