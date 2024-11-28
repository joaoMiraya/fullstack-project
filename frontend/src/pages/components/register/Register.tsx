import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "../utils/Button"
import { Input } from "../utils/Input"
import { Label } from "../utils/Label"
import { FuncType, FormProps } from "../../../types/types";
import { api } from "../../../services/api";
import { ErrorsBox } from "../utils/ErrorsBox";
import { setCookie } from "../../../services/cookiesManager";
import { Toggle } from "../utils/Toggle";
import { validator } from "../../../services/validator";
import { parseCurrencyToCents } from "../../../scripts/moneyFormater";
import { TextArea } from "../utils/TextArea";
import {  useNavigate } from "react-router-dom";

export const Register = (props: FuncType) => {
    const [isDriver, setIsDriver] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [form, setForm] = useState<FormProps>({
        name: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
        cnh: '',
        car: '',
        fee: '',
        minKm: '',
        description: ''
    });
    const navigate = useNavigate();
    const validateData = (): boolean => {
        const validation = validator();
        setErrors({});
        let count = 0;

        const { name = '', email = '', confirmEmail = '', password = '', confirmPassword = '', cnh = '', car = '', fee = '' } = form;

        const newErrors: { [key: string]: string[] } = {};
        
        if (!validation.verifyIfIsNotNull(name)) {
          newErrors.name = ['Nome inválido'];
          count++;
        }
        if (!validation.validateEmail(email)) {
          newErrors.email = ['Email inválido'];
          count++;
        }
        if (!validation.compareValue(email, confirmEmail)) {
          newErrors.confirmEmail = ['O email está diferente'];
          count++;
        }
        if (!validation.validatePassword(password)) {
          newErrors.password = ['A senha deve conter 6 caracteres'];
          count++;
        }
        if (!validation.compareValue(password, confirmPassword)) {
          newErrors.confirmPassword = ['A senha está diferente'];
          count++;
        }

        if(isDriver){
            if (isDriver && !validation.cnhValidate(cnh)) {
              newErrors.cnh = ['CNH inválida'];
              count++;
            }
            if (!validation.verifyIfIsNotNull(car)) {
                newErrors.car = ['Informe o modelo do seu carro'];
                count++;
            }
            if (!validation.validateFee(fee)) {
                newErrors.fee = ['Informe a taxa a ser cobrada'];
                count++;
            }
        }

        setErrors(newErrors);

        return count === 0;
    };

    const handleTryRegister = (e: FormEvent) => {
        e.preventDefault();
        if(!validateData()) return;
        const data = {
            name: form.name,
            email: form.email,
            password: form.password,
            ...(isDriver && {
                driver: {
                    cnh: form.cnh,
                    car: form.car,
                    minKm: form.minKm,
                    fee: parseCurrencyToCents(form.fee),
                    description: form.description
                }
            })
        };
        
        api.post('register', data).then((res) => {
            if (res.status !== 201) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    system: [...(prevErrors.system || []), res.data.message],
                }));
            }
            setCookie('token', res.data.token);
            setCookie('user', JSON.stringify(res.data.user));
            
            return navigate('/home');
        }).catch(err => {
            console.log(`Error tryng create account: `, err);  
        });
    };

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    return (
        <form>
            <div className="bg-[#2C2C2E] mb-4 rounded-sm p-4 text-white text-center text-xl">
                <h1>Crie sua conta</h1>
            </div>
            <Toggle value={isDriver} func={setIsDriver} />
            <div className="flex flex-col gap-2">
                <span>
                    <Label name="name" value="Nome:" />
                    <Input type="text" value={form.name || ''} onChange={setForm} name="name"/>
                    {errors.name && <ErrorsBox error={errors.name[0]} />}
                </span>
                <span>
                    <Label name="email" value="Email:" />
                    <Input type="email" value={form.email} onChange={setForm} name="email" placeholder="example@email.com" />
                    {errors.email && <ErrorsBox error={errors.email[0]} />}
                </span>
                <span>
                    <Label name="confirmEmail" value="Confirme seu email:" />
                    <Input type="email" value={form.confirmEmail || ''} onChange={setForm} name="confirmEmail" />
                    {errors.confirmEmail && <ErrorsBox error={errors.confirmEmail[0]} />}
                </span>
                <span>
                    <Label name="password" value="Senha:" />
                    <Input type="password" value={form.password} onChange={setForm} name="password"/>
                    {errors.password && <ErrorsBox error={errors.password[0]} />}
                </span>
                <span>
                    <Label name="confirmPassword" value="Confirme sua senha:" />
                    <Input type="password" value={form.confirmPassword || ''} onChange={setForm} name="confirmPassword" />
                    {errors.confirmPassword && <ErrorsBox error={errors.confirmPassword[0]} />}
                </span>

                {isDriver &&
                    <>
                        <span>
                            <Label name="cnh" value="CNH:" />
                            <Input type="text" value={form.cnh ? form.cnh : ''} onChange={setForm} name="cnh" />
                            {errors.cnh && <ErrorsBox error={errors.cnh[0]} />}
                        </span>
                        <span>
                            <Label name="car" value="Modelo do carro:" />
                            <Input type="text" value={form.car || ''} onChange={setForm} name="car" />
                            {errors.car && <ErrorsBox error={errors.car[0]} />}
                        </span>
                        <span>
                            <Label name="minKm" value="Mínimo de Km por viagem:" />
                            <Input variant="km" type="number" value={form.minKm || ''} onChange={setForm} name="minKm" />
                            {errors.minKm && <ErrorsBox error={errors.minKm[0]} />}
                        </span>
                        <span>
                            <Label name="fee" value="Taxa por Km:" />
                            <Input placeholder="0,00" variant="money" type="text" value={form.fee || ''} onChange={setForm} name="fee" />
                            {errors.fee && <ErrorsBox error={errors.fee[0]} />}
                        </span>
                        <span>
                            <Label name="description" value="Sua descrição:" />
                            <TextArea value={form.description  || ''} onChange={handleTextAreaChange}  name="description" />
                            {errors.description && <ErrorsBox error={errors.description[0]} />}
                        </span>
                    </> 
                }
                {errors.system && <ErrorsBox error={errors.system[0]} />}
                <span className="flex justify-between">
                <p onClick={() => props.func()} className="text-[#FF9900] text-sm underline cursor-pointer">Entrar em minha conta</p>
                    <Button func={handleTryRegister} text="Cadastrar" />
                </span>
            </div>
        </form>
    )
}