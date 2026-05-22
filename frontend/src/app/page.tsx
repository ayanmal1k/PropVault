import { ZameenHeroSearch } from "@/components/search/ZameenHeroSearch";
import { ZameenHome } from "@/components/home/ZameenHome";

export const metadata = {
  title: "Pakistan Property Real Estate - Sell Buy Rent Homes & Properties In Pakistan Real Estate - PropVault",
  description: "Sell, Buy & Rent Homes and Properties in Pakistan",
};

export default function HomePage() {
  return (
    <>
      <ZameenHeroSearch />
      <ZameenHome />
    </>
  );
}
