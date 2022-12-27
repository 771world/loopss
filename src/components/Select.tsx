import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


interface IAppProps {
    params: any[],
    onChange: (value: any) => void,
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Select(props: IAppProps) {

    const [selected, setSelected] = useState(props.params[0])

    const onChange = (value: any) => {
        setSelected(value)
        props.onChange(value.id)
    }

    return (
        <Listbox value={selected} onChange={onChange}>
            {({ open }) => (
                <>
                    <div className="relative flex-1 max-w-[5rem] sm:max-w-xs h-full">
                        <Listbox.Button className="relative w-full cursor-default rounded-md border border-black py-2 pl-3 pr-5 sm:pr-10 text-left shadow-sm focus:outline-none text-xs sm:text-sm  bg-white">
                            <span className="block truncate">{selected.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs sm:text-sm bg-white">
                                {props.params.map((person) => (
                                    <Listbox.Option
                                        key={person.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'text-black bg-gray-400' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-4 sm:pr-9'
                                            )
                                        }
                                        value={person}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                    {person.name}
                                                </span>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-indigo-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-4'
                                                        )}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}
