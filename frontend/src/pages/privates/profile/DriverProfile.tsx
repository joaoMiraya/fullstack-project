import { useEffect, useState } from "react"
import { History } from "../../components/utils/History"
import { api } from "../../../services/api";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { DriverInterface, HistoryProps } from "../../../types/types";


export const DriverProfile = () => {
    const location = useLocation();
    const uid = location.pathname.split('/').pop();
    const { user } = useAuth();

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
    const [history, setHistory] = useState<HistoryProps[]>([]);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        if(!user || !uid) {
            return
        }

        api.get(`driver/${uid}`).then((res) => {
            setDriver(res.data);
        }).catch((err) => {
            console.log(err);
        })
        api.get(`ride/${user?.uid}/${uid}`).then((res) => {
            setHistory(res.data)
        }).catch((err) => {
            console.log(err);
        })
        api.get(`driver/rating/${uid}`).then((res) => {
            setRating(res.data)
        }).catch((err) => {
            console.log(err);
        })
    }, [uid, user]);

    return (
        <>
            <div className="flex min-h-screen pt-12">
                <div className="flex flex-col items-center w-full">
                    <div className="flex justify-center">
                        <span className="bg-[#2C2C2E] relative flex justify-center items-center max-h-[4rem] max-w-[26rem] min-w-[22rem] mb-4 rounded-t-sm p-4 text-white text-center text-xl">
                            <span className="flex items-center justify-center w-[4rem] h-[4rem] rounded-full bg-[#2C2C2E] border-white border-solid border-2 text-3xl">{driver?.name.charAt(0)}</span>
                        </span>
                    </div>
                    <div className="flex w-full max-w-[22rem]">
                        <span className="flex justify-between w-full">
                            <p>{driver?.name}</p>
                            <p className="text-sm">{rating || 0}/5</p>
                        </span>
                    </div>
                    <div className="py-4 flex flex-col gap-2 w-full max-w-[22rem]">
                        {history.length > 0 ? 
                        <h2>Suas viagens com {driver.name}</h2>
                        :<p className="text-sm">Você ainda não possui viagens com esse motorista</p>}
                        {history.map((element, i) => {
                            return (
                                <span key={i}>
                                    <History showName={false} {...element} />
                                </span>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}