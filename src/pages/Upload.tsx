import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
  import { ethers } from "ethers";
import { Upload, Coins, Video, Image, Heart, Eye, Share, User, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { createCoin, DeployCurrency, ValidMetadataURI, getCoinCreateFromLogs } from "@zoralabs/coins-sdk";
import { Hex, createWalletClient, createPublicClient, http, Address, custom } from "viem";
import { base, baseSepolia } from "viem/chains";

interface CoinCreationResult {
  hash: string;
  address: string;
  deployment: any;
}

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coinName, setCoinName] = useState('');
  const [coinSymbol, setCoinSymbol] = useState('');
  const [contentType, setContentType] = useState<'photo' | 'video'>('video');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<'form' | 'uploading' | 'creating' | 'success'>('form');
  const [currentStepText, setCurrentStepText] = useState('');
  const [createdCoin, setCreatedCoin] = useState<CoinCreationResult | null>(null);
  const [error, setError] = useState('');
  const [network] = useState<'mainnet' | 'testnet'>('testnet'); // Change to 'mainnet' for production
  const [currency] = useState<'ZORA' | 'ETH'>('ZORA');

  // Your backend configuration - users don't need to input these


let PLATFORM_WALLET = "";
let PLATFORM_REFERRER = "";

async function loadWalletFromSession() {
  if (window.ethereum) {
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = browserProvider.getSigner();

    try {
      const address = await (await signer).getAddress(); // Will not prompt again if already connected
      PLATFORM_WALLET = address;
      PLATFORM_REFERRER = address;
      console.log("Connected Wallet:", address);
    } catch (err) {
      console.error("Error getting address:", err);
    }
  } else {
    console.error("Ethereum provider not found");
  }
}

loadWalletFromSession();

  const RPC_URL = network === 'mainnet' ? "https://mainnet.base.org" : "https://sepolia.base.org";
  
  const chainConfig = {
    chain: network === 'mainnet' ? base : baseSepolia,
    rpcUrl: RPC_URL,
    chainId: network === 'mainnet' ? base.id : baseSepolia.id,
  };

  const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    // You can implement your toast logic here
    console.log(`${variant === 'destructive' ? 'ERROR' : 'SUCCESS'}: ${title} - ${description}`);
  };

  const uploadImageToIPFS = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const metadata = JSON.stringify({
        name: file.name,
        description: description,
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', options);

      const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
      
      if (!PINATA_JWT) {
        console.warn('PINATA_JWT not configured, using demo hash');
        await new Promise(resolve => setTimeout(resolve, 2000));
        return "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy";
      }

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS');
      }

      const result = await response.json();
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      console.error('IPFS upload error:', error);
      return "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy";
    }
  };

  const createMetadata = (name: string, description: string, imageUri: string) => {
    return {
      name: name,
      description: description,
      image: imageUri,
      attributes: [
        {
          trait_type: "Type",
          value: "Creator Coin"
        },
        {
          trait_type: "Network",
          value: network === 'mainnet' ? 'Base' : 'Base Sepolia'
        },
        {
          trait_type: "Content Type",
          value: contentType === 'video' ? 'Video' : 'Photo'
        }
      ]
    };
  };

  const uploadMetadataToIPFS = async (metadata: any): Promise<string> => {
    try {
      const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
      
      if (!PINATA_JWT) {
        console.warn('PINATA_JWT not configured, using demo metadata hash');
        return "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy";
      }

      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `${metadata.name} Metadata`,
            description: `Metadata for ${metadata.name} creator coin`
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload metadata to IPFS');
      }

      const result = await response.json();
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      console.error('Metadata upload error:', error);
      return "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy";
    }
  };

  const createMemeCoin = async (params: any): Promise<CoinCreationResult> => {
    try {
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(chainConfig.rpcUrl),
      });

      if (!window.ethereum) {
        throw new Error("No ethereum provider found");
      }

      const walletClient = createWalletClient({
        account: PLATFORM_WALLET as Address,
        chain: chainConfig.chain,
        transport: custom(window.ethereum),
      });

      const coinParams = {
        name: params.name,
        symbol: params.symbol,
        uri: params.uri as ValidMetadataURI,
        payoutRecipient: PLATFORM_WALLET as Address,
        platformReferrer: PLATFORM_REFERRER ? PLATFORM_REFERRER as Address : undefined,
        chainId: chainConfig.chainId,
        currency: params.currency === 'ETH' ? DeployCurrency.ZORA : DeployCurrency.ETH,
      };

      console.log('Creating coin with params:', coinParams);

      const result = await createCoin(coinParams, walletClient, publicClient, {
        gasMultiplier: 120,
      });

      console.log('Coin creation result:', result);

      const receipt = await publicClient.waitForTransactionReceipt({ hash: result.hash });
      const coinDeployment = getCoinCreateFromLogs(receipt);

      return {
        hash: result.hash,
        address: coinDeployment?.coin || result.address,
        deployment: coinDeployment || result,
      };
    } catch (error) {
      console.error('Coin creation error:', error);
      
      // Only use demo mode if explicitly in development AND the error is a chain mismatch
      if (process.env.NODE_ENV === 'development' && error.message?.includes('chain')) {
        console.log('Development mode: Chain mismatch detected, creating demo coin result');
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              hash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
              address: "0x" + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
              deployment: params
            });
          }, 3000);
        });
      }
      
      throw error;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (contentType === 'video') {
      setVideoFile(file);
    } else {
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !coinName || !coinSymbol) {
      setError("Please fill in all required fields.");
      return;
    }

    const file = contentType === 'video' ? videoFile : imageFile;
    if (!file) {
      setError("Please upload a file.");
      return;
    }

    setIsUploading(true);
    setUploadStep('uploading');
    setError('');

    try {
      setCurrentStepText("Uploading content to IPFS...");
      showToast("Uploading Content 📸", "Storing your content on IPFS...");
      
      const imageUri = await uploadImageToIPFS(file);
      
      setCurrentStepText("Creating metadata...");
      const metadata = createMetadata(coinName, description, imageUri);
      const metadataUri = await uploadMetadataToIPFS(metadata);
      
      setUploadStep('creating');
      setCurrentStepText(`Creating coin on ${network === 'mainnet' ? 'Base' : 'Base Sepolia'} network...`);
      showToast("Creating Coin 🪙", `Deploying your creator coin on ${network === 'mainnet' ? 'Base' : 'Base Sepolia'}...`);

      const coinParams = {
        name: coinName,
        symbol: coinSymbol,
        uri: metadataUri,
        payoutRecipient: PLATFORM_WALLET,
        platformReferrer: PLATFORM_REFERRER || undefined,
        currency: currency,
      };

      const result = await createMemeCoin(coinParams);
      setCreatedCoin(result);
      setUploadStep('success');

      showToast("Creator Coin Created Successfully! 🎉", `Your content is now a tradeable coin on ${network === 'mainnet' ? 'Base' : 'Base Sepolia'}!`);
      
      // Reset form
      setTitle('');
      setDescription('');
      setCoinName('');
      setCoinSymbol('');
      setImageFile(null);
      setVideoFile(null);
      
    } catch (error) {
      console.error("Error creating coin:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(`Failed to create your creator coin: ${errorMessage}`);
      setUploadStep('form');
    } finally {
      setIsUploading(false);
    }
  };

  const getStepIcon = () => {
    switch (uploadStep) {
      case 'uploading':
        return <Upload className="animate-pulse text-blue-400" size={24} />;
      case 'creating':
        return <Coins className="animate-spin text-yellow-400" size={24} />;
      case 'success':
        return <CheckCircle className="text-green-400" size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Share Your Content & Mint Creator Coins</h1>
        
        {/* Network Info */}
        <div className="mb-6">
          <Badge className={`${network === 'mainnet' ? 'bg-green-600' : 'bg-orange-600'} text-white`}>
            {network === 'mainnet' ? 'Base Mainnet' : 'Base Sepolia Testnet'}
          </Badge>
        </div>

        {/* Content Upload Section */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              {contentType === 'video' ? (
                <Video className="mr-2 text-purple-400" />
              ) : (
                <Image className="mr-2 text-green-400" />
              )}
              Content Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Content Type Toggle */}
            <div>
              <label className="block text-gray-300 mb-2">Content Type</label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  onClick={() => setContentType('video')}
                  className={`${
                    contentType === 'video'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Video className="mr-2" size={16} />
                  Video/Reel
                </Button>
                <Button
                  type="button"
                  onClick={() => setContentType('photo')}
                  className={`${
                    contentType === 'photo'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Image className="mr-2" size={16} />
                  Photo
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Content Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Enter your ${contentType} title`}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Describe your ${contentType}...`}
                className="bg-white/10 border-white/20 text-white min-h-[100px]"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                Upload {contentType === 'video' ? 'Video' : 'Photo'} *
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  accept={contentType === 'video' ? "video/*" : "image/*"}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {contentType === 'video' ? (
                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  ) : (
                    <Image className="mx-auto mb-4 text-gray-400" size={48} />
                  )}
                  <p className="text-gray-400">
                    {(contentType === 'video' && videoFile) || (contentType === 'photo' && imageFile)
                      ? `Selected: ${(contentType === 'video' ? videoFile : imageFile)?.name}`
                      : 'Click to upload or drag and drop'
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {contentType === 'video' 
                      ? 'MP4, MOV, AVI up to 100MB'
                      : 'JPG, PNG, GIF up to 50MB'
                    }
                  </p>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coin Creation Section */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Coins className="mr-2 text-yellow-400" />
              Create Your Zora Coin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Coin Name *</label>
                <Input
                  value={coinName}
                  onChange={(e) => setCoinName(e.target.value)}
                  placeholder="My Awesome Coin"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Symbol * (max 5 chars)</label>
                <Input
                  value={coinSymbol}
                  onChange={(e) => setCoinSymbol(e.target.value.toUpperCase())}
                  placeholder="MAC"
                  maxLength={5}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> This will create a real coin on {network === 'mainnet' ? 'Base' : 'Base Sepolia'} network using Zora's protocol. 
                The platform will handle all blockchain interactions automatically.
              </p>
            </div>
            
            {/* Upload Progress */}
            {uploadStep !== 'form' && (
              <div className="bg-gray-900/50 border border-gray-600/20 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {getStepIcon()}
                  <span className="text-white font-medium">{currentStepText}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: uploadStep === 'uploading' ? '33%' : uploadStep === 'creating' ? '66%' : '100%' 
                    }}
                  />
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleSubmit}
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  {uploadStep === 'uploading' ? 'Uploading to IPFS...' : 
                   uploadStep === 'creating' ? 'Creating Coin...' : 'Processing...'}
                </>
              ) : (
                <>
                  <Coins className="mr-2" size={16} />
                  Upload Content & Create Coin
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-900/20 border-red-500/20 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center text-red-300">
                <AlertTriangle className="mr-2" size={20} />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Display */}
        {createdCoin && uploadStep === 'success' && (
          <Card className="bg-green-900/20 border-green-500/20 mb-8">
            <CardHeader>
              <CardTitle className="text-green-300 flex items-center">
                <CheckCircle className="mr-2" />
                Creator Coin Created Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-green-200">
                <p><strong>Transaction Hash:</strong> {createdCoin.hash}</p>
                <p><strong>Coin Address:</strong> {createdCoin.address}</p>
                <p><strong>Network:</strong> {network === 'mainnet' ? 'Base Mainnet' : 'Base Sepolia'}</p>
                <p><strong>Currency: ETH</strong></p>
                <div className="mt-4 p-3 bg-green-800/20 rounded">
                  <p className="text-sm">
                    Your creator coin has been successfully deployed on {network === 'mainnet' ? 'Base' : 'Base Sepolia'} network. 
                    You can view it on a block explorer using the transaction hash above.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UploadPage;