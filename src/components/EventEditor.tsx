import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Textarea from './Textarea';
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import Select from './Select';
import 'dayjs/locale/en';
import { Contract } from '@ethersproject/contracts'
import { ethers, utils } from 'ethers';
import abi from "../contract/LoopssFactory.json"
import { useContractFunction } from '@usedapp/core';
import { notification } from './Notiofication';
import { DateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';


interface IAppProps {
    showModal: boolean
    changeInfoModal: () => void;
}

interface ICharactor {
    role: number,
    name: string,
    address: string,
}

const roles = [
    { id: 0, name: 'Host' },
    { id: 1, name: 'Guest' },
]

const dateFormat = 'YYYY-MM-DD HH:mm';

const loopssFactoryInterface = new utils.Interface(abi)
const loopssFactoryContractAddress = '0x936Dce0805503f071D1AFFd2F6a66473CFaC081B'
const contract = new Contract(loopssFactoryContractAddress, loopssFactoryInterface)

export default function EventEditor(props: IAppProps) {

    const titieRef = useRef<HTMLInputElement>(null);

    const mintRef = useRef<HTMLSpanElement>(null);

    const amountRef = useRef<HTMLInputElement>(null);

    const textareaRef = useRef<any>(null);

    const charactorRef = useRef<HTMLDivElement>(null);

    const [charactorInfo, setCharactorInfo] = useState<ICharactor[]>([]);

    const [checkIndex, setCheckIndex] = useState(0);

    const [value, setValue] = useState<Dayjs | null>(dayjs('2022-04-07 12:00', 'YYYY-MM-DD HH:mm'));

    const { send } = useContractFunction(contract, 'createEvent', { transactionName: 'Create Event' })

    const changeCheck = (index: number) => {
        setCheckIndex(index);
    }

    const handleAddCharactor = () => {
        setCharactorInfo([...charactorInfo, { role: 0, name: '', address: '' }]);
    }

    const handleRemoveCharactor = (index?: number) => {
        if (index) {
            const newCharactorInfo = [...charactorInfo];
            newCharactorInfo.splice(index, 1);
            setCharactorInfo(newCharactorInfo);
            return;
        }
        const newCharactorInfo = [...charactorInfo];
        newCharactorInfo.splice(newCharactorInfo.length - 1, 1);
        setCharactorInfo(newCharactorInfo);
    }

    const createEvent = async (e: any) => {

        e.preventDefault();

        const title = titieRef.current!.value;
        const brief = textareaRef.current.pushText();
        const deadline = mintRef.current!.innerText;
        const amount = amountRef.current!.value;
        const deadlineTimestamp = new Date(deadline).getTime() / 1000;

        const amountInWei = utils.parseEther(amount);
        const tx = await send(amountInWei, ethers.BigNumber.from(deadlineTimestamp), title, brief).catch((error: any) => {
            console.log(error);
            notification("Create Event Failed!");
        })
        console.log(tx);
        if (tx) {
            notification("Create Event Successfully!", "top-center", 1);
        }
    }

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
                                <div className="flex-1 mt-3 text-center sm:mt-0 sm:ml-4">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-left">
                                        Event Editor
                                    </Dialog.Title>
                                    <div className="mt-4">

                                        <div className="relative mt-1 rounded-md shadow-sm flex-col space-y-4">

                                            <section className='relative'>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    placeholder="Title"
                                                    ref={titieRef}
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    100
                                                </div>
                                            </section>

                                            <section>
                                                <Textarea onRef={textareaRef} label='Brief (option)' description='500' />
                                            </section>

                                            <section>
                                                <div className='flex space-x-2'>
                                                    <span className='text-baseColor'>Charactor</span>
                                                    <button className='bg-white rounded-sm cursor-pointer' onClick={() => handleRemoveCharactor()}>
                                                        <MinusIcon className="h-4 w-6 text-gray-400" />
                                                    </button>
                                                    <button className='bg-white rounded-sm cursor-pointer' onClick={() => handleAddCharactor()}>
                                                        <PlusIcon className="h-4 w-6 text-gray-400" />
                                                    </button>
                                                </div>
                                            </section>

                                            <section>
                                                <div className='flex-col space-y-2' ref={charactorRef}>
                                                    {
                                                        charactorInfo.map((charactor: ICharactor, index) => {
                                                            return (
                                                                <div className='flex flex-nowrap space-x-2 items-center justify-between' key={index}>
                                                                    <Select params={roles} onChange={
                                                                        (value) => {
                                                                            charactor.role = value;
                                                                            const newCharactorInfo = [...charactorInfo];
                                                                            newCharactorInfo[index].role = value;
                                                                            setCharactorInfo(newCharactorInfo);
                                                                            console.log(value);
                                                                        }
                                                                    }></Select>
                                                                    <input value={charactor.name} onChange={
                                                                        (e) => {
                                                                            const newCharactorInfo = [...charactorInfo];
                                                                            newCharactorInfo[index].name = e.target.value;
                                                                            setCharactorInfo(newCharactorInfo);
                                                                        }
                                                                    } type="text" name="name" className="w-[20%] rounded-md border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 text-xs placeholder:text-xs sm:text-sm sm:placeholder:text-sm" placeholder="Name" />
                                                                    <input value={charactor.address} onChange={
                                                                        (e) => {
                                                                            const newCharactorInfo = [...charactorInfo];
                                                                            newCharactorInfo[index].address = e.target.value;
                                                                            setCharactorInfo(newCharactorInfo);
                                                                        }
                                                                    } type="text" name="address" className="w-[20%] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-xs placeholder:text-xs sm:text-sm sm:placeholder:text-sm" placeholder="Address" />
                                                                    <button className='bg-white rounded-sm cursor-pointer h-full' onClick={() => handleRemoveCharactor(index)}>
                                                                        <MinusIcon className="h-8 w-8 text-gray-400" />
                                                                    </button>
                                                                    {/* 
                                                                    <button className='bg-white rounded-sm cursor-pointer h-full'>
                                                                        <PlusIcon className="h-8 w-8 text-gray-400" />
                                                                    </button> */}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </section>

                                            <section>
                                                <div className='flex space-x-2'>
                                                    <span className='text-baseColor'>SignUp Rule</span>
                                                </div>
                                            </section>

                                            <section>
                                                <div className='flex items-center space-x-2'>
                                                    <span className='text-baseColor'>Deposit Loopss</span>
                                                    <input ref={amountRef} type="text" name="amount" className="rounded-md border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 text-xs placeholder:text-xs sm:text-sm sm:placeholder:text-sm" placeholder="Amount (At least)" />
                                                </div>
                                            </section>

                                            <section>
                                                <div className='flex space-x-2'>
                                                    <span className='text-baseColor'>Mint Rule</span>
                                                </div>
                                            </section>

                                            <section>
                                                <div className='flex justify-start items-center space-x-4'>
                                                    <span onClick={() => changeCheck(0)} className={`${checkIndex === 0 ? 'font-semibold text-black' : 'text-baseColor'}`}>SignUp</span>
                                                    <span onClick={() => changeCheck(1)} className={`${checkIndex === 1 ? 'font-semibold text-black' : 'text-baseColor'}`}>NFT Pass</span>
                                                    <span onClick={() => changeCheck(2)} className={`${checkIndex === 2 ? 'font-semibold text-black' : 'text-baseColor'}`}>Password</span>
                                                </div>
                                            </section>

                                            <section>
                                                <div className='flex flex-col justify-start items-start space-y-2'>
                                                    <span className='text-baseColor'>SignUp End</span>
                                                    {/* <DatePicker ref={dateRef} className='max-w-full' locale={locale} showTime={{ format: 'HH:mm' }} onOk={onOk} format={dateFormat} /> */}
                                                    <div className='sm:hidden'>
                                                        <MobileDateTimePicker
                                                            label="For mobile"
                                                            value={value}
                                                            onChange={(newValue) => {
                                                                mintRef.current!.innerText = newValue!.format(dateFormat);
                                                                setValue(newValue);
                                                            }}
                                                            renderInput={(params) => <TextField {...params} />}
                                                        />
                                                    </div>
                                                    <div className='hidden sm:block'>
                                                        <DateTimePicker
                                                            renderInput={(props) => <TextField {...props}
                                                            />}
                                                            label="DateTimePicker"
                                                            value={value}
                                                            inputFormat={dateFormat}
                                                            onChange={(newValue) => {
                                                                if (newValue) {
                                                                    mintRef.current!.innerText = newValue.format(dateFormat);
                                                                } else {
                                                                    mintRef.current!.innerText = '';
                                                                }
                                                                setValue(newValue);
                                                            }}
                                                        />
                                                    </div>
                                                    {/* <span className='text-baseColor'>2022-11-11 2:00 (UTC+0)</span> */}
                                                </div>
                                            </section>


                                            <section>
                                                <div className='flex flex-col justify-start items-start space-y-2'>
                                                    <span className='text-baseColor'>Mint Start</span>
                                                    <span ref={mintRef} className='text-baseColor'></span>
                                                </div>
                                            </section>


                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:justify-center">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-solid border-black shadow-sm px-[10%] py-2 text-base font-medium text-baseColor focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={createEvent}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}