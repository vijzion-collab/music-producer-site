"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const licenses = [
  {
    id: "personal",
    name: "Personal Use",
    price: 49,
    description: "For indie projects, student films, non-commercial content",
    features: ["Web & social media", "Up to 10k views", "No TV/film", "1 year license"],
    color: "from-zinc-700 to-zinc-800",
  },
  {
    id: "commercial",
    name: "Commercial",
    price: 299,
    description: "For businesses, ads, branded content, TV",
    features: ["Unlimited views", "TV & film allowed", "Broadcast rights", "2 year license"],
    color: "from-amber-500/20 to-yellow-400/20",
    popular: true,
  },
  {
    id: "exclusive",
    name: "Exclusive Rights",
    price: 999,
    description: "Full buyout, exclusive licensing, sync placements",
    features: ["All platforms", "Unlimited term", "Worldwide rights", "All media"],
    color: "from-amber-600/20 to-yellow-500/20",
  },
];

export default function LicensingPage() {
  const [selected, setSelected] = useState("commercial");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handlePurchase = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/licensing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseId: selected,
          trackTitle: "Music License",
          customerEmail: "customer@example.com",
          paymentMethod: "stripe",
        }),
      });
      const data = await res.json();
      setResult({ success: data.success, message: data.message });
    } catch {
      setResult({ success: false, message: "Payment failed" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-zinc-500">Music</span> <span className="gold-gradient">Licensing</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Clear licensing for your creative projects. One-time payments, instant delivery.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {licenses.map((license, i) => (
            <motion.div
              key={license.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(license.id)}
              className={`relative cursor-pointer rounded-3xl p-8 border transition-all ${
                selected === license.id
                  ? "border-amber-500/50 shadow-lg shadow-amber-500/10"
                  : "border-zinc-800 hover:border-zinc-700"
              } bg-gradient-to-b ${license.color}`}
            >
              {license.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full text-xs font-bold text-black">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{license.name}</h3>
              <p className="text-zinc-500 text-sm mb-6">{license.description}</p>
              <div className="mb-8">
                <span className="text-5xl font-black">${license.price}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {license.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={(e) => { e.stopPropagation(); handlePurchase(); }}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold transition ${
                  selected === license.id
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:scale-105"
                    : "bg-zinc-800 hover:bg-zinc-700"
                } disabled:opacity-50`}
              >
                {loading ? "Processing..." : selected === license.id ? "Purchase License" : "Select"}
              </button>
            </motion.div>
          ))}
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-12 p-6 rounded-2xl text-center ${
              result.success ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
            }`}
          >
            <p className={result.success ? "text-green-400" : "text-red-400"}>{result.message}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold mb-8">Accepted Payment Methods</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-3 px-6 py-3 glass rounded-xl border border-amber-500/20">
              <svg className="h-8" viewBox="0 0 50 50"><path fill="#635BFF" d="M25 50C11.2 50 0 38.8 0 25S11.2 0 25 0s25 11.2 25 25-11.2 25-25 25z"/></svg>
              <span className="font-medium">Stripe</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 glass rounded-xl border border-amber-500/20">
              <svg className="h-8" viewBox="0 0 50 50"><path fill="#003087" d="M25 0C11.2 0 0 11.2 0 25s11.2 25 25 25 25-11.2 25-25S38.8 0 25 0z"/></svg>
              <span className="font-medium">PayPal</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 glass rounded-xl border border-amber-500/20">
              <svg className="h-8" viewBox="0 0 50 50"><path fill="#009CDE" d="M25 0C11.2 0 0 11.2 0 25s11.2 25 25 25 25-11.2 25-25S38.8 0 25 0z"/></svg>
              <span className="font-medium">Bank Transfer</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}