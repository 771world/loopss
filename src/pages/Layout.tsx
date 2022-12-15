import copy from "copy-to-clipboard";
import { Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { ethers } from "ethers";
import { useRef } from "react";
import Header from "../components/Header";
import { notification } from "../components/Notiofication";
import Home from "../pages/Home";
import Graph from "./Graph";


const provider: any = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/rbeUGLWOu1aehsuKbaNw_yhVKFXXdwbp');



export default function Layout() {

    const header = useRef<HTMLDivElement>(null);
    const home = useRef<HTMLDivElement>(null);

    const clearData = () => {
        // @ts-ignore
        home.current!.clearData();
    }

    const handleConnect = () => {
        // @ts-ignore
        header.current!.handleConnect();
    }

    return (
        <>
            <BrowserRouter>
                <header className="flex items-center justify-center header py-1 md:text-base text-xs">
                    <span className="hidden md:block">Contract Address :0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2 (BSC)</span>
                    <span className="md:hidden">0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2 (BSC)</span>
                    <span onClick={() => {
                        copy("0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2")
                        notification("Copy successfully", "top-center", 1)
                    }} className="pl-2 cursor-pointer">Copy</span>
                </header>
                <div className="container mx-auto px-4">
                    <Header onRef={header} clearData={clearData} provider={provider} />
                    <Switch>
                        <Route exact path="/" render={(props) => <Home {...props} onRef={home} provider={provider} handleConnect={handleConnect} />} />
                        <Route exact path="/graph" render={(props) => <Graph {...props} provider={provider} />} />
                    </Switch>
                </div>
            </BrowserRouter>
        </>

    );
}
