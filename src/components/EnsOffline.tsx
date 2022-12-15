import { useEffect, useState } from "react";

interface IAppProps {
    ens: string;
    address: string
    shortenAddress: boolean
}

export default function EnsOffline(props: IAppProps) {

    const [rendered, setRendered] = useState("");

    useEffect(() => {
        if (props.ens) {
            setRendered(props.ens);
        } else {
            setRendered(props.address);
        }
    }, [props.address, setRendered]);

    return (
        <>
            <span className="underline cursor-pointer hidden md:block" onClick={() => {
                window.open(`https://bscscan.com/token/0xb1ac1c0f2e7e467f10df232e82cc65e2ca4cb0d2?a=${props.address}`, '_blank')
            }}>
                {rendered}
            </span>
            <span className="underline cursor-pointer md:hidden" onClick={() => {
                window.open(`https://bscscan.com/token/0xb1ac1c0f2e7e467f10df232e82cc65e2ca4cb0d2?a=${props.address}`, '_blank')
            }}>{
                    props.shortenAddress ? rendered.substring(0, 6) + '...' + rendered.substring(rendered.length - 4, rendered.length) : rendered
                }</span>
        </>
    );
}
