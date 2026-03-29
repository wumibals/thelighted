"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { AdminRole } from "@/lib/types/user";
import { RoleProtectedPage } from "@/app/components/admin/RoleProtectedPage";
import { MetricCard } from "@/app/components/admin/analytics/MetricCard";
import { CategoryDistribution } from "@/app/components/admin/analytics/CategoryDistribution";
import { TopPerformers } from "@/app/components/admin/analytics/TopPerformers";
import ContactTrends from "@/app/components/admin/analytics/ContactTrends";

export default function AnalyticsClient() {
  const [period, setPeriod] = useState(30);

  const { data: analytics, isLoading: loadingAnalytics, isError } = useQuery({
    queryKey: ["analytics", period],
    queryFn: () => adminApi.getAnalytics(period),
  });

  const { data: menuAnalytics, isLoading: loadingMenu } = useQuery({
    queryKey: ["menuAnalytics"],
    queryFn: () => adminApi.getMenuAnalytics(),
  });

  const { data: contactAnalytics, isLoading: loadingContact } = useQuery({
    queryKey: ["contactAnalytics"],
    queryFn: () => adminApi.getContactAnalytics(),
  });

  const { data: trendingItems, isLoading: loadingTrending } = useQuery({
    queryKey: ["trendingItems"],
    queryFn: () => adminApi.getTrendingItems(),
  });

  const isLoading = loadingAnalytics || loadingMenu || loadingContact || loadingTrending;

  return (
    <RoleProtectedPage
      allowedRoles={[AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.MANAGER]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <div className="flex gap-2">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setPeriod(d)}
                className={`px-3 py-1 text-sm rounded-lg border ${
                  period === d
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-red-500">Failed to load analytics data.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                title="Total Orders"
                value={analytics?.totalOrders ?? 0}
                icon={ShoppingCart}
                delay={0}
              />
              <MetricCard
                title="Total Revenue"
                value={`$${analytics?.totalRevenue?.toFixed(2) ?? "0.00"}`}
                icon={DollarSign}
                delay={0.1}
              />
              <MetricCard
                title="Avg Order Value"
                value={`$${analytics?.avgOrderValue?.toFixed(2) ?? "0.00"}`}
                icon={TrendingUp}
                delay={0.2}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryDistribution data={menuAnalytics?.categories ?? []} />
              <TopPerformers items={trendingItems ?? []} />
            </div>

            <ContactTrends data={contactAnalytics?.submissions ?? []} />
          </>
        )}
      </div>
    </RoleProtectedPage>
  );
}
