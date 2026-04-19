'use client'
import {SignUp} from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      
      <div className="w-full max-w-md p-6 rounded-2xl shadow-xl bg-gray-900 border border-gray-800">
        
        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          Create your account
        </h1>

        <SignUp />

      </div>
    </div>
  );
}