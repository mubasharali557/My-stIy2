// // app/signup/page.tsx

// export default function SignupPage() {
//   return (
//     <div className="min-h-screen bg-[#ececec] flex items-center justify-center px-4">
//       <div className="w-full max-w-[450px] bg-white rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-hidden">
        
//         {/* Header */}
//         <div className="bg-[#4f46e5] text-white text-center py-12">
//           <h1 className="text-[42px] font-bold leading-tight">
//             Mystery Mosaic AI
//           </h1>

//           <p className="mt-3 text-[20px] text-white/90">
//             Create your account
//           </p>
//         </div>

//         {/* Form */}
//         <div className="px-8 py-10">
//           {/* Email */}
//           <div className="mb-6">
//             <label className="block text-[22px] font-medium text-[#2d2d2d] mb-3">
//               Email Address
//             </label>

//             <input
//               type="email"
//               placeholder="name@example.com"
//               className="w-full h-[62px] rounded-[10px] border border-[#d3d7df] px-5 text-[22px] outline-none focus:ring-2 focus:ring-[#4f46e5]"
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-8">
//             <label className="block text-[22px] font-medium text-[#2d2d2d] mb-3">
//               Password
//             </label>

//             <input
//               type="password"
//               placeholder="••••••••"
//               className="w-full h-[62px] rounded-[10px] border border-[#d3d7df] px-5 text-[22px] outline-none focus:ring-2 focus:ring-[#4f46e5]"
//             />
//           </div>

//           {/* Button */}
//           <button className="w-full h-[64px] bg-[#4f46e5] hover:bg-[#4338ca] transition rounded-[10px] text-white text-[28px] font-semibold">
//             Sign Up
//           </button>

//           {/* Footer */}
//           <div className="text-center mt-10">
//             <p className="text-[20px] text-[#3f3f46]">
//               Already have an account?{" "}
//               <a
//                 href="/login"
//                 className="text-[#4f46e5] font-semibold hover:underline"
//               >
//                 Log In
//               </a>
//             </p>

//             <a
//               href="/"
//               className="block mt-8 text-[16px] text-[#9ca3af] hover:underline"
//             >
//               Back to Home
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// app/signup/page.tsx

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#f3f3f5] flex items-center justify-center px-4">
      
      <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-500 text-white text-center py-12 relative">
          
          <h1 className="text-[42px] font-bold leading-tight bg-red-600 inline-block px-5 py-2 rounded-xl">
            Mystery Mosaic AI
          </h1>

          <p className="mt-4 text-[20px] text-white/90">
            Create your account
          </p>

          {/* Back to Home */}
          <a
            href="/"
            className="absolute left-4 top-4 text-sm hover:opacity-80"
          >
            ← Home
          </a>
        </div>

        {/* Form */}
        <div className="px-8 py-10">
          
          {/* Email */}
          <div className="mb-6">
            <label className="block text-[20px] font-medium text-gray-700 mb-3">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@example.com"
              className="w-full h-[58px] rounded-xl border border-gray-300 px-5 text-lg outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="block text-[20px] font-medium text-gray-700 mb-3">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-[58px] rounded-xl border border-gray-300 px-5 text-lg outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
            />
          </div>

          {/* Button */}
          <button className="w-full h-[60px] bg-red-500 hover:bg-red-600 transition rounded-xl text-white text-xl font-semibold shadow-md">
            Sign Up
          </button>

          {/* Footer */}
          <div className="text-center mt-10">
            
            <p className="text-lg text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-red-500 font-semibold hover:underline"
              >
                Log In
              </a>
            </p>

            <a
              href="/"
              className="block mt-6 text-sm text-gray-400 hover:underline"
            >
              Back to Home
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}