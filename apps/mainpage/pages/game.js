import FloatingBalance from '../components/FloatingBalance';
import GamePlay from '../components/Game';
import FloatingLoginButton from '../components/FloatingLoginButton'; // Import the FloatingLoginButton component

export default function Game() {
  return (
    <div>
      <FloatingLoginButton />
      <FloatingBalance />
      <GamePlay />
    </div>
  );
}