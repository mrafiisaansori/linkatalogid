export function isVercelDemoRuntime() {
  return process.env.VERCEL === "1" && process.env.NODE_ENV === "production";
}
