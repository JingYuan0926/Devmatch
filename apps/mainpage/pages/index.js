import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Devmatch</h1>
      <Link href="http://localhost:3001">Go to Maschain</Link><br/>
      <Link href="http://localhost:3002">Go to Aptos</Link>
    </div>
  );
}
