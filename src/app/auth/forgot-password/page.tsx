'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        console.error('Password reset error:', error.message);
        setError(error.message);
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1C1F26] text-white p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Logo"
            width={32}
            height={32}
            priority
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Forgot password?</h2>
          <p className="mt-2 text-sm text-gray-400">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#2A2F3B] rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#6366F1] hover:bg-[#4F46E5] rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366F1]"
          >
            Reset password
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center">
          <Link
            href="/auth/signin"
            className="text-sm text-[#6366F1] hover:text-[#4F46E5]"
          >
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  );
} 