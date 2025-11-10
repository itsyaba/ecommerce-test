"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { readCart, setItemQuantity, removeFromCart, clearCart } from "@/lib/cart";

type LocalCart = ReturnType<typeof readCart>;

export default function CartPage() {
  const [items, setItems] = useState<LocalCart>({});

  const refresh = () => setItems(readCart());

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("cart-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cart-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const total = Object.values(items).reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 my-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Your Cart</h1>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden sm:inline-flex">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            {Object.keys(items).length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  clearCart();
                  refresh();
                }}
              >
                Clear Cart
              </Button>
            )}
          </div>
        </div>

        {Object.keys(items).length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <div className="mt-4">
              <Link href="/collection">
                <Button>Browse Collection</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {Object.values(items).map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center gap-4">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-md bg-muted" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.color ? `Color: ${item.color}` : null}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setItemQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="p-6 h-fit">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="mt-4 w-full" disabled={total === 0}>
                Checkout
              </Button>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}


