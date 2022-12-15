import { useEthers, useTokenBalance } from "@usedapp/core";
import { useEffect, useImperativeHandle, useState } from "react";
import card from "../asserts/card.png";
import spring from "../asserts/spring.png"
import exchange from "../asserts/exchange.png"
import discord from "../asserts/discord.png"
import notion from "../asserts/notion.png"
import tokenIcon from "../asserts/icon.png"
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from "ethers";
import copy from "copy-to-clipboard";
import { notification } from "../components/Notiofication";
import { CONTRACT_ADDRESS } from "../constants/config";
import { getTrust } from "../config/api";
import EnsOffline from "../components/EnsOffline";
import Ens from "../components/Ens";

let initFlag = false;

interface IAppProps {
    handleConnect: () => void;
    onRef: any;
    provider: ethers.providers.Web3Provider
}

interface ITrust {
    fromAddress: string;
    toAddress: string;
    trustType: number;
    value: number;
    ens: string;
}

export default function Home(props: IAppProps) {

    const { account } = useEthers();

    const [dataType, setDataType] = useState(0);

    const [trustType, setTrustType] = useState(0);

    const [holdList, setHoldList] = useState<ITrust[]>([]);

    const [holderList, setHolderList] = useState<ITrust[]>([]);

    const stakingBalance = useTokenBalance(CONTRACT_ADDRESS, account)

    useImperativeHandle(props.onRef, () => {
        return {
            clearData: clearData,
        }
    })

    /**
     * @description:  connect wallet
     * @return {*}
     */
    const handleConnect = () => {
        props.handleConnect();
    }

    /**
     * @description: change data type
     * @param {number} type
     * @return {*}
     */
    const handleHold = async (type: number) => {
        setTrustType(type);
    }

    /**
     * @description: clear data
     * @return {*}
     */
    const clearData = () => {
        setDataType(0);
        setHoldList([]);
        setHolderList([]);
    }

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
    const handleAddToken = async () => {
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

    /**
     * @description: init trust data 
     * @return {*}
     */
    const initData = async () => {
        if (account) {
            getTrust(account, 0).then((res: ITrust[]) => {
                setHolderList(res)
            }).catch(err => {
                console.log(err);
            });
            getTrust(account, 1).then((res: ITrust[]) => {
                setHoldList(res)
            }).catch(err => {
                console.log(err);
            });
        }
    }


    useEffect(() => {
        if (account) {
            if (!initFlag) {
                initData();
                initFlag = true;
            }
            if (trustType === 0) {
                getTrust(account, 1).then(res => {
                    setHoldList(res)
                    if (res.length === 0) {
                        setDataType(2)
                    } else {
                        setDataType(1)
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
            if (trustType === 1) {
                getTrust(account, 0).then(res => {
                    setHolderList(res)
                    if (res.length === 0) {
                        setDataType(2)
                    } else {
                        setDataType(1)
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        } else {
            setDataType(0)
        }
    }, [account, trustType]);

    return (
        <>
            <section className="w-full relative rounded-lg mt-4">

                <div className="mx-auto w-[95%] h-[25vh] max-h-[25vh] bg-center bg-card bg-no-repeat object-contain relative rounded-lg hidden md:block">
                    <div className="absolute left-3 bottom-6 text-white text-xl font-bold">
                        <p>Loopss</p>
                        <p>Flow your influence by your own money</p>
                    </div>
                </div>

                <img className="w-full h-auto max-h-[50vh] object-contain md:hidden" src={card} alt="" />
                <div className="absolute left-3 bottom-6 text-white text-base md:text-xl font-bold md:hidden">
                    <p>Loopss</p>
                    <p>Flow your influence by your own money</p>
                </div>
            </section>

            <section className="w-full relative rounded-lg border-1 border-solid border-black mt-4">
                <div className="mx-3 my-5 flex space-x-2 md:space-x-4">
                    <div className="w-8 h-8">
                        <img className="object-contain" src={spring} alt="" />
                    </div>
                    <div className="flex flex-col justify-start items-start">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold">Loopss from you</span>
                            <div className="text-xs md:text-sm flex items-center">
                                {account ? (
                                    <>
                                        <Ens address={account} shortenAddress={false} provider={props.provider} />
                                        <DocumentDuplicateIcon className="ml-2 md:w-4 md:h-4 w-8 h-8 object-contain cursor-pointer" onClick={
                                            () => {
                                                copy(account)
                                                notification("Copy successfully", "top-center", 1)
                                            }
                                        } />
                                    </>
                                ) : ''}
                            </div>
                        </div>
                        <div className="flex flex-col mt-2">
                            <span className="text-xs font-bold">Amount</span>
                            <span className="text-sm">{stakingBalance ? (+ethers.utils.formatUnits(stakingBalance.toString())).toFixed(3).toString() : 0}</span>
                        </div>
                    </div>
                </div>
                <button className="absolute px-4 py-1 text-sm right-1/10 bottom-4 border-1 border-solid border-black rounded-md" onClick={handleAddToken}>Add Loopss To Wallet</button>
            </section>

            <section className="flex justify-center items-center mt-4">
                <div className={`flex justify-between items-center px-2 py-1 text-base cursor-pointer ${trustType === 0 ? 'border-1 rounded-md border-solid border-black' : ''} `} onClick={() => handleHold(0)}>
                    <span>You Hold</span>
                    <span>&nbsp;&nbsp;</span>
                    <span>{holdList.length}</span>
                </div>
                <div className="w-0.5 h-8 bg-black mx-4"></div>
                <div className={`flex justify-between items-center px-2 py-1 text-base cursor-pointer ${trustType === 1 ? 'border-1 rounded-md border-solid border-black' : ''} `} onClick={() => handleHold(1)}>
                    <span>{holderList.length}</span>
                    <span>&nbsp;&nbsp;</span>
                    <span>Hold You</span>
                </div>
            </section>

            <section className="w-full relative rounded-lg border-1 border-solid border-black mt-4">
                {
                    dataType === 0 &&
                    (
                        <>
                            <div className="mx-3 my-5 flex justify-between space-x-4 text-sm font-bold">
                                <span>Loopss Address Token</span>
                                <span>Amount</span>
                            </div>
                            <div className="flex justify-center items-center">
                                <span className="text-sm py-8 cursor-pointer" onClick={handleConnect}>Connect Wallet to check ↗️</span>
                            </div>
                        </>
                    )
                }
                {
                    dataType === 1 &&
                    (
                        <div className="mx-3 my-5 text-xs md:text-sm">
                            <div className="flex justify-between space-x-8 font-bold">
                                <span>Loopss Address Token</span>
                                <span>Amount</span>
                            </div>
                            {
                                trustType === 0 &&
                                (
                                    holdList.map((trust: ITrust, index) => {
                                        return (
                                            <div className="flex justify-between md:space-x-8" key={index}>
                                                <div className="flex items-center h-8">
                                                    {trust.trustType === 1 && <img className="w-4 h-4 object-contain mr-2" src={exchange} alt="" />}
                                                    <EnsOffline ens={trust.ens} address={trust.fromAddress} shortenAddress={true} />
                                                </div>
                                                <span>{(+ethers.utils.formatEther(trust.value)).toFixed(3)}</span>
                                            </div>
                                        )
                                    }
                                    )
                                )
                            }
                            {
                                trustType === 1 &&
                                (
                                    holderList.map((trust: ITrust, index) => {
                                        return (
                                            <div className="flex justify-between md:space-x-8" key={index}>
                                                <div className="flex items-center h-8">
                                                    {trust.trustType === 1 && <img className="w-4 h-4 object-contain mr-2" src={exchange} alt="" />}
                                                    <EnsOffline ens={trust.ens} address={trust.toAddress} shortenAddress={true} />
                                                </div>
                                                <span>{(+ethers.utils.formatEther(trust.value)).toFixed(3)}</span>
                                            </div>
                                        )
                                    }
                                    )
                                )
                            }
                        </div>
                    )
                }
                {
                    dataType === 2 &&
                    (
                        <>
                            <div className="mx-3 my-5 flex justify-between space-x-4 text-sm font-bold">
                                <span>Loopss Address Token</span>
                                <span>Amount</span>
                            </div>
                            <div className="flex justify-center items-center">
                                <span className="text-sm py-8">You don't have any Loopss</span>
                            </div>
                        </>
                    )
                }

            </section>

            <section className="mt-4">
                <div className="flex justify-center items-center p-2 text-2xl font-bold">
                    <span>Q&A</span>
                </div>
                <div className="flex flex-col space-y-8 justify-start items-start text-sm">
                    <div>
                        <p className="font-bold">What is Loopss ?</p>
                        <p>{`> Loopss is Social Money generator for everyone, build for social graph`}</p>
                        <p>{`> Loopss is a gift for you to flow your influence`}</p>
                    </div>
                    <div>
                        <p className="font-bold">How to start generating your own Loopss ?</p>
                        <p>{`> At least 3 another EOA transfer 1 Loopss.me to your EOA`}</p>
                    </div>
                    <div>
                        <p className="font-bold">How to transfer Loopss.me if i have't generating your own Loopss AT ?</p>
                        <p>{`> Add Loopss.me token to your wallet ,then you can transfer it`}</p>
                        <p onClick={() => {
                            copy("0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2")
                            notification("Copy successfully", "bottom-center", 1)
                        }} className="flex items-center cursor-pointer">{`> Loopss.me address: 0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2`}<DocumentDuplicateIcon className="ml-2 md:w-4 md:h-4 w-8 h-8 object-contain" /></p>
                    </div>

                </div>
            </section>

            <section className="mt-4 mb-4">
                <div className="flex justify-center items-center p-2 text-2xl font-bold space-x-4">
                    <img onClick={() => {
                        window.open('https://discord.gg/9bt7uqGuJS', '_blank')
                    }} src={discord} alt="" className="w-8 h-8 object-contain cursor-pointer" />
                    <img onClick={() => {
                        window.open('https://www.notion.so/socialmoney/Loopss-15a3634708754d729b345f386d80dc9d', '_blank')
                    }} src={notion} alt="" className="w-8 h-8 object-contain cursor-pointer" />
                </div>
            </section>
        </>
    );
}
