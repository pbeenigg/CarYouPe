"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Loader2 } from "lucide-react";

const STATUS_OPTIONS = [
  "pending",
  "paid",
  "shipped",
  "completed",
  "cancelled",
] as const;

export default function OrdersPage() {
  const t = useTranslations("Orders");
  const tCommon = useTranslations("Common");
  const [orders, setOrders] = useState<Order[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editTrackingNo, setEditTrackingNo] = useState("");
  const [editRemark, setEditRemark] = useState("");

  const { loading, run: fetchOrders } = useRequest(
    async () => orderService.getOrders(),
    { onSuccess: (data) => setOrders(data as Order[]) },
  );

  const { loading: detailLoading, run: fetchOrderDetail } = useRequest(
    async (id: number) => orderService.getOrder(id),
    {
      onSuccess: (data) => {
        const o = data as Order;
        setSelected(o);
        setEditStatus(o.status);
        setEditTrackingNo(o.tracking_no || "");
        setEditRemark(o.remark || "");
      },
    },
  );

  const { loading: updating, run: updateOrder } = useRequest(
    async () => {
      if (!selected) return;
      return await orderService.updateOrder(selected.id, {
        status: editStatus,
        tracking_no: editTrackingNo || undefined,
        remark: editRemark || undefined,
      });
    },
    {
      onSuccess: () => {
        setDetailOpen(false);
        fetchOrders();
      },
      successMessage: tCommon("updateSuccess"),
    },
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const openDetail = (order: Order) => {
    setDetailOpen(true);
    fetchOrderDetail(order.id);
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, { color: string; key: string }> = {
      pending: { color: "text-yellow-600", key: "pending" },
      paid: { color: "text-blue-600", key: "paid" },
      shipped: { color: "text-purple-600", key: "shipped" },
      completed: { color: "text-green-600", key: "completed" },
      cancelled: { color: "text-gray-600", key: "cancelled" },
    };
    const s = map[status];
    if (!s) return status;
    return <span className={s.color}>{t(s.key as "pending")}</span>;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("orderNo")}</TableHead>
                <TableHead>{t("totalAmount")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("shippingName")}</TableHead>
                <TableHead>{t("createdAt")}</TableHead>
                <TableHead className="text-right">
                  {tCommon("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {tCommon("loading")}
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {t("noOrders")}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.order_no}
                    </TableCell>
                    <TableCell>¥{order.total_amount}</TableCell>
                    <TableCell>{getStatusLabel(order.status)}</TableCell>
                    <TableCell>{order.shipping_name || "-"}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDetail(order)}
                      >
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

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("orderDetails")}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {detailLoading || !selected ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t("orderNo")}:</span>{" "}
                  {selected.order_no}
                </div>
                <div>
                  <span className="font-medium">{t("totalAmount")}:</span> ¥
                  {selected.total_amount}
                </div>
                <div>
                  <span className="font-medium">{t("createdAt")}:</span>{" "}
                  {new Date(selected.created_at).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">{t("status")}:</span>{" "}
                  {getStatusLabel(selected.status)}
                </div>
              </div>

              {/* 收货信息 */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">{t("shipping")}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div>
                    <span className="font-medium">{t("shippingName")}:</span>{" "}
                    {selected.shipping_name}
                  </div>
                  <div>
                    <span className="font-medium">{t("shippingPhone")}:</span>{" "}
                    {selected.shipping_phone}
                  </div>
                  <div>
                    <span className="font-medium">{t("shippingAddress")}:</span>{" "}
                    {selected.shipping_address}
                  </div>
                </CardContent>
              </Card>

              {/* 订单商品 */}
              {selected.items && selected.items.length > 0 && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">
                      {t("orderItems")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("productName")}</TableHead>
                          <TableHead>{t("unitPrice")}</TableHead>
                          <TableHead>{t("quantity")}</TableHead>
                          <TableHead className="text-right">
                            {t("subtotal")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selected.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>{item.product_name}</div>
                              {item.sku_specs && (
                                <div className="text-xs text-muted-foreground">
                                  {Object.entries(item.sku_specs)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(", ")}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>¥{item.price}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              ¥{(Number(item.price) * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* 管理操作 */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">
                    {t("updateStatus")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("status")}</Label>
                      <Select value={editStatus} onValueChange={setEditStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {t(s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("trackingNo")}</Label>
                      <Input
                        value={editTrackingNo}
                        onChange={(e) => setEditTrackingNo(e.target.value)}
                        placeholder={t("trackingNo")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("remark")}</Label>
                    <Textarea
                      value={editRemark}
                      onChange={(e) => setEditRemark(e.target.value)}
                      placeholder={t("remark")}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={() => updateOrder()}
              disabled={updating || !selected}
            >
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
