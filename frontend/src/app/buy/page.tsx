import { redirect } from "next/navigation";

export default function BuyPage() {
  redirect("/search?purpose=SALE");
}
