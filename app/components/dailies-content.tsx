import { isPendingDaily } from "@/lib/daily/types";
import { fetchServerDailies } from "@/lib/server/dailies";
import { DailiesList } from "./dailies-list";
import { DailiesAutoRefresh } from "./dailies-auto-refresh";
import { PageHeader, PageShell, PageSurface } from "./page-shell";

type DailiesContentProps = {
  title?: string;
};

export async function DailiesContent({
  title = "Dailies",
}: DailiesContentProps) {
  const dailies = await fetchServerDailies();
  const hasPendingDailies = dailies.some(isPendingDaily);
  const pendingNotice = hasPendingDailies
    ? "Please wait while dailies are being created. This page refreshes every minute for up to 10 minutes while a daily is pending."
    : undefined;

  return (
    <PageShell>
      <DailiesAutoRefresh enabled={hasPendingDailies} />
      <PageSurface className="space-y-6">
        <PageHeader title={title} description={pendingNotice} />
        <DailiesList dailies={dailies} />
      </PageSurface>
    </PageShell>
  );
}
