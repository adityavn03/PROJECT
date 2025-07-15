import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState, useEffect } from 'react';

export const ShowBalance = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    const getBalance = async () => {
        if (wallet.publicKey) {
            setLoading(true);
            try {
                const balance = await connection.getBalance(wallet.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            } catch (error) {
                console.error("Error fetching balance:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        getBalance();
    }, [wallet.publicKey, connection]);

    if (!wallet.connected) {
        return (
            <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">💳</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
                <p className="text-gray-600 mb-4">
                    Please connect your wallet to view your balance
                </p>
                <button 
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Refresh Page
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-8 shadow-sm border">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">₿</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Balance</h2>
                <p className="text-gray-600">Your current SOL balance</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100">
                <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                {balance.toFixed(6)} SOL
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 text-sm">
                        {wallet.publicKey ? 
                            `${wallet.publicKey.toString().slice(0, 8)}...${wallet.publicKey.toString().slice(-8)}` : 
                            'No wallet connected'
                        }
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <button 
                    onClick={getBalance}
                    disabled={!wallet.publicKey || loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Refreshing...
                        </div>
                    ) : (
                        '🔄 Refresh Balance'
                    )}
                </button>
                
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium mb-1">Balance Information:</p>
                    <p>• Real-time balance from Solana network</p>
                    <p>• Automatically updates on wallet connection</p>
                    <p>• Includes all SOL tokens in your wallet</p>
                </div>
            </div>
        </div>
    );
};