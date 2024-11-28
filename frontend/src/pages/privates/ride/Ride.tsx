import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { Maps } from "../trips/components/Maps";
import { RideProps } from "../../../types/types";
import { formatToBRL } from "../../../scripts/moneyFormater";
import { convertTime } from "../../../scripts/main";
import { api } from "../../../services/api";
import { Button } from "../../components/utils/Button";
import { useNavigate } from "react-router-dom";


export const Ride = () => {
    const [ride, setRide] = useState<RideProps | undefined>();
    const [rating, setRating] = useState(0);
    const {getCurrentRide, user, setEndRide} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const rideData: RideProps | undefined = getCurrentRide();
        if (rideData) {
            setRide(rideData);
        }
        
    }, [getCurrentRide]);

    const handleGetRating = () => {
        api.get(`driver/rating/${ride?.driver}`).then((res) => {
            setRating(res.data);
        })
    };

    const handleDoneRide = () => {
        if(!ride?.rId) {
            return
        }
        api.post('ride/done', {rId: ride.rId}).then(() => {
            setEndRide();
            navigate(`/profile/${user?.uid}`);
        }).catch(err => {
            console.log(err);
        })
    };

    const handleCancelRide = () => {
        if(!ride?.rId) {
            return
        }
        api.post('ride/cancel', {rId: ride.rId}).then(() => {
            setEndRide();
            navigate('/');
        }).catch(err => {
            console.log(err);
        })
    };
    
    handleGetRating();
    if(!ride?.origin || !ride.destination) {
        return <p>Aguarde...</p>
    };

    return (
        <>
            <div className="min-h-screen flex justify-center">
                <div className="flex flex-col mt-12 max-w-[32rem]">
                    <div className="flex justify-center">
                        <span className="bg-[#2C2C2E] max-w-[26rem] sm:min-w-[22rem] mb-4 rounded-t-sm p-4 text-white text-center text-xl">
                            <h1 className="text-xl text-center">Seu motorista está a caminho</h1>
                        </span>
                    </div>
                    <div>
                        <Maps origin={JSON.parse(ride?.origin)} destination={JSON.parse(ride?.destination)} />
                    </div>
                    <div className="flex flex-col mt-6 bg-[#2C2C2E] text-[#F5F5F7] p-2 rounded-b-sm">
                        <h2 className="text-center mb-2">Dados da sua viajem</h2>
                        <hr />
                        <div>
                            <ul>
                                <li className="flex justify-between gap-6 items-baseline">
                                    <span className="flex gap-2">
                                        <p>Motorista:</p>
                                        <p className=""> {ride.driver_name}</p>
                                    </span>
                                    <span className="text-sm">{ride.car}</span>
                                </li>
                                <li className="flex justify-between">
                                    <p>Valor:</p>
                                    <p className="text-sm">{formatToBRL(ride.value)}</p>
                                </li>
                                <li className="flex justify-between">
                                    <p>Duração:</p>
                                    <p className="text-sm">{convertTime(ride.duration)}</p>
                                </li>
                                <li className="flex justify-between">
                                    <p>Nota do motorista:</p>
                                    <p className="text-sm">{rating}/5</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <span className="flex w-full py-2 justify-between">
                        <Button theme={'bg-[#FF9900]'} func={handleCancelRide} text="Cancelar corrida"/>
                        <Button func={handleDoneRide} text="Finalizar corrida"/>
                    </span>
                </div>
            </div>
        </>
    )
};