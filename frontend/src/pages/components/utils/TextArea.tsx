import { ChangeEvent } from "react";

interface TextAreaInterface {
    name: string;
    onChange:  (e: ChangeEvent<HTMLTextAreaElement>) => void;
    value: string;
};

export const TextArea = (props: TextAreaInterface) => {

    return (

        <>
            <div className="flex border-[1px] border-solid border-gray-300">
                <textarea 
                className="outline-none w-full p-2 text-sm" 
                name={props.name} 
                value={props.value}
                onChange={(e) => props.onChange(e)}>
                </textarea>
            </div>
        </>
    )
}