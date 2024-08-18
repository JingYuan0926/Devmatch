import Shop from "../components/Shop";
import FloatingBalance from '../components/FloatingBalance';
import {WalletSelector} from '../components/WalletSelector';

export default function Home() {
  return(
    <div>
      <FloatingBalance />
      <WalletSelector />
      <Shop />
    </div>
  ) 

   
}