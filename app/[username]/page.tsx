import { getPublicCatalogPayload } from "@/lib/server/seller-data";
import { PublicCatalogPage } from "@/components/public-catalog-page";

export default async function UsernamePage({
  params
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const catalog = await getPublicCatalogPayload(username);

  return <PublicCatalogPage username={username} initialCatalog={catalog} />;
}
