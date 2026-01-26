import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { checkEmailServiceHealth, EmailFallbackService } from '../lib/email-fallback'

type HealthStatus = {
  smtp: boolean
  fallback: boolean
}

export default function ContactStatusPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setHealth(checkEmailServiceHealth())
  }, [])

  const handleCopyContact = async () => {
    const success = await EmailFallbackService.copyContactInfo()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const emergencyMessage = EmailFallbackService.getEmergencyMessage()

  return (
    <>
      <Head>
        <title>联系状态 - CarYouPe</title>
        <meta name="description" content="邮件服务状态和紧急联系方式" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📧 联系服务状态
            </h1>
            <p className="text-lg text-gray-600">
              检查邮件服务状态和获取紧急联系方式
            </p>
          </div>

          {health && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* SMTP 状态 */}
              <div className={`rounded-lg p-6 ${
                health.smtp 
                  ? 'bg-green-50 border-green-200 border' 
                  : 'bg-red-50 border-red-200 border'
              }`}>
                <div className="text-center">
                  <div className="text-3xl mb-2">
                    {health.smtp ? '✅' : '❌'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    SMTP 邮件服务
                  </h3>
                  <p className="text-sm text-gray-600">
                    {health.smtp ? '已配置，可以发送邮件' : '未配置或配置错误'}
                  </p>
                </div>
              </div>

              {/* 降级方案状态 */}
              <div className="bg-blue-50 border-blue-200 border rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🛡️</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    降级方案
                  </h3>
                  <p className="text-sm text-gray-600">
                    本地备份 - 总是可用
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 紧急联系方式 */}
          <div className="bg-red-50 border-red-200 border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">
              🚨 紧急联系方式
            </h2>
            
            <div className="bg-white rounded-lg p-6 mb-6">
              <pre className="whitespace-pre-wrap text-gray-700 text-sm">
                {emergencyMessage}
              </pre>
            </div>

            <div className="text-center">
              <button
                onClick={handleCopyContact}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? '✅ 已复制到剪贴板' : '📋 复制联系方式'}
              </button>
            </div>
          </div>

          {/* 问题排查 */}
          <div className="bg-yellow-50 border-yellow-200 border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-yellow-800 mb-6 text-center">
              🔧 问题排查
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  如果邮件服务不可用：
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 检查网络连接</li>
                  <li>• 尝试刷新页面重新提交</li>
                  <li>• 使用紧急联系方式直接联系</li>
                  <li>• 稍后重试在线表单</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  管理员修复步骤：
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 检查 SMTP 服务器配置</li>
                  <li>• 更新 EmailJS 模板 ID</li>
                  <li>• 验证邮箱授权码</li>
                  <li>• 查看 EMAIL-FIX.md 文档</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 快速操作 */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              🏠 返回首页
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}