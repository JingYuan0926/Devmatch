import LandingPage from '../components/Landing';
import { WalletSelector } from '../components/WalletSelector';

export default function Home() {
  return (
    <div>
      <WalletSelector />
      <LandingPage />
    </div>
  );
}