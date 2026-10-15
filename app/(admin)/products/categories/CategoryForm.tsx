'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createCategory, updateCategory, deactivateCategory } from '@/actions/products';

interface Props {
  category?: { id: string; name: string; description: string | null; parentId: string | null; isActive: boolean };
  categories: { id: string; name: string; parentId: string | null }[];
}

export function CategoryForm({ category, categories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: category?.name ?? '',
    description: category?.description ?? '',
    parentId: category?.parentId ?? '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        parentId: form.parentId || undefined,
      };
      const result = category
        ? await updateCategory(category.id, payload)
        : await createCategory(payload);

      if (!result?.success) {
        setError(result?.error?.message || 'Failed to save category');
        return;
      }
      router.push('/products/categories');
    });
  }

  function handleDeactivate() {
    if (!category) return;
    startTransition(async () => {
      const result = await deactivateCategory(category.id);
      if (!result?.success) {
        setError(result?.error?.message || 'Failed to deactivate category');
        return;
      }
      router.push('/products/categories');
    });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <Input
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Parent Category</label>
          <select
            value={form.parentId}
            onChange={(e) => setForm({ ...form, parentId: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          >
            <option value="">None (top-level category)</option>
            {categories
              .filter((c) => c.id !== category?.id)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : category ? 'Save Changes' : 'Create Category'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          {category && category.isActive && (
            <Button type="button" variant="danger" onClick={handleDeactivate} disabled={isPending}>
              Deactivate
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
