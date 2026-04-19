'use client'
import {SignIn} from "@clerk/nextjs";


export default function SignInPage() {
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      
      <div className="w-full max-w-md p-6 rounded-2xl shadow-xl bg-gray-900 border border-gray-800">
        
        <h1 className="text-2xl font-semibold text-white text-center">
          Welcome back
        </h1>

        <p className="text-gray-400 text-sm text-center mt-2 mb-6">
          Sign in to continue
        </p>
        <SignIn routing="path" path="/sign-in" />

      </div>
    </div>
  );
}