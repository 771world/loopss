import { Fragment, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Contract } from '@ethersproject/contracts'
import { ethers, utils } from 'ethers';
import abi from "../contract/LoopssFactory.json"
import loopssAbi from "../contract/Loopss.json"
import { useCall, useContractFunction, useEthers } from '@usedapp/core';
import { notification } from './Notiofication';

interface IAppProps {
    showModal: boolean
    changeInfoModal: () => void;
    eventId: number
    amount: string
}

const loopssFactoryInterface = new utils.Interface(abi)
const loopssFactoryContractAddress = '0x936Dce0805503f071D1AFFd2F6a66473CFaC081B'
const contract = new Contract(loopssFactoryContractAddress, loopssFactoryInterface)

const loopssInterface = new utils.Interface(loopssAbi)
const loopssContractAddress = '0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2'
const loopssContract = new Contract(loopssContractAddress, loopssInterface)

export default function DepositModal(props: IAppProps) {

    const { account } = useEthers();

    const { send: join } = useContractFunction(contract, 'joinEvent', { transactionName: 'Join Event', gasLimitBufferPercentage: 10 })

    const useCheckAllowance = () => {
        // 检查是否授权了max自己的Loopss给EventFactory
        const { value, error } = useCall({
            contract: new Contract(loopssContractAddress, loopssInterface),
            method: 'allowance',
            args: [account, account, loopssFactoryContractAddress]
        }) ?? {}
        if (error) {
            console.error(error.message)
            return 0
        }
        return value?.[0]
    }

    const allowance = useCheckAllowance();

    const { state, send: approve } = useContractFunction(loopssContract, 'approve', { transactionName: 'approve' })

    const joinEvent = async () => {

        if (allowance !== undefined && allowance._hex === '0x00') {
            // approve max loopss to event factory
            await approve(account, loopssFactoryContractAddress, ethers.constants.MaxUint256).catch((err) => {
                console.log(err)
                notification("Approve Failed!");
            })
        }

        join(ethers.BigNumber.from(props.eventId)).then((tx) => {
            if (tx) {
                notification("Join Event Successfully!", "top-center", 1);
            }
        }).catch((err) => {
            console.log(err)
            notification("Join Event Failed!");
        })

    }

    useEffect(() => {
        console.log(state);
    }, [state])

    return (
        <Transition.Root show={props.showModal} as={Fragment}>
            <Dialog as="div" className="fixed z-30 inset-0 overflow-y-auto" onClose={props.changeInfoModal}>
                <div className="flex sm:items-end items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 mask transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="relative inline-block align-bottom  bg-conmon border-solid border-2 border-info-modal rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
                            <div className="sm:flex sm:items-center">
                                <div className="flex-1 mt-3 sm:mt-0 sm:ml-4">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-left">
                                        Deposit Loopss to SignUp
                                    </Dialog.Title>
                                    <div className="mt-4">

                                        <div className="relative mt-1 rounded-md shadow-sm flex-col space-y-4">

                                            <section>
                                                <div className='flex items-center justify-between space-x-2'>
                                                    {/* <div className='flex w-full'>
                                                        <input ref={amoutRef} type="text" name="deposit" className="flex-1 rounded-md border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 text-xs placeholder:text-xs sm:text-sm sm:placeholder:text-sm" placeholder={`${props.amount} (At Least)`} />
                                                    </div> */}
                                                    <div className='flex-1'>
                                                        <button className='flex items-center justify-center border border-solid border-black  rounded-md px-4 py-2' onClick={joinEvent}>
                                                            Deposit {props.amount} Loopss
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <span className='underline cursor-pointer'>How to get your Loopss?</span>
                                            </section>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
