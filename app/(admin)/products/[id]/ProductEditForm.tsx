'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  updateProduct,
  uploadProductImage,
  deleteProductImage,
  setPrimaryProductImage,
  deactivateProduct,
} from '@/actions/products';
import { adjustStock } from '@/actions/inventory';
import { resolveImageUrl } from '@/lib/imageUrl';

const UNIT_OPTIONS = ['Pieces', 'Box', 'Pack', 'Kg', 'Litre', 'Dozen', 'Ream', 'Roll', 'Set', 'Bottle', 'Other'];

const selectClass =
  'w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500';

interface Props {
  product: any;
  categories: any[];
}

export function ProductEditForm({ product, categories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    name: product.name ?? '',
    brand: product.brand ?? '',
    barcode: product.barcode ?? '',
    categoryId: product.category?.id ?? '',
    unit: product.unit ?? 'Pieces',
    buyingPrice: product.buyingPrice ?? '',
    sellingPrice: product.sellingPrice ?? '',
    compareAtPrice: product.compareAtPrice ?? '',
    minimumStock: String(product.minimumStock ?? 0),
    isAvailable: Boolean(product.isAvailable),
  });
  const [stockChange, setStockChange] = useState({ quantity: '', type: 'increase', reason: '' });

  const selling = Number(form.sellingPrice);
  const compare = form.compareAtPrice === '' ? null : Number(form.compareAtPrice);
  const compareInvalid = compare !== null && (!(compare > 0) || compare <= selling);

  function notify(type: 'ok' | 'error', text: string) {
    setMessage({ type, text });
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (compareInvalid) {
      notify('error', 'The sale (compare-at) price must be higher than the selling price. Leave it empty to remove the sale.');
      return;
    }

    startTransition(async () => {
      const response = await updateProduct(product.id, {
        name: form.name,
        brand: form.brand,
        barcode: form.barcode || null,
        categoryId: form.categoryId,
        unit: form.unit,
        buyingPrice: Number(form.buyingPrice),
        sellingPrice: selling,
        compareAtPrice: compare,
        minimumStock: Number(form.minimumStock),
        isAvailable: form.isAvailable,
      });
      if (!response?.success) {
        notify('error', response?.error?.message || 'Could not save the product');
        return;
      }
      notify('ok', 'Product saved');
      router.refresh();
    });
  }

  function handleStock(e: React.FormEvent) {
    e.preventDefault();
    const quantity = Number(stockChange.quantity);
    if (!quantity || quantity <= 0) {
      notify('error', 'Enter a quantity greater than zero');
      return;
    }
    startTransition(async () => {
      const response = await adjustStock(
        product.id,
        quantity,
        stockChange.type as 'increase' | 'decrease' | 'damaged' | 'customer_return',
        stockChange.reason || undefined
      );
      if (!response?.success) {
        notify('error', response?.error?.message || 'Could not adjust stock');
        return;
      }
      setStockChange({ quantity: '', type: 'increase', reason: '' });
      notify('ok', 'Stock updated');
      router.refresh();
    });
  }

  function handleImageUpload(file: File | null) {
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    startTransition(async () => {
      const response = await uploadProductImage(product.id, data);
      if (!response?.success) {
        notify('error', response?.error?.message || 'Could not upload the image');
        return;
      }
      router.refresh();
    });
  }

  function handleImageAction(imageId: string, action: 'primary' | 'delete') {
    if (action === 'delete' && !window.confirm('Remove this image?')) return;
    startTransition(async () => {
      const response =
        action === 'primary'
          ? await setPrimaryProductImage(product.id, imageId)
          : await deleteProductImage(product.id, imageId);
      if (!response?.success) {
        notify('error', response?.error?.message || 'Could not update the image');
        return;
      }
      router.refresh();
    });
  }

  function handleDeactivate() {
    if (!window.confirm('Deactivate this product? It will be hidden from the online store.')) return;
    startTransition(async () => {
      const response = await deactivateProduct(product.id);
      if (!response?.success) {
        notify('error', response?.error?.message || 'Could not deactivate the product');
        return;
      }
      router.push('/products');
    });
  }

  const currentStock = product.inventory?.currentStock ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-slate-600">SKU {product.sku}</p>
        </div>
        <Button variant="danger" onClick={handleDeactivate} disabled={isPending || product.status !== 'active'}>
          Deactivate
        </Button>
      </div>

      {message && (
        <p
          role={message.type === 'error' ? 'alert' : 'status'}
          className={`text-sm rounded-lg p-3 border ${
            message.type === 'error'
              ? 'text-red-600 bg-red-50 border-red-200'
              : 'text-green-700 bg-green-50 border-green-200'
          }`}
        >
          {message.text}
        </p>
      )}

      <Card title="Details">
        <form onSubmit={save} className="space-y-4">
          <Input
            label="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
            <Input
              label="Barcode"
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className={selectClass}
                required
              >
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parentId ? '— ' : ''}
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className={selectClass}
              >
                {!UNIT_OPTIONS.includes(form.unit) && <option value={form.unit}>{form.unit}</option>}
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Buying price"
              type="number"
              step="0.01"
              min="0"
              value={form.buyingPrice}
              onChange={(e) => setForm({ ...form, buyingPrice: e.target.value })}
            />
            <Input
              label="Selling price"
              type="number"
              step="0.01"
              min="0"
              value={form.sellingPrice}
              onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
              required
            />
            <Input
              label="Sale: original price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Empty = no sale"
              helperText="Shown struck-through on the store. Must be above the selling price."
              value={form.compareAtPrice}
              onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
              error={compareInvalid ? 'Must be higher than the selling price' : undefined}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <Input
              label="Minimum stock level"
              type="number"
              min="0"
              value={form.minimumStock}
              onChange={(e) => setForm({ ...form, minimumStock: e.target.value })}
            />
            <label className="flex items-center gap-3 pb-2.5 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                className="h-4 w-4 accent-purple-600"
              />
              Available on the online store
            </label>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isPending || compareInvalid}>
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Stock" subtitle={`Currently ${currentStock} in stock`}>
        <form onSubmit={handleStock} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Change</label>
            <select
              value={stockChange.type}
              onChange={(e) => setStockChange({ ...stockChange, type: e.target.value })}
              className={selectClass}
            >
              <option value="increase">Add stock</option>
              <option value="decrease">Remove stock</option>
              <option value="damaged">Damaged / written off</option>
              <option value="customer_return">Customer return</option>
            </select>
          </div>
          <Input
            label="Quantity"
            type="number"
            min="1"
            value={stockChange.quantity}
            onChange={(e) => setStockChange({ ...stockChange, quantity: e.target.value })}
          />
          <Input
            label="Reason (optional)"
            value={stockChange.reason}
            onChange={(e) => setStockChange({ ...stockChange, reason: e.target.value })}
          />
          <Button type="submit" variant="secondary" disabled={isPending}>
            Apply
          </Button>
        </form>
      </Card>

      <Card title="Images">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(product.images || []).map((image: any) => {
            const src = resolveImageUrl(image.imageUrl);
            return (
              <div key={image.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-slate-100">
                  {src && <img src={src} alt={product.name} className="w-full h-full object-cover" />}
                </div>
                <div className="p-2 flex items-center justify-between gap-2 text-xs">
                  {image.isPrimary ? (
                    <span className="text-purple-700 font-medium">Primary</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleImageAction(image.id, 'primary')}
                      className="text-purple-600 hover:underline"
                    >
                      Make primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleImageAction(image.id, 'delete')}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            disabled={isPending}
            onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
            className="text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 file:text-sm file:font-medium hover:file:bg-purple-100"
          />
        </div>
      </Card>
    </div>
  );
}
