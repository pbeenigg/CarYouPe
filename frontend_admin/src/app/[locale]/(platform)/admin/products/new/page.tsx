"use client"

import { useTranslations } from 'next-intl';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useRequest } from '@/hooks/use-request';
import { productService, type Category } from '@/services/products';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  subtitle: z.string().optional(),
  category_id: z.string().min(1, {
    message: "Please select a category.",
  }),
  base_price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a number",
  }),
  is_on_sale: z.boolean(),
  description: z.string().optional(),
  main_image: z.string().optional(),
})

export default function NewProductPage() {
  const t = useTranslations('Products');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  // 1. 获取分类
  const { run: fetchCategories } = useRequest(
    async () => {
      return await productService.getCategories();
    },
    {
      onSuccess: (data) => setCategories(data),
      onError: (err) => console.error("Failed to fetch categories:", err),
    }
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      is_on_sale: true,
      description: "",
      base_price: "0",
      main_image: "",
    },
  })

  // 2. 上传图片
  const { loading: uploading, run: uploadImage } = useRequest(
    async (formData: FormData) => {
      return await productService.uploadFile(formData);
    },
    {
      onError: () => alert("Upload failed"),
    }
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    uploadImage(formData).then((res) => {
      if (res) {
        field.onChange(res.url);
      }
    });
  };

  // 3. 创建产品
  const { loading, run: createProduct } = useRequest(
    async (values: z.infer<typeof formSchema>) => {
      return await productService.createProduct({
        name: values.title, // Map title to name
        description: values.description,
        price: parseFloat(values.base_price),
        stock: 100, // Default stock for now
        category_id: parseInt(values.category_id),
        image_url: values.main_image,
        is_active: values.is_on_sale
      });
    },
    {
      onSuccess: () => {
        router.push('/admin/products');
      },
      onError: (err) => console.error("Failed to create product:", err),
    }
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createProduct(values);
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('createTitle')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('productDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('name')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('subtitle')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('subtitle')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('category')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectCategory')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('basePrice')}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_on_sale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">{t('onSale')}</FormLabel>
                    </div>
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
                name="main_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('mainImage')}</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-4">
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, field)}
                          disabled={uploading}
                        />
                        {field.value && (
                          <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img 
                               src={`http://localhost:8000${field.value}`} 
                               alt="Preview" 
                               className="object-cover w-full h-full"
                             />
                          </div>
                        )}
                        <Input type="hidden" {...field} />
                      </div>
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
                    <FormLabel>{t('description')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('description')}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  {tCommon('cancel')}
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? tCommon('loading') : tCommon('submit')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
