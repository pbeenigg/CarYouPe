"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRequest } from "@/hooks/use-request";
import { settingService } from "@/services/settings";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  nickname: z.string().optional(),
  real_name: z.string().optional(),
  phone: z.string().optional(),
  avatar_url: z.string().optional(),
});

const passwordSchema = z
  .object({
    new_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirm_password: z.string().min(6),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const tCommon = useTranslations("Common");

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: "",
      real_name: "",
      phone: "",
      avatar_url: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  // 1. 获取用户信息
  const { loading, run: fetchProfile } = useRequest(
    async () => {
      return await settingService.getProfile();
    },
    {
      onSuccess: (data: unknown) => {
        // data 可能是 { user: ... } 或者直接是 user 对象，取决于后端
        // 根据旧代码 `response.data.user`，这里 data 应该是包含 user 的对象
        // 但 settingService.getProfile 返回 api.get<User>，如果是标准结构，data 就是 User
        // 假设 Service 层已经处理好，或者我们在这里适配
        const responseData = data as any;
        const user = responseData.user || responseData;

        profileForm.reset({
          nickname: user.nickname || "",
          real_name: user.real_name || "",
          phone: user.phone || "",
          avatar_url: user.avatar_url || "",
        });
      },
      onError: (err) => console.error("Failed to fetch profile:", err),
    },
  );

  // 2. 更新个人资料
  const { loading: savingProfile, run: updateProfile } = useRequest(
    async (values: ProfileFormValues) => {
      return await settingService.updateProfile(values);
    },
    {
      onSuccess: () => {
        toast.success(t("updateProfileSuccess"));
      },
    },
  );

  // 3. 更新密码
  const { loading: savingPassword, run: updatePassword } = useRequest(
    async (values: PasswordFormValues) => {
      return await settingService.updatePassword(values.new_password);
    },
    {
      onSuccess: () => {
        toast.success(t("updatePasswordSuccess"));
        passwordForm.reset();
      },
    },
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  const onProfileSubmit = (values: ProfileFormValues) => {
    updateProfile(values);
  };

  const onPasswordSubmit = (values: PasswordFormValues) => {
    updatePassword(values);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
          <TabsTrigger value="security">{t("security")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile")}</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={profileForm.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("nickname")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Nickname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="real_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("realName")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Real Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("phone")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={savingProfile || loading}>
                      {savingProfile && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {tCommon("save")}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("changePassword")}</CardTitle>
              <CardDescription>Change your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newPassword")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("confirmPassword")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={savingPassword}>
                      {savingPassword && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {tCommon("save")}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
