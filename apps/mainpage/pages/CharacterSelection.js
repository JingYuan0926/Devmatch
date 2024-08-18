import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

const CharacterSelection = () => {
  const router = useRouter();

  const handleCharacterSelect = (character) => {
    if (character === 'character1') {
      // Redirect to localhost:3000/createWallet
      window.location.href = 'http://localhost:3000/createWallet';
    } else if (character === 'character2') {
      // Redirect to localhost:3001/createWallet
      window.location.href = 'http://localhost:3001/createWallet';
    }
  };

  return (
    <div className="container">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=Sedan+SC&display=swap" rel="stylesheet" />
      </Head>
      <main className="main">
        <h1 className="title">Choose Your Character</h1>
        <div className="character-selection">
          <div className="character" onClick={() => handleCharacterSelect('character1')}>
            <Image src="/maschaing.gif" alt="Character 1" width={400} height={400} className="character-image" />
            <p className="character-name">Thomas</p>
          </div>
          <div className="character" onClick={() => handleCharacterSelect('character2')}>
            <Image src="/aptosg.gif" alt="Character 2" width={400} height={400} className="character-image" />
            <p className="character-name">Ming</p>
          </div>
        </div>
      </main>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
        .container {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-image: url('/background3.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          font-family: 'Pixelify Sans', 'Courier New', Courier, monospace; 
        }
        .main {
          width: 100%;
          padding: 2rem;
          text-align: center;
        }
        .title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: black;
          
        }
        .character-selection {
          display: flex;
          justify-content: space-around;
          width: 10%;
        }
        .character {
          cursor: pointer;
          text-align: center;
          transition: transform 0.3s ease;
          margin-left: 154px;
        }
        .character:hover {
          transform: scale(1.05);
        }
        .character-name {
          margin-top: 5px;
          font-size: 2.2rem;
          color: black;
          font-weight: bold;
        }
        .character-image {
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default CharacterSelection;
