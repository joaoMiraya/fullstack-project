import { useEffect, useState } from "react"
import { DriverInterface, RouteResultProps } from "../../../../types/types"
import { formatToBRL } from '../../../../scripts/moneyFormater';
import { api } from "../../../../services/api";
import { useAuth } from "../../../../context/authContext";
import { Rating } from "./Rating";
import { Link, useNavigate } from "react-router-dom";

interface DriverProps {
    driver: DriverInterface;
    routeResult: RouteResultProps | undefined;
};

export const Drivers = (props: DriverProps) => {
    const [driver, setDriver] = useState<DriverInterface>({
        name: '',
        uid: '',
        car: '',
        minKm: 0,
        fee: 0,
        description: '',
        review: 
        [
            {
                rating: 0,
                comment: ''
            }
        ]
    });
    const [open, setOpen] = useState(false);
    const {user, setInRide} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(props.driver) {
            setDriver(props.driver)
        }
    },[props.driver]);

    const handleGetRide = () => {
        if (!props.routeResult || !user) {
            console.error("Required datas");
            return;
        }
        const data = {
            customer_id: user?.uid,
            origin: JSON.stringify(props.routeResult?.origin),
            destination: JSON.stringify(props.routeResult?.destination),
            distance: props.routeResult?.distance,
            duration: props.routeResult?.duration,
            driver: driver.uid,
            value: driver.fee,
            car: driver.car
        };
        api.post('ride/confirm', data).then((res) => {
            setInRide({...data, driver_name: driver.name, car: driver.car, rId: res.data.race?.rId});
            navigate(`/ride/${res.data.race?.rId}`)
        }).catch((err) => {
            alert(err.response.data.error_description)
            console.log(err);
        });
    };

    return (
        <>
            <div className="flex flex-col shadow-md min-w-[20rem] md:w-[20rem] mt-6 border-solid border-[1px] border-gray-400 rounded-md p-6">
                    <div className="flex justify-start gap-3">
                        <span className="bg-gray-500 rounded-full justify-center items-center text-white flex min-h-[3rem] min-w-[3rem] max-h-[3rem] max-w-[3rem]">{driver.name.charAt(0).toUpperCase()}</span>
                        <div className="flex justify-between w-full flex-col gap-3">
                            <span className="flex justify-between">
                                <span>
                                    <Link to={`/driver/${driver.uid}`}><h3 className="hover:underline text-[#00ADEF] duration-300">{driver.name}</h3></Link>
                                    <p className="whitespace-nowrap text-sm">{driver.car}</p>
                                </span>
                                <p className="font-semibold">{formatToBRL(driver.fee)}</p>
                            </span>
                            <div className="text-sm max-w-[10rem] min-h-8">
                                <p>{driver.description}</p>
                            </div>
                        </div>
                    </div>
                <span className="flex justify-between mt-4">
                    <button onClick={() => handleGetRide()} className="px-4 bg-[#00ADEF] rounded-full text-white">Escolher</button>
                    <button onClick={() => setOpen(!open)} className="underline">{open ? 'Esconder' : 'Ver avaliações'}</button>
                </span>
                {open &&
                    <div className="mt-6 p-2 rounded-md bg-gray-200">
                        {driver.review?.map((val, i) => {
                            if(!val.comment && !val.rating) {
                                return <p key={`no-review${i}`} className="text-sm ">Ainda não há avalizações</p>
                            }
                            return (
                                <span key={i}>
                                    <Rating comment={val.comment} rating={val.rating}/>
                                </span>
                            )
                        })}
                    </div>
                }
    
            </div>
        </>
    )
}