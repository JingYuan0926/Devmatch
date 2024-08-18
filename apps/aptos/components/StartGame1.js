import { useRouter } from 'next/router';
import Head from 'next/head';

const StartGameButton = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/game'); // Navigate to the game page
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=Sedan+SC&display=swap" rel="stylesheet" />
      </Head>
      <button className="float-button start-game-button" onClick={handleButtonClick}>
        Start Game
      </button>
      <style jsx>{`
        .start-game-button {
          position: fixed;
          bottom: 20%;
          left: 300px;
          width: 300px;
          height: 90px;
          border-radius: 12px;
          background-color: #4CA2FF;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          padding: 10px;
          transition: all 0.3s ease;
          color: white;
          z-index: 20;
          font-family: 'Pixelify Sans', 'Courier New', Courier, monospace;
          font-size: 45px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .start-game-button:hover {
          background-color: #0059c1;
        }        
      `}</style>
    </>
  );
};

export default StartGameButton;
