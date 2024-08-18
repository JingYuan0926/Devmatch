import StartGameButton from '../components/StartGame1';
import { WalletSelector } from '../components/WalletSelector';
import Image from 'next/image';

export default function CreateWalletPage() {
  return (
    <div className="container">
      <div className="modal-container">
        <WalletSelector/>
        <StartGameButton/>
      </div>
      <div className="character-container">
        <Image src="/aptosg.gif" alt="Character" width={400} height={400} />
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100vh;
          width: 100%;
          background-image: url('/background3.jpeg');
          background-size: cover;
          background-position: center;
          padding: 20px;
        }

       .modal-container {
          flex: 2; /* Increase this value to make the modal container wider */
          display: flex;
          justify-content: flex-start; /* Align the modal to the left */
          align-items: center;
          margin-left: 50px; /* Adjust this value to position it closer to the left */
        }

        .character-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
