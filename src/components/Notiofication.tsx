import toast from 'react-hot-toast';
import copy from "copy-to-clipboard"

export const notification = (message: string, position: string = 'top-center', type: number = 0) => {
    if (type === 0) {
        toast.error(message, {
            duration: 4000,
            // @ts-ignore
            position: position,
            className: 'toast-background toast-text',
            ariaProps: {
                role: 'status',
                'aria-live': 'polite',
            },
        })
    }
    if (type === 1) {
        toast.success(message, {
            duration: 4000,
            // @ts-ignore
            position: position,
            className: 'toast-background toast-text',
            ariaProps: {
                role: 'status',
                'aria-live': 'polite',
            },
        })
    }
    if (type === 2) {
        toast(message, {
            duration: 4000,
            // @ts-ignore
            position: position,
            className: 'toast-background toast-text',
            ariaProps: {
                role: 'status',
                'aria-live': 'polite',
            },
        })
    }

    if (type === 3) {
        toast(
            (t: any) => (
                <span className='text-center'>
                    <span> Please add <span className='text-xs bg-slate-300'>0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2</span> to your mobile wallet</span>
                    <button onClick={() => {
                        copy("0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2")
                        toast.dismiss()
                        notification("Copy successfully", "bottom-center", 1)
                        setTimeout(() => {
                            toast.dismiss()
                        }, 2000);
                    }
                    } className="button-10 mt-2 mx-auto">Copy and close
                    </button>
                </span>
            )
        );
    }
}