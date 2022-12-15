import { formatEther } from '@ethersproject/units'
import { TransactionStatus, transactionErrored, useEthers } from '@usedapp/core'
import { BigNumber } from 'ethers'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactElement, useEffect, useState } from 'react'
import { CheckIcon, ExclamationCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'

const formatter = new Intl.NumberFormat('en-us', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
})

const formatBalance = (balance: BigNumber | undefined) =>
    formatter.format(parseFloat(formatEther(balance ?? BigNumber.from('0'))))

interface TransactionFormProps {
    balance: BigNumber | undefined
    send: (value: string) => void
    title: string
    ticker: string
    transaction: TransactionStatus
}

const TransactionForm = ({ balance, send, title, ticker, transaction }: TransactionFormProps) => (
    <div className='flex flex-col w-full h-full bg-white p-8'>
        <div className='flex items-baseline justify-between border-b-2 border-solid border-gray-300'>
            <p>{title}</p>
            <div className='text-gray-600 text-sm'>
                Your {ticker} balance: {formatBalance(balance)}
            </div>
        </div>
        <div className='flex justify-center p-4'>
            <label htmlFor={`${ticker}Input`}>How much?</label>
        </div>
        <InputComponent ticker={ticker} transaction={transaction} send={send} />
        <StatusAnimation transaction={transaction} />
    </div>
)

interface InputComponentProps {
    send: (value: string) => void
    ticker: string
    transaction: TransactionStatus
}

const InputComponent = ({ ticker, transaction, send }: InputComponentProps) => {
    const { account } = useEthers()
    const [value, setValue] = useState('0')
    const [disabled, setDisabled] = useState(false)

    const onClick = () => {
        if (Number(value) > 0) {
            setDisabled(true)
            send(value)
        }
    }

    useEffect(() => {
        if (transaction.status !== 'Mining') {
            setDisabled(false)
            setValue('0')
        }
    }, [transaction])

    return (
        <div className='flex mx-auto text-gray-600 items-center overflow-hidden'>
            <div className='relative flex items-center'>
                <input
                    id={`${ticker}Input`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={value}
                    onChange={(e) => setValue(e.currentTarget.value)}
                    disabled={disabled}
                    className='transaction-input'
                />
                <div className='absolute right-4'>{ticker}</div>
            </div>
            <button className='transaction-button' disabled={!account || disabled} onClick={onClick}>
                Send
            </button>
        </div>
    )
}

interface StatusAnimationProps {
    transaction: TransactionStatus
}


const StatusAnimation = ({ transaction }: StatusAnimationProps) => {

    const [showTransactionStatus, setShowTransactionStatus] = useState(false)
    const [timer, setTimer] = useState(
        setTimeout(() => {
            void 0
        }, 1)
    )

    useEffect(() => {
        setShowTransactionStatus(true)
        clearTimeout(timer)

        if (transaction.status !== 'Mining' && transaction.status !== 'PendingSignature')
            setTimer(setTimeout(() => setShowTransactionStatus(false), 5000))
    }, [transaction])

    return (
        <div className='flex justify-center items-center overflow-hidden m-2 h-20'>
            <AnimatePresence initial={false} exitBeforeEnter>
                {showTransactionStatus && transactionErrored(transaction) && (
                    <StatusBlock
                        color={'#F87171'}
                        text={transaction?.errorMessage || ''}
                        icon={<ExclamationCircleIcon />}
                        key={transaction?.chainId + transaction.status}
                    />
                )}
                {showTransactionStatus && transaction.status === 'PendingSignature' && (
                    <StatusBlock
                        color="black"
                        text="Waiting for wallet owners to sign the transaction"
                        icon={<SparklesIcon />}
                        key={transaction?.chainId + transaction.status}
                    />
                )}
                {showTransactionStatus && transaction.status === 'Success' && (
                    <StatusBlock
                        color="green"
                        text="Transaction successful"
                        icon={<CheckIcon />}
                        key={transaction?.chainId + transaction.status}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

interface StatusBlockProps {
    color: string
    text: string
    icon: ReactElement
}

const StatusBlock = ({ color, text, icon }: StatusBlockProps) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        key={text}
        className='informationRow'
    >
        <motion.div style={{ fill: color }} className='iconContainer'>{icon}</motion.div>
        <div style={{ color: color, textAlign: 'center' }}>{text}</div>
    </motion.div>
)

export { TransactionForm, StatusAnimation }
