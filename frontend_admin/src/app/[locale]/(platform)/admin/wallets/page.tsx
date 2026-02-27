"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRequest } from "@/hooks/use-request";
import {
  walletService,
  type Wallet,
  type WalletTransaction,
} from "@/services/wallets";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Loader2,
  Plus,
  Minus,
  Star,
} from "lucide-react";

export default function WalletsPage() {
  const t = useTranslations("Wallets");
  const tCommon = useTranslations("Common");

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  // Operation dialog state
  const [opType, setOpType] = useState<"addBalance" | "deductBalance" | "addPoints" | null>(null);
  const [opAmount, setOpAmount] = useState("");

  const { loading, run: fetchWallets } = useRequest(
    async () => walletService.getWallets(),
    { onSuccess: (data) => setWallets(data as Wallet[]) },
  );

  const { loading: txLoading, run: fetchTransactions } = useRequest(
    async (walletId: number) => walletService.getTransactions(walletId),
    { onSuccess: (data) => setTransactions(data as WalletTransaction[]) },
  );

  const { loading: operating, run: doOperation } = useRequest(
    async () => {
      if (!selected || !opType) return;
      const amount = Number(opAmount);
      if (opType === "addBalance") {
        return await walletService.addBalance(selected.id, amount);
      } else if (opType === "deductBalance") {
        return await walletService.deductBalance(selected.id, amount);
      } else {
        return await walletService.addPoints(selected.id, amount);
      }
    },
    {
      onSuccess: () => {
        setOpType(null);
        setOpAmount("");
        fetchWallets();
        if (selected) {
          walletService.getWallet(selected.id).then((res) => {
            setSelected(res.data as Wallet);
          });
          fetchTransactions(selected.id);
        }
      },
      successMessage: t("operateSuccess"),
    },
  );

  useEffect(() => {
    fetchWallets();
  }, []);

  const openDetail = (wallet: Wallet) => {
    setSelected(wallet);
    setDetailOpen(true);
    fetchTransactions(wallet.id);
  };

  const openOp = (type: "addBalance" | "deductBalance" | "addPoints") => {
    setOpType(type);
    setOpAmount("");
  };

  const getDirectionBadge = (direction: string) => {
    return direction === "in" ? (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        {t("income")}
      </Badge>
    ) : (
      <Badge variant="destructive">{t("expense")}</Badge>
    );
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
                <TableHead>{t("userId")}</TableHead>
                <TableHead>{t("balance")}</TableHead>
                <TableHead>{t("points")}</TableHead>
                <TableHead>{t("totalIncome")}</TableHead>
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
              ) : wallets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {t("noWallets")}
                  </TableCell>
                </TableRow>
              ) : (
                wallets.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell>{wallet.id}</TableCell>
                    <TableCell>{wallet.user_id}</TableCell>
                    <TableCell className="font-medium">
                      ¥{wallet.balance}
                    </TableCell>
                    <TableCell>{wallet.points}</TableCell>
                    <TableCell>¥{wallet.total_income}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDetail(wallet)}
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

      {/* Wallet Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("walletDetail")}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {selected && (
            <div className="space-y-6">
              {/* Wallet Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t("userId")}:</span>{" "}
                  {selected.user_id}
                </div>
                <div>
                  <span className="font-medium">{t("balance")}:</span>{" "}
                  <span className="text-lg font-bold">¥{selected.balance}</span>
                </div>
                <div>
                  <span className="font-medium">{t("points")}:</span>{" "}
                  {selected.points}
                </div>
                <div>
                  <span className="font-medium">{t("totalIncome")}:</span>{" "}
                  ¥{selected.total_income}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" onClick={() => openOp("addBalance")}>
                  <Plus className="mr-1 h-4 w-4" />
                  {t("addBalance")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openOp("deductBalance")}
                >
                  <Minus className="mr-1 h-4 w-4" />
                  {t("deductBalance")}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openOp("addPoints")}
                >
                  <Star className="mr-1 h-4 w-4" />
                  {t("addPoints")}
                </Button>
              </div>

              {/* Transactions */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">
                    {t("transactions")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{t("transactionType")}</TableHead>
                        <TableHead>{t("amount")}</TableHead>
                        <TableHead>{t("direction")}</TableHead>
                        <TableHead>{t("relatedId")}</TableHead>
                        <TableHead>{t("createdAt")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {txLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                            {tCommon("loading")}
                          </TableCell>
                        </TableRow>
                      ) : transactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            {t("noTransactions")}
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>{tx.id}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{tx.type}</Badge>
                            </TableCell>
                            <TableCell>¥{tx.amount}</TableCell>
                            <TableCell>
                              {getDirectionBadge(tx.direction)}
                            </TableCell>
                            <TableCell>{tx.related_id || "-"}</TableCell>
                            <TableCell>
                              {new Date(tx.created_at).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              {tCommon("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Operation Dialog */}
      <Dialog open={opType !== null} onOpenChange={() => setOpType(null)}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle>
              {opType === "addBalance"
                ? t("addBalance")
                : opType === "deductBalance"
                  ? t("deductBalance")
                  : t("addPoints")}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                {opType === "addPoints" ? t("pointsCount") : t("amount")}
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={opAmount}
                onChange={(e) => setOpAmount(e.target.value)}
                placeholder={
                  opType === "addPoints" ? t("pointsCount") : t("amount")
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpType(null)}>
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={() => doOperation()}
              disabled={operating || !opAmount || Number(opAmount) <= 0}
            >
              {operating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {tCommon("submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
