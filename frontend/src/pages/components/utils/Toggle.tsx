import { Dispatch, SetStateAction } from "react";

interface ToggleInterface {
    func: Dispatch<SetStateAction<boolean>>;
    value: boolean;
};

export const Toggle = (props: ToggleInterface) => {

    return (

        <>
            <p className="text-sm text-gray-500">Você será?</p>
            <div onClick={() => props.func(!props.value)} className={`${props.value ? 'bg-green-500 shadow-inner shadow-green-300' : 'bg-gray-500'} duration-300 cursor-pointer flex items-center max-w-[8rem] h-6 rounded-full p-2 relative`}>
                <span className={`bg-gray-300 absolute ${props.value ? 'right-0' : 'left-0'} shadow-inner  w-8 h-6 rounded-full`}>
                </span>
                <p className={`text-[12px] text-center font-bold text-white absolute ${props.value ? 'left-8' : 'left-10'}`}>{props.value ? 'Motorista' : 'Passageiro'}</p>
            </div>
        </>
    )
}