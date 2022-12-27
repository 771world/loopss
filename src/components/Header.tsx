import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { ethers } from 'ethers';
import { useImperativeHandle, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import WalletButton from './WalletButton';

export interface IAppProps {
    clearData: () => void;
    onRef: any;
    provider: ethers.providers.Web3Provider
}

export default function Header(props: IAppProps) {

    const wallet = useRef<HTMLDivElement>(null);

    const [active, setActive] = useState(0);

    useImperativeHandle(props.onRef, () => {
        return {
            handleConnect: handleConnect,
        }
    })

    const clearData = () => {
        props.clearData();
    }

    const handleConnect = () => {
        // @ts-ignore
        wallet.current!.handleConnect();
    }

    const handlePage = (index: number) => {
        setActive(index);
    }

    return (
        <>
            <div className="flex items-center justify-start md:hidden mt-2 pl-2 space-x-2">
                <span className="text-xl font-bold">
                    Loopss
                </span>
                <span className='p-0.25 border-1 border-solid border-black rounded-lg text-xs'>
                    DEMO
                </span>
            </div>
            <section className='flex justify-between items-center md:mt-4'>
                <div className="flex justify-center items-center space-x-2 md:space-x-4">
                    <span className="text-xl font-bold hidden md:block">
                        Loopss
                    </span>
                    <span className='p-0.25 border-1 border-solid border-black rounded-lg text-xs hidden md:block'>
                        DEMO
                    </span>
                    <NavLink to='/' onClick={() => handlePage(0)} className={`cursor-pointer ${active === 0 ? 'underline' : ''}`}>Dashboard</NavLink>
                    <NavLink to='/graph' onClick={() => handlePage(1)} className={`cursor-pointer ${active === 1 ? 'underline' : ''}`}>Graph</NavLink>
                    <NavLink to='/events' onClick={() => handlePage(2)} className={`cursor-pointer ${active === 2 ? 'underline' : ''}`}>Events</NavLink>
                    <NavLink to='/tokens' onClick={() => handlePage(3)} className={`cursor-pointer ${active === 3 ? 'underline' : ''}`}>Send</NavLink>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4">
                    <Cog6ToothIcon className="w-6 h-6 md:w-8 md:h-8" />
                    <WalletButton onRef={wallet} clearData={clearData} provider={props.provider} />
                </div>
            </section>
        </>

    );
}
