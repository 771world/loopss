import { DocumentDuplicateIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { useEthers, useTokenBalance } from "@usedapp/core";
import copy from "copy-to-clipboard";
import { ethers } from "ethers";
import Ens from "../components/Ens";
import { CONTRACT_ADDRESS } from "../constants/config";
import { notification } from "../components/Notiofication";
import detectEthereumProvider from '@metamask/detect-provider'
import Select from "../components/Select";
import EventEditor from "../components/EventEditor";
import { useEffect, useState } from "react";
import EventDetail from "../components/EventDetail";
import { getEventDetail, getEventList } from "../config/api";
import dayjs from "dayjs";
import { card, spring, tokenIcon } from "../asserts";

interface IAppProps {
    provider: ethers.providers.Web3Provider
}

interface IEvent {
    atAmount: number,
    deadline: number,
    name: string,
    id: number,
}

const params = [
    { id: 0, name: 'All' },
    { id: 1, name: 'Avilable Sign Up' },
    { id: 2, name: 'Stop Sign Up' }
]

let eventDetail: any = null;

export default function Events(props: IAppProps) {

    const { account } = useEthers();

    const stakingBalance = useTokenBalance(CONTRACT_ADDRESS, account)

    const [showInfoModal, setShowInfoModal] = useState(false);

    const [showDtailModal, setShowDtailModal] = useState(false);

    const [selected, setSelected] = useState(0);

    const [eventList, setEventList] = useState<IEvent[]>([])

    const [iAmIn, setIAmIn] = useState(false)

    const [iCreated, setICreated] = useState(false)

    const changeInfoModal = () => {
        setShowInfoModal(!showInfoModal);
    };

    const changeDetailModal = () => {
        setShowDtailModal(!showDtailModal);
    };

    const handleDetailModal = (id: number) => {
        // fetch data
        getEventDetail(id).then(res => {
            eventDetail = res;
            setShowDtailModal(!showDtailModal);
        }).catch(err => {
            console.log('err: ', err);
        })
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

    useEffect(() => {
        getEventList(selected, iCreated ? account : undefined, iAmIn ? account : undefined).then(res => {
            setEventList(res)
        })
    }, [selected, iAmIn, iCreated, account])


    return (
        <div>
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

            <section className="w-full relative mt-4 flex justify-center">
                <button className="border-1 border-solid border-black rounded-md py-1 px-2" onClick={() => {
                    if (account) {
                        changeInfoModal()
                    } else {
                        notification("Please connect your wallet first")
                    }
                }}>Create New Event
                </button>
            </section>

            <section className="w-full relative mt-4 flex flex-1 justify-between items-center">
                <Select params={params} onChange={
                    (value) => {
                        setSelected(value)
                    }
                }></Select>
                <fieldset className="flex space-x-5">
                    <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id="iAmIn"
                                aria-describedby="iAmIn-description"
                                name="iAmIn"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={iAmIn}
                                onChange={
                                    (e) => {
                                        setIAmIn(e.target.checked)
                                    }
                                }
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="iAmIn" className="font-medium text-gray-700">
                                I am in
                            </label>
                        </div>
                    </div>
                    <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id="iCreated"
                                aria-describedby="iCreated-description"
                                name="iCreated"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={iCreated}
                                onChange={
                                    (e) => {
                                        setICreated(e.target.checked)
                                    }
                                }
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="iCreated" className="font-medium text-gray-700">
                                I Created
                            </label>
                        </div>
                    </div>
                </fieldset>
            </section>

            <section className="w-full relative rounded-lg border-1 border-solid border-black mt-4 text-xs md:text-base">
                <div className="flex justify-between items-center text-center p-2">
                    <div className="w-1/5">Event Id</div>
                    <div className="w-1/5">Event Name</div>
                    <div className="w-1/5">SignUp End</div>
                    <div className="w-1/5">Amount</div>
                    <div className="w-1/5 flex justify-center">edit</div>
                </div>
                {
                    eventList.map((item: IEvent, index: number) => {
                        return (
                            <div className="flex justify-between items-center text-center p-2" key={index}>
                                <div className="w-1/5">{item.id}</div>
                                <div className="w-1/5">{item.name}</div>
                                <div className="w-1/5">{dayjs(new Date(item.deadline * 1000)).format('DD-MM-YYYY HH:mm')}</div>
                                <div className="w-1/5">{ethers.utils.formatEther(item.atAmount).toString()}</div>
                                <div className="cursor-pointer w-1/5 flex justify-center" onClick={() => {
                                    if (account) {
                                        handleDetailModal(item.id)
                                    } else {
                                        notification("Please connect your wallet first")
                                    }
                                }
                                }><Squares2X2Icon className="w-5 h-5" /></div>
                            </div>
                        )
                    })
                }
            </section>

            <EventEditor showModal={showInfoModal} changeInfoModal={changeInfoModal} />
            <EventDetail showModal={showDtailModal} changeInfoModal={changeDetailModal} data={eventDetail} />
        </div>
    );
}
