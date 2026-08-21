import { getServicesForScreen } from "@/lib/services";
import DisplayClient from "./DisplayClient";

type Props = {
  searchParams: Promise<{ screen?: string }>;
};

export default async function DisplayPage({ searchParams }: Props) {
  const { screen: screenParam } = await searchParams;
  const screen = screenParam === "2" ? 2 : 1;

  const initialServices = await getServicesForScreen(screen);

  return <DisplayClient screen={screen} initialServices={initialServices} />;
}
