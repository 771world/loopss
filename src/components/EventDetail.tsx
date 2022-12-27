import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import DepositModal from './DepositModal';
import { ethers } from 'ethers';
import dayjs from "dayjs";


interface IEventDetail {
    atAmount: string,
    deadline: number,
    ens: string,
    name: string,
    about: string,
    creator: string,
    eventContractAddress: string,
    participantAddressList: string[],
    id: number,
}


interface IAppProps {
    showModal: boolean
    changeInfoModal: () => void;
    data: IEventDetail
}

export default function EventDetail(props: IAppProps) {

    const [showInfoModal, setShowInfoModal] = useState(false);

    const changeInfoModal = () => {
        setShowInfoModal(!showInfoModal);
    };

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
                                    <div className='flex items-center justify-between'>
                                        <span className='font-semibold'>{props.data ? props.data.name : ''}</span>
                                        <div className='flex items-center space-x-2'>
                                            <ClipboardDocumentCheckIcon className='h-4 w-4 cursor-pointer' />
                                            <span># 1</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">

                                        <div className="relative mt-1 rounded-md shadow-sm flex-col space-y-4">

                                            <section>
                                                <p className='break-words'>
                                                    {props.data ? props.data.about : ''}
                                                </p>
                                            </section>

                                            <section>
                                                <div className='flex flex-col space-y-2'>
                                                    <span className='text-baseColor'>
                                                        Host: {props.data ? (props.data.ens ? props.data.ens : props.data.creator) : ''}
                                                    </span>
                                                    {
                                                        props.data && props.data.participantAddressList ? props.data.participantAddressList.map((item, index) => {
                                                            return (
                                                                <span className='text-baseColor text-sm md:text-base' key={index}>
                                                                    Guest: {item}
                                                                </span>
                                                            )
                                                        })
                                                            :
                                                            null
                                                    }
                                                </div>
                                            </section>

                                            <section>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex flex-col'>
                                                        <span>SignUp End</span>
                                                        <span>{props.data ? dayjs(new Date(props.data.deadline * 1000)).format('DD-MM-YYYY HH:mm') : null}</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span>Mint Start</span>
                                                        <span>{props.data ? dayjs(new Date(props.data.deadline * 1000)).format('DD-MM-YYYY HH:mm') : null}</span>
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <div className='flex items-center justify-between space-x-2'>
                                                    <div className='flex flex-col'>
                                                        <span className='text-baseColor'>Deposit {props.data ? ethers.utils.formatEther(props.data.atAmount).toString() : '20'} Loopss to SignUp</span>
                                                        <span className='underline'>How to get your Loopss?</span>
                                                    </div>
                                                    <div>
                                                        <button className='bg-signUp flex items-center justify-center rounded-md px-4 py-2' onClick={changeInfoModal}>
                                                            SignUp ({props.data && props.data.participantAddressList ? props.data.participantAddressList.length : 0})
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <div className='flex items-center justify-between space-x-2'>
                                                    <span className='text-baseColor'>Event created by : {props.data ? (props.data.ens ? props.data.ens : props.data.creator) : ''}</span>
                                                    {/* <span className='text-baseColor underline cursor-pointer'>Edit</span> */}
                                                </div>
                                            </section>

                                            <DepositModal showModal={showInfoModal} changeInfoModal={changeInfoModal} eventId={props.data ? props.data.id : -1} amount={props.data ? ethers.utils.formatEther(props.data.atAmount).toString() : '20'} />

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
