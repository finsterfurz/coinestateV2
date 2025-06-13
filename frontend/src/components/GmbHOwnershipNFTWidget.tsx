import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface PurchaseState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const GmbHOwnershipNFTWidget: React.FC = () => {
  const { isConnected, connect, nftCount, accountAddress } = useWeb3();
  const [quantity, setQuantity] = useState<number>(1);
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    loading: false,
    error: null,
    success: false,
  });

  // Calculate total cost in EUR and USD equivalent
  const pricePerNFT = 1000; // €1,000 per NFT as per new architecture
  const totalCost = quantity * pricePerNFT;
  const ownershipPercentage = (quantity / 2500) * 100; // 2,500 total NFTs per property

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 100) { // Reasonable limits
      setQuantity(newQuantity);
    }
  };

  const handlePurchase = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    setPurchaseState({ loading: true, error: null, success: false });

    try {
      // TODO: Integrate with actual GmbHOwnershipNFT.sol contract
      // This would call the smart contract purchase function
      
      // Simulated purchase flow for development
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPurchaseState({ loading: false, error: null, success: true });
    } catch (error: any) {
      setPurchaseState({ 
        loading: false, 
        error: error.message || 'Purchase failed. Please try again.', 
        success: false 
      });
    }
  };

  const resetPurchaseState = () => {
    setPurchaseState({ loading: false, error: null, success: false });
  };

  // Legal compliance features for German law
  const complianceFeatures = [
    {
      icon: DocumentCheckIcon,
      title: 'Rechtssichere Struktur',
      description: 'Deutsche GmbH mit lizenziertem Treuhänder',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Kein Finanzprodukt',
      description: 'Technischer Informationsservice, keine Kapitalanlage',
    },
    {
      icon: UserGroupIcon,
      title: 'Community-Voting',
      description: 'Treuhänder kann Votings vertraglich berücksichtigen',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section with Legal Messaging */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Community-NFT für Informationszugang
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Erwerben Sie digitalen Zugang zu deutschen Immobilienprojekt-Informationen. 
          Kein Finanzprodukt, keine Kapitalanlage - reine Informationsdienstleistung.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Purchase Widget */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-coinestate-card">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Community-NFT Zugang
            </h3>
            <p className="text-gray-600">
              €1.000 pro NFT = Informationszugang zu deutschem GmbH-Immobilienprojekt
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anzahl NFTs
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium">−</span>
              </button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-primary-600">{quantity}</span>
              </div>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 100}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium">+</span>
              </button>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Preis pro NFT:</span>
              <span className="font-semibold">€{pricePerNFT.toLocaleString('de-DE')}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Anzahl:</span>
              <span className="font-semibold">{quantity}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Informationszugang:</span>
              <span className="text-sm text-accent-600">{ownershipPercentage.toFixed(2)}% der Community</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Gesamt:</span>
              <span className="text-lg font-bold text-primary-600">
                €{totalCost.toLocaleString('de-DE')}
              </span>
            </div>
          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={purchaseState.loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              purchaseState.loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 hover:scale-105 shadow-coinestate-card hover:shadow-coinestate-hover'
            }`}
          >
            {purchaseState.loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verarbeitung...
              </span>
            ) : !isConnected ? (
              'Wallet verbinden'
            ) : (
              `${quantity} NFT${quantity > 1 ? 's' : ''} für €${totalCost.toLocaleString('de-DE')} erwerben`
            )}
          </button>

          {/* Error/Success Messages */}
          {purchaseState.error && (
            <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-error-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-error-700">{purchaseState.error}</p>
                  <button
                    onClick={resetPurchaseState}
                    className="mt-2 text-sm text-error-600 hover:text-error-500 underline"
                  >
                    Erneut versuchen
                  </button>
                </div>
              </div>
            </div>
          )}

          {purchaseState.success && (
            <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg">
              <div className="flex">
                <ShieldCheckIcon className="h-5 w-5 text-success-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-success-700">
                    Kauf erfolgreich! Ihre NFTs werden in Kürze in Ihrem Wallet angezeigt.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Current Holdings (if connected) */}
          {isConnected && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ihre aktuellen NFTs:</span>
                <span className="font-semibold text-primary-600">{nftCount}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-600">Community-Anteil:</span>
                <span className="text-sm text-accent-600">
                  {((nftCount / 2500) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Information & Compliance Section */}
        <div className="space-y-6">
          {/* Legal Compliance Features */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-coinestate-card">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Rechtssichere Struktur
            </h4>
            <div className="space-y-4">
              {complianceFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800">{feature.title}</h5>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Legal Disclaimers */}
          <div className="bg-warning-50 border border-warning-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="w-6 h-6 text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-warning-800 mb-2">
                  Wichtige rechtliche Hinweise
                </h4>
                <ul className="text-sm text-warning-700 space-y-1">
                  <li>• Kein Finanzprodukt oder Kapitalanlage</li>
                  <li>• Reine Informationsdienstleistung</li>
                  <li>• Keine Eigentumsrechte oder Ansprüche</li>
                  <li>• CoinEstate verwaltet kein Geld</li>
                  <li>• Freiwillige GmbH-Zahlungen ohne Garantie</li>
                  <li>• Treuhänder-Entscheidungen nicht rechtlich bindend</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-coinestate-card">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Immobilienprojekt Berlin
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Objektwert:</span>
                <span className="font-semibold">€2.500.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Community-NFTs:</span>
                <span className="font-semibold">2.500 Stück</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verwaltungsgebühr:</span>
                <span className="font-semibold">15% für CoinEstate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Treuhänder:</span>
                <span className="font-semibold text-success-600">Lizenziert</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
