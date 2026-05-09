// "use client";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";

// export default function LoginPage() {
//   return (
//     <div className="min-h-screen bg-[#f3f3f5] flex items-center justify-center px-4">
      
//       {/* CARD */}
//       <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-xl overflow-hidden">
        
//         {/* TOP HEADER */}
//         <div className="bg-red-500 text-white px-6 py-8 relative">
          
//           {/* BACK BUTTON */}
//           <Link
//             href="/"
//             className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium hover:opacity-80 duration-300"
//           >
//             <ArrowLeft size={18} />
//             Home
//           </Link>

//           {/* TITLE */}
//           <div className="text-center mt-4">
//             <h1 className="text-5xl font-black bg-red-600 px-4 py-2 rounded-xl inline-block">
//               Mystery Mosaic AI
//             </h1>

//             <p className="mt-4 text-white/90 text-lg">
//               Sign in to continue
//             </p>
//           </div>
//         </div>

//         {/* FORM */}
//         <div className="px-8 py-10">
          
//           {/* EMAIL */}
//           <div className="mb-7">
//             <label className="block text-gray-700 font-medium mb-3">
//               Email Address
//             </label>

//             <input
//               type="email"
//               placeholder="name@example.com"
//               className="w-full h-14 border border-gray-300 rounded-xl px-5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-lg"
//             />
//           </div>

//           {/* PASSWORD */}
//           <div className="mb-4">
//             <label className="block text-gray-700 font-medium mb-3">
//               Password
//             </label>

//             <input
//               type="password"
//               placeholder="••••••••"
//               className="w-full h-14 border border-gray-300 rounded-xl px-5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-lg"
//             />
//           </div>

//           {/* FORGOT PASSWORD */}
//           <div className="flex justify-end mb-8">
//             <Link
//               href="/forgotpassword"
//               className="text-red-500 text-sm font-medium hover:underline"
//             >
//               Forgot Password?
//             </Link>
//           </div>

//           {/* BUTTON */}
//           <button className="w-full h-14 rounded-xl bg-red-500 text-white text-xl font-bold hover:opacity-90 duration-300 shadow-lg">
//             Sign In
//           </button>

//           {/* SIGNUP */}
//           <p className="text-center text-gray-600 mt-8 text-lg">
//             Don't have an account?{" "}
//             <Link
//               href="/signup"
//               className="text-red-500 font-semibold hover:underline"
//             >
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPaint, setShowPaint] = useState(false);

  const handleLogin = () => {
    // Login hone ke baad paint show hoga
    setShowPaint(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f3f5] flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* LEATHER PAINT EFFECT */}
      {showPaint && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          
          <div className="relative w-[320px] h-[320px] rounded-full bg-gradient-to-br from-red-700 via-red-500 to-red-900 shadow-[0_0_80px_rgba(239,68,68,0.7)] animate-pulse overflow-hidden">
            
            {/* Leather Texture */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"></div>

            {/* Paint Splash */}
            <div className="absolute -top-10 left-10 w-40 h-40 bg-red-300 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute bottom-0 right-0 w-52 h-52 bg-red-800 rounded-full blur-3xl opacity-40"></div>

            {/* Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-3xl font-black tracking-wide text-center px-6">
                Welcome Back
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* CARD */}
      <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-xl overflow-hidden relative z-10">
        
        {/* TOP HEADER */}
        <div className="bg-red-500 text-white px-6 py-8 relative">
          
          {/* BACK BUTTON */}
          <Link
            href="/"
            className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium hover:opacity-80 duration-300"
          >
            <ArrowLeft size={18} />
            Home
          </Link>

          {/* TITLE */}
          <div className="text-center mt-4">
            <h1 className="text-5xl font-black bg-red-600 px-4 py-2 rounded-xl inline-block">
              Mystery Mosaic AI
            </h1>

            <p className="mt-4 text-white/90 text-lg">
              Sign in to continue
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="px-8 py-10">
          
          {/* EMAIL */}
          <div className="mb-7">
            <label className="block text-gray-700 font-medium mb-3">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@example.com"
              className="w-full h-14 border border-gray-300 rounded-xl px-5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-lg"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-3">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-14 border border-gray-300 rounded-xl px-5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-lg"
            />
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end mb-8">
            <Link
              href="/forgotpassword"
              className="text-red-500 text-sm font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* BUTTON */}
         <Link
  href="/mystly"
  className="w-full h-14 rounded-xl bg-red-500 text-white text-xl font-bold hover:opacity-90 duration-300 shadow-lg flex items-center justify-center"
>
  Sign In
</Link>

          {/* SIGNUP */}
          <p className="text-center text-gray-600 mt-8 text-lg">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-red-500 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}