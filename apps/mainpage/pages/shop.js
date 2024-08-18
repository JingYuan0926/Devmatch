import Shop from "../components/Shop";
import FloatingBalance from '../components/FloatingBalance';
import FloatingLoginButton from '../components/FloatingLoginButton'; // Import the FloatingLoginButton component

export default function Home() {
  return(
    <div>
      <FloatingLoginButton />
      <FloatingBalance />
      <Shop />
    </div>
  ) 

   
}