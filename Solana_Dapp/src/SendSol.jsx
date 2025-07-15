import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";

export const SendSol = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState("");
    const [receiver, setReceiver] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const validatePublicKey = (key) => {
        try {
            new PublicKey(key);
            return true;
        } catch {
            return false;
        }
    };

    const sendSol = async () => {
        if (!wallet.publicKey) {
            setMessage("Please connect your wallet first");
            return;
        }

        if (!receiver.trim()) {
            setMessage("Please enter a receiver address");
            return;
        }

        if (!validatePublicKey(receiver)) {
            setMessage("Invalid receiver address");
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setMessage("Please enter a valid amount");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const transaction = new Transaction();
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(receiver),
                    lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
                })
            );

            const signature = await wallet.sendTransaction(transaction, connection);
            setMessage(`Transaction successful! Signature: ${signature}`);
            setAmount("");
            setReceiver("");
        } catch (error) {
            setMessage(`Transaction failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send SOL
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Receiver Address
                    </label>
                    <input
                        type="text"
                        value={receiver}
                        onChange={(e) => setReceiver(e.target.value)}
                        placeholder="Enter recipient's public key"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Amount (SOL)
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        step="0.0001"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        disabled={loading}
                    />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-3 rounded-md">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-sm text-yellow-800 dark:text-yellow-200">
                            Double-check the recipient address before sending
                        </span>
                    </div>
                </div>

                <button
                    onClick={sendSol}
                    disabled={loading || !wallet.publicKey || !receiver.trim() || !amount}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send SOL
                        </>
                    )}
                </button>

                {message && (
                    <div className={`p-3 rounded-md ${
                        message.includes('successful') 
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700' 
                            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
                    }`}>
                        <p className="text-sm">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};