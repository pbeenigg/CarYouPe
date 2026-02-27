"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRequest } from "@/hooks/use-request";
import { storeService, type Store } from "@/services/stores";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function StoresPage() {
  const t = useTranslations("Stores");
  const tCommon = useTranslations("Common");
  const [stores, setStores] = useState<Store[]>([]);
  const [auditOpen, setAuditOpen] = useState(false);
  const [selected, setSelected] = useState<Store | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { loading, run: fetchStores } = useRequest(
    async () => storeService.getStores(),
    { onSuccess: (data) => setStores(data as Store[]) },
  );

  const { loading: auditing, run: doAudit } = useRequest(
    async (status: number) => {
      if (!selected) return;
      return await storeService.auditStore(selected.id, {
        status,
        reject_reason: status === 2 ? rejectReason : undefined,
      });
    },
    {
      onSuccess: () => {
        setAuditOpen(false);
        setRejectReason("");
        fetchStores();
      },
      successMessage: t("auditSuccess"),
    },
  );

  useEffect(() => {
    fetchStores();
  }, []);

  const openAudit = (store: Store) => {
    setSelected(store);
    setRejectReason("");
    setAuditOpen(true);
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="outline">{t("pending")}</Badge>;
      case 1:
        return <Badge className="bg-green-100 text-green-700 border-green-200">{t("approved")}</Badge>;
      case 2:
        return <Badge variant="destructive">{t("rejected")}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
                <TableHead>ID</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("contactName")}</TableHead>
                <TableHead>{t("contactPhone")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("createdAt")}</TableHead>
                <TableHead className="text-right">
                  {tCommon("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    {tCommon("loading")}
                  </TableCell>
                </TableRow>
              ) : stores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    {t("noStores")}
                  </TableCell>
                </TableRow>
              ) : (
                stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>{store.id}</TableCell>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>{store.contact_name}</TableCell>
                    <TableCell>{store.contact_phone}</TableCell>
                    <TableCell>{getStatusBadge(store.status)}</TableCell>
                    <TableCell>
                      {new Date(store.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openAudit(store)}
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

      <Dialog open={auditOpen} onOpenChange={setAuditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("auditTitle")}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium">{t("name")}:</span>{" "}
                  {selected.name}
                </div>
                <div>
                  <span className="font-medium">{t("userId")}:</span>{" "}
                  {selected.user_id}
                </div>
                <div>
                  <span className="font-medium">{t("contactName")}:</span>{" "}
                  {selected.contact_name}
                </div>
                <div>
                  <span className="font-medium">{t("contactPhone")}:</span>{" "}
                  {selected.contact_phone}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">{t("address")}:</span>{" "}
                  {selected.address || "-"}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">{t("businessLicense")}:</span>{" "}
                  {selected.business_license || "-"}
                </div>
                <div>
                  <span className="font-medium">{t("status")}:</span>{" "}
                  {getStatusBadge(selected.status)}
                </div>
              </div>

              {selected.reject_reason && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  <span className="font-medium">{t("rejectReason")}:</span>{" "}
                  {selected.reject_reason}
                </div>
              )}

              {selected.status === 0 && (
                <div className="space-y-2">
                  <Label>{t("rejectReason")}</Label>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder={t("rejectReasonPlaceholder")}
                    className="resize-none"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAuditOpen(false)}>
              {tCommon("cancel")}
            </Button>
            {selected?.status === 0 && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => doAudit(2)}
                  disabled={auditing}
                >
                  {auditing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <XCircle className="mr-1 h-4 w-4" />
                  {t("reject")}
                </Button>
                <Button
                  onClick={() => doAudit(1)}
                  disabled={auditing}
                >
                  {auditing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <CheckCircle className="mr-1 h-4 w-4" />
                  {t("approve")}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
