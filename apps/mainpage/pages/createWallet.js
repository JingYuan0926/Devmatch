import StartGameButton from '../components/StartGame1';
import FloatingLoginButton from '../components/FloatingLoginButton'; // Import the FloatingLoginButton component
import Head from 'next/head';
import Image from 'next/image';

export default function CreateWalletPage() {
  return (
    
    <div className="container">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=Sedan+SC&display=swap" rel="stylesheet" />
      </Head>
      <div className="modal-container">
        <FloatingLoginButton />
        <StartGameButton/>
      </div>
      <div className="character-container">
        <Image src="/maschaing.gif" alt="Character" width={400} height={400} />
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 92.5vh;
          width: 96vw;
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
