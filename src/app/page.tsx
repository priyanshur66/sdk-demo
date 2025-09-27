"use client";

import Link from "next/link";
import { useState } from "react";
import { HaloClient } from "pyusd-payments-sdk";

const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
const NETWORK = "testnet";
const HOUSE_RECIPIENT = "0x64cBdcCfa295a0dB0187E5Ef7fAC28205908B4e4";

const shortenAddress = (address) => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleHousePurchase = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const client = new HaloClient({
        rpcUrl: RPC_URL,
        network: NETWORK,
        recipient: HOUSE_RECIPIENT,
      });

      const senderAddress = await client.getWalletAddress();
      const currentBalance = await client.getPyusdBalance(senderAddress);

      if (Number(currentBalance) < 100) {
        throw new Error(
          "Insufficient PYUSD balance. You need at least 100 PYUSD to purchase this house."
        );
      }

      const signedTx = await client.makePayment(senderAddress, {
        amount: "100",
      });

      const broadcast = await client.broadcastTransaction(signedTx);

      alert("House purchase successful! Welcome to your new home!");
    } catch (err) {
      console.error(err);
      const fallback =
        err instanceof Error ? err.message : "Unexpected error processing house purchase.";
      alert(fallback);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030711] via-[#0b1229] to-black text-white">
      {/* Newspaper Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                The Daily Chronicle
              </h1>
              <p className="mt-2 text-lg text-white/70">
                Saturday, September 27, 2025 • Regulatory Edition
              </p>
            </div>
            <div className="hidden md:block">
              <Link
                href="/pools"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-emerald-300 hover:text-emerald-200"
              >
                ☕ Coffee Pools
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column - Main News */}
          <div className="lg:col-span-8">
            <article className="mb-12">
              <div className="mb-6">
                <span className="inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-400">
                  Regulatory Victory
                </span>
              </div>
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Major Breakthrough: SEC Approves First Bitcoin ETF
              </h2>
              <p className="mb-6 text-lg text-white/70 leading-relaxed">
                In a landmark decision, the Securities and Exchange Commission has granted approval for the first
                Bitcoin exchange-traded fund, paving the way for institutional investors to gain exposure to
                cryptocurrency through traditional markets. This regulatory green light is expected to bring
                billions in new investment to the digital asset space.
              </p>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span>By Financial Reporter</span>
                <span>•</span>
                <span>3 hours ago</span>
              </div>
            </article>

            <div className="grid gap-8 md:grid-cols-2">
              <article>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  EU Parliament Passes Comprehensive Crypto Regulation Framework
                </h3>
                <p className="text-white/70">
                  European lawmakers have approved MiCA (Markets in Crypto-Assets) regulation, creating a unified
                  framework for cryptocurrency operations across all EU member states. The legislation provides
                  much-needed clarity for businesses and consumers in the digital asset space.
                </p>
              </article>
              <article>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Singapore Grants First Digital Asset Banking Licenses
                </h3>
                <p className="text-white/70">
                  The Monetary Authority of Singapore has issued full banking licenses to two cryptocurrency
                  platforms, marking a significant milestone in the integration of traditional finance with
                  digital assets. This move establishes Singapore as a global leader in crypto regulation.
                </p>
              </article>
            </div>
          </div>

          {/* Right Column - Sidebar & Ads */}
          <div className="lg:col-span-4 space-y-8">
            {/* Crypto Market Widget */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="mb-4 text-lg font-semibold text-white">Crypto Market Update</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Bitcoin ETF</span>
                  <span className="text-green-400">+15.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Ethereum</span>
                  <span className="text-green-400">+8.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">PYUSD Stable</span>
                  <span className="text-green-400">+0.1%</span>
                </div>
              </div>
            </div>

            {/* Regulatory Progress */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="mb-4 text-lg font-semibold text-white">Regulatory Progress</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Countries with Crypto Laws</span>
                  <span className="text-white">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">CBDCs in Development</span>
                  <span className="text-white">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Licensed Exchanges</span>
                  <span className="text-white">200+</span>
                </div>
              </div>
            </div>

            {/* House Listing Ad - MAIN FEATURE */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-400/10 to-orange-400/5 p-6 backdrop-blur cursor-pointer transition-all hover:border-yellow-300 hover:scale-105" onClick={handleHousePurchase}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-orange-400/5"></div>
              <div className="relative">
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-400">
                    Premium Listing
                  </span>
                  <span className="text-xs text-yellow-400/70">Pay with PYUSD</span>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-white">
                  🏠 Dream Mountain Villa
                </h3>

                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Price:</span>
                    <span className="text-xl font-bold text-yellow-400">100 PYUSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Location:</span>
                    <span className="text-white">Alpine Heights</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Bedrooms:</span>
                    <span className="text-white">4 BR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Bathrooms:</span>
                    <span className="text-white">3 BA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Square Feet:</span>
                    <span className="text-white">2,500 sq ft</span>
                  </div>
                </div>

                <p className="mb-4 text-sm text-white/70">
                  Stunning mountain retreat with panoramic views, modern amenities, and direct access
                  to hiking trails. Perfect for nature lovers and remote workers.
                </p>

                <button
                  className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-3 text-sm font-semibold text-black transition hover:from-yellow-300 hover:to-orange-300 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing Purchase..." : "Buy Now - 100 PYUSD"}
                </button>

                <p className="mt-2 text-xs text-white/50">
                  Recipient: {shortenAddress(HOUSE_RECIPIENT)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - More News */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <article>
            <h3 className="mb-3 text-lg font-semibold text-white">
              UK Treasury Advances Digital Pound Plans
            </h3>
            <p className="text-sm text-white/70">
              The British government announces consultation on a central bank digital currency, positioning
              the UK at the forefront of digital finance innovation with potential launch by 2025.
            </p>
          </article>
          <article>
            <h3 className="mb-3 text-lg font-semibold text-white">
              Australia Recognizes Crypto as Regulated Financial Product
            </h3>
            <p className="text-sm text-white/70">
              Australian securities regulator grants crypto exchanges licensing under existing financial
              services laws, providing consumer protection and market stability for digital assets.
            </p>
          </article>
          <article>
            <h3 className="mb-3 text-lg font-semibold text-white">
              Japan Expands Crypto Tax Incentives for Businesses
            </h3>
            <p className="text-sm text-white/70">
              New tax reforms in Japan reduce corporate tax rates for cryptocurrency businesses,
              encouraging innovation and investment in the digital economy sector.
            </p>
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-white/60">
                © 2025 The Daily Chronicle. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <Link href="/pools" className="text-sm text-white/60 hover:text-white">
                Coffee Pools
              </Link>
              <a href="#" className="text-sm text-white/60 hover:text-white">
                About
              </a>
              <a href="#" className="text-sm text-white/60 hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
