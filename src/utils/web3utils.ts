import { notification } from "../components/Notiofication"
import detectEthereumProvider from '@metamask/detect-provider'
import { tokenIcon } from "../asserts";


/**
 * @description: detect wallet 
 * @param {any} provider provider
 * @return {*}
 */
const delectWallet = (provider: any): boolean => {
    if (provider) {
        if (provider !== window.ethereum) {
            notification("Do you have multiple wallets installed?");
            return false;
        } else {
            // 优先级更高
            if (provider.isMathWallet) {
                console.log('Ready to connect to MathWallet.');
                return true;
            }
            if (provider.isMetaMask) {
                console.log('Ready to connect to MetaMask.');
                return true;
            }
            notification("Please install MetaMask!");
            return false;
        }
    } else {
        notification("Please install MetaMask!");
        return false;
    }
}

/**
 * @description: add token 
 * @return {*}
 */
const handleAddToken = async (account: string | undefined) => {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        notification("Please add 0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2 to your mobile wallet", 'top-center', 3)
        return
    }
    const provider: any = await detectEthereumProvider()
    if (delectWallet(provider)) {
        if (account) {
            provider.sendAsync({
                method: 'metamask_watchAsset',
                params: {
                    "type": "ERC20",
                    "options": {
                        "address": "0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2",
                        "symbol": "Loopss.me",
                        "decimals": 18,
                        "image": tokenIcon,
                    },
                },
                id: Math.round(Math.random() * 100000),
            }, (err: any, added: any) => {
                if (err || 'error' in added) {
                    notification("There was a problem adding the token.")
                    console.error(err);
                    return
                }
                notification("Token added!", "1")
            })
        } else {
            notification("Please connect your wallet first")
        }
    }
}

export { handleAddToken }
