"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRequest } from "@/hooks/use-request";
import { userService, type User } from "@/services/users";
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
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const userSchema = z.object({
  username: z.string().min(2, { message: "Username is required" }),
  nickname: z.string().optional(),
  real_name: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().optional(),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UsersPage() {
  const t = useTranslations("Users");
  const tCommon = useTranslations("Common");
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      nickname: "",
      real_name: "",
      phone: "",
      password: "",
      is_active: true,
      is_superuser: false,
    },
  });

  const { loading, run: fetchUsers } = useRequest(
    async () => userService.getUsers(),
    { onSuccess: (data) => setUsers(data as User[]) },
  );

  const { loading: submitting, run: submitUser } = useRequest(
    async (values: UserFormValues) => {
      if (editing) {
        const payload: Record<string, unknown> = {
          username: values.username,
          nickname: values.nickname || undefined,
          real_name: values.real_name || undefined,
          phone: values.phone || undefined,
          is_active: values.is_active,
          is_superuser: values.is_superuser,
        };
        if (values.password) payload.password = values.password;
        return await userService.updateUser(editing.id, payload);
      }
      return await userService.createUser({
        username: values.username,
        nickname: values.nickname || undefined,
        real_name: values.real_name || undefined,
        phone: values.phone || undefined,
        password: values.password || undefined,
        is_active: values.is_active,
        is_superuser: values.is_superuser,
      });
    },
    {
      onSuccess: () => {
        setDialogOpen(false);
        fetchUsers();
      },
      successMessage: editing
        ? tCommon("updateSuccess")
        : tCommon("createSuccess"),
    },
  );

  const { run: deleteUser } = useRequest(
    async (id: number) => userService.deleteUser(id),
    { onSuccess: () => fetchUsers(), successMessage: tCommon("deleteSuccess") },
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editing) {
      form.reset({
        username: editing.username || "",
        nickname: editing.nickname || "",
        real_name: editing.real_name || "",
        phone: editing.phone || "",
        password: "",
        is_active: editing.is_active,
        is_superuser: editing.is_superuser,
      });
    } else {
      form.reset({
        username: "",
        nickname: "",
        real_name: "",
        phone: "",
        password: "",
        is_active: true,
        is_superuser: false,
      });
    }
  }, [editing, dialogOpen]);

  const handleDelete = (id: number) => {
    if (confirm(tCommon("confirmDelete"))) deleteUser(id);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("allUsers")}</CardTitle>
          <Dialog
            open={dialogOpen}
            onOpenChange={(v) => {
              setDialogOpen(v);
              if (!v) setEditing(null);
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(null)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("addUser")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editing ? t("editTitle") : t("createTitle")}
                </DialogTitle>
                <DialogDescription />
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((v) => submitUser(v))}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("username")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("username")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nickname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("nickname")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("nickname")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="real_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("realName")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("realName")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("phone")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("phone")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("password")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={
                                editing ? t("passwordHint") : t("password")
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <FormLabel>{t("isActive")}</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="is_superuser"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <FormLabel>{t("isSuperuser")}</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{t("username")}</TableHead>
                <TableHead>{t("nickname")}</TableHead>
                <TableHead>{t("phone")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("role")}</TableHead>
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
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    {t("noUsers")}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="font-medium">
                      {user.username || "-"}
                    </TableCell>
                    <TableCell>{user.nickname || "-"}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <span className="text-green-600">{t("active")}</span>
                      ) : (
                        <span className="text-red-600">{t("inactive")}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.is_superuser ? t("admin") : t("user")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(user);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleDelete(user.id)}
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
