"use client"

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useRequest } from '@/hooks/use-request';
import { authService } from '@/services/auth';
import { Header } from "@/components/layout/admin-header";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export default function LoginPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const { loading, run: login } = useRequest(
    async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('password', values.password);
      return await authService.login(formData);
    },
    {
      onSuccess: (data) => {
        // useRequest automatically infers generic T from requestFn return type if possible,
        // but here it might be inferred as unknown or similar depending on useRequest definition.
        // Since we updated authService.login to return specific type, we can cast or trust inference if useRequest is good.
        // But useRequest definition defaults T=unknown.
        const { access_token } = data as { access_token: string }; 
        localStorage.setItem('token', access_token);
        router.push('/admin/dashboard');
      },
      onError: (err) => {
        console.error(err);
        setError(t('errorMessage'));
      }
    }
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError('');
    login(values);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-32 bg-muted/40 p-4">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="relative h-24 w-24 mb-6">
             <Image 
               src="/images/logo.png" 
               alt="CarYouPe Logo" 
               fill
               className="object-contain dark:invert"
               priority
             />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t('welcome')}</h1>
          <p className="text-muted-foreground">{t('loginSubtitle')}</p>
        </div>

        <Card className="border-border/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">{t('loginTitle')}</CardTitle>
            <CardDescription>
              CarYouPe Admin Panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('errorTitle')}</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('username')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('usernamePlaceholder')} {...field} />
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
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t('passwordPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? t('loginBtnLoading') : t('loginBtn')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
