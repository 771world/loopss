import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import WalletButton from './components/WalletButton';
import detectEthereumProvider from '@metamask/detect-provider'
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import card from "./asserts/card.png"
import spring from "./asserts/spring.png"
import exchange from "./asserts/exchange.png"
import discord from "./asserts/discord.png"
import notion from "./asserts/notion.png"
import tokenIcon from "./asserts/icon.png"
import { notification } from "./components/Notiofication"
import { useTokenBalance, useEthers } from "@usedapp/core";
import { CONTRACT_ADDRESS } from "./constants/config";
import copy from "copy-to-clipboard"
import { ethers } from 'ethers'
import { getTrust } from "./config/api";
import { useRef, useEffect, useState } from "react";
import Ens from "./components/Ens";


let initFlag = false;

const provider: any = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/rbeUGLWOu1aehsuKbaNw_yhVKFXXdwbp');

interface ITrust {
  fromAddress: string;
  toAddress: string;
  trustType: number;
  value: number;
  ens: string;
}

function App() {

  const { account } = useEthers();

  const [dataType, setDataType] = useState(0);

  const [trustType, setTrustType] = useState(0);

  const [holdList, setHoldList] = useState<ITrust[]>([]);

  const [holderList, setHolderList] = useState<ITrust[]>([]);

  const wallet = useRef<HTMLDivElement>(null);

  const stakingBalance = useTokenBalance(CONTRACT_ADDRESS, account)

  const handleConnect = () => {
    // @ts-ignore
    wallet.current!.handleConnect();
  }

  const handleHold = async (type: number) => {
    setTrustType(type);
  }

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

  const clearData = () => {
    setDataType(0);
    setHoldList([]);
    setHolderList([]);
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
      <header className="flex items-center justify-center header py-1 md:text-base text-xs">
        <span className="hidden md:block">Token Address :0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2 (BSC)</span>
        <span className="md:hidden">0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2 (BSC)</span>
        <span onClick={() => {
          copy("0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2")
          notification("Copy successfully", "top-center", 1)
        }} className="pl-2 cursor-pointer">Copy</span>
      </header>
      <div className="container mx-auto px-4">
        <section className='flex justify-between items-center mt-4'>
          <div className="flex justify-center items-center space-x-2 md:space-x-4">

            <div className="flex flex-col items-start justify-center md:hidden">
              <span className="text-xl font-bold">
                Loopss
              </span>
              <span className='p-0.25 border-1 border-solid border-black rounded-lg text-xs'>
                DEMO
              </span>
            </div>

            <span className="text-xl font-bold hidden md:block">
              Loopss
            </span>
            <span className='p-0.25 border-1 border-solid border-black rounded-lg text-xs hidden md:block'>
              DEMO
            </span>
            <span className=' border-b-1 border-solid border-gray-300 underline'>Dashboard</span>
            <span>Graph</span>
            <span>Events</span>

          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Cog6ToothIcon className="w-6 h-6 md:w-8 md:h-8" />
            <WalletButton onRef={wallet} clearData={clearData} provider={provider} />
          </div>
        </section>

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
                {/* <span className="text-xs md:text-sm">{account ? account : ''}</span> */}
                <div className="text-xs md:text-sm flex items-center">
                  {account ? (
                    <>
                      {/* <span>{account}</span> */}
                      <Ens address={account} shortenAddress={false} provider={provider} />
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
                          <div className="flex items-center">
                            {trust.trustType === 1 && <img className="w-4 h-4 object-contain mr-2" src={exchange} alt="" />}
                            {/* <span className="underline cursor-pointer hidden md:block" onClick={() => {
                              window.open(`https://bscscan.com/token/0xb1ac1c0f2e7e467f10df232e82cc65e2ca4cb0d2?a=${trust.fromAddress}`, '_blank')
                            }}></span>
                            <span className="underline cursor-pointer md:hidden" onClick={() => {
                              window.open(`https://bscscan.com/token/0xb1ac1c0f2e7e467f10df232e82cc65e2ca4cb0d2?a=${trust.fromAddress}`, '_blank')
                            }}>{trust.fromAddress!.replace(trust.fromAddress!.slice(6, 38), '...')}</span> */}
                            <Ens address={trust.fromAddress} shortenAddress={true} provider={provider} />
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
                          <div className="flex items-center">
                            {trust.trustType === 1 && <img className="w-4 h-4 object-contain mr-2" src={exchange} alt="" />}
                            {/* 
                            <span className="underline cursor-pointer hidden md:block" onClick={() => {
                              window.open(`https://bscscan.com/token/0xb1ac1c0f2e7e467f10df232e82cc65e2ca4cb0d2?a=${trust.toAddress}`, '_blank')
                            }}>{trust.toAddress}</span>
                            <span className="underline cursor-pointer md:hidden" onClick={() => {
                              window.open(`https://bscscan.com/token/0xb1ac1c0f2e7e467f10df232e82cc65e2ca4cb0d2?a=${trust.toAddress}`, '_blank')
                            }}>{trust.toAddress!.replace(trust.toAddress!.slice(6, 38), '...')}</span> */}
                            <Ens address={trust.toAddress} shortenAddress={true} provider={provider} />
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
            }} src={discord} alt="" className="w-8 h-8 object-contain" />
            <img onClick={() => {
              window.open('https://www.notion.so/socialmoney/Loopss-15a3634708754d729b345f386d80dc9d', '_blank')
            }} src={notion} alt="" className="w-8 h-8 object-contain" />
          </div>
        </section>

      </div>
    </>

  );
}

export default App;
