import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        fontFamily: "var(--font-body), serif",
      }}
    >
      <h1 style={{ fontFamily: "var(--font-display), serif" }}>
        Big Hit Barbershop
      </h1>
      <p>This app serves the wall-mounted display boards.</p>
      <p>
        <Link href="/display?screen=1">/display?screen=1</Link>
        {" — "}
        <Link href="/display?screen=2">/display?screen=2</Link>
      </p>
    </main>
  );
}
