'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { createSale } from '@/actions/sales';
import { getProducts } from '@/actions/products';
import { getCustomers } from '@/actions/customers';
import { Search, Minus, Plus, Trash2, CheckCircle2, UserRound, Pencil } from 'lucide-react';

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  availableStock: number;
}

interface PickedProduct {
  id: string;
  name: string;
  sellingPrice: number;
  currentStock: number;
}

interface PickedCustomer {
  id: string;
  name: string;
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit', label: 'Credit (pay later)' },
  { value: 'other', label: 'Other' },
];

function ProductSearch({
  onSelect,
  label,
}: {
  onSelect: (product: PickedProduct) => void;
  label: string;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!open) return;

    // Opening the box with nothing typed yet shows the first few products
    // immediately (feels like a normal dropdown); typing narrows that down
    // with a short debounce so it doesn't hit the backend on every keystroke.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearching(true);
    const timer = setTimeout(
      async () => {
        const res = await getProducts(1, 8, query);
        setResults(res?.data?.data || []);
        setSearching(false);
      },
      query.trim() ? 300 : 0
    );
    return () => clearTimeout(timer);
  }, [query, open]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          label={label}
          placeholder="Type a product name, SKU, or brand to search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="pl-9"
        />
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {searching ? (
            <p className="px-4 py-3 text-sm text-slate-500">Searching...</p>
          ) : results.length > 0 ? (
            results.map((p: any) => {
              const stock = p.inventory?.currentStock ?? 0;
              const outOfStock = stock <= 0;
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={outOfStock}
                  onMouseDown={() => {
                    if (outOfStock) return;
                    onSelect({ id: p.id, name: p.name, sellingPrice: Number(p.sellingPrice), currentStock: stock });
                    setQuery('');
                    setResults([]);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 flex justify-between items-center gap-3 border-b border-slate-50 last:border-0 ${
                    outOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'
                  }`}
                >
                  <span className="text-sm text-slate-900">{p.name}</span>
                  <span className="text-sm text-slate-500 shrink-0">
                    {outOfStock ? (
                      <span className="text-red-500 font-medium">Out of stock</span>
                    ) : (
                      <>Rs.{p.sellingPrice} · {stock} in stock</>
                    )}
                  </span>
                </button>
              );
            })
          ) : query.trim() ? (
            <p className="px-4 py-3 text-sm text-slate-500">No products match &ldquo;{query}&rdquo;</p>
          ) : (
            <p className="px-4 py-3 text-sm text-slate-500">No products found</p>
          )}
        </div>
      )}
    </div>
  );
}

function CustomerSearch({ onSelect }: { onSelect: (customer: PickedCustomer) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearching(true);
    const timer = setTimeout(
      async () => {
        const res = await getCustomers(1, 8, query);
        setResults(res?.data?.data || []);
        setSearching(false);
      },
      query.trim() ? 300 : 0
    );
    return () => clearTimeout(timer);
  }, [query, open]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search by name, phone, or email..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="pl-9"
        />
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {searching ? (
            <p className="px-4 py-3 text-sm text-slate-500">Searching...</p>
          ) : results.length > 0 ? (
            results.map((c: any) => (
              <button
                key={c.id}
                type="button"
                onMouseDown={() => {
                  onSelect({ id: c.id, name: c.name });
                  setQuery('');
                  setResults([]);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-purple-50 flex justify-between items-center gap-3 border-b border-slate-50 last:border-0"
              >
                <span className="text-sm text-slate-900">{c.name}</span>
                <span className="text-sm text-slate-500 shrink-0">{c.phone}</span>
              </button>
            ))
          ) : query.trim() ? (
            <p className="px-4 py-3 text-sm text-slate-500">No customers match &ldquo;{query}&rdquo;</p>
          ) : (
            <p className="px-4 py-3 text-sm text-slate-500">No customers found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function NewSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discountMode, setDiscountMode] = useState<'fixed' | 'percent'>('fixed');
  const [discountInput, setDiscountInput] = useState(0);

  // Step 1: who is this bill for. A customer must be chosen — either picked
  // from registered customers, or typed in by hand for a walk-in — before
  // products can be added.
  const [customerMode, setCustomerMode] = useState<'registered' | 'walkin'>('registered');
  const [selectedCustomer, setSelectedCustomer] = useState<PickedCustomer | null>(null);
  const [walkInNameDraft, setWalkInNameDraft] = useState('');
  const [walkInName, setWalkInName] = useState('');

  const customerConfirmed = Boolean(selectedCustomer || walkInName);

  function changeCustomer() {
    setSelectedCustomer(null);
    setWalkInName('');
    setWalkInNameDraft('');
  }

  function addToCart(product: PickedProduct) {
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + 1, product.currentStock);
      setCart([...cart]);
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          quantity: Math.min(1, product.currentStock),
          price: product.sellingPrice,
          discount: 0,
          availableStock: product.currentStock,
        },
      ]);
    }
  }

  function setQuantity(productId: string, quantity: number) {
    setCart(
      cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.availableStock)) }
          : item
      )
    );
  }

  function removeFromCart(productId: string) {
    setCart(cart.filter((item) => item.productId !== productId));
  }

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.price - item.discount, 0);
  const discountAmount = Math.min(
    discountMode === 'percent' ? subtotal * ((discountInput || 0) / 100) : discountInput || 0,
    subtotal
  );
  const total = subtotal - discountAmount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0 || !customerConfirmed) return;

    setLoading(true);

    try {
      const result = await createSale({
        customerId: selectedCustomer?.id,
        customerName: selectedCustomer ? undefined : walkInName,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          discount: item.discount,
        })),
        discount: discountAmount,
        paymentMethod,
      });

      const newSaleId = result?.data?.sale?.id;
      if (result.success && newSaleId) {
        router.push(`/sales/${newSaleId}`);
      } else if (result.success) {
        router.push('/sales');
      }
    } catch (error) {
      console.error('Failed to create sale');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Create Bill</h1>

      <Card title="Step 1: Customer">
        {customerConfirmed ? (
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2.5">
              <UserRound className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {selectedCustomer?.name || walkInName}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedCustomer ? 'Registered customer' : 'Walk-in customer'}
                </p>
              </div>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={changeCustomer}>
              <Pencil className="w-3.5 h-3.5" /> Change
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={customerMode === 'registered' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCustomerMode('registered')}
              >
                Registered Customer
              </Button>
              <Button
                type="button"
                variant={customerMode === 'walkin' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCustomerMode('walkin')}
              >
                Walk-in Customer
              </Button>
            </div>

            {customerMode === 'registered' ? (
              <CustomerSearch onSelect={setSelectedCustomer} />
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Customer's name"
                  value={walkInNameDraft}
                  onChange={(e) => setWalkInNameDraft(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => setWalkInName(walkInNameDraft.trim())}
                  disabled={!walkInNameDraft.trim()}
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {customerConfirmed && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Step 2: Add Products">
              <ProductSearch
                onSelect={addToCart}
                label={cart.length > 0 ? 'Add Another Item' : 'Search for a Product'}
              />
            </Card>

            <Card title="Bill Items">
              {cart.length > 0 ? (
                <Table
                  headers={['Product', 'Unit Price', 'Quantity', 'Subtotal', '']}
                  rows={cart.map((item) => [
                    item.productName,
                    `Rs.${item.price}`,
                    <div key={`${item.productId}-qty`} className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={item.availableStock}
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.productId, parseInt(e.target.value) || 1)}
                        className="w-14 text-center border border-slate-300 rounded px-1 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.availableStock}
                        className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                        aria-label="Increase quantity"
                        title={
                          item.quantity >= item.availableStock
                            ? `Only ${item.availableStock} in stock`
                            : undefined
                        }
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>,
                    <span key={`${item.productId}-subtotal`} className="font-semibold text-slate-900">
                      Rs.{(item.quantity * item.price - item.discount).toFixed(2)}
                    </span>,
                    <button
                      key={`${item.productId}-remove`}
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>,
                  ])}
                />
              ) : (
                <p className="text-center text-slate-600 py-8">
                  Search for a product above to add it to this bill
                </p>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Payment & Summary">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Discount</label>
                  <div className="flex gap-2">
                    <div className="flex rounded-lg border border-slate-300 overflow-hidden shrink-0">
                      <button
                        type="button"
                        onClick={() => setDiscountMode('fixed')}
                        className={`px-3 py-2 text-sm font-medium ${
                          discountMode === 'fixed'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Rs.
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountMode('percent')}
                        className={`px-3 py-2 text-sm font-medium border-l border-slate-300 ${
                          discountMode === 'percent'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        %
                      </button>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      max={discountMode === 'percent' ? 100 : undefined}
                      value={discountInput}
                      onChange={(e) => setDiscountInput(parseFloat(e.target.value) || 0)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">Rs.{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-semibold">-Rs.{discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t text-base font-bold">
                    <span>Final Total:</span>
                    <span className="text-purple-600">Rs.{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full"
                >
                  {loading ? 'Creating Bill...' : (<><CheckCircle2 className="w-4 h-4 inline" /> Complete Bill</>)}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="w-full"
                >
                  Cancel
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
