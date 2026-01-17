"use client"

import { useEffect, useState, Fragment } from "react";
import { useTranslations } from 'next-intl';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRequest } from "@/hooks/use-request";
import { menuService, type Menu } from "@/services/menus";
import { Header } from "@/components/layout/admin-header";

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
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, Loader2, ChevronRight, ChevronDown } from "lucide-react";

const menuSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  path: z.string().min(1, { message: "Path is required" }),
  icon: z.string().optional(),
  order: z.coerce.number(),
})

type MenuFormValues = z.infer<typeof menuSchema>;

export default function MenusPage() {
  const t = useTranslations('Menus');
  const tCommon = useTranslations('Common');
  const tSidebar = useTranslations('Sidebar');
  const [menus, setMenus] = useState<Menu[]>([]);
  const [open, setOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  // 1. 获取菜单列表
  const { loading, run: fetchMenus } = useRequest(
    async () => {
      return await menuService.getMenus();
    },
    {
      onSuccess: (data) => setMenus(data),
      onError: (err) => console.error("Failed to fetch menus:", err),
    }
  );

  // 2. 提交表单 (创建/更新)
  const { loading: submitting, run: submitMenu } = useRequest(
    async (values: MenuFormValues) => {
      // 构造符合后端要求的数据结构
      const payload = {
        name: values.title, // 简单映射 title -> name，实际可能需要单独字段
        title: values.title,
        path: values.path,
        icon: values.icon,
        sort: values.order,
      };

      if (editingMenu) {
        return await menuService.updateMenu(editingMenu.id, payload);
      } else {
        return await menuService.createMenu(payload);
      }
    },
    {
      onSuccess: () => {
        setOpen(false);
        fetchMenus();
      },
      successMessage: editingMenu ? "Menu updated successfully" : "Menu created successfully",
    }
  );

  // 3. 删除菜单
  const { run: deleteMenu } = useRequest(
    async (id: number) => {
      return await menuService.deleteMenu(id);
    },
    {
      onSuccess: () => fetchMenus(),
      successMessage: "Menu deleted successfully",
    }
  );

  const form = useForm<any>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      title: "",
      path: "",
      icon: "",
      order: 0,
    },
  })

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    if (editingMenu) {
      form.reset({
        title: editingMenu.title,
        path: editingMenu.path,
        icon: editingMenu.icon,
        // @ts-ignore
        order: editingMenu.sort || editingMenu.order || 0,
      });
    } else {
      form.reset({
        title: "",
        path: "",
        icon: "",
        order: 0,
      });
    }
  }, [editingMenu, form, open]);

  const onSubmit = (values: any) => {
    submitMenu(values);
  };

  const handleDelete = (id: number) => {
    if (confirm(tCommon('confirmDelete'))) {
      deleteMenu(id);
    }
  };

  const getDisplayTitle = (title: string) => {
    if (title.startsWith('Sidebar.')) {
        // @ts-ignore
        return tSidebar(title.replace('Sidebar.', ''));
    }
    return title;
  };

  const renderMenuRows = (items: Menu[], level = 0): React.ReactNode => {
    return items.map((menu) => (
      <Fragment key={menu.id}>
        <TableRow>
          <TableCell style={{ paddingLeft: `${level * 20 + 10}px` }}>
            <div className="flex items-center">
              {menu.children && menu.children.length > 0 && (
                <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
              )}
              {getDisplayTitle(menu.title)}
            </div>
          </TableCell>
          <TableCell>{menu.path}</TableCell>
          <TableCell>{menu.icon}</TableCell>
          {/* @ts-ignore */}
          <TableCell>{menu.sort || menu.order}</TableCell>
          <TableCell className="text-right">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setEditingMenu(menu);
                setOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-600"
              onClick={() => handleDelete(menu.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
        {menu.children && renderMenuRows(menu.children, level + 1)}
      </Fragment>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <Dialog open={open} onOpenChange={(val) => {
          setOpen(val);
          if (!val) setEditingMenu(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMenu(null)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('addMenu')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingMenu ? t('editTitle') : t('createTitle')}</DialogTitle>
              <DialogDescription>
                {editingMenu ? "Edit menu details below." : "Enter details for the new menu."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('menuTitle')}</FormLabel>
                      <FormControl>
                        <Input placeholder="Dashboard" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('path')}</FormLabel>
                      <FormControl>
                        <Input placeholder="/admin/dashboard" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('icon')}</FormLabel>
                          <FormControl>
                            <Input placeholder="LayoutDashboard" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('order')}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {tCommon('submit')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('menuTitle')}</TableHead>
                <TableHead>{t('path')}</TableHead>
                <TableHead>{t('icon')}</TableHead>
                <TableHead>{t('order')}</TableHead>
                <TableHead className="text-right">{tCommon('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {tCommon('loading')}
                  </TableCell>
                </TableRow>
              ) : menus.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No menus found.
                  </TableCell>
                </TableRow>
              ) : (
                renderMenuRows(menus)
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
