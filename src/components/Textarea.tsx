import { useImperativeHandle, useRef } from "react"

interface IAppProps {
    onRef: any;
    label: string;
    description: string;
}



export default function Textarea(props: IAppProps) {

    const textRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(props.onRef, () => {
        return {
            pushText: pushText,
        }
    })

    const pushText = () => {
        return textRef.current?.value || ''
    }

    return (
        <div className="flex items-start space-x-4">
            <div className="min-w-0 flex-1">
                <form action="#" className="relative">
                    <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                        <label htmlFor="comment" className="sr-only">
                            {props.label}
                        </label>
                        <textarea
                            rows={3}
                            name="comment"
                            id="comment"
                            className="block w-full resize-none border-0 bg-gray-200 py-3 focus:ring-0 sm:text-sm"
                            placeholder="Brief (option)"
                            defaultValue={''}
                            ref={textRef}
                        />
                        <div className="pointer-events-none absolute bottom-2 right-0 flex items-center pr-3">
                            {props.description}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
