"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRequest } from "@/hooks/use-request";
import {
  distributionService,
  type DistributionRelation,
  type CommissionRecord,
} from "@/services/distributions";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function DistributionsPage() {
  const t = useTranslations("Distributions");
  const tCommon = useTranslations("Common");

  const [relations, setRelations] = useState<DistributionRelation[]>([]);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [parentId, setParentId] = useState("");
  const [childId, setChildId] = useState("");

  const { loading: loadingRelations, run: fetchRelations } = useRequest(
    async () => distributionService.getRelations(),
    { onSuccess: (data) => setRelations(data as DistributionRelation[]) },
  );

  const { loading: loadingCommissions, run: fetchCommissions } = useRequest(
    async () => distributionService.getCommissions(),
    { onSuccess: (data) => setCommissions(data as CommissionRecord[]) },
  );

  const { loading: creating, run: createRelation } = useRequest(
    async () => {
      return await distributionService.createRelation({
        parent_id: Number(parentId),
        child_id: Number(childId),
      });
    },
    {
      onSuccess: () => {
        setCreateOpen(false);
        setParentId("");
        setChildId("");
        fetchRelations();
      },
      successMessage: tCommon("createSuccess"),
    },
  );

  const { run: deleteRelation } = useRequest(
    async (id: number) => distributionService.deleteRelation(id),
    {
      onSuccess: () => fetchRelations(),
      successMessage: tCommon("deleteSuccess"),
    },
  );

  useEffect(() => {
    fetchRelations();
    fetchCommissions();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>

      <Tabs defaultValue="relations">
        <TabsList>
          <TabsTrigger value="relations">{t("relations")}</TabsTrigger>
          <TabsTrigger value="commissions">{t("commissions")}</TabsTrigger>
        </TabsList>

        <TabsContent value="relations" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("relations")}</CardTitle>
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-1 h-4 w-4" />
                {t("addRelation")}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t("parentId")}</TableHead>
                    <TableHead>{t("childId")}</TableHead>
                    <TableHead>{t("level")}</TableHead>
                    <TableHead>{t("createdAt")}</TableHead>
                    <TableHead className="text-right">
                      {tCommon("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingRelations ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {tCommon("loading")}
                      </TableCell>
                    </TableRow>
                  ) : relations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {t("noRelations")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    relations.map((rel) => (
                      <TableRow key={rel.id}>
                        <TableCell>{rel.id}</TableCell>
                        <TableCell>{rel.parent_id}</TableCell>
                        <TableCell>{rel.child_id}</TableCell>
                        <TableCell>{rel.level}</TableCell>
                        <TableCell>
                          {new Date(rel.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm(tCommon("confirmDelete"))) {
                                deleteRelation(rel.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("commissions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t("orderId")}</TableHead>
                    <TableHead>{t("fromUserId")}</TableHead>
                    <TableHead>{t("toUserId")}</TableHead>
                    <TableHead>{t("amount")}</TableHead>
                    <TableHead>{t("rate")}</TableHead>
                    <TableHead>{t("level")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("createdAt")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingCommissions ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        {tCommon("loading")}
                      </TableCell>
                    </TableRow>
                  ) : commissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        {t("noCommissions")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    commissions.map((comm) => (
                      <TableRow key={comm.id}>
                        <TableCell>{comm.id}</TableCell>
                        <TableCell>{comm.order_id}</TableCell>
                        <TableCell>{comm.from_user_id}</TableCell>
                        <TableCell>{comm.to_user_id}</TableCell>
                        <TableCell>¥{comm.amount}</TableCell>
                        <TableCell>{(comm.rate * 100).toFixed(1)}%</TableCell>
                        <TableCell>{comm.level}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              comm.status === "settled"
                                ? "default"
                                : "outline"
                            }
                          >
                            {comm.status === "settled"
                              ? t("settled")
                              : t("pendingSettle")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(comm.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("createRelationTitle")}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("parentId")}</Label>
              <Input
                type="number"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                placeholder={t("parentId")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("childId")}</Label>
              <Input
                type="number"
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                placeholder={t("childId")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={() => createRelation()}
              disabled={creating || !parentId || !childId}
            >
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {tCommon("submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
