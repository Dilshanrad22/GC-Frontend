'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createSale, getSales } from '@/actions/sales';
import { getProducts } from '@/actions/products';
import { getCustomers } from '@/actions/customers';
import { useEffect } from 'react';

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
}

export default function NewSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerId, setCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    async function loadData() {
      const [productsRes, customersRes] = await Promise.all([
        getProducts(1, 100),
        getCustomers(1, 100),
      ]);
      if (productsRes?.data?.data) setProducts(productsRes.data.data);
      if (customersRes?.data?.data) setCustomers(customersRes.data.data);
    }
    loadData();
  }, []);

  function addToCart() {
    if (!selectedProduct || quantity <= 0) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const existingItem = cart.find((item) => item.productId === selectedProduct);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: selectedProduct,
        productName: product.name,
        quantity,
        price: product.sellingPrice,
        discount: 0,
      });
    }

    setCart([...cart]);
    setSelectedProduct('');
    setQuantity(1);
  }

  function removeFromCart(productId: string) {
    setCart(cart.filter((item) => item.productId !== productId));
  }

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.price - item.discount, 0);
  const total = subtotal - discountAmount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);

    try {
      const result = await createSale({
        customerId: customerId || undefined,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
        })),
        discountAmount,
        paymentMethod,
      });

      if (result.success) {
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
      <h1 className="text-3xl font-bold text-slate-900">Create Sale</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Add Products">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - Rs.{p.sellingPrice}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Input
                  label="Quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="pt-6">
                  <Button onClick={addToCart}>Add to Cart</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Cart */}
          <Card title="Shopping Cart">
            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {item.productName}
                      </p>
                      <p className="text-sm text-slate-600">
                        {item.quantity} × Rs.{item.price} = Rs.
                        {item.quantity * item.price}
                      </p>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-600 py-8">
                No items in cart yet
              </p>
            )}
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card title="Sale Summary">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Customer (Optional)
                </label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Walk-in Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="check">Check</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <Input
                label="Discount Amount"
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value))}
              />

              <div className="bg-slate-50 p-4 rounded space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">Rs.{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span className="font-semibold">-Rs.{discountAmount}</span>
                </div>
                <div className="flex justify-between pt-2 border-t text-base font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">Rs.{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full"
              >
                {loading ? 'Processing...' : '✓ Complete Sale'}
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
    </div>
  );
}
