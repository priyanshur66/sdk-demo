"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { HaloClient } from "pyusd-payments-sdk";

const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
const NETWORK = "testnet";

const initialPools = [
  {
    id: "monsoon",
    name: "Monsoon Malabar",
    description: "Rich, full-bodied coffee with notes of dark chocolate and spice, aged by monsoon winds.",
    recipient: "0x64cBdcCfa295a0dB0187E5Ef7fAC28205908B4e4",
    entries: 0,
    capacity: 6,
    participants: [] as string[],
    lastWinner: null as string | null,
    status: "Filling",
  },
  {
    id: "cappuccino",
    name: "Cappuccino Blend",
    description: "Perfect balance of espresso, steamed milk, and foam for the classic Italian experience.",
    recipient: "0x64cBdcCfa295a0dB0187E5Ef7fAC28205908B4e4",
    entries: 0,
    capacity: 6,
    participants: [] as string[],
    lastWinner: null as string | null,
    status: "Filling",
  },
  {
    id: "baarbara",
    name: "Baarbara Estate",
    description: "Premium single-origin beans from the renowned Baarbara coffee estate in Karnataka.",
    recipient: "0x64cBdcCfa295a0dB0187E5Ef7fAC28205908B4e4",
    entries: 0,
    capacity: 6,
    participants: [] as string[],
    lastWinner: null as string | null,
    status: "Filling",
  },
  {
    id: "salawara",
    name: "Salawara Estate",
    description: "Bright, citrusy coffee with floral notes from the misty hills of Salawara plantation.",
    recipient: "0x64cBdcCfa295a0dB0187E5Ef7fAC28205908B4e4",
    entries: 0,
    capacity: 6,
    participants: [] as string[],
    lastWinner: null as string | null,
    status: "Filling",
  },
  {
    id: "bababudangiri",
    name: "Third Wave Bababudangiri",
    description: "Artisanal, small-batch roast celebrating the birthplace of Indian coffee in the Western Ghats.",
    recipient: "0x64cBdcCfa295a0dB0187E5Ef7fAC28205908B4e4",
    entries: 0,
    capacity: 6,
    participants: [] as string[],
    lastWinner: null as string | null,
    status: "Filling",
  },
];

const shortenAddress = (address: string | null | undefined): string => {
  if (!address || address.length < 10) return address || "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function PoolsPage() {
  const [pools, setPools] = useState(initialPools);
  const [isProcessing, setIsProcessing] = useState(false);

  const poolSummaries = useMemo(
    () => [
      {
        label: "Active pools",
        value: pools.filter((pool) => pool.entries < pool.capacity).length,
      },
      {
        label: "Coffee champions",
        value: pools.filter((pool) => pool.lastWinner).length,
      },
      {
        label: "PYUSD circulating",
        value: `${
          pools.reduce((acc, pool) => acc + pool.entries, 0) * 1
        } PYUSD`,
      },
    ],
    [pools]
  );

  const handleJoinPool = useCallback(
    async (pool: typeof initialPools[0]) => {
      if (isProcessing) return;
      setIsProcessing(true);

      try {
        const client = new HaloClient({
          rpcUrl: RPC_URL,
          network: NETWORK,
          recipient: pool.recipient,
        });

        const senderAddress = await client.getWalletAddress();
        const currentBalance = await client.getPyusdBalance(senderAddress);

        if (Number(currentBalance) < 1) {
          throw new Error(
            "Insufficient PYUSD balance. You need at least 1 PYUSD to join."
          );
        }

        const signedTx = await client.makePayment(senderAddress, {
          amount: "1",
        });

        await client.broadcastTransaction(signedTx);

        setPools((prev) =>
          prev.map((p) => {
            if (p.id !== pool.id) return p;
            const nextParticipants = [...p.participants, shortenAddress(senderAddress)];
            const nextEntries = Math.min(nextParticipants.length, p.capacity);
            const nextStatus =
              nextEntries >= p.capacity ? "Ready to Spin" : nextEntries >= p.capacity - 1 ? "Almost Full" : "Filling";
            return {
              ...p,
              participants: nextParticipants.slice(0, p.capacity),
              entries: nextEntries,
              status: p.lastWinner ? "Filling" : nextStatus,
              lastWinner: p.lastWinner && nextEntries < p.capacity ? null : p.lastWinner,
            };
          })
        );

        alert("Payment successful! You secured a seat in the pool!");
      } catch (err) {
        console.error(err);
        const fallback =
          err instanceof Error ? err.message : "Unexpected error initiating HaLo payment.";
        alert(fallback);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing]
  );

  const handleSelectWinner = useCallback((pool: typeof initialPools[0]) => {
    if (pool.participants.length < pool.capacity) return;

    const winnerIndex = Math.floor(Math.random() * pool.participants.length);
    const winnerAddress = pool.participants[winnerIndex];

    setPools((prev) =>
      prev.map((p) =>
        p.id === pool.id
          ? {
              ...p,
              lastWinner: winnerAddress,
              status: "Winner Selected",
            }
          : p
      )
    );
    alert(`Winner selected: ${winnerAddress}. Time to brew!`);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030711] via-[#0b1229] to-black text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-16 sm:px-10 lg:px-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-emerald-300 hover:text-emerald-200"
            >
              ← Back to newspaper
            </Link>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Group Coffee Pools
            </h1>
            <p className="max-w-2xl text-base text-white/70">
              Lock in 1 PYUSD to claim your seat, monitor filling pools, and spin up a winner
            </p>
          </div>
          <div className="grid w-full max-w-md grid-cols-3 gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white/70 backdrop-blur">
            {poolSummaries.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {item.label}
                </span>
                <span className="text-lg font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-8 lg:gap-10">
            {pools.map((pool) => {
              const isFull = pool.entries >= pool.capacity;
              const isReadyToSpin = isFull && pool.status !== "Winner Selected";

              return (
                <article
                  key={pool.id}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/0 p-6 sm:p-8 backdrop-blur"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                        <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-emerald-100">
                          {pool.status}
                        </span>
                        <span>
                          live
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-white sm:text-3xl">{pool.name}</h2>
                        <p className="mt-3 text-sm text-white/70">{pool.description}</p>
                      </div>
                      <div className="grid gap-3 text-xs text-white/60 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                          <p className="uppercase tracking-[0.3em]">Entry</p>
                          <p className="mt-2 text-lg font-semibold text-white">1 PYUSD</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                          <p className="uppercase tracking-[0.3em]">Pool address</p>
                          <p className="mt-2 text-sm font-semibold text-white">
                            {shortenAddress(pool.recipient)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full max-w-[220px] flex-col gap-3 rounded-2xl border border-white/10 bg-black/50 p-4 text-center text-sm">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Join pool</p>
                      <button
                        type="button"
                        className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-400/40 disabled:text-emerald-900"
                        disabled={isProcessing || isFull}
                        onClick={() => handleJoinPool(pool)}
                      >
                        {isFull ? "Pool full" : "Join for 1 PYUSD"}
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-300 hover:text-emerald-200 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/30"
                        disabled={!isReadyToSpin}
                        onClick={() => handleSelectWinner(pool)}
                      >
                        Select winner
                      </button>
                      {pool.lastWinner && (
                        <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">
                          Last winner: {pool.lastWinner}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Wallets in drum
                    </p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {pool.participants.map((participant, index) => (
                        <div
                          key={`${participant}-${index}`}
                          className="flex items-center justify-between rounded-xl bg-black/50 px-4 py-3 text-sm text-white/70"
                        >
                          <span>{participant}</span>
                          <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                            Seat {index + 1}
                          </span>
                        </div>
                      ))}
                      {Array.from({ length: pool.capacity - pool.participants.length }).map((_, index) => (
                        <div
                          key={`placeholder-${pool.id}-${index}`}
                          className="flex items-center justify-between rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-white/40"
                        >
                          <span>Waiting for entrant</span>
                          <span className="text-xs uppercase tracking-[0.3em] text-white/30">
                            Seat {pool.participants.length + index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </section>
      </div>
    </div>
  );
}
