module.exports = {
  reactStrictMode: true,
  env: {
    LIFF_ID: process.env.LIFF_ID,
  },
  experimental: {
    forceSwcTransforms: true,
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    domains: ['line-liff-app.s3.ap-northeast-1.amazonaws.com'],
  },
};
