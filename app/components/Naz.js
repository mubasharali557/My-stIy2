// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   Sparkles,
//   Palette,
//   Wand2,
//   Download,
//   Mail,
//   Phone,
// } from "lucide-react";

// export default function Home() {
//   const features = [
//     {
//       icon: <Sparkles size={22} />,
//       title: "11 Unique Shapes",
//       desc: "Create with Rectangle, Triangle, Hexagon, Circle, Polygon, Round, Diamond, Brick, Octagon, Voronoi and more!",
//       color: "bg-purple-100 text-purple-600",
//     },
//     {
//       icon: <Palette size={22} />,
//       title: "Named Color Palette",
//       desc: "Export your palette with accurate color names and hex codes.",
//       color: "bg-pink-100 text-pink-500",
//     },
//     {
//       icon: <Wand2 size={22} />,
//       title: "Quality Export",
//       desc: "Download high-resolution PNG, vector SVG, or ready-to-print PDFs.",
//       color: "bg-green-100 text-green-500",
//     },
//     {
//       icon: <Download size={22} />,
//       title: "Private & Secure",
//       desc: "Your images and generations are private and secure.",
//       color: "bg-orange-100 text-orange-500",
//     },
//     {
//       icon: <Download size={22} />,
//       title: "Private & Secure",
//       desc: "Your images and generations are private and secure.",
//       color: "bg-orange-100 text-orange-500",
//     },
//     {
//       icon: <Download size={22} />,
//       title: "Private & Secure",
//       desc: "Your images and generations are private and secure.",
//       color: "bg-orange-100 text-orange-500",
//     },
//     {
//       icon: <Wand2 size={22} />,
//       title: "Quality Export",
//       desc: "Download high-resolution PNG, vector SVG, or ready-to-print PDFs.",
//       color: "bg-green-100 text-green-500",
//     },
//     {
//       icon: <Wand2 size={22} />,
//       title: "Quality Export",
//       desc: "Download high-resolution PNG, vector SVG, or ready-to-print PDFs.",
//       color: "bg-green-100 text-green-500",
//     },
//     {
//       icon: <Palette size={22} />,
//       title: "Named Color Palette",
//       desc: "Export your palette with accurate color names and hex codes.",
//       color: "bg-pink-100 text-pink-500",
//     },
//     {
//       icon: <Palette size={22} />,
//       title: "Named Color Palette",
//       desc: "Export your palette with accurate color names and hex codes.",
//       color: "bg-pink-100 text-pink-500",
//     },
//   ];

//   const pricing = [
//     {
//       name: "Basic",
//       price: "$9.99",
//       credits: "100",
//       btn: "Choose Basic",
//       link: "/login",
//       active: false,
//     },
//     {
//       name: "Plus",
//       price: "$40",
//       credits: "500",
//       btn: "Choose Plus",
//       link: "/login",
//       active: true,
//     },
//     {
//       name: "Pro",
//       price: "$300",
//       credits: "5,000",
//       btn: "Choose Pro",
//       link: "/login",
//       active: false,
//     },
//   ];

//   return (
//     <div className="bg-[#f7f7fa] text-[#0f172a] overflow-hidden">

//       {/* NAVBAR */}
//       <header className="w-full px-8 lg:px-16 py-5 flex items-center justify-between">

//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
//             ✦
//           </div>

//           <h2 className="text-[22px] font-bold text-green-500">
//             Mystery Mosaic AI
//           </h2>
//         </div>

//         <div className="hidden md:flex items-center gap-10">

//           <Link href="#features" className="text-[15px] font-medium">
//             Features
//           </Link>

//           <Link href="#pricing" className="text-[15px] font-medium">
//             Pricing
//           </Link>

//           <Link href="/login" className="text-[15px] font-medium">
//             Log In
//           </Link>

//           <Link href="/login">
//             <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 duration-300">
//               Get 5 Free Credits
//             </button>
//           </Link>
//         </div>
//       </header>

//       {/* HERO */}
//       <section className="max-w-7xl mx-auto px-6 pt-16 text-center relative">

//         <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-5 py-2 rounded-full text-sm font-semibold">
//           ✦ AI-Powered Mosaic Generator
//         </div>

//         <h1 className="text-5xl md:text-7xl font-black mt-8 leading-tight text-green-500">
//           {/* Turn Photos into */}
//           <br />
          
//           <span className="text-green-500">
//             Color-By-Number Art
//           </span>
//         </h1>

//         <p className="max-w-3xl mx-auto text-gray-600 text-lg mt-8 leading-8">
//           Create professional mosaic sheets for Amazon KDP, educational
//           printables, or digital art.
//         </p>

//         <Link href="/login">
//           <button className="mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-2xl hover:scale-105 duration-300">
//             Create Now →
//           </button>
//         </Link>

//         {/* IMAGE */}
//         <div className="mt-20 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 max-w-5xl mx-auto">
//           <Image
//             src="/image1.jpg"
//             alt="mosaic"
//             width={1400}
//             height={800}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </section>

//       {/* FEATURES */}
//       <section
//         id="features"
//         className="max-w-7xl mx-auto px-6 py-36"
//       >
//         <div className="text-center">

//           <h2 className="text-5xl font-black text-green-500">
//             Powerful Mosaic Engine
//           </h2>

//           <p className="text-gray-500 mt-5 text-lg">
//             Everything you need to create diverse and stunning patterns.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
//           {features.map((item, index) => (
//             <div
//               key={index}
//               className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl duration-300"
//             >
//               <div
//                 className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
//               >
//                 {item.icon}
//               </div>

//               <h3 className="text-2xl font-bold mt-7">
//                 {item.title}
//               </h3>

//               <p className="text-gray-500 mt-5 leading-7">
//                 {item.desc}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* PRICING */}
//       <section
//         id="pricing"
//         className="max-w-7xl mx-auto px-6 pb-32"
//       >
//         <div className="text-center">

//           <h2 className="text-5xl font-black text-green-500">
//             Simple, Transparent Pricing
//           </h2>

//           <p className="text-gray-500 mt-5 text-lg">
//             Choose the plan that fits your needs.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-10 mt-20">
//           {pricing.map((plan, index) => (
//             <div
//               key={index}
//               className={`relative rounded-3xl border p-10 bg-white ${
//                 plan.active
//                   ? "border-indigo-500 shadow-2xl scale-105"
//                   : "border-gray-200"
//               }`}
//             >
//               {plan.active && (
//                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold">
//                   MOST POPULAR
//                 </div>
//               )}

//               <h3 className="text-2xl font-bold">
//                 {plan.name}
//               </h3>

//               <div className="mt-6 flex items-end gap-2">
//                 <span className="text-6xl font-black text-green-500">
//                   {plan.price}
//                 </span>

//                 <span className="text-gray-500 mb-2">
//                   / mo
//                 </span>
//               </div>

//               <div className="bg-indigo-50 rounded-2xl p-6 mt-8">
//                 <h4 className="text-5xl font-black text-indigo-600">
//                   {plan.credits}
//                 </h4>

//                 <p className="text-indigo-600 font-semibold mt-2">
//                   Credits / mo
//                 </p>
//               </div>

//               <Link href={plan.link}>
//                 <button
//                   className={`w-full py-4 rounded-2xl mt-10 font-bold text-lg duration-300 ${
//                     plan.active
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
//                       : "bg-gray-100 hover:bg-gray-200"
//                   }`}
//                 >
//                   {plan.btn}
//                 </button>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="bg-[#081121] text-white">
//         <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-16">

//           <div>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
//                 ✦
//               </div>

//               <h2 className="text-2xl font-bold text-green-500">
//                 Mystery Mosaic AI
//               </h2>
//             </div>

//             <p className="text-gray-400 mt-8 leading-8">
//               The ultimate tool for creating high-quality color-by-number art.
//             </p>
//           </div>

//           <div>
//             <h3 className="text-2xl font-bold mb-8">
//               Contact Us
//             </h3>

//             <div className="space-y-6 text-gray-400">
//               <div className="flex items-center gap-3">
//                 <Mail size={20} />
//                 <span>nuhacolorbynumber@gmail.com</span>
//               </div>

//               <div className="flex items-center gap-3">
//                 <Phone size={20} />
//                 <span>+880 01401686658</span>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-2xl font-bold mb-8">
//               Legal
//             </h3>

//             <ul className="space-y-5 text-gray-400">
//               <li>Privacy Policy</li>
//               <li>Terms of Service</li>
//               <li>Refund Policy</li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-gray-800 py-8 text-center text-gray-500">
//           © 2026 Mystery Mosaic AI
//         </div>
//       </footer>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Palette,
  Wand2,
  Download,
  Mail,
  Phone,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Sparkles size={24} />,
      title: "11 Unique Shapes",
      desc: "Create with Rectangle, Triangle, Hexagon, Circle, Polygon and more amazing patterns.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <Palette size={24} />,
      title: "Named Color Palette",
      desc: "Export your palette with accurate color names and hex codes instantly.",
      color: "bg-pink-100 text-pink-500",
    },
    {
      icon: <Wand2 size={24} />,
      title: "Quality Export",
      desc: "Download high-resolution PNG, SVG, and ready-to-print PDFs.",
      color: "bg-green-100 text-green-500",
    },
    {
      icon: <Download size={24} />,
      title: "Private & Secure",
      desc: "Your uploads and generations remain fully private and secure.",
      color: "bg-orange-100 text-orange-500",
    },
    {
      icon: <Sparkles size={24} />,
      title: "Fast Processing",
      desc: "Generate stunning mosaics in seconds using advanced AI tools.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Palette size={24} />,
      title: "Unlimited Creativity",
      desc: "Customize colors, layouts, and shapes exactly the way you want.",
      color: "bg-red-100 text-red-500",
    },
    {
      icon: <Wand2 size={24} />,
      title: "Professional Results",
      desc: "Perfect for Amazon KDP books, educational printables, and art.",
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: <Download size={24} />,
      title: "Instant Download",
      desc: "Download your generated files immediately after creation.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: <Sparkles size={24} />,
      title: "AI Powered",
      desc: "Advanced AI technology transforms photos into beautiful mosaics.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: <Palette size={24} />,
      title: "Modern Templates",
      desc: "Choose from elegant templates and creative mosaic styles.",
      color: "bg-cyan-100 text-cyan-600",
    },
  ];

  const pricing = [
    {
      name: "Basic",
      price: "$9.99",
      credits: "100",
      btn: "Choose Basic",
      link: "/login",
      active: false,
    },
    {
      name: "Plus",
      price: "$40",
      credits: "500",
      btn: "Choose Plus",
      link: "/login",
      active: true,
    },
    {
      name: "Pro",
      price: "$300",
      credits: "5,000",
      btn: "Choose Pro",
      link: "/login",
      active: false,
    },
  ];

  return (
    <div className="bg-[#f7f7fa] text-[#0f172a] overflow-hidden">
      
      {/* NAVBAR */}
      <header className="w-full px-8 lg:px-16 py-5 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            ✦
          </div>

          <h2 className="text-[22px] font-bold text-green-500">
            Mystery Mosaic AI
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-[15px] font-medium hover:text-indigo-600 duration-300">
            Features
          </Link>

          <Link href="#pricing" className="text-[15px] font-medium hover:text-indigo-600 duration-300">
            Pricing
          </Link>

          <Link href="/login" className="text-[15px] font-medium hover:text-indigo-600 duration-300">
            Log In
          </Link>

          <Link href="/login">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 duration-300">
              Get 5 Free Credits
            </button>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-16 text-center relative">
        
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-5 py-2 rounded-full text-sm font-semibold">
          ✦ AI-Powered Mosaic Generator
        </div>

        <h1 className="text-5xl md:text-7xl font-black mt-8 leading-tight">
          <span className="text-green-500">
            <p>Turn image into</p>
            Color-By-Number Art
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-gray-600 text-lg mt-8 leading-8">
          Create professional mosaic sheets for Amazon KDP,
          educational printables, or digital art.
        </p>

        <Link href="/login">
          <button className="mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-2xl hover:scale-105 duration-300">
            Create Now →
          </button>
        </Link>

        {/* IMAGE */}
        <div className="mt-20 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 max-w-5xl mx-auto">
          <Image
            src="/image1.jpg"
            alt="mosaic"
            width={1400}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-32"
      >
        <div className="text-center">
          
          <h2 className="text-5xl font-black text-green-500">
            Powerful Mosaic Engine
          </h2>

          <p className="text-gray-500 mt-5 text-lg">
            Everything you need to create diverse and stunning patterns.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-20">
          {features.map((item, index) => (
            <div
              key={index}
              className="
                group
                bg-white
                border border-gray-200
                rounded-3xl
                p-6
                hover:shadow-2xl
                hover:-translate-y-2
                duration-300
                text-center
                min-h-[280px]
                flex
                flex-col
                items-center
                justify-start
              "
            >
              {/* ICON */}
              <div
                className={`
                  w-16 h-16
                  rounded-2xl
                  flex items-center justify-center
                  ${item.color}
                  shadow-md
                  group-hover:scale-110
                  duration-300
                `}
              >
                {item.icon}
              </div>

              {/* TITLE */}
              <h3 className="text-xl font-bold mt-6 leading-7">
                {item.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-gray-500 mt-4 leading-7 text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="max-w-7xl mx-auto px-6 pb-32"
      >
        <div className="text-center">
          
          <h2 className="text-5xl font-black text-green-500">
            Simple, Transparent Pricing
          </h2>

          <p className="text-gray-500 mt-5 text-lg">
            Choose the plan that fits your needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mt-20">
          {pricing.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl border p-10 bg-white duration-300 hover:shadow-2xl ${
                plan.active
                  ? "border-indigo-500 shadow-2xl scale-105"
                  : "border-gray-200"
              }`}
            >
              {plan.active && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
              )}

              <h3 className="text-2xl font-bold">
                {plan.name}
              </h3>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-6xl font-black text-green-500">
                  {plan.price}
                </span>

                <span className="text-gray-500 mb-2">
                  / mo
                </span>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-6 mt-8">
                <h4 className="text-5xl font-black text-indigo-600">
                  {plan.credits}
                </h4>

                <p className="text-indigo-600 font-semibold mt-2">
                  Credits / mo
                </p>
              </div>

              <Link href={plan.link}>
                <button
                  className={`w-full py-4 rounded-2xl mt-10 font-bold text-lg duration-300 ${
                    plan.active
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {plan.btn}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#081121] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-16">
          
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                ✦
              </div>

              <h2 className="text-2xl font-bold text-green-500">
                Mystery Mosaic AI
              </h2>
            </div>

            <p className="text-gray-400 mt-8 leading-8">
              The ultimate tool for creating high-quality color-by-number art.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8">
              Contact Us
            </h3>

            <div className="space-y-6 text-gray-400">
              <div className="flex items-center gap-3">
                <Mail size={20} />
                <span>nuhacolorbynumber@gmail.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={20} />
                <span>+880 01401686658</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8">
              Legal
            </h3>

            <ul className="space-y-5 text-gray-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Refund Policy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 py-8 text-center text-gray-500">
          © 2026 Mystery Mosaic AI
        </div>
      </footer>
    </div>
  );
}