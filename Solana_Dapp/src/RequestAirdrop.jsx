import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from 'react';

export const RequestAirdrop = () => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const requestAirdrop = async () => {
        if (!publicKey) {
            alert('Please connect your wallet first');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (parseFloat(amount) > 5) {
            alert('Maximum 5 SOL per request');
            return;
        }

        setLoading(true);
        try {
            const signature = await connection.requestAirdrop(publicKey, parseFloat(amount) * LAMPORTS_PER_SOL);
            await connection.confirmTransaction(signature);
            alert(`Successfully requested ${amount} SOL airdrop!\n\nTransaction: ${signature}`);
            setAmount('');
        } catch (error) {
            console.error("Airdrop failed:", error);
            alert('Airdrop failed. Please try again or check if you have reached the rate limit.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-8 shadow-sm border">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">⚡</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Request SOL Airdrop</h2>
                <p className="text-gray-600">Get free SOL tokens for testing on devnet</p>
            </div>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount (SOL)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount (max 5 SOL)"
                            step="0.1"
                            min="0"
                            max="5"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                        />
                        <div className="absolute right-3 top-3 text-gray-400 font-medium">
                            SOL
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-800 mb-2">Airdrop Information</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                        <li>• Maximum 5 SOL per request</li>
                        <li>• Only available on devnet network</li>
                        <li>• Rate limited to prevent abuse</li>
                        <li>• Tokens are for testing purposes only</li>
                    </ul>
                </div>

                <button 
                    onClick={requestAirdrop}
                    disabled={!publicKey || loading || !amount}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Requesting Airdrop...
                        </div>
                    ) : (
                        '💰 Request Airdrop'
                    )}
                </button>

                {!publicKey && (
                    <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">
                            ⚠️ Please connect your wallet to request an airdrop
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};