import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Coins, TrendingUp, Users, Upload, Zap, Wallet, X, Check, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

const Index = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const features = [
    {
      icon: Play,
      title: 'Create & Share Reels',
      description: 'Upload your creative content and build your audience'
    },
    {
      icon: Coins,
      title: 'Mint Creator Coins',
      description: 'Launch your own token and monetize your content'
    },
    {
      icon: TrendingUp,
      title: 'Earn from Engagement',
      description: 'Get rewarded when your content performs well'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with creators and fans in a decentralized space'
    }
  ];

  const walletOptions = [
    {
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using MetaMask browser extension',
      id: 'metamask'
    }
  ];

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectMetaMask = async () => {
    setIsConnecting(true);
    
    // Check if MetaMask is installed
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask) {
      try {
        console.log('MetaMask detected, attempting connection...');
        
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts && accounts.length > 0) {
          console.log('Connected to MetaMask:', accounts[0]);
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
          setShowWalletModal(false);
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
              setWalletAddress(accounts[0]);
            } else {
              setWalletConnected(false);
              setWalletAddress('');
            }
          });
          
          // Listen for chain changes
          window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
          });
          
        } else {
          throw new Error('No accounts returned from MetaMask');
        }
        
      } catch (error) {
        console.error('MetaMask connection error:', error);
        
        if (error.code === 4001) {
          alert('Please approve the connection request in MetaMask to continue.');
        } else {
          alert(`Failed to connect to MetaMask: ${error.message}`);
        }
        
        setWalletConnected(false);
        setWalletAddress('');
      }
    } else {
      console.log('MetaMask not detected');
      alert('MetaMask is not installed! Please install the MetaMask browser extension from https://metamask.io/ to connect your wallet.');
    }
    
    setIsConnecting(false);
  };

  const handleWalletConnect = (walletId) => {
    switch (walletId) {
      case 'metamask':
        connectMetaMask();
        break;
      default:
        alert('This wallet is not supported yet');
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen">
      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Connect Wallet</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </Button>
            </div>
            
            <div className="space-y-3">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletConnect(wallet.id)}
                  disabled={isConnecting}
                  className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 flex items-center space-x-4 transition-all duration-300 disabled:opacity-50"
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <div className="flex-1 text-left">
                    <h4 className="text-white font-semibold">{wallet.name}</h4>
                    <p className="text-gray-400 text-sm">{wallet.description}</p>
                  </div>
                  {isConnecting && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                New to Ethereum wallets?{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">
                  Learn more <ExternalLink size={14} className="inline" />
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Zoransta
        </div>
        
        {walletConnected && (
          <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Check size={16} />
            <span className="text-sm font-medium">{formatAddress(walletAddress)}</span>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Create. Share. Earn.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            The first Web3 social platform where creators mint their own coins and fans invest in their favorite content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {walletConnected ? (
              <>
                <Button 
                  size="lg" 
                  onClick={() => alert('Navigate to upload page - wallet connected!')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3"
                >
                  <Upload className="mr-2" size={20} />
                  Start Creating
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => alert('Navigate to dashboard - wallet connected!')}
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg px-8 py-3"
                >
                  <Zap className="mr-2" size={20} />
                  View Dashboard
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={() => setShowWalletModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3"
              >
                <Wallet className="mr-2" size={20} />
                Connect Wallet to Start
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why ReelsCoin?</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Revolutionary features that put creators in control of their content and earnings
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <feature.icon className="mx-auto mb-4 text-purple-400" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Wallet Status Section */}
      {walletConnected && (
        <section className="container mx-auto px-4 py-20">
          <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-2xl p-8 border border-green-500/20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-4">
                <Check size={20} />
                <span className="font-medium">Wallet Connected</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Welcome to Zoransta!</h3>
              <p className="text-gray-400">Your wallet is connected and ready to use</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">Your Address</h4>
                <p className="text-purple-400 font-mono text-sm">{formatAddress(walletAddress)}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">Network</h4>
                <p className="text-blue-400">Ethereum Mainnet</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">Status</h4>
                <p className="text-green-400">Ready to Create</p>
              </div>
            </div>
            
            <div className="text-center">
              <Button
                variant="outline"
                onClick={disconnectWallet}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
              >
                Disconnect Wallet
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-purple-400 mb-2">1,000+</h3>
              <p className="text-gray-400">Creators Joined</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-blue-400 mb-2">50K+</h3>
              <p className="text-gray-400">Reels Uploaded</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-pink-400 mb-2">$100K+</h3>
              <p className="text-gray-400">Creator Earnings</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the revolution of decentralized content creation and start earning from your creativity today
          </p>
          {walletConnected ? (
            <Button 
              size="lg" 
              onClick={() => alert('Navigate to upload page - wallet connected!')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-12 py-4"
            >
              Launch Your First Reel
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => setShowWalletModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-12 py-4"
            >
              <Wallet className="mr-2" size={20} />
              Connect Wallet to Begin
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;