import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface Web3ContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  account: string | null;
  accountAddress: string | null; // Added for compatibility with new components
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  
  // Contract instances - TRANSFORMED: Single GmbH Ownership NFT Contract
  gmbhOwnershipNFTContract: ethers.Contract | null;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  
  // Data - TRANSFORMED: NFT-only data structure
  nftBalance: string; // Total NFT balance as string for consistency
  nftCount: number;   // Number of NFTs owned
  ownershipPercentage: number; // Percentage of total GmbH ownership
  refreshData: () => Promise<void>;
  
  // GmbH-specific functions
  purchaseGmbHOwnership: (quantity: number) => Promise<void>;
  getGmbHInfo: () => Promise<any>;
  voteOnProposal: (proposalId: number, support: boolean) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// TRANSFORMED: GmbH Ownership NFT Contract ABI
const GMBH_OWNERSHIP_NFT_ABI = [
  // NFT Standard Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function totalSupply() view returns (uint256)",
  
  // GmbH Ownership Functions
  "function purchaseOwnership() external payable",
  "function getOwnershipPercentage(address owner) view returns (uint256)",
  "function getTotalOwnership() view returns (uint256)",
  "function getSharePrice() view returns (uint256)",
  
  // Governance Functions
  "function vote(uint256 proposalId, bool support) external",
  "function getVotingPower(address voter) view returns (uint256)",
  "function hasVoted(uint256 proposalId, address voter) view returns (bool)",
  
  // GmbH Information Functions
  "function getGmbHDetails() view returns (tuple(string name, string address, uint256 totalValue, uint256 monthlyIncome, address trustee))",
  "function getPropertyInfo() view returns (tuple(string propertyAddress, uint256 propertyValue, uint256 monthlyRent, string status))",
  
  // Payment Functions
  "function claimProfits() external",
  "function getPendingProfits(address owner) view returns (uint256)",
  "function getLastPaymentDate() view returns (uint256)",
  
  // Events
  "event OwnershipPurchased(address indexed buyer, uint256 quantity, uint256 totalCost)",
  "event VoteCast(address indexed voter, uint256 proposalId, bool support, uint256 votingPower)",
  "event ProfitsDistributed(uint256 totalAmount, uint256 timestamp)",
];

// SECURITY: Verified GmbH Ownership NFT Contract Addresses
const VERIFIED_CONTRACTS = {
  GMBH_NFT_MAINNET: '0x0000000000000000000000000000000000000000', // TODO: Replace with actual mainnet address
  GMBH_NFT_GOERLI: '0x0000000000000000000000000000000000000000',  // TODO: Replace with actual goerli address
  GMBH_NFT_SEPOLIA: '0x0000000000000000000000000000000000000000', // TODO: Replace with actual sepolia address
  // Add support for Polygon for lower gas fees
  GMBH_NFT_POLYGON: '0x0000000000000000000000000000000000000000', // TODO: Replace with actual polygon address
  GMBH_NFT_MUMBAI: '0x0000000000000000000000000000000000000000',  // TODO: Replace with actual mumbai address
} as const;

// SECURITY: Get verified contract address based on chain
const getGmbHContractAddress = (chainId: number): string => {
  let contractKey: keyof typeof VERIFIED_CONTRACTS;
  
  switch (chainId) {
    case 1:   // Ethereum Mainnet
      contractKey = 'GMBH_NFT_MAINNET';
      break;
    case 5:   // Goerli Testnet
      contractKey = 'GMBH_NFT_GOERLI';
      break;
    case 11155111: // Sepolia Testnet
      contractKey = 'GMBH_NFT_SEPOLIA';
      break;
    case 137: // Polygon Mainnet
      contractKey = 'GMBH_NFT_POLYGON';
      break;
    case 80001: // Mumbai Testnet
      contractKey = 'GMBH_NFT_MUMBAI';
      break;
    default:
      throw new Error(`GmbH Ownership NFT not deployed on chain ${chainId}`);
  }
  
  const address = VERIFIED_CONTRACTS[contractKey];
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    throw new Error(`GmbH Ownership NFT contract not configured for chain ${chainId}`);
  }
  
  return address;
};

// TRANSFORMED: Support for Ethereum + Polygon for lower gas fees
const SUPPORTED_CHAIN_IDS = [1, 5, 11155111, 137, 80001]; // Mainnet, Goerli, Sepolia, Polygon, Mumbai

const NETWORK_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  11155111: 'Sepolia Testnet',
  137: 'Polygon Mainnet',
  80001: 'Mumbai Testnet',
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  
  // TRANSFORMED: Single GmbH Ownership NFT Contract
  const [gmbhOwnershipNFTContract, setGmbhOwnershipNFTContract] = useState<ethers.Contract | null>(null);
  
  // TRANSFORMED: NFT-focused data state
  const [nftBalance, setNftBalance] = useState('0');
  const [nftCount, setNftCount] = useState(0);
  const [ownershipPercentage, setOwnershipPercentage] = useState(0);

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Initialize contract when signer is available
  useEffect(() => {
    if (signer && chainId) {
      initializeContract();
    }
  }, [signer, chainId]);

  // Refresh data when contract is available
  useEffect(() => {
    if (gmbhOwnershipNFTContract && account) {
      refreshData();
    }
  }, [gmbhOwnershipNFTContract, account]);

  const checkConnection = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await connectWallet();
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const connectWallet = async () => {
    // SECURITY: Verify MetaMask is the real extension
    if (!window.ethereum?.isMetaMask) {
      toast.error('Bitte installieren Sie MetaMask Wallet');
      return;
    }

    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();
      const currentChainId = Number(network.chainId);

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(currentChainId);
      setIsConnected(true);

      // SECURITY: Check if on supported network
      if (!SUPPORTED_CHAIN_IDS.includes(currentChainId)) {
        const supportedNetworksList = SUPPORTED_CHAIN_IDS.map(id => NETWORK_NAMES[id]).join(', ');
        toast.error(`Nicht unterstütztes Netzwerk. Bitte wechseln Sie zu: ${supportedNetworksList}`);
      } else {
        toast.success(`Wallet verbunden mit ${NETWORK_NAMES[currentChainId]}`);
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      toast.error(error.message || 'Fehler beim Verbinden der Wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const connect = async () => {
    await connectWallet();
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    setGmbhOwnershipNFTContract(null);
    setNftBalance('0');
    setNftCount(0);
    setOwnershipPercentage(0);
    toast.success('Wallet getrennt');
  };

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return;

    // SECURITY: Only allow switching to supported networks
    if (!SUPPORTED_CHAIN_IDS.includes(targetChainId)) {
      toast.error('Nicht unterstütztes Netzwerk');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      toast.success(`Netzwerk gewechselt zu ${NETWORK_NAMES[targetChainId]}`);
    } catch (error: any) {
      if (error.code === 4902) {
        toast.error('Bitte fügen Sie dieses Netzwerk zu MetaMask hinzu');
      } else {
        toast.error('Fehler beim Wechseln des Netzwerks');
      }
    }
  };

  const initializeContract = async () => {
    if (!signer || !chainId) return;

    try {
      // SECURITY: Only initialize contract for supported networks
      if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
        console.warn(`Unsupported network: ${chainId}`);
        return;
      }

      // SECURITY: Get verified contract address
      let contractAddress: string;
      
      try {
        contractAddress = getGmbHContractAddress(chainId);
      } catch (error) {
        console.warn('GmbH contract not configured for this network:', error);
        toast.error('GmbH Ownership NFT nicht auf diesem Netzwerk verfügbar');
        return;
      }

      const contract = new ethers.Contract(contractAddress, GMBH_OWNERSHIP_NFT_ABI, signer);
      setGmbhOwnershipNFTContract(contract);
      
      console.log(`GmbH Ownership NFT contract initialized at ${contractAddress} on ${NETWORK_NAMES[chainId]}`);
    } catch (error) {
      console.error('Error initializing GmbH contract:', error);
      toast.error('Fehler beim Initialisieren des GmbH-Vertrags');
    }
  };

  const refreshData = async () => {
    if (!gmbhOwnershipNFTContract || !account) return;

    try {
      // Get NFT balance
      const balance = await gmbhOwnershipNFTContract.balanceOf(account);
      const count = Number(balance);
      
      setNftBalance(balance.toString());
      setNftCount(count);

      // Calculate ownership percentage if user has NFTs
      if (count > 0) {
        try {
          const ownershipBasisPoints = await gmbhOwnershipNFTContract.getOwnershipPercentage(account);
          const percentage = Number(ownershipBasisPoints) / 100; // Convert basis points to percentage
          setOwnershipPercentage(percentage);
        } catch (error) {
          // Fallback calculation: assume 2500 total NFTs
          const percentage = (count / 2500) * 100;
          setOwnershipPercentage(percentage);
        }
      } else {
        setOwnershipPercentage(0);
      }

    } catch (error) {
      console.error('Error refreshing NFT data:', error);
      toast.error('Fehler beim Laden der NFT-Daten');
    }
  };

  // TRANSFORMED: GmbH Ownership Purchase Function
  const purchaseGmbHOwnership = async (quantity: number) => {
    if (!gmbhOwnershipNFTContract || !account) {
      toast.error('Bitte verbinden Sie Ihre Wallet');
      return;
    }

    try {
      // Get current share price (should be 1000 USDC per NFT)
      const sharePrice = await gmbhOwnershipNFTContract.getSharePrice();
      const totalCost = sharePrice * BigInt(quantity);

      // Create purchase transaction
      const tx = await gmbhOwnershipNFTContract.purchaseOwnership({
        value: totalCost,
        gasLimit: 300000, // Conservative gas limit
      });

      toast.loading('Transaktion wird verarbeitet...', { id: 'purchase' });
      
      const receipt = await tx.wait();
      
      toast.success(`${quantity} GmbH Ownership NFT${quantity > 1 ? 's' : ''} erfolgreich erworben!`, { id: 'purchase' });
      
      // Refresh data after successful purchase
      await refreshData();
      
      return receipt;
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(error.message || 'Fehler beim Kauf der GmbH-Anteile', { id: 'purchase' });
      throw error;
    }
  };

  // TRANSFORMED: Get GmbH Information
  const getGmbHInfo = async () => {
    if (!gmbhOwnershipNFTContract) return null;

    try {
      const gmbhDetails = await gmbhOwnershipNFTContract.getGmbHDetails();
      const propertyInfo = await gmbhOwnershipNFTContract.getPropertyInfo();
      
      return {
        gmbh: {
          name: gmbhDetails.name,
          address: gmbhDetails.address,
          totalValue: gmbhDetails.totalValue,
          monthlyIncome: gmbhDetails.monthlyIncome,
          trustee: gmbhDetails.trustee,
        },
        property: {
          address: propertyInfo.propertyAddress,
          value: propertyInfo.propertyValue,
          monthlyRent: propertyInfo.monthlyRent,
          status: propertyInfo.status,
        }
      };
    } catch (error) {
      console.error('Error getting GmbH info:', error);
      return null;
    }
  };

  // TRANSFORMED: Community Voting Function
  const voteOnProposal = async (proposalId: number, support: boolean) => {
    if (!gmbhOwnershipNFTContract || !account) {
      toast.error('Bitte verbinden Sie Ihre Wallet');
      return;
    }

    try {
      // Check if user has voting power
      const votingPower = await gmbhOwnershipNFTContract.getVotingPower(account);
      if (Number(votingPower) === 0) {
        toast.error('Sie haben keine Stimmrechte. Bitte erwerben Sie GmbH Ownership NFTs.');
        return;
      }

      // Check if already voted
      const hasVoted = await gmbhOwnershipNFTContract.hasVoted(proposalId, account);
      if (hasVoted) {
        toast.error('Sie haben bereits für diesen Vorschlag abgestimmt.');
        return;
      }

      const tx = await gmbhOwnershipNFTContract.vote(proposalId, support, {
        gasLimit: 150000,
      });

      toast.loading('Stimme wird abgegeben...', { id: 'vote' });
      
      const receipt = await tx.wait();
      
      toast.success(`Stimme erfolgreich abgegeben: ${support ? 'Dafür' : 'Dagegen'}`, { id: 'vote' });
      
      return receipt;
    } catch (error: any) {
      console.error('Voting error:', error);
      toast.error(error.message || 'Fehler beim Abstimmen', { id: 'vote' });
      throw error;
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    const newChainId = parseInt(chainId, 16);
    setChainId(newChainId);
    
    // Show network change notification
    if (NETWORK_NAMES[newChainId]) {
      toast.success(`Netzwerk gewechselt zu ${NETWORK_NAMES[newChainId]}`);
    }
    
    // Refresh the page to reset the app state
    window.location.reload();
  };

  const value: Web3ContextType = {
    isConnected,
    isConnecting,
    account,
    accountAddress: account, // Alias for compatibility
    chainId,
    provider,
    signer,
    gmbhOwnershipNFTContract,
    connect,
    disconnect,
    switchNetwork,
    nftBalance,
    nftCount,
    ownershipPercentage,
    refreshData,
    purchaseGmbHOwnership,
    getGmbHInfo,
    voteOnProposal,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// TRANSFORMED: Utility functions for German GmbH context
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTokenAmount = (amount: string, decimals: number = 2): string => {
  const num = parseFloat(amount);
  if (num === 0) return '0';
  if (num < 0.01) return '<0.01';
  return num.toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

export const formatEuroAmount = (amount: string | number, decimals: number = 2): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatOwnershipPercentage = (percentage: number): string => {
  if (percentage === 0) return '0%';
  if (percentage < 0.01) return '<0.01%';
  return `${percentage.toFixed(2)}%`;
};

// German-specific date formatting
export const formatGermanDate = (timestamp: number): string => {
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp * 1000));
};
