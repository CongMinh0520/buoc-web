import { GridSkeleton } from "@/components/ui/Skeletons";
import { getT } from "@/i18n/server";

export default async function Loading() {
  const t = await getT();
  return <GridSkeleton label={t.skeleton.category} />;
}
