"use client";

import { Button, Card, CardContent } from "@heroui/react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  CloudUpload,
  Shield,
  Folder,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#0f172a]/80 via-[#0b1f3a]/80 to-[#020617]/80 text-white">

      <Navbar />

      <main className="flex-1">

        {/* ================= HERO ================= */}
        <section className="py-20 md:py-28 px-4">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

            {/* TEXT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your files,{" "}
                <span className="text-blue-400">organized</span>  
                <br />
                and always within reach
              </h1>

              <p className="text-lg text-blue-200/70 max-w-lg mx-auto lg:mx-0">
                A clean, fast, and secure way to manage everything — from
                documents to memories — all in one place.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">

                {!isSignedIn ? (
                  <>
                    <Link href="/sign-up">
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button variant="primary" size="lg">
                          Get Started →
                        </Button>
                      </motion.div>
                    </Link>

                    <Link href="/sign-in">
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="lg">
                          Sign In
                        </Button>
                      </motion.div>
                    </Link>
                  </>
                ) : (
                  <Link href="/dashboard">
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button variant="primary" size="lg">
                        Go to Dashboard →
                      </Button>
                    </motion.div>
                  </Link>
                )}

              </div>
            </motion.div>

            {/* HERO VISUAL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center relative"
            >
              <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative bg-white/60 dark:bg-white/5 backdrop-blur-xl border rounded-2xl p-10 shadow-xl shadow-blue-900/20"
              >
                <ImageIcon className="h-20 w-20 text-blue-400 mx-auto" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center mb-12"
            >
              Everything you need, nothing you don’t
            </motion.h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

              {[{
                icon: CloudUpload,
                title: "Lightning Fast Uploads",
                desc: "Drag, drop, and store your files instantly.",
              },
              {
                icon: Folder,
                title: "Effortless Organization",
                desc: "Folders, search, and structure made simple.",
              },
              {
                icon: Shield,
                title: "Private & Secure",
                desc: "Your files stay safe and accessible only to you.",
              }].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="p-6 text-center backdrop-blur-xl bg-white/60 dark:bg-white/5 border shadow-lg shadow-blue-900/10">
                    <CardContent>
                      <item.icon className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                      <h3 className="text-xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-blue-200/70">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="py-24 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto backdrop-blur-xl bg-white/60 dark:bg-white/5 border rounded-2xl p-10 shadow-lg shadow-blue-900/20"
          >

            <h2 className="text-3xl font-bold mb-4">
              Start organizing your digital life today
            </h2>

            <p className="text-blue-200/70 mb-8">
              Simple. Fast. Reliable. Everything your files need.
            </p>

            {!isSignedIn ? (
              <Link href="/sign-up">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button variant="primary" size="lg">
                    Create Account →
                  </Button>
                </motion.div>
              </Link>
            ) : (
              <Link href="/dashboard">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button variant="primary" size="lg">
                    Open Dashboard →
                  </Button>
                </motion.div>
              </Link>
            )}

          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-6 text-center text-sm text-blue-200/60">
        © {new Date().getFullYear()} CloudKeep — Simple, secure, and fast
      </footer>
    </div>
  );
}