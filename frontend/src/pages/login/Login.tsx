import { FormEvent, useState } from "react";
import { Input } from "../components/utils/Input";
import { Label } from "../components/utils/Label";
import { Button } from "../components/utils/Button";
import { FuncType, FormProps } from "../../types/types";
import { api } from "../../services/api";
import { setCookie } from "../../services/cookiesManager";
import { validator } from "../../services/validator";
import { useNavigate } from "react-router-dom";

function Login(props: FuncType){
    const [form, setForm] = useState<FormProps>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleTryLogin = (e: FormEvent) => {
        e.preventDefault();
        const validation = validator();
        if(!validation.validateEmail(form.email)) {
            return setErrors((prevErrors) => [...prevErrors, 'Email inválido']);
        }

        const data = {
            email: form.email,
            password: form.password
        };
        
        return api.post('login', data).then((res) => {
            if(res.status != 200) {
               return setErrors((prevErrors) => [...prevErrors, res.data.message])
            }
            
            setCookie('token', res.data.token);
            setCookie('user', JSON.stringify(res.data.user));
            navigate('/home');
            return window.location.reload();
        }).catch(err => {
            console.log(`Error tryng authenticate: `, err);  
        });
    };

    return(
        <>
        <form>
            <div className="bg-[#2C2C2E] mb-4 rounded-sm p-4 text-white text-center text-xl">
                <h1>Entre em sua conta</h1>
            </div>
            <div className="flex flex-col gap-2">
                <span>
                    <Label name="email" value="Email:" />
                    <Input type="email" value={form.email} onChange={setForm} name="email" placeholder="example@email.com" />
                </span>
                <span>
                    <Label name="password" value="Senha:" />
                    <Input type="password" value={form.password} onChange={setForm} name="password" />
                </span>
                <p className="text-red-400 text-sm">{errors}</p>
                <span className="flex justify-between">
                <p onClick={() => props.func()} className="text-[#FF9900] text-sm underline cursor-pointer">Criar conta</p>
                    <Button func={handleTryLogin} text="Entrar" />
                </span>
            </div>
        </form>
        </>
    )
}

export default Login;