import Header from '@/components/Header';
import HomeHero from '@/components/HomeHero';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      <Header className="text-white" />
      <HomeHero />
    </main>
  );
}
