import Link from "next/link";

export default function HomeScreen() {
  return (
    <div>
      <h1>Página inicial</h1>
      <Link href={"/sobre"}>Ir para sobre</Link>
    </div>
  );
}
