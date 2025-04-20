import { motion, AnimatePresence } from "framer-motion";
import { BiCopyAlt } from "react-icons/bi";
import { useEffect, useState } from "react";

export const copyPopup = {
    initial: {
        opacity: 0,
        scale: 0.5
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            ease: "easeInOut",
            duration: 0.1
        }
    },
    exit: {
        opacity: 0
    }
}

export default function CopyPaste({ text }) {
    const [copySuccess, setCopySuccess] = useState(false);
    const [message, setMessage] = useState("Copied!")
    const TIME = 1000

    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Text copied to clipboard');
            setCopySuccess(true);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setMessage("Failed!")
        }
    };

    useEffect(() => {
        if (copySuccess) {
            setTimeout(() => {
                setCopySuccess(false);
            }, TIME);
        }
    }, [copySuccess]);
    return (
        <>
            <BiCopyAlt className="text-gray-400 w-6 h-6 hover:cursor-pointer" onClick={() => copyText(text)} />
            <AnimatePresence>
                {copySuccess &&
                    <motion.div
                        variants={copyPopup}
                        initial={"initial"}
                        animate={"animate"}
                        exit={"exit"}
                        className="absolute -bottom-2 right-6 z-10 p-2 rounded-md bg-gray-700 text-white">
                        <p>{message}</p>
                    </motion.div>
                }
            </AnimatePresence>
        </>
    )
}