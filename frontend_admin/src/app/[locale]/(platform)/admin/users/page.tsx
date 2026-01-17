"use client"

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
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
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/admin-header";

export default function UsersPage() {
  const t = useTranslations('Users');
  const tCommon = useTranslations('Common');
  const [users, setUsers] = useState<User[]>([]);

  // 使用 useRequest 封装数据获取逻辑
  // 自动处理 loading 状态，并支持防抖和错误处理
  const { loading, run: fetchUsers } = useRequest(
    async () => {
      // 调用 Service 层方法，而非直接调用 api
      return await userService.getUsers();
    },
    {
      onSuccess: (data) => {
        setUsers(data);
      },
      onError: (err) => {
        console.error("Failed to fetch users:", err);
      }
    }
  );

  useEffect(() => {
    fetchUsers();
  }, []); // 空依赖数组，确保只在挂载时执行一次

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <Button>{t('addUser')}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('allUsers')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{t('username')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('role')}</TableHead>
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
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <span className="text-green-600">{t('active')}</span>
                      ) : (
                        <span className="text-red-600">{t('inactive')}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.is_superuser ? t('admin') : t('user')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        {tCommon('edit')}
                      </Button>
                      <Button variant="destructive" size="sm">
                        {tCommon('delete')}
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
