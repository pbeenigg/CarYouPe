"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRequest } from "@/hooks/use-request";
import { roleService, type Role } from "@/services/roles";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const roleSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

export default function RolesPage() {
  const t = useTranslations("Roles");
  const tCommon = useTranslations("Common");
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // 1. 获取角色列表
  const { loading, run: fetchRoles } = useRequest(
    async () => {
      return await roleService.getRoles();
    },
    {
      onSuccess: (data) => setRoles(data as Role[]),
      onError: (err) => console.error("Failed to fetch roles:", err),
    },
  );

  // 2. 提交表单
  const { loading: submitting, run: submitRole } = useRequest(
    async (values: RoleFormValues) => {
      if (editingRole) {
        return await roleService.updateRole(editingRole.id, values);
      } else {
        return await roleService.createRole(values);
      }
    },
    {
      onSuccess: () => {
        setOpen(false);
        fetchRoles();
      },
      successMessage: editingRole
        ? tCommon("updateSuccess")
        : tCommon("createSuccess"),
    },
  );

  // 3. 删除角色
  const { run: deleteRole } = useRequest(
    async (id: number) => {
      return await roleService.deleteRole(id);
    },
    {
      onSuccess: () => fetchRoles(),
      successMessage: tCommon("deleteSuccess"),
    },
  );

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (editingRole) {
      form.reset({
        name: editingRole.name,
        description: editingRole.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [editingRole, form, open]);

  const onSubmit = (values: RoleFormValues) => {
    submitRole(values);
  };

  const handleDelete = (id: number) => {
    if (confirm(tCommon("confirmDelete"))) {
      deleteRole(id);
    }
  };

  const getDisplayDescription = (description?: string) => {
    if (description && description.startsWith("Roles.desc.")) {
      return t(description.replace("Roles.", ""));
    }
    return description || "";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setEditingRole(null);
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditingRole(null)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("addRole")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingRole ? t("editTitle") : t("createTitle")}
              </DialogTitle>
              <DialogDescription>
                {editingRole
                  ? "Edit role details below."
                  : "Enter details for the new role."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name")}</FormLabel>
                      <FormControl>
                        <Input placeholder="admin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("description")}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t("description")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {tCommon("submit")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

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
                <TableHead>{t("description")}</TableHead>
                <TableHead>{t("permissions")}</TableHead>
                <TableHead className="text-right">
                  {tCommon("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {tCommon("loading")}
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No roles found.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.id}</TableCell>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      {getDisplayDescription(role.description)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.map((perm, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingRole(role);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleDelete(role.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
