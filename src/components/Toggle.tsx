import { useState } from "react";
import "../styles/toggle.css";

export interface IAppProps {
    toggled: (isToggled: boolean) => void;
}

export default function Toggle(props: IAppProps) {

    const [isToggled, setIsToggled] = useState(true);

    const handleData = (e: any, flag: boolean) => {
        setIsToggled(flag);
        e.currentTarget.classList.toggle("active");
        props.toggled(isToggled);
    }

    return (
        <>
            <button onClick={(e) => handleData(e, !isToggled)} type="button" className="btn btn-sm btn-toggle" data-toggle="button" aria-pressed="false">
                <div className="handle"></div>
            </button>
        </>
    );
}
