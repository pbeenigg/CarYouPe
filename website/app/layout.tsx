import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarYou Pe - 汽车用品之家 | 一键匹配爱车的每个细节",
  description: "广州引领者汽车用品有限公司专业从事汽车脚垫、座垫、座套等皮革制品生产销售。7000平米标准化生产车间，100多名优秀员工团队，为您提供安全环保的高品质汽车用品。",
  keywords: "汽车脚垫,汽车座垫,汽车座套,全包围脚垫,皮革座套,汽车内饰,广州汽车用品",
  authors: [{ name: "广州引领者汽车用品有限公司" }],
  openGraph: {
    title: "CarYou Pe - 汽车用品之家",
    description: "一键匹配爱车的每个细节",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
