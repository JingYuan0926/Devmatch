import axios from 'axios';

const API_URL = 'https://service-testnet.maschain.com';
const CLIENT_ID = 'fbe3e68b64bc94d69c8f630b32ae2815a1cc1c80daf69175e0a2f7f05dad6c9d';
const CLIENT_SECRET = 'sk_ab29a87ed862fd9cf3b2922c7779d9d6e4def9ce059f5380d0b928ddd8cd91a5';

const MintNFT = async (walletAddress, car, contractAddress, setStatus, setIsLoading) => {
  console.log('MintNFT function called with:', { walletAddress, car, contractAddress });

  // Early logging to verify contractAddress
  if (!contractAddress) {
    console.error('Error: contractAddress is undefined or empty.');
    setStatus('Minting failed: Contract address is missing.');
    setIsLoading(false);
    return;
  }

  setIsLoading(true);
  setStatus('Initiating minting on MasChain...');

  // Validate input data
  if (!walletAddress || !car.name || !car.price || !car.imageUrl || !contractAddress) {
    const error = 'Missing required data for minting';
    console.error(error, { walletAddress, car, contractAddress });
    setStatus(error);
    setIsLoading(false);
    throw new Error(error);
  }

  const formData = new FormData();
  formData.append('wallet_address', walletAddress);
  formData.append('to', walletAddress);
  formData.append('contract_address', contractAddress);
  formData.append('name', `${car.name} Certificate`);
  formData.append('description', `Certificate for the purchase of ${car.name}`);
  formData.append('callback_url', 'http://localhost:3000/showcase'); // Replace with your actual callback URL

  console.log('FormData initial fields:', Object.fromEntries(formData));

  // Fetch and append the image
  try {
    console.log('Fetching image from URL:', car.imageUrl);
    const imageUrl = new URL(car.imageUrl, window.location.origin).href;
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const fileName = imageUrl.split('/').pop() || 'car_image.jpg';
    formData.append('file', new File([imageBlob], fileName, { type: imageBlob.type }));
    console.log('Image appended to FormData:', { fileName, type: imageBlob.type });
  } catch (error) {
    console.error('Error fetching image:', error);
    setStatus('Failed to fetch car image');
    setIsLoading(false);
    throw error;
  }

  // Append attributes
  const attributes = [
    { trait: "Car Name", value: car.name },
    { trait: "Price", value: car.price.toString() }
  ];
  formData.append('attributes', JSON.stringify(attributes));
  console.log('Attributes appended:', attributes);

  console.log('Final FormData fields:', Object.fromEntries(formData));

  try {
    console.log('Sending POST request to:', `${API_URL}/api/certificate/mint-certificate`);
    const response = await axios.post(`${API_URL}/api/certificate/mint-certificate`, formData, {
      headers: {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('API Response:', response.data);

    if (response.data.status === 200 ) {
      const { nft_token_id, transactionHash, status } = response.data.result;
      const successMessage = `MasChain minting initiated. NFT Token ID: ${nft_token_id}, Transaction Hash: ${transactionHash}, Status: ${status}`;
      console.log(successMessage);
      setStatus(successMessage);
      setIsLoading(false);
      return response.data.result;
    } else {
      throw new Error('Minting failed: Unexpected response format');
    }
  } catch (error) {
    console.error('MasChain minting error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      setStatus(`MasChain minting failed: ${error.response.data.result || error.message}`);
    } else {
      setStatus(`MasChain minting failed: ${error.message}`);
    }
    setIsLoading(false);
    throw error;
  }
};

export default MintNFT;
