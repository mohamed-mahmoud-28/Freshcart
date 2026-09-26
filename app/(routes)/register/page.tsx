'use client'
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail, Phone, ShieldCheck, Star, Truck, UserPlus, UserRound } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/Schema/Register/register";
import * as zod from "zod";
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation";
import { userRegister } from "@/API/Actions/Auth.actions";

const benefits = [
  { title: "Premium Quality", description: "Premium quality products sourced from trusted suppliers.", icon: Star },
  { title: "Fast Delivery", description: "Same-day delivery available in most areas.", icon: Truck },
  { title: "Secure Shopping", description: "Your data and payments are completely secure.", icon: ShieldCheck },
];



type UserData = zod.infer<typeof schema>;

export default function Register() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<UserData>({
    defaultValues: {
      "name": "",
      "email": "",
      "password": "",
      "rePassword": "",
      "phone": ""
    },
    resolver: zodResolver(schema),

  })
  const password = useWatch({ control, name: "password", defaultValue: "" });
  const passwordChecks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[#?!@$%^&*-]/.test(password),
  ];
  const passwordStrength = passwordChecks.filter(Boolean).length;
  const strengthLabel = passwordStrength >= 4 ? "Strong" : passwordStrength >= 2 ? "Medium" : "Weak";
  const strengthColor = passwordStrength >= 4 ? "bg-[#12a857]" : passwordStrength >= 2 ? "bg-[#f59e0b]" : "bg-[#ef4444]";

  async function submitForm(data: UserData) {
    let result: Awaited<ReturnType<typeof userRegister>>
    try { result = await userRegister(data) }
    catch { result = { success: false, message: 'Could not create your account. Please try again.' } }

    if (result.success) {
      router.push('/login')
      toast.add({
        type: "success",
        description: result.message,
      });
    } else {
      toast.add({
        type: "error",
        description: result.message,
      });
    } 
    

  }

  return (
    <main className="min-h-[calc(100vh-106px)] bg-[#fbfdfc] px-4 py-14 sm:px-8 lg:px-12 lg:py-24 xl:px-20">
      <div className="mx-auto grid max-w-390 items-start gap-16 lg:grid-cols-[1fr_0.95fr] lg:gap-24">

        <section className="pt-2 lg:pt-5" aria-labelledby="register-welcome">
          <h1 id="register-welcome" className="text-4xl font-bold tracking-tight text-[#26364b] sm:text-5xl">
            Welcome to <span className="text-[#12a857]">FreshCart</span>
          </h1>
          <p className="mt-4 max-w-117.5 text-base leading-7 text-[#64748b] sm:text-lg">
            Join thousands of happy customers who enjoy fresh groceries delivered right to their doorstep.
          </p>

          <div className="mt-10 grid gap-6">
            {benefits.map(({ title, description, icon: Icon }) => (
              <div key={title} className="flex items-center gap-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#c9f8dc] text-[#075c32] sm:size-14">
                  <Icon size={23} strokeWidth={2.2} />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#26364b] sm:text-lg">{title}</h2>
                  <p className="mt-1 text-sm text-[#64748b] sm:text-base">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <blockquote className="mt-11 max-w-130 rounded-xl border border-[#e7edef] bg-white p-6 shadow-[0_8px_24px_rgba(15,35,55,0.05)] sm:p-7">
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full bg-[#d8f8e4] text-[#0ca653]"><UserRound size={23} /></span>
              <div>
                <cite className="not-italic text-base font-semibold text-[#26364b]">Sarah Johnson</cite>
                <div className="mt-1 flex gap-1 text-lg text-[#ffc107]" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, index) => <FaStar key={index} />)}
                </div>
              </div>
            </div>
            <p className="mt-5 text-base italic leading-7 text-[#64748b]">
              “FreshCart has transformed my shopping experience. The quality of the products is outstanding, and delivery is always on time.”
            </p>
          </blockquote>
        </section>

        <section className="rounded-3xl border border-[#edf1f2] bg-white p-8 shadow-[0_18px_48px_rgba(15,35,55,0.12)] sm:p-14 xl:p-16" aria-labelledby="register-title">
          <div className="text-center">
            <h2 id="register-title" className="text-3xl font-bold text-[#26364b] sm:text-4xl">Create Your Account</h2>
            <p className="mt-3 text-base text-[#64748b] sm:text-lg">Start your fresh journey with us today</p>
          </div>


          <form onSubmit={handleSubmit(submitForm)} className="mt-9">
            <div className="space-y-5">


              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-semibold text-[#334155]" htmlFor={field.name}>User Name</FieldLabel>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-[#94a3b8]" aria-hidden="true" />
                      <Input {...field} className="h-12 rounded-xl border-[#dce7e1] bg-[#fbfefc] pl-11 pr-4 text-[15px] text-[#26364b] shadow-none transition placeholder:text-[#a0acb8] focus-visible:border-[#12a857] focus-visible:ring-[#12a857]/20 focus-visible:ring-offset-0 group-data-[invalid=true]/field:border-red-500 group-data-[invalid=true]/field:focus-visible:border-red-500 group-data-[invalid=true]/field:focus-visible:ring-red-500/20" id={field.name} aria-invalid={fieldState.invalid} placeholder="Ali" autoComplete="off" />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-semibold text-[#334155]" htmlFor={field.name}>Email</FieldLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-[#94a3b8]" aria-hidden="true" />
                      <Input type="email" {...field} className="h-12 rounded-xl border-[#dce7e1] bg-[#fbfefc] pl-11 pr-4 text-[15px] text-[#26364b] shadow-none transition placeholder:text-[#a0acb8] focus-visible:border-[#12a857] focus-visible:ring-[#12a857]/20 focus-visible:ring-offset-0 group-data-[invalid=true]/field:border-red-500 group-data-[invalid=true]/field:focus-visible:border-red-500 group-data-[invalid=true]/field:focus-visible:ring-red-500/20" id={field.name} aria-invalid={fieldState.invalid} placeholder="ali@example.com" autoComplete="on" />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />


              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-semibold text-[#334155]" htmlFor={field.name}>Password</FieldLabel>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-[#94a3b8]" aria-hidden="true" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className="h-12 rounded-xl border-[#dce7e1] bg-[#fbfefc] pl-11 pr-12 text-[15px] text-[#26364b] shadow-none transition placeholder:text-[#a0acb8] focus-visible:border-[#12a857] focus-visible:ring-[#12a857]/20 focus-visible:ring-offset-0 group-data-[invalid=true]/field:border-red-500 group-data-[invalid=true]/field:focus-visible:border-red-500 group-data-[invalid=true]/field:focus-visible:ring-red-500/20"
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="create a strong password"
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
                    
                    <div className="mt-1 flex items-center gap-2" aria-live="polite">
                      <div className="flex h-1.5 flex-1 gap-1 overflow-hidden rounded-full bg-[#e8edef]">
                        {Array.from({ length: 5 }, (_, index) => (
                          <span key={index} className={`h-full flex-1 transition-colors ${index < passwordStrength ? strengthColor : "bg-[#e8edef]"}`} />
                        ))}
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength >= 4 ? "text-[#12a857]" : passwordStrength >= 2 ? "text-[#d97706]" : "text-[#64748b]"}`}>
                        {strengthLabel}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748b]">Must be at least 8 characters with numbers and symbols</p>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />


              <Controller
                name="rePassword"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-semibold text-[#334155]" htmlFor={field.name}>Confirm Password</FieldLabel>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-[#94a3b8]" aria-hidden="true" />
                      <Input
                        type={showRePassword ? "text" : "password"}
                        {...field}
                        className="h-12 rounded-xl border-[#dce7e1] bg-[#fbfefc] pl-11 pr-12 text-[15px] text-[#26364b] shadow-none transition placeholder:text-[#a0acb8] focus-visible:border-[#12a857] focus-visible:ring-[#12a857]/20 focus-visible:ring-offset-0 group-data-[invalid=true]/field:border-red-500 group-data-[invalid=true]/field:focus-visible:border-red-500 group-data-[invalid=true]/field:focus-visible:ring-red-500/20"
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="confirm your password"
                        autoComplete="on"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRePassword((visible) => !visible)}
                        className="absolute right-0 top-0 grid h-12 w-12 place-items-center text-[#64748b] transition hover:text-[#12a857]"
                        aria-label={showRePassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showRePassword ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />


              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-semibold text-[#334155]" htmlFor={field.name}>Phone Number</FieldLabel>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-[#94a3b8]" aria-hidden="true" />
                      <Input {...field} className="h-12 rounded-xl border-[#dce7e1] bg-[#fbfefc] pl-11 pr-4 text-[15px] text-[#26364b] shadow-none transition placeholder:text-[#a0acb8] focus-visible:border-[#12a857] focus-visible:ring-[#12a857]/20 focus-visible:ring-offset-0 group-data-[invalid=true]/field:border-red-500 group-data-[invalid=true]/field:focus-visible:border-red-500 group-data-[invalid=true]/field:focus-visible:ring-red-500/20" id={field.name} aria-invalid={fieldState.invalid} placeholder="+1 234 567 8900" autoComplete="tel" />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />


              <label className="flex items-start gap-2 text-sm text-[#64748b]">
                <input type="checkbox" required className="mt-0.5 size-4 shrink-0 rounded border-[#cbd5e1] accent-[#12a857]" />
                <span>I agree to the <Link href="/terms" className="font-semibold text-[#0ca653] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="font-semibold text-[#0ca653] hover:underline">Privacy Policy</Link></span>
              </label>
                <Button type="submit" disabled={isSubmitting} className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#12a857] text-base font-bold text-white shadow-[0_10px_20px_rgba(18,168,87,0.18)] transition hover:bg-[#0d9149] hover:shadow-[0_12px_24px_rgba(18,168,87,0.24)] disabled:opacity-60">
                <UserPlus size={18} aria-hidden="true" />
                  {isSubmitting ? 'Creating account…' : 'Create My Account'}
              </Button>



            </div>
          </form>

          <p className="mt-8 text-center text-sm text-[#64748b]">
            Already have an account? <Link href="/login" className="font-bold text-[#0ca653] hover:text-[#08783c]">Sign In</Link>
          </p>

        </section>

      </div>
    </main>
  );
} 
