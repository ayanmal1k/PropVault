import { Suspense } from "react";
import { SearchResults } from "./SearchResults";

export const metadata = {
  title: "Property Search Results",
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading search results…</div>
    }>
      <SearchResults />
    </Suspense>
  );
}
