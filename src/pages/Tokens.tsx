import { DocumentDuplicateIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useContractFunction, useEthers, useTokenBalance } from "@usedapp/core";
import copy from "copy-to-clipboard";
import { ethers, utils } from "ethers";
import { useRef } from "react";
import { card, spring } from "../asserts";
import Ens from "../components/Ens";
import { notification } from "../components/Notiofication";
import Textarea from "../components/Textarea";
import { CONTRACT_ADDRESS } from "../constants/config";
import abi from "../contract/memo.json"
import { handleAddToken } from "../utils/web3utils";
import { Contract } from '@ethersproject/contracts'



interface IAppProps {
    provider: ethers.providers.Web3Provider
}

const memoInterface = new utils.Interface(abi)
const memoContractAddress = '0x8040444c64009710E3a1b8F3B432aeb9f0d26a8F'
const contract = new Contract(memoContractAddress, memoInterface)


export default function Tokens(props: IAppProps) {

    const { account } = useEthers();

    const stakingBalance = useTokenBalance(CONTRACT_ADDRESS, account)

    const addressRef = useRef<HTMLInputElement>(null);

    const amountRef = useRef<HTMLInputElement>(null);

    const textareaRef = useRef<any>(null);

    const { send } = useContractFunction(contract, 'sendMemo', { transactionName: 'Send Memo' })

    const sendToken = async () => {

        const receiver = addressRef.current?.value;
        const amount = amountRef.current!.value;
        const memo = textareaRef.current.pushText();

        const amountInWei = utils.parseEther(amount);
        if (receiver && amountInWei && memo) {
            const tx = await send(receiver, amountInWei, memo).catch((error: any) => {
                console.log(error);
                notification("Send failed")
            })
            if (tx) {
                notification("Send successfully", "top-center", 1)
            }
        }
    }


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
                <button className="absolute px-4 py-1 text-sm right-1/10 bottom-4 border-1 border-solid border-black rounded-md" onClick={() => handleAddToken(account)}>Add Loopss To Wallet</button>
            </section>

            <section className="w-full relative rounded-lg border-1 border-solid border-black mt-4 flex-col space-y-4">

                <div className="mx-3 my-5 space-y-4">

                    <h2>Send Looopss</h2>

                    <section className="relative">
                        <input
                            type="text"
                            name="Address"
                            className="block w-full rounded-md bg-gray-200 border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Address"
                            ref={addressRef}
                        />
                        <div className="absolute flex items-center inset-y-0 right-4">
                            <XMarkIcon className="md:w-5 md:h-5 w-4 h-4 object-contain cursor-pointer" onClick={() => addressRef.current ? addressRef.current.value = "" : ""} />
                            <DocumentDuplicateIcon className="md:w-5 md:h-5 w-4 h-4 object-contain cursor-pointer" onClick={
                                () => {
                                    copy(addressRef.current ? addressRef.current.value : "")
                                    notification("Copy successfully", "top-center", 1)
                                }
                            } />
                        </div>
                    </section>

                    <section className='relative'>
                        <input
                            type="text"
                            name="Amount"
                            className="block w-full rounded-md bg-gray-200 border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Amount"
                            ref={amountRef}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            {stakingBalance ? (+ethers.utils.formatUnits(stakingBalance.toString())).toFixed(3).toString() : 0}
                        </div>
                    </section>


                    <section>
                        <Textarea onRef={textareaRef} label='Memo (option)' description="500" />
                    </section>

                    <section className="mt-5 sm:mt-4 sm:flex sm:justify-center">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-solid border-black shadow-sm px-[10%] py-2 text-base font-medium text-baseColor focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => {
                                if (account) {
                                    sendToken()
                                } else {
                                    notification("Please connect your wallet first")
                                }
                            }}
                        >
                            Send
                        </button>
                    </section>

                </div>

            </section>

        </div>
    );

}
