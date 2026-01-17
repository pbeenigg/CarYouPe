"use client"

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useRequest } from "@/hooks/use-request";
import { orderService, type Order } from "@/services/orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Header } from "@/components/layout/admin-header";
export default function OrdersPage() {
  const t = useTranslations('Orders');
  const tCommon = useTranslations('Common');
  const [orders, setOrders] = useState<Order[]>([]);

  // 获取订单列表
  const { loading, run: fetchOrders } = useRequest(
    async () => {
      return await orderService.getOrders();
    },
    {
      onSuccess: (data) => setOrders(data),
      onError: (err) => console.error("Failed to fetch orders:", err),
    }
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return <span className="text-yellow-600">{t('pending')}</span>;
      case 'paid': return <span className="text-blue-600">{t('paid')}</span>;
      case 'shipped': return <span className="text-purple-600">{t('shipped')}</span>;
      case 'completed': return <span className="text-green-600">{t('completed')}</span>;
      case 'cancelled': return <span className="text-gray-600">{t('cancelled')}</span>;
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('orderNo')}</TableHead>
                <TableHead>{t('totalAmount')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('shipping')}</TableHead>
                <TableHead>{t('createdAt')}</TableHead>
                <TableHead className="text-right">{tCommon('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {tCommon('loading')}
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_no}</TableCell>
                    <TableCell>¥{order.total_amount}</TableCell>
                    <TableCell>
                      {getStatusLabel(order.status)}
                    </TableCell>
                    <TableCell>
                      {/* @ts-ignore */}
                      {order.shipping_name || (order.user ? order.user.username : 'Unknown')}
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
