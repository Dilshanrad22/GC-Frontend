'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createProduct, getCategories, uploadProductImage } from '@/actions/products';

const UNIT_OPTIONS = [
  'Pieces',
  'Box',
  'Pack',
  'Kg',
  'Litre',
  'Dozen',
  'Ream',
  'Roll',
  'Set',
  'Bottle',
  'Other',
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    categoryId: '',
    brand: '',
    unit: 'Pieces',
    buyingPrice: '',
    sellingPrice: '',
    currentStock: '',
    minimumStock: '0',
  });

  useEffect(() => {
    async function loadCategories() {
      const result = await getCategories();
      if (result?.data?.data) {
        setCategories(result.data.data);
      }
    }
    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createProduct({
        name: formData.name,
        barcode: formData.barcode || undefined,
        categoryId: formData.categoryId,
        brand: formData.brand || undefined,
        unit: formData.unit,
        buyingPrice: formData.buyingPrice ? Number(formData.buyingPrice) : undefined,
        sellingPrice: Number(formData.sellingPrice),
        currentStock: Number(formData.currentStock),
        minimumStock: formData.minimumStock ? Number(formData.minimumStock) : 0,
      });

      if (result.success && result.data?.id) {
        if (imageFile) {
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
          await uploadProductImage(result.data.id, imageFormData);
        }
        router.push('/products');
      }
    } catch (error) {
      console.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Add New Product</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            placeholder="Product name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Barcode"
              placeholder="Barcode (optional)"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            />

            <Input
              label="Brand"
              placeholder="Brand name (optional)"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Unit<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                required
              >
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Buying Price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.buyingPrice}
              onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
            />

            <Input
              label="Selling Price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Current Stock"
              type="number"
              min="0"
              placeholder="0"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              required
            />

            <Input
              label="Minimum Stock Level"
              type="number"
              min="0"
              placeholder="0"
              value={formData.minimumStock}
              onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 file:text-sm file:font-medium hover:file:bg-purple-100"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
