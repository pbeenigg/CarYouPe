"use client"

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRequest } from "@/hooks/use-request";
import { categoryService, type Category } from "@/services/categories";

import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  parent_id: z.number().nullable().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const t = useTranslations('Categories');
  const tCommon = useTranslations('Common');

  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  // 将树形结构展平为列表 (用于表格和下拉)
  const flatCategories: Category[] = [];
  const flattenCategories = (cats: Category[], depth = 0) => {
    for (const cat of cats) {
      flatCategories.push({ ...cat, name: `${"─".repeat(depth)} ${cat.name}`.trim() });
      if (cat.children && cat.children.length > 0) {
        flattenCategories(cat.children, depth + 1);
      }
    }
  };

  // 原始列表 (不带缩进, 用于选择框)
  const allCategories: Category[] = [];
  const collectAll = (cats: Category[]) => {
    for (const cat of cats) {
      allCategories.push(cat);
      if (cat.children && cat.children.length > 0) {
        collectAll(cat.children);
      }
    }
  };

  if (categories.length > 0) {
    flattenCategories(categories);
    collectAll(categories);
  }

  const { loading, run: fetchCategories } = useRequest(
    async () => categoryService.getCategories(),
    { onSuccess: (data) => setCategories(data as Category[]) }
  );

  const { loading: submitting, run: submitCategory } = useRequest(
    async (values: CategoryFormValues) => {
      const payload = {
        name: values.name,
        parent_id: values.parent_id || null,
      };
      if (editing) {
        return await categoryService.updateCategory(editing.id, payload);
      }
      return await categoryService.createCategory(payload);
    },
    {
      onSuccess: () => { setDialogOpen(false); fetchCategories(); },
      successMessage: editing ? tCommon('updateSuccess') : tCommon('createSuccess'),
    }
  );

  const { run: deleteCategory } = useRequest(
    async (id: number) => categoryService.deleteCategory(id),
    { onSuccess: () => fetchCategories(), successMessage: tCommon('deleteSuccess') }
  );

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", parent_id: null },
  });

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (editing) {
      form.reset({ name: editing.name, parent_id: editing.parent_id || null });
    } else {
      form.reset({ name: "", parent_id: null });
    }
  }, [editing, dialogOpen]);

  const handleDelete = (id: number) => {
    if (confirm(tCommon('confirmDelete'))) deleteCategory(id);
  };

  // 查找父分类名称
  const getParentName = (parentId: number | null | undefined) => {
    if (!parentId) return "-";
    const parent = allCategories.find(c => c.id === parentId);
    return parent?.name || String(parentId);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('title')}</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(null)}>
                <Plus className="mr-2 h-4 w-4" />{t('addCategory')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editing ? t('editTitle') : t('createTitle')}</DialogTitle>
                <DialogDescription />
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((v) => submitCategory(v))} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('categoryName')}</FormLabel>
                      <FormControl><Input placeholder={t('categoryName')} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="parent_id" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('parentCategory')}</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === "none" ? null : Number(v))}
                        value={field.value ? String(field.value) : "none"}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder={t('parentCategory')} /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t('noParent')}</SelectItem>
                          {allCategories
                            .filter(c => c.id !== editing?.id) // 不能选自己为父分类
                            .map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{t('categoryName')}</TableHead>
                <TableHead>{t('parentCategory')}</TableHead>
                <TableHead className="text-right">{tCommon('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center">{tCommon('loading')}</TableCell></TableRow>
              ) : flatCategories.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center">{t('noCategories')}</TableCell></TableRow>
              ) : flatCategories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{getParentName(cat.parent_id)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => {
                      // 找到原始分类 (不含缩进前缀)
                      const original = allCategories.find(c => c.id === cat.id);
                      if (original) { setEditing(original); setDialogOpen(true); }
                    }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(cat.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
