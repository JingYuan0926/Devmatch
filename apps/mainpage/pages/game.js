import FloatingBalance from '../components/FloatingBalance';
import GamePlay from '../components/Game';
import CreateWalletComponent from '../components/FloatingLoginButton';


export default function Game() {
  return (
    <div>
      <CreateWalletComponent />
      <FloatingBalance />
      <GamePlay />
    </div>
  );
}