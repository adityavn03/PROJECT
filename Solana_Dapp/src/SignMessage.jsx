import { ed25519 } from '@noble/curves/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { useState } from 'react';

export const SignMessage = () => {
    const { publicKey, signMessage } = useWallet();
    const [message, setMessage] = useState("");
    const [signature, setSignature] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const sign = async () => {
        if (!publicKey) {
            setError("Connect your wallet first");
            return;
        }

        if (!signMessage) {
            setError("Wallet does not support message signing");
            return;
        }

        if (!message.trim()) {
            setError("Please enter a message to sign");
            return;
        }

        setLoading(true);
        setError("");
        setSignature("");

        try {
            const encodedMessage = new TextEncoder().encode(message);
            const messageSignature = await signMessage(encodedMessage);
            
            // Verify signature
            if (!ed25519.verify(messageSignature, encodedMessage, publicKey.toBytes())) {
                throw new Error("Message signature invalid!");
            }

            const signatureBase58 = bs58.encode(messageSignature);
            setSignature(signatureBase58);
        } catch (err) {
            setError(`Signing failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const copySignature = () => {
        navigator.clipboard.writeText(signature);
        // You could add a toast notification here
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Sign Message
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message to Sign
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message here..."
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                        disabled={loading}
                    />
                </div>

                <button
                    onClick={sign}
                    disabled={loading || !publicKey || !message.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Sign Message
                        </>
                    )}
                </button>

                {error && (
                    <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 p-3 rounded-md">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {signature && (
                    <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 p-4 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">
                                Signature Generated Successfully!
                            </h3>
                            <button
                                onClick={copySignature}
                                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
                                {signature}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};