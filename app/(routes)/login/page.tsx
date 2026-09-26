"use client";

import Image from "next/image";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Clock3, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Star, Truck, Users } from "lucide-react";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/Schema/Login/login";
// import { userLogin } from "@/API/Actions/Login.action";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

type LoginData = zod.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<LoginData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  async function submitForm(data: LoginData) {
    let isLogin
    try { isLogin = await signIn('credentials', { ...data, redirect: false }) }
    catch { toast.add({ type: 'error', description: 'Could not sign in. Please try again.' }); return }

    if (isLogin?.ok) {
      toast.add({
        type: "success",
        description: "Login successful",
      });

      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl")
      const safeCallbackUrl = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/"
      router.push(safeCallbackUrl)
    } else {
      toast.add({
        type: "error",
        description: "Invalid Email & Password",
      });
    }

  }


  return (
    <main className="min-h-[calc(100vh-106px)] bg-[#fbfdfc] px-4 py-10 sm:px-8 sm:py-16 lg:px-12 lg:py-24 xl:px-20">
      <div className="mx-auto grid w-full max-w-390 items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-24 xl:gap-32">
        <section className="hidden text-center lg:block" aria-labelledby="login-introduction">
          <div className="relative mx-auto h-82 w-full max-w-145 overflow-hidden rounded-2xl bg-[#e8f7ed] shadow-[0_12px_28px_rgba(15,35,55,0.1)] xl:h-90 xl:max-w-155">
            <Image
              src="/Assets/images/login-image.png"
              alt="Fresh groceries ready for delivery"
              fill
              priority
              sizes="(max-width: 1024px) 0px, 620px"
              className="object-cover object-center"
            />
          </div>
          <h1 id="login-introduction" className="mx-auto mt-7 max-w-155 text-3xl font-bold leading-tight text-[#26364b] xl:text-4xl">
            FreshCart - Your One-Stop Shop for Fresh Products
          </h1>
          <p className="mx-auto mt-4 max-w-145 text-base leading-7 text-[#64748b] xl:text-lg">
            Join thousands of happy customers who trust FreshCart for their daily grocery needs.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-[#64748b]">
            <span className="inline-flex items-center gap-2 font-medium">
              <Truck size={19} strokeWidth={2.4} className="text-[#0ca653]" aria-hidden="true" />
              Free Delivery
            </span>
            <span className="inline-flex items-center gap-2 font-medium">
              <ShieldCheck size={19} strokeWidth={2.4} className="text-[#0ca653]" aria-hidden="true" />
              Secure Payment
            </span>
            <span className="inline-flex items-center gap-2 font-medium">
              <Clock3 size={19} strokeWidth={2.4} className="text-[#0ca653]" aria-hidden="true" />
              24/7 Support
            </span>
          </div>
        </section>

        <section className="mx-auto w-full max-w-155 rounded-3xl border border-[#edf1f2] bg-white px-8 py-12 shadow-[0_18px_48px_rgba(15,35,55,0.12)] sm:px-14 sm:py-16 xl:px-18 xl:py-18" aria-labelledby="login-title">
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight text-[#26364b] sm:text-4xl">
              <span className="text-[#12a857]">Fresh</span>Cart
            </p>
            <h2 id="login-title" className="mt-4 text-2xl font-bold text-[#26364b] sm:text-3xl">
              Welcome Back!
            </h2>
            <p className="mt-3 text-base leading-7 text-[#64748b] sm:text-lg">
              Sign in to continue your fresh shopping experience
            </p>
          </div>

          <p className="mt-8 text-center text-sm text-[#64748b]">Sign in with your email and password</p>
          <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email address" },
              }}
              render={({ field, fieldState }) => (
                <Field className="gap-2" data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-sm font-semibold text-[#334155]" htmlFor={field.name}>Email</FieldLabel>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-[#94a3b8]" aria-hidden="true" />
                    <Input
                      type="email"
                      {...field}
                      className="h-12 rounded-xl border-[#dce7e1] bg-[#fbfefc] pl-11 pr-4 text-[15px] text-[#26364b] shadow-none transition placeholder:text-[#a0acb8] focus-visible:border-[#12a857] focus-visible:ring-[#12a857]/20 focus-visible:ring-offset-0 group-data-[invalid=true]/field:border-red-500 group-data-[invalid=true]/field:focus-visible:border-red-500 group-data-[invalid=true]/field:focus-visible:ring-red-500/20"
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email"
                      autoComplete="on"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field, fieldState }) => (
                <Field className="gap-2" data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between gap-4">
                    <FieldLabel className="text-sm font-semibold text-[#334155]" htmlFor={field.name}>
                      Password
                    </FieldLabel>
                      <Link href="/forgot-password" className="text-sm font-semibold text-[#0ca653] transition hover:text-[#08783c]">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-[#94a3b8]" aria-hidden="true" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="h-12 rounded-xl border-[#dce7e1] bg-[#fbfefc] pl-11 pr-12 text-[15px] text-[#26364b] shadow-none transition placeholder:text-[#a0acb8] focus-visible:border-[#12a857] focus-visible:ring-[#12a857]/20 focus-visible:ring-offset-0 group-data-[invalid=true]/field:border-red-500 group-data-[invalid=true]/field:focus-visible:border-red-500 group-data-[invalid=true]/field:focus-visible:ring-red-500/20"
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="on"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute right-0 top-0 grid h-12 w-12 place-items-center text-[#64748b] transition hover:text-[#12a857]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <div className="flex items-center gap-2 text-sm">
              <label className="inline-flex items-center gap-2 text-[#64748b]">
                <input type="checkbox" className="size-4 rounded border-[#cbd5e1] accent-[#12a857]" />
                Keep me signed in
              </label>
            </div>
            <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl bg-[#12a857] text-base font-bold text-white shadow-[0_10px_20px_rgba(18,168,87,0.18)] transition hover:bg-[#0d9149] hover:shadow-[0_12px_24px_rgba(18,168,87,0.24)] disabled:opacity-60">
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-7 text-center text-[16px] text-[#64748b]">
            New to FreshCart?{" "}
            <Link href="/register" className="font-bold text-[#0ca653] hover:text-[#08783c]">
              Create one
            </Link>
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-[#edf1f2] pt-5 text-xs font-medium text-[#64748b] sm:gap-x-8 sm:text-sm">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <LockKeyhole size={16} className="text-[#64748b]" aria-hidden="true" />
              SSL Secured
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <Users size={17} className="text-[#64748b]" aria-hidden="true" />
              50K+ Users
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <Star size={17} className="fill-[#64748b] text-[#64748b]" aria-hidden="true" />
              4.9 Rating
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
