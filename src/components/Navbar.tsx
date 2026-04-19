"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  CloudUpload,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { useState, useEffect } from "react";

interface SerializedUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  username?: string | null;
  emailAddress?: string | null;
  avatar?: string | null; // ✅ NEW
}

interface NavbarProps {
  user?: SerializedUser | null;
}

export default function Navbar({ user }: NavbarProps) {
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isOnDashboard =
    pathname === "/dashboard" || pathname?.startsWith("/dashboard/");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut(() => router.push("/"));
  };

  const userDetails = {
    initials:
      user?.firstName?.[0] || user?.username?.[0] || "U",
    displayName:
      user?.firstName || user?.username || "User",
  };

  // ✅ FINAL AVATAR SOURCE
  const avatarSrc = user?.avatar || user?.imageUrl || null;

  const menuItems = [
    {
      key: "profile",
      label: "Profile",
      action: () => router.push("/dashboard?tab=profile"),
    },
    {
      key: "files",
      label: "My Files",
      action: () => router.push("/dashboard"),
    },
    {
      key: "logout",
      label: "Sign Out",
      action: handleSignOut,
      danger: true,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 
      bg-gradient-to-r from-[#0f172a]/80 via-[#0b1f3a]/80 to-[#020617]/80
      backdrop-blur-xl border-b border-white/10
      ${isScrolled ? "shadow-lg shadow-blue-500/10" : ""}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition">
            <img
              src="/logo.png"
              alt="CloudKeep logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            CloudKeep
          </h1>
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-4">

          {!user && (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" className="hover:bg-white/10">
                  Sign In
                </Button>
              </Link>

              <Link href="/sign-up">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-md">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-4">

              {!isOnDashboard && (
                <Link href="/dashboard">
                  <Button variant="ghost" className="hover:bg-white/10">
                    Dashboard
                  </Button>
                </Link>
              )}

              {/* USER DROPDOWN */}
              <Dropdown>
                <DropdownTrigger>
                  <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-xl hover:bg-white/10 transition">

                    <Avatar className="bg-blue-500/20 text-blue-400">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt="user"
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-xs font-semibold">
                          {userDetails.initials}
                        </span>
                      )}
                    </Avatar>

                    <span className="hidden sm:block font-medium text-white">
                      {userDetails.displayName}
                    </span>

                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </DropdownTrigger>

                <DropdownMenu
                  aria-label="User menu"
                  items={menuItems}
                  className="bg-[#0f172a] border border-white/10 backdrop-blur-xl rounded-xl px-3 py-2 flex flex-row items-center gap-2"
                >
                  {(item) => (
                    <DropdownItem
                      key={item.key}
                      onClick={item.action}
                      className={`
                        px-4 py-2
                        text-base font-semibold
                        whitespace-nowrap
                        rounded-lg
                        transition
                        hover:bg-white/10
                        ${
                          item.danger
                            ? "text-red-400 hover:bg-red-500/10"
                            : "text-white"
                        }
                      `}
                    >
                      {item.label}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <Button
          variant="ghost"
          className="md:hidden hover:bg-white/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full 
          bg-[#0f172a] border-t border-white/10 backdrop-blur-xl 
          p-4 flex flex-col gap-3 md:hidden shadow-xl">

            {!user ? (
              <>
                <Link href="/sign-in">
                  <Button className="w-full bg-white/10">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="w-full bg-blue-500 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Avatar className="bg-blue-500/20 text-blue-400">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      userDetails.initials
                    )}
                  </Avatar>
                  <span>{userDetails.displayName}</span>
                </div>

                <Link href="/dashboard">
                  <Button className="w-full bg-white/10">Dashboard</Button>
                </Link>

                <Button
                  onClick={handleSignOut}
                  className="w-full bg-red-500/80 text-white"
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}