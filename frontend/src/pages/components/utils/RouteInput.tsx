import { Dispatch, SetStateAction } from "react";
import { RouteProps } from "../../../types/types";


interface RouteInputProps {
    onChange:  Dispatch<SetStateAction<RouteProps>>
    name: string;
    type: string;
    value: string;
    placeholder?: string;
}

export const RouteInput = (props:RouteInputProps) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if(!props.onChange){
            return;
        }
    
        props.onChange((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
    return (

        <>
            <div className="flex border-[1px] border-solid border-gray-300">
            <input
                className="w-full pl-2 shadow-sm outline-none text-sm min-h-[25px]"
                type={props.type}
                name={props.name}
                value={props.value}
                onChange={handleInputChange}
                placeholder={props.placeholder ?? ""}
            />
            </div>
        </>
    )
}