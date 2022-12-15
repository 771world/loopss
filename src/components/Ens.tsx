import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export interface IAppProps {
    address: string
    shortenAddress: boolean
    provider: ethers.providers.Web3Provider
}

const ensMap = new Map<string, string>();

export default function Ens(props: IAppProps) {

    const [loading, setLoading] = useState<boolean>(true);

    const [rendered, setRendered] = useState("");

    useEffect(() => {
        if (props.address) {
            if (ensMap.has(props.address)) {
                setRendered(ensMap.get(props.address)!);
                setLoading(false);
            } else {
                props.provider.lookupAddress(props.address).then((name: any) => {
                    if (name) {
                        setRendered(name);
                        ensMap.set(props.address, name);
                    } else {
                        setRendered(props.address);
                    }
                    setLoading(false);
                }).catch((error: any) => {
                    console.log(error);
                    setRendered(props.address);
                });
            }
        }
    }, [props.provider, props.address, setRendered]);


    return (
        loading ? (<span className="underline cursor-pointer animate-spin flex items-center">
            <ArrowPathIcon className="h-5 w-5 object-contain" />
        </span >) :
            (
                <>
                    <span className="underline cursor-pointer hidden md:block" onClick={() => {
                        window.open(`https://bscscan.com/token/0xb1ac1c0f2e7e467f10df232e82cc65e2ca4cb0d2?a=${props.address}`, '_blank')
                    }}>
                        {rendered}
                    </span>
                    <span className="underline cursor-pointer md:hidden" onClick={() => {
                        window.open(`https://bscscan.com/token/0xb1ac1c0f2e7e467f10df232e82cc65e2ca4cb0d2?a=${props.address}`, '_blank')
                    }}>{
                            ((rendered.startsWith('0x') || rendered.startsWith('0X')) && props.shortenAddress) ? rendered.substring(0, 6) + '...' + rendered.substring(rendered.length - 4, rendered.length) : rendered
                        }</span>
                </>
            )
    );
}
