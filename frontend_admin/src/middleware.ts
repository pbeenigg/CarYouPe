import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en-US', 'zh-CN'],
 
  // Used when no locale matches
  defaultLocale: 'zh-CN'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh-CN|en-US)/:path*']
};
