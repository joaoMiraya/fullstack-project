import { FormEvent } from "react";


interface ButtonInterface {
    func: (e: FormEvent) => void;
    text: string;
    theme?: string;
}

export const Button = (props: ButtonInterface) => {

    return (
        <>
            <button onClick={(e) => props.func(e)} className={`${props.theme?? 'bg-[#00ADEF]'} shadow-md py-1 text-white px-4 rounded-sm`}>{props.text}</button>
        </>
    )
}