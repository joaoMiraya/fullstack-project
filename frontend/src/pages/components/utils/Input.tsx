import { Dispatch, SetStateAction, useState } from "react";
import { formatCurrency } from "../../../scripts/moneyFormater";
import { FormProps } from "../../../types/types";

interface InputInterface {
  onChange?: Dispatch<SetStateAction<FormProps>>;
  value: string;
  name: string;
  type: string;
  placeholder?: string;
  variant?: string;
}

export const Input = (props: InputInterface) => {
  const { variant = "default" } = props;
  const [internalValue, setInternalValue] = useState(props.value || "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(!props.onChange){
        return;
    }
    const formattedValue =
      variant === "money" ? formatCurrency(value) : value;

    setInternalValue(formattedValue);

    props.onChange((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };

  return (
    <div className="flex border-[1px] border-solid border-gray-300">
        {variant == 'money'&& <span className="px-2 text-gray-400">R$</span> }
      <input
        className="w-full pl-2 shadow-sm outline-none text-sm min-h-[25px]"
        type={props.type}
        name={props.name}
        value={internalValue}
        onChange={handleInputChange}
        placeholder={props.placeholder ?? ""}
      />
       {variant == 'km'&& <span className="px-2 text-gray-400 text-sm flex items-center">Metros</span> }
    </div>
  );
};
