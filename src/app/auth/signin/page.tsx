'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        setError(error.message);
      } else {
        router.push('/');
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
        <h2 className="mt-6 text-center text-3xl font-bold">
          Sign in to your account
        </h2>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#6366F1] hover:text-[#4F46E5]"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#2A2F3B] rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#6366F1] hover:bg-[#4F46E5] rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366F1]"
          >
            Sign in
          </button>
        </form>

        {/* Sign up link */}
        <p className="mt-4 text-center text-sm text-gray-400">
          Not a member?{' '}
          <Link href="/auth/signup" className="text-[#6366F1] hover:text-[#4F46E5]">
            Start a 14 day free trial
          </Link>
        </p>
      </div>
    </div>
  );
} 