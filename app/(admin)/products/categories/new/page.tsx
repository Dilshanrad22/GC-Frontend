import { getCategories } from '@/actions/products';
import { CategoryForm } from '../CategoryForm';

async function NewCategoryPage() {
  const response = await getCategories();
  const categories = response?.data?.data || [];

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Add Category</h1>
      <CategoryForm categories={categories} />
    </div>
  );
}

export default NewCategoryPage;
