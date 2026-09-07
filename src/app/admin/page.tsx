import { loadVercelAnalytics } from "@/lib/vercel-analytics";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default async function AdminHomePage() {
  const result = await loadVercelAnalytics();
  return <AnalyticsDashboard result={result} />;
}
