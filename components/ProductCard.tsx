'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Pencil, CheckCircle2, XCircle, X } from 'lucide-react';
import { updateProductAvailability } from '@/actions/products';
import { resolveImageUrl } from '@/lib/imageUrl';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand?: string | null;
    sellingPrice: string | number;
    isAvailable: boolean;
    category?: { name: string } | null;
    images?: { imageUrl: string; isPrimary: boolean }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAvailable, setIsAvailable] = useState(product.isAvailable);

  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageSrc = resolveImageUrl(primaryImage?.imageUrl);

  async function handleSetAvailability(value: boolean) {
    if (value === isAvailable) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const result = await updateProductAvailability(product.id, value);
    setSaving(false);
    if (result.success) {
      setIsAvailable(value);
      setEditing(false);
      router.refresh();
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
      <div className="h-36 bg-slate-100 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <p className="font-semibold text-slate-900 text-sm leading-tight">
            {product.name}
          </p>
          {product.category?.name && (
            <p className="text-xs text-slate-500 mt-0.5">{product.category.name}</p>
          )}
        </div>

        <p className="text-purple-600 font-semibold text-sm">
          Rs.{product.sellingPrice}
        </p>

        <div className="mt-auto pt-2 flex items-center justify-between">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
              <XCircle className="w-3.5 h-3.5" /> Not Available
            </span>
          )}

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-purple-600 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
          )}
        </div>

        {editing && (
          <div className="flex items-center gap-2 pt-1">
            <button
              disabled={saving}
              onClick={() => handleSetAvailability(true)}
              className={`flex-1 text-xs font-medium py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                isAvailable
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
              }`}
            >
              Available
            </button>
            <button
              disabled={saving}
              onClick={() => handleSetAvailability(false)}
              className={`flex-1 text-xs font-medium py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                !isAvailable
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700'
              }`}
            >
              Not Available
            </button>
            <button
              disabled={saving}
              onClick={() => setEditing(false)}
              className="text-slate-400 hover:text-slate-600 px-1"
              aria-label="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
