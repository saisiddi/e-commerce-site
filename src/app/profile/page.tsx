"use client";

import { useState } from "react";

import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [pincode, setPincode] = useState(user?.pincode ?? "");
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, address, pincode });
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <Link href="/">
        <button type="button" className="flex items-center gap-2 text-ink/60 hover:text-ink transition">
          ← Back
        </button>
      </Link>
      <SectionHeading
        eyebrow="Profile"
        title="Your atelier account"
        description="Your orders, preferences, and account details in one calm space."
      />

      <div className="grid gap-6 rounded-3xl border border-stone bg-white/70 p-6 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-ink/60">Member</p>
          <h2 className="mt-3 text-2xl font-semibold">{user?.name ?? "Guest"}</h2>
          <p className="mt-2 text-sm text-ink/70">{user?.email ?? "—"}</p>

          <form onSubmit={save} className="mt-6 grid gap-3">
            <label className="text-sm">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />

            <label className="text-sm">Address</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />

            <label className="text-sm">Pincode</label>
            <Input value={pincode} onChange={(e) => setPincode(e.target.value)} />

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save profile"}</Button>
            </div>
          </form>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-stone bg-clay/40 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-ink/60">Order History</p>
            {user?.orders && user.orders.length > 0 ? (
              <div className="mt-4 space-y-4">
                {user.orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Order #{o.id}</div>
                      <div className="text-sm text-ink/60">{new Date(o.date).toLocaleString()}</div>
                    </div>
                    <div className="text-sm">${o.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-sm text-ink/60">No orders yet.</div>
            )}
          </div>

          <div className="rounded-3xl border border-stone bg-clay/40 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-ink/60">Style Preferences</p>
            {user?.preferences ? (
              <div className="mt-4 space-y-2 text-sm">
                {user.preferences.colorPalette && user.preferences.colorPalette.length > 0 && <p>Colors: <span className="font-medium">{user.preferences.colorPalette.join(", ")}</span></p>}
                {user.preferences.size && <p>Size: <span className="font-medium uppercase">{user.preferences.size}</span></p>}
                {user.preferences.fitPreference && <p>Fit: <span className="font-medium capitalize">{user.preferences.fitPreference}</span></p>}
                {user.preferences.occasion && <p>Occasion: <span className="font-medium capitalize">{user.preferences.occasion}</span></p>}
                {user.preferences.budget && <p>Budget: <span className="font-medium capitalize">{user.preferences.budget}</span></p>}
              </div>
            ) : (
              <div className="mt-4 text-sm text-ink/60">No preferences set yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
