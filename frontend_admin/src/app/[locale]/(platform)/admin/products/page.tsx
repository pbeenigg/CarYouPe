"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRequest } from "@/hooks/use-request";
import { productService, type Product } from "@/services/products";
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
import { Link } from "@/i18n/routing";
import { PermissionGuard } from "@/components/permission-guard";

export default function ProductsPage() {
  const t = useTranslations("Products");
  const tCommon = useTranslations("Common");
  const [products, setProducts] = useState<Product[]>([]);

  // 获取产品列表
  const { loading, run: fetchProducts } = useRequest(
    async () => {
      return await productService.getProducts();
    },
    {
      onSuccess: (data) => setProducts(data as Product[]),
      onError: (err) => console.error("Failed to fetch products:", err),
    },
  );

  // 删除产品
  const { run: deleteProduct } = useRequest(
    async (id: number) => {
      return await productService.deleteProduct(id);
    },
    {
      onSuccess: () => fetchProducts(),
      successMessage: tCommon("deleteSuccess"),
    },
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id: number) => {
    if (confirm(tCommon("confirmDelete"))) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <PermissionGuard permission="products:create">
          <Link href="/admin/products/new">
            <Button>{t("addProduct")}</Button>
          </Link>
        </PermissionGuard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("allProducts")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("id")}</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("price")}</TableHead>
                <TableHead>{t("status")}</TableHead>
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
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>¥{product.base_price}</TableCell>
                    <TableCell>
                      {product.is_on_sale ? (
                        <span className="text-green-600">{t("onSale")}</span>
                      ) : (
                        <span className="text-red-600">{t("offShelf")}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <PermissionGuard permission="products:edit">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm" className="mr-2">
                            {tCommon("edit")}
                          </Button>
                        </Link>
                      </PermissionGuard>
                      <PermissionGuard permission="products:delete">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          {tCommon("delete")}
                        </Button>
                      </PermissionGuard>
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
