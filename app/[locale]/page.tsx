import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DEFAULT_REDIRECTS } from "@/core/constants/routes";
import HomeClient from "./home-client";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect(DEFAULT_REDIRECTS.AUTHENTICATED);
  }

  return <HomeClient />;
}

