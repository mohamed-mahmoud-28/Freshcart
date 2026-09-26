"use client";

import { Minus, Plus, Share2, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";
import AddToCartButton from '../Cart/AddToCartButton';
import WishlistButton from '@/_components/Wishlist/WishlistButton';

type ProductPurchaseProps = {
  price: number;
  priceAfterDiscount?: number;
  quantityAvailable: number;
  title: string;
};

export default function ProductPurchase({ price, priceAfterDiscount, quantityAvailable, productId, title }: ProductPurchaseProps & { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const currentPrice = priceAfterDiscount ?? price;

  function updateQuantity(nextQuantity: number) {
    setQuantity(Math.max(1, Math.min(quantityAvailable, nextQuantity)));
  }

  return (
    <div className="border-t border-[#edf1f3] pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-2 text-sm text-slate-500">Quantity</p>
          <div className="flex w-fit items-center overflow-hidden rounded-lg border border-[#dce5e9]">
            <button className="grid size-11 place-items-center text-slate-500 transition hover:scale-105 hover:bg-[#effbf5] hover:text-[#0b9f5a] disabled:cursor-not-allowed disabled:opacity-35" type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(quantity - 1)} disabled={quantity === 1}><Minus size={15} /></button>
            <span className="grid h-[42px] min-w-11 place-items-center border-x border-[#dce5e9] text-[15px] font-semibold text-[#20334b]" aria-live="polite">{quantity}</span>
            <button className="grid size-11 place-items-center text-slate-500 transition hover:scale-105 hover:bg-[#effbf5] hover:text-[#0b9f5a] disabled:cursor-not-allowed disabled:opacity-35" type="button" aria-label="Increase quantity" onClick={() => updateQuantity(quantity + 1)} disabled={quantity === quantityAvailable}><Plus size={15} /></button>
          </div>
        </div>
        <span className="text-[13px] text-slate-400">{quantityAvailable} available</span>
      </div>

      <div className="mt-[18px] flex items-center justify-between rounded-lg bg-[#f7faf9] p-[17px] text-sm text-slate-500"><span>Total Price</span><strong className="text-[23px] font-extrabold text-[#0b9f5a]">{(currentPrice * quantity).toLocaleString("en-EG")} EGP</strong></div>

      <div className="mt-3.5 grid grid-cols-1 gap-2.5 min-[481px]:grid-cols-[1.35fr_1fr]">
        <AddToCartButton
          productId={productId}
          showAddedState
          className="flex w-full items-center justify-center gap-2 rounded-[22px] bg-[#12a857] px-4 py-3 text-[18px] font-semibold text-white transition hover:bg-[#0d8f49]"
        >
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </AddToCartButton>
        <button type="button" className="inline-flex min-h-[56px] items-center justify-center gap-2.5 rounded-[9px] bg-[#172236] text-base font-extrabold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-[#253650] hover:shadow-xl sm:min-h-[62px] sm:text-[17px]"><Zap size={15} fill="currentColor" /> Buy Now</button>
      </div>

      <div className="mt-3.5 grid grid-cols-[minmax(0,1fr)_52px] gap-2 sm:grid-cols-[minmax(0,1fr)_58px] sm:gap-3">
        <WishlistButton
          productId={productId}
          productTitle={title}
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[10px] border border-[#dce5e9] bg-white px-3 text-sm text-slate-600 transition hover:-translate-y-0.5 hover:border-[#12a857] hover:bg-[#f0fdf6] hover:text-[#0b9f5a] hover:shadow-md sm:min-h-[56px] sm:gap-3 sm:rounded-[18px] sm:px-4 sm:text-base"
        ><span>In Wishlist</span></WishlistButton>

        <button
          type="button"
          aria-label="Share product"
          className="flex size-[52px] items-center justify-center rounded-[10px] border border-[#dfe3e8] bg-white text-[#1f2937] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f3f4f6] hover:shadow-md sm:size-14 sm:rounded-[18px]"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
