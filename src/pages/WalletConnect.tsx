import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WalletConnect = () => {
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      browserProvider.send("eth_accounts", []).then((accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        }
      });
    }
  }, []);

  const handleConnect = async () => {
    if (!provider) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Ethereum wallet.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Connecting Wallet...",
        description: "Please approve connection in your wallet.",
      });

      const accounts = await provider.send("eth_requestAccounts", []);
      const userAddress = accounts[0];
      setAddress(userAddress);

      toast({
        title: "Wallet Connected!",
        description: `Connected to ${userAddress}`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to wallet.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    // No real "disconnect" with MetaMask – we just clear the local state
    setAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected locally.",
    });
  };

  if (address) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-green-400 border-green-800">
          {address.slice(0, 6)}...{address.slice(-4)}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="border-red-800 text-red-400 hover:bg-red-900/20"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  );
};
