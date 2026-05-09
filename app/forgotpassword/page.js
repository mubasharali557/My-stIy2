// export default function ResetPassword() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
//       {/* Card */}
//       <div className="w-[380px] bg-white rounded-2xl shadow-lg overflow-hidden">
        
//         {/* Header */}
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 relative">
//           <div className="absolute left-4 top-4 text-sm cursor-pointer">
//             ← Home
//           </div>

//           <h1 className="text-center text-2xl font-semibold mt-4">
//             Mystery Mosaic AI
//           </h1>
//           <p className="text-center text-sm mt-1 opacity-90">
//             Reset your password
//           </p>
//         </div>

//         {/* Body */}
//         <div className="p-6">
          
//           {/* Email */}
//           <label className="text-sm font-medium text-gray-700">
//             Email Address
//           </label>
//           <input
//             type="email"
//             placeholder="name@example.com"
//             className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />

//           {/* Button */}
//           <button className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90">
//             Send Reset Link
//           </button>

//           {/* Back to login */}
//           <p className="text-center text-sm text-purple-600 mt-4 cursor-pointer hover:underline">
//             Back to Login
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function ResetPassword() {
  return (
    <div className="min-h-screen bg-[#f3f3f5] flex items-center justify-center px-4">
      
      {/* Card */}
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-500 text-white p-6 relative">
          
          {/* Home */}
          <div className="absolute left-4 top-4 text-sm cursor-pointer hover:opacity-80">
            ← Home
          </div>

          <h1 className="text-center text-3xl font-bold mt-6 bg-red-600 inline-block px-4 py-2 rounded-xl">
            Mystery Mosaic AI
          </h1>

          <p className="text-center text-sm mt-3 text-white/90">
            Reset your password
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          
          {/* Email */}
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            placeholder="name@example.com"
            className="w-full mt-2 h-12 px-4 border border-gray-300 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          />

          {/* Button */}
          <button className="w-full mt-6 h-12 bg-red-500 text-white rounded-xl font-semibold text-lg hover:opacity-90 duration-300 shadow-md">
            Send Reset Link
          </button>

          {/* Back to login */}
          <p className="text-center text-sm text-red-500 mt-5 cursor-pointer hover:underline">
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
}