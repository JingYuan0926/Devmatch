import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

const CharacterSelection = () => {

  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/game'); // Navigate to the game page
  };

  const handleCharacterSelect = (url) => {
    router.push(url);
  };

  return (
    <div className="container">
      <Head>
        <title>Character Selection</title>
        <meta name="description" content="Select your character" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <h1 className="title">Choose Your Character</h1>
        <div className="character-selection">
          <div className="character" onClick={(handleButtonClick)}>
            <Image src="/csy.gif" alt="Character 1" width={400} height={400} className="character-image" />
            <p className="character-name">Character 1</p>
          </div>
          <div className="character" onClick={() => handleCharacterSelect('http://localhost:3001')}>
            <Image src="/csy.gif" alt="Character 2" width={400} height={400} className="character-image" />
            <p className="character-name">Character 2</p>
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
        }
        .main {
          width: 100%;
          padding: 2rem;
          text-align: center;
        }
        .title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: black;
        }
        .character-selection {
          display: flex;
          justify-content: space-around;
          width: 80%;
        }
        .character {
          cursor: pointer;
          text-align: center;
          transition: transform 0.3s ease;
          margin-left: 220px;
        }
        .character:hover {
          transform: scale(1.05);
        }
        .character-name {
          margin-top: 10px;
          font-size: 1.2rem;
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
