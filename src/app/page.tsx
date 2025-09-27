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
                Saturday, September 27, 2025 • Volume 127, Issue 42
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
                <span className="inline-block rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-400">
                  Breaking News
                </span>
              </div>
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Revolutionary Coffee Pool System Launches in Web3
              </h2>
              <p className="mb-6 text-lg text-white/70 leading-relaxed">
                A groundbreaking new platform allows coffee enthusiasts to participate in decentralized
                group purchases using PYUSD stablecoin. The innovative system creates fair distribution
                pools where participants can join for just 1 PYUSD and have equal chances of winning
                premium coffee selections.
              </p>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span>By Crypto Reporter</span>
                <span>•</span>
                <span>2 hours ago</span>
              </div>
            </article>

            <div className="grid gap-8 md:grid-cols-2">
              <article>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Local Economy Sees Boost from DeFi Adoption
                </h3>
                <p className="text-white/70">
                  Small businesses report increased revenue as cryptocurrency payments become more mainstream.
                  Local coffee shops are leading the charge in adopting digital currencies.
                </p>
              </article>
              <article>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Weather Update: Perfect Conditions for Coffee Growing
                </h3>
                <p className="text-white/70">
                  Favorable monsoon patterns this season promise exceptional harvests from traditional
                  growing regions across South India and Ethiopia.
                </p>
              </article>
            </div>
          </div>

          {/* Right Column - Sidebar & Ads */}
          <div className="lg:col-span-4 space-y-8">
            {/* Weather Widget */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="mb-4 text-lg font-semibold text-white">Today's Weather</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Temperature</span>
                  <span className="text-white">72°F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Conditions</span>
                  <span className="text-white">Partly Cloudy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Perfect for</span>
                  <span className="text-white">☕ Coffee</span>
                </div>
              </div>
            </div>

            {/* Stock Market */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="mb-4 text-lg font-semibold text-white">Market Update</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">PYUSD</span>
                  <span className="text-green-400">+2.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">BTC</span>
                  <span className="text-green-400">+1.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">ETH</span>
                  <span className="text-green-400">+3.2%</span>
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
              Coffee Culture Evolution
            </h3>
            <p className="text-sm text-white/70">
              How blockchain technology is revolutionizing the coffee industry, from bean to cup.
            </p>
          </article>
          <article>
            <h3 className="mb-3 text-lg font-semibold text-white">
              Sustainable Sourcing Trends
            </h3>
            <p className="text-sm text-white/70">
              New initiatives ensure fair trade practices and environmental responsibility in coffee production.
            </p>
          </article>
          <article>
            <h3 className="mb-3 text-lg font-semibold text-white">
              Smart Contracts in Commerce
            </h3>
            <p className="text-sm text-white/70">
              Automated agreements are streamlining transactions and building trust in digital marketplaces.
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
