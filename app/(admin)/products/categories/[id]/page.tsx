import { getCategory, getCategories } from '@/actions/products';
import { CategoryForm } from '../CategoryForm';
import { notFound } from 'next/navigation';

async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categoryResponse, categoriesResponse] = await Promise.all([
    getCategory(id),
    getCategories(),
  ]);

  if (!categoryResponse?.success || !categoryResponse.data) {
    notFound();
  }

  const categories = categoriesResponse?.data?.data || [];

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Edit Category</h1>
      <CategoryForm category={categoryResponse.data} categories={categories} />
    </div>
  );
}

export default EditCategoryPage;
