import Link from "next/link";
import { CiUser } from "react-icons/ci";
import { FaPhoneAlt, FaTruck, FaSignOutAlt } from "react-icons/fa";
import { IoGiftSharp } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { HiUserAdd } from "react-icons/hi";
import { signOut, useSession } from "next-auth/react";

export default function DesktopTopNav({ isScrolled }: { isScrolled: boolean }) {
  const { data, status } = useSession();

  function handelLogOut() {
    signOut({ redirect: true, callbackUrl: '/login' })
  }

  return (
    <div
      data-slot="top-navbar"
      className={`fixed left-0 top-0 z-50 hidden w-full border-b border-slate-200 bg-white transition-[transform,opacity] duration-300 motion-reduce:transition-none lg:block ${isScrolled ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
    >
      <div className="flex h-[38px] items-center justify-between px-4 sm:px-5 lg:px-6">

        {/* Left */}
        <div className="flex items-center gap-7">
          <p
            className="flex items-center gap-2 text-[13px] font-normal text-[#6A7282] transition-colors hover:text-[#16A34A]"
          >
            <FaTruck size={13} className="text-[#16A34A]" />
            <span>Free Shipping on Orders 500 EGP</span>
          </p>

          <p
            className="flex items-center gap-2 text-[13px] font-normal text-[#6A7282] transition-colors hover:text-[#16A34A]"
          >
            <IoGiftSharp size={14} className="text-[#16A34A]" />
            <span>New Arrivals Daily</span>
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          <a
            href="tel:+201000000000"
            className="flex items-center gap-2 text-[13px] font-normal text-[#6A7282] transition-colors hover:text-[#16A34A]"
          >
            <FaPhoneAlt size={11} />
            <span>+1 (800) 123-4567</span>
          </a>

          <a
            href="mailto:support@freshcart.com"
            className="flex items-center gap-2 text-[13px] font-normal text-[#6A7282] transition-colors hover:text-[#16A34A]"
          >
            <MdOutlineEmail size={15} />
            <span>support@freshcart.com</span>
          </a>

          <div className="h-4 w-px bg-[#E5E7EB]" />

          {status === "authenticated" ? (
            <>
              {/* User */}
              <Link href="" className="flex items-center gap-1.5 text-[13px] font-normal text-[#6A7282] hover:text-[#16A34A]">
                <CiUser size={18} />
                <span>{data?.user?.name}</span>
              </Link>

              {/* Sign Out */}
              <button
                onClick={handelLogOut}
                type="button"
                className="flex items-center gap-1.5 text-[13px] font-normal text-[#6A7282] transition-colors hover:text-red-500"
              >
                <FaSignOutAlt size={16} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              {/* Sign In */}
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-[13px] font-normal text-[#6A7282] transition-colors hover:text-[#16A34A]"
              >
                <CiUser size={18} />
                <span>Sign In</span>
              </Link>

              {/* Sign Up */}
              <Link
                href="/register"
                className="flex items-center gap-1.5 text-[13px] font-normal text-[#6A7282] transition-colors hover:text-[#16A34A]"
              >
                <HiUserAdd size={16} />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
