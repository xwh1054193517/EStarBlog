import DefaultLayout from "@/components/layouts/DefaultLayout";
import { getMockSiteData } from "@/lib/mock-api";

export default async function HomePage() {
  const siteData = await getMockSiteData();

  return (
    <DefaultLayout siteData={siteData} pageType="home">
      <section className="demo-card">

      </section>
    </DefaultLayout>
  );
}
