import { FormEvent, useState } from "react";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/authContext";
import { Label } from "../../components/utils/Label";
import { RouteInput } from "../../components/utils/RouteInput";
import { DriverInterface, RouteProps, RouteResultProps } from '../../../types/types';
import { Button } from "../../components/utils/Button";
import { validator } from "../../../services/validator";
import { ErrorsBox } from "../../components/utils/ErrorsBox";
import gif from '../../../assets/loading.gif';
import { Drivers } from "./components/Drivers";
import { Maps } from "./components/Maps";


interface OptionType {
    name: string;
    uid: string;
    car: string;
    minKm: number;
    value: number;
    description: string;
    review?: { rating: number; comment: string }[];
};

export const Trips = () => {
    const { user } = useAuth();
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);
    const [sucess, setSucess] = useState(false);
    const [route, setRoute] = useState<RouteProps>({
        origin: '',
        destination: ''
    });
    const [routeResult, setRouteResult] = useState<RouteResultProps>();
    const [drivers, setDrivers] = useState<DriverInterface[]>([]);

    const validateData = () => {
        const validation = validator();
        let count = 0;
        const newErrors: { [key: string]: string[] } = {};

        if(!validation.verifyIfIsNotNull(route.origin)){
            count++;
            return newErrors.origin = ['Ponto de partida invalido'];
        }
        if(!validation.verifyIfIsNotNull(route.destination)){
            count++;
            return newErrors.destination = ['Ponto de destino invalido'];
        }
        if(validation.compareValue(route.origin, route.destination)){
            count++;
            return newErrors.destination = ['Não pode ser o mesmo endereço'];
        }
        setErrors(newErrors);

        return count === 0;
    };
    
    const handleCalculateRoute = (e: FormEvent) => {
        e.preventDefault();
        if(!validateData() || !user) return;
        setLoading(true);
        api.post('/ride/estimate', {
            customer_id: user?.uid,
            origin: route.origin,
            destination: route.destination
        }).then(res => {
            setSucess(true);
            setRouteResult({
                origin: [
                    {
                        lat: res.data.origin.lat,
                        lng:  res.data.origin.lng
                    }
                ],
                destination: [
                    {
                        lat: res.data.destination.lat,
                        lng:  res.data.destination.lng
                    }
                ],
                duration: res.data.duration,
                distance: res.data.distance,
                customer_id: res.data.customer_id
            });
            
            if (res.data.options && typeof res.data.options === 'object') {
                const optionsArray = Object.values(res.data.options) as OptionType[];
                setDrivers(
                    optionsArray.map((option): DriverInterface => ({
                        name: option.name,
                        uid: option.uid,
                        car: option.car,
                        minKm: option.minKm,
                        fee: option.value,
                        description: option.description,
                        review: option.review && option.review.length > 0
                            ? option.review
                            : [{ rating: 0, comment: '' }]
                    }))
                );
            } 
            
        }).catch(err => {
            setSucess(false);
            setErrors(prevErrors => ({
                ...prevErrors,
                system: [...(prevErrors.system || []), 'Endereço não foi encontrado'],
            }));
            console.log(err);
            
        }).finally(() => {
            setLoading(false);
        });
    };


    return (
        <>
            <div className="min-h-screen">
                
                <div className="flex flex-col items-center ">
                    {!sucess&&
                        <div className="flex flex-col pt-12">
                        <div className="bg-[#2C2C2E] min-w-[22rem] mb-4 rounded-sm p-4 text-white text-center text-xl">
                            <h1 className="text-xl text-center">Faça viagens com segurança</h1>
                        </div>
                        <form>
                            <span>
                                <Label name="origin" value="Ponto de partida:" />
                               <RouteInput name="origin" type="text" value={route.origin} onChange={setRoute} />
                               {errors.name && <ErrorsBox error={errors.origin[0]} />}
                            </span>
                            <span>
                                <Label name="destination" value="Destino:" />
                               <RouteInput name="destination" type="text" value={route.destination} onChange={setRoute} />
                               {errors.name && <ErrorsBox error={errors.destination[0]} />}
                            </span>
                            {errors.system && <ErrorsBox error={errors.system[0]} />}
                            <span className="mt-4 flex justify-end">
                                {loading &&
                                    <span className="justify-self-center">
                                        <img className="max-w-6 max-h-6" src={gif} alt="loading" />
                                    </span>
                                }
                                {!loading &&
                                    <>
                                        <Button func={handleCalculateRoute} text="Calcular rota" />
                                    </>
                                }
                            </span>
                        </form>
                    </div>
                    }
                    {sucess && !loading &&
                        <div className="w-full sm:px-6 md:px-12 mt-6">
                            <Maps destination={routeResult?.destination} origin={routeResult?.origin} />
                            <div className="px-4">
                                <span className="flex justify-between items-center">
                                    <h2 className="text-xl my-4">Motoristas disponíveis:</h2>
                                    <button onClick={() => setSucess(!sucess)} className="border-solid border-gray-400 border-[1px] rounded-sm max-h-8 px-2">Outro destino</button>
                                </span>
                                <div className="flex justify-center flex-wrap gap-6">
                                    {drivers.map((driver, i) => {
                                        if(!driver){
                                            return (
                                                <p>Não há motoristas disponíveis</p>
                                            )
                                        }
                                        return (
                                            <div className="flex" key={i}>
                                                <Drivers routeResult={routeResult} driver={driver} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
