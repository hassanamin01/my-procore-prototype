import dynamic from "next/dynamic";

const AppShell = dynamic(() => import("@/components/AppShell"), {
  ssr: false,
  loading: () => (
    <p style={{ padding: 40, color: "#6b7280" }}>Loading...</p>
  ),
});

export default function Home() {
  return <AppShell />;
}
