"use client";

import { addToCart } from "@/API/Cart/addToCart";
import { toast } from "@/components/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { CART_QUERY_KEY } from "./useCart";

type AddToCartButtonProps = {
  className?: string;
  children: ReactNode;
  productId: string;
  showAddedState?: boolean;
  resetAfterAddMs?: number;
};

export default function AddToCartButton({
  className = "",
  children,
  productId,
  showAddedState = false,
  resetAfterAddMs,
}: AddToCartButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isAdded, setIsAdded] = useState(false);
  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.add({
        type: "success",
        description: data?.message ?? "Product added successfully to your cart",
      });

      if (showAddedState) {
        setIsAdded(true);

        if (resetAfterAddMs) {
          window.setTimeout(() => setIsAdded(false), resetAfterAddMs);
        }
      }
    },
    onError: (error) => {
      console.error("Failed to add product to cart:", error);

      toast.add({
        type: "error",
        description: "Failed to add product to cart",
      });
    },
  });

  function handleAddToCart() {
    if (status === "loading" || isLoading || isAdded) return;

    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsAdded(false);
    mutate(productId);
  }

  return (
    <button
      type="button"
      aria-label={isLoading ? "Adding to cart" : isAdded ? "Added to cart" : "Add to cart"}
      aria-live="polite"
      className={`${className} cursor-pointer disabled:cursor-not-allowed`}
      onClick={handleAddToCart}
      disabled={status === "loading" || isLoading || (showAddedState && isAdded)}
    >
      {isLoading ? (
        <LoaderCircle size={18} className="animate-spin" />
      ) : isAdded ? (
        <Check size={18} />
      ) : (
        children
      )}
    </button>
  );
} 
