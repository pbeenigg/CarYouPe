"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRequest } from "@/hooks/use-request";
import { dashboardService, type DashboardData } from "@/services/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Store,
  Wallet,
  TrendingUp,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const [data, setData] = useState<DashboardData | null>(null);

  const { loading, run: fetchDashboard } = useRequest(
    async () => dashboardService.getDashboard(),
    { onSuccess: (d) => setData(d as DashboardData) },
  );

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statCards = [
    {
      title: t("totalUsers"),
      value: data.users.total,
      sub: t("todayNew", { count: data.users.today_new }),
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: t("totalProducts"),
      value: data.products.total,
      sub: t("onSale", { count: data.products.on_sale }),
      icon: Package,
      color: "text-green-600",
    },
    {
      title: t("totalOrders"),
      value: data.orders.total,
      sub: t("todayOrders", { count: data.orders.today }),
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    {
      title: t("totalRevenue"),
      value: `¥${data.revenue.total.toLocaleString()}`,
      sub: t("todayRevenue", {
        amount: `¥${data.revenue.today.toLocaleString()}`,
      }),
      icon: DollarSign,
      color: "text-yellow-600",
    },
    {
      title: t("totalStores"),
      value: data.stores.total,
      sub: t("pendingAudit", { count: data.stores.pending }),
      icon: Store,
      color: "text-orange-600",
    },
    {
      title: t("walletBalance"),
      value: `¥${data.wallet.total_balance.toLocaleString()}`,
      sub: t("platformTotal"),
      icon: Wallet,
      color: "text-cyan-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 7-Day Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{t("recentTrend")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {data.recent_7days.map((day) => (
              <div
                key={day.date}
                className="flex flex-col items-center gap-1 text-center"
              >
                <div className="text-xs text-muted-foreground">
                  {day.date.slice(5)}
                </div>
                <div className="w-full bg-muted rounded-sm overflow-hidden h-20 flex flex-col justify-end">
                  <div
                    className="bg-primary/80 rounded-sm transition-all"
                    style={{
                      height: `${Math.max(
                        4,
                        Math.min(
                          100,
                          data.recent_7days.reduce(
                            (max, d) => Math.max(max, d.orders),
                            1,
                          ) > 0
                            ? (day.orders /
                                data.recent_7days.reduce(
                                  (max, d) => Math.max(max, d.orders),
                                  1,
                                )) *
                                100
                            : 4,
                        ),
                      )}%`,
                    }}
                  />
                </div>
                <div className="text-sm font-medium">{day.orders}</div>
                <div className="text-xs text-muted-foreground">
                  ¥{day.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t("orderStatus")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(data.orders.by_status).map(([status, count]) => (
              <div
                key={status}
                className="text-center p-3 rounded-lg bg-muted/50"
              >
                <div className="text-lg font-bold">{count}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {t(`status_${status}` as "title")}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
