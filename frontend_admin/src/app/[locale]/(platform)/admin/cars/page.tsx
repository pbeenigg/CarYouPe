"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRequest } from "@/hooks/use-request";
import {
  carService,
  type CarBrand,
  type CarSeries,
  type CarModel,
} from "@/services/cars";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

// ========== Zod Schemas ==========
const brandSchema = z.object({
  name: z.string().min(1, { message: "Brand name is required" }),
  logo: z.string().optional(),
});

const seriesSchema = z.object({
  name: z.string().min(1, { message: "Series name is required" }),
  brand_id: z.number().min(1, { message: "Brand is required" }),
});

const modelSchema = z.object({
  name: z.string().min(1, { message: "Model name is required" }),
  series_id: z.number().min(1, { message: "Series is required" }),
  year: z.string().optional(),
});

type BrandFormValues = z.infer<typeof brandSchema>;
type SeriesFormValues = z.infer<typeof seriesSchema>;
type ModelFormValues = z.infer<typeof modelSchema>;

export default function CarsPage() {
  const t = useTranslations("Cars");
  const tCommon = useTranslations("Common");

  // ========== State ==========
  const [brands, setBrands] = useState<CarBrand[]>([]);
  const [series, setSeries] = useState<CarSeries[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);

  const [brandOpen, setBrandOpen] = useState(false);
  const [seriesOpen, setSeriesOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  const [editingBrand, setEditingBrand] = useState<CarBrand | null>(null);
  const [editingSeries, setEditingSeries] = useState<CarSeries | null>(null);
  const [editingModel, setEditingModel] = useState<CarModel | null>(null);

  // 车系筛选用的品牌ID
  const [filterBrandId, setFilterBrandId] = useState<number | undefined>(
    undefined,
  );
  // 车型筛选用的车系ID
  const [filterSeriesId, setFilterSeriesId] = useState<number | undefined>(
    undefined,
  );

  // ========== API Requests ==========
  const { loading: brandsLoading, run: fetchBrands } = useRequest(
    async () => carService.getBrands(),
    { onSuccess: (data) => setBrands(data as CarBrand[]) },
  );

  const { loading: seriesLoading, run: fetchSeries } = useRequest(
    async () => carService.getSeries({ brand_id: filterBrandId }),
    { onSuccess: (data) => setSeries(data as CarSeries[]) },
  );

  const { loading: modelsLoading, run: fetchModels } = useRequest(
    async () => carService.getModels({ series_id: filterSeriesId }),
    { onSuccess: (data) => setModels(data as CarModel[]) },
  );

  // ========== Brand CRUD ==========
  const { loading: brandSubmitting, run: submitBrand } = useRequest(
    async (values: BrandFormValues) => {
      if (editingBrand) {
        return await carService.updateBrand(editingBrand.id, values);
      }
      return await carService.createBrand(values);
    },
    {
      onSuccess: () => {
        setBrandOpen(false);
        fetchBrands();
      },
      successMessage: editingBrand
        ? tCommon("updateSuccess")
        : tCommon("createSuccess"),
    },
  );

  const { run: deleteBrand } = useRequest(
    async (id: number) => carService.deleteBrand(id),
    {
      onSuccess: () => fetchBrands(),
      successMessage: tCommon("deleteSuccess"),
    },
  );

  // ========== Series CRUD ==========
  const { loading: seriesSubmitting, run: submitSeries } = useRequest(
    async (values: SeriesFormValues) => {
      if (editingSeries) {
        return await carService.updateSeries(editingSeries.id, values);
      }
      return await carService.createSeries(values);
    },
    {
      onSuccess: () => {
        setSeriesOpen(false);
        fetchSeries();
      },
      successMessage: editingSeries
        ? tCommon("updateSuccess")
        : tCommon("createSuccess"),
    },
  );

  const { run: deleteSeries } = useRequest(
    async (id: number) => carService.deleteSeries(id),
    {
      onSuccess: () => fetchSeries(),
      successMessage: tCommon("deleteSuccess"),
    },
  );

  // ========== Model CRUD ==========
  const { loading: modelSubmitting, run: submitModel } = useRequest(
    async (values: ModelFormValues) => {
      if (editingModel) {
        return await carService.updateModel(editingModel.id, values);
      }
      return await carService.createModel(values);
    },
    {
      onSuccess: () => {
        setModelOpen(false);
        fetchModels();
      },
      successMessage: editingModel
        ? tCommon("updateSuccess")
        : tCommon("createSuccess"),
    },
  );

  const { run: deleteModel } = useRequest(
    async (id: number) => carService.deleteModel(id),
    {
      onSuccess: () => fetchModels(),
      successMessage: tCommon("deleteSuccess"),
    },
  );

  // ========== Forms ==========
  const brandForm = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: "", logo: "" },
  });

  const seriesForm = useForm<SeriesFormValues>({
    resolver: zodResolver(seriesSchema),
    defaultValues: { name: "", brand_id: 0 },
  });

  const modelForm = useForm<ModelFormValues>({
    resolver: zodResolver(modelSchema),
    defaultValues: { name: "", series_id: 0, year: "" },
  });

  // ========== Effects ==========
  useEffect(() => {
    fetchBrands();
  }, []);
  useEffect(() => {
    fetchSeries();
  }, [filterBrandId]);
  useEffect(() => {
    fetchModels();
  }, [filterSeriesId]);

  useEffect(() => {
    if (editingBrand) {
      brandForm.reset({
        name: editingBrand.name,
        logo: editingBrand.logo || "",
      });
    } else {
      brandForm.reset({ name: "", logo: "" });
    }
  }, [editingBrand, brandOpen]);

  useEffect(() => {
    if (editingSeries) {
      seriesForm.reset({
        name: editingSeries.name,
        brand_id: editingSeries.brand_id,
      });
    } else {
      seriesForm.reset({ name: "", brand_id: brands[0]?.id || 0 });
    }
  }, [editingSeries, seriesOpen]);

  useEffect(() => {
    if (editingModel) {
      modelForm.reset({
        name: editingModel.name,
        series_id: editingModel.series_id,
        year: editingModel.year || "",
      });
    } else {
      modelForm.reset({ name: "", series_id: series[0]?.id || 0, year: "" });
    }
  }, [editingModel, modelOpen]);

  // ========== Handlers ==========
  const handleDeleteBrand = (id: number) => {
    if (confirm(tCommon("confirmDelete"))) deleteBrand(id);
  };
  const handleDeleteSeries = (id: number) => {
    if (confirm(tCommon("confirmDelete"))) deleteSeries(id);
  };
  const handleDeleteModel = (id: number) => {
    if (confirm(tCommon("confirmDelete"))) deleteModel(id);
  };

  // 查找品牌名称 (用于车系表格显示)
  const getBrandName = (brandId: number) =>
    brands.find((b) => b.id === brandId)?.name || String(brandId);
  // 查找车系名称 (用于车型表格显示)
  const getSeriesName = (seriesId: number) =>
    series.find((s) => s.id === seriesId)?.name || String(seriesId);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>

      <Tabs defaultValue="brands" className="w-full">
        <TabsList>
          <TabsTrigger value="brands">{t("brands")}</TabsTrigger>
          <TabsTrigger value="series">{t("series")}</TabsTrigger>
          <TabsTrigger value="models">{t("models")}</TabsTrigger>
        </TabsList>

        {/* ==================== 品牌 Tab ==================== */}
        <TabsContent value="brands">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("brands")}</CardTitle>
              <Dialog
                open={brandOpen}
                onOpenChange={(v) => {
                  setBrandOpen(v);
                  if (!v) setEditingBrand(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingBrand(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("addBrand")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBrand
                        ? t("editBrandTitle")
                        : t("createBrandTitle")}
                    </DialogTitle>
                    <DialogDescription />
                  </DialogHeader>
                  <Form {...brandForm}>
                    <form
                      onSubmit={brandForm.handleSubmit((v) => submitBrand(v))}
                      className="space-y-4"
                    >
                      <FormField
                        control={brandForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("brandName")}</FormLabel>
                            <FormControl>
                              <Input placeholder="BMW" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={brandForm.control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("brandLogo")}</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={brandSubmitting}>
                          {brandSubmitting && (
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
                    <TableHead>{t("brandName")}</TableHead>
                    <TableHead>{t("brandLogo")}</TableHead>
                    <TableHead className="text-right">
                      {tCommon("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brandsLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        {tCommon("loading")}
                      </TableCell>
                    </TableRow>
                  ) : brands.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        {t("noBrands")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    brands.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell>{brand.id}</TableCell>
                        <TableCell className="font-medium">
                          {brand.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm truncate max-w-48">
                          {brand.logo || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingBrand(brand);
                              setBrandOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => handleDeleteBrand(brand.id)}
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
        </TabsContent>

        {/* ==================== 车系 Tab ==================== */}
        <TabsContent value="series">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle>{t("series")}</CardTitle>
                <Select
                  value={filterBrandId ? String(filterBrandId) : "all"}
                  onValueChange={(v) =>
                    setFilterBrandId(v === "all" ? undefined : Number(v))
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t("selectBrand")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allBrands")}</SelectItem>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog
                open={seriesOpen}
                onOpenChange={(v) => {
                  setSeriesOpen(v);
                  if (!v) setEditingSeries(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingSeries(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("addSeries")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingSeries
                        ? t("editSeriesTitle")
                        : t("createSeriesTitle")}
                    </DialogTitle>
                    <DialogDescription />
                  </DialogHeader>
                  <Form {...seriesForm}>
                    <form
                      onSubmit={seriesForm.handleSubmit((v) => submitSeries(v))}
                      className="space-y-4"
                    >
                      <FormField
                        control={seriesForm.control}
                        name="brand_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("selectBrand")}</FormLabel>
                            <Select
                              onValueChange={(v) => field.onChange(Number(v))}
                              value={
                                field.value ? String(field.value) : undefined
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("selectBrand")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {brands.map((b) => (
                                  <SelectItem key={b.id} value={String(b.id)}>
                                    {b.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={seriesForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("seriesName")}</FormLabel>
                            <FormControl>
                              <Input placeholder="3 Series" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={seriesSubmitting}>
                          {seriesSubmitting && (
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
                    <TableHead>{t("seriesName")}</TableHead>
                    <TableHead>{t("brands")}</TableHead>
                    <TableHead className="text-right">
                      {tCommon("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seriesLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        {tCommon("loading")}
                      </TableCell>
                    </TableRow>
                  ) : series.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        {t("noSeries")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    series.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.id}</TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>{getBrandName(s.brand_id)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingSeries(s);
                              setSeriesOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => handleDeleteSeries(s.id)}
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
        </TabsContent>

        {/* ==================== 车型 Tab ==================== */}
        <TabsContent value="models">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle>{t("models")}</CardTitle>
                <Select
                  value={filterSeriesId ? String(filterSeriesId) : "all"}
                  onValueChange={(v) =>
                    setFilterSeriesId(v === "all" ? undefined : Number(v))
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t("selectSeries")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allBrands")}</SelectItem>
                    {series.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog
                open={modelOpen}
                onOpenChange={(v) => {
                  setModelOpen(v);
                  if (!v) setEditingModel(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingModel(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("addModel")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingModel
                        ? t("editModelTitle")
                        : t("createModelTitle")}
                    </DialogTitle>
                    <DialogDescription />
                  </DialogHeader>
                  <Form {...modelForm}>
                    <form
                      onSubmit={modelForm.handleSubmit((v) => submitModel(v))}
                      className="space-y-4"
                    >
                      <FormField
                        control={modelForm.control}
                        name="series_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("selectSeries")}</FormLabel>
                            <Select
                              onValueChange={(v) => field.onChange(Number(v))}
                              value={
                                field.value ? String(field.value) : undefined
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t("selectSeries")}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {series.map((s) => (
                                  <SelectItem key={s.id} value={String(s.id)}>
                                    {s.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={modelForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("modelName")}</FormLabel>
                            <FormControl>
                              <Input placeholder="325Li" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={modelForm.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("year")}</FormLabel>
                            <FormControl>
                              <Input placeholder="2024" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={modelSubmitting}>
                          {modelSubmitting && (
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
                    <TableHead>{t("modelName")}</TableHead>
                    <TableHead>{t("series")}</TableHead>
                    <TableHead>{t("year")}</TableHead>
                    <TableHead className="text-right">
                      {tCommon("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {tCommon("loading")}
                      </TableCell>
                    </TableRow>
                  ) : models.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {t("noModels")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    models.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.id}</TableCell>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell>{getSeriesName(m.series_id)}</TableCell>
                        <TableCell>{m.year || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingModel(m);
                              setModelOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => handleDeleteModel(m.id)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
