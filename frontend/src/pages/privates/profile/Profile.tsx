import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext"
import { api } from "../../../services/api";
import { formatDate } from "../../../scripts/main";
import { HistoryProps } from "../../../types/types";
import { History } from "../../components/utils/History";



export const Profile = () => {
    const [history, setHistory] = useState<HistoryProps[]>([]);
    const { user, logout } = useAuth();

    useEffect(()=> {
        if(user && user.uid) {
            const uid = user.uid;
            api.get(`ride/${uid}`).then((res) => {                
                setHistory(res.data);
            }).catch((err) => {
                console.log(err);
            })
        }
    },[user]);

    return (
        <>
            <div className="flex min-h-screen pt-12">
                <div className="flex flex-col items-center w-full">
                    <div className="flex justify-center">
                        <span className="bg-[#2C2C2E] relative flex justify-center items-center max-h-[4rem] max-w-[26rem] min-w-[22rem] mb-4 rounded-t-sm p-4 text-white text-center text-xl">
                            <span className="flex items-center justify-center w-[4rem] h-[4rem] rounded-full bg-[#2C2C2E] border-white border-solid border-2 text-3xl">{user?.name.charAt(0)}</span>
                            <button onClick={() => logout()} className=" text-sm self-end absolute right-[-1px] bottom-[-12px] mb-3 ml-3 px-4 bg-[#FF9900] text-white font-semibold shadow-md rounded-bl-2xl">Logout</button>
                        </span>
                    </div>
                    <div className="flex w-full max-w-[22rem]">
                        <span className="flex justify-between w-full">
                            <p>{user?.name}</p>
                            <p className="text-sm">{formatDate(user?.createdAt)}</p>
                        </span>
                    </div>
                    <div className="py-4 flex flex-col gap-2 w-full max-w-[22rem]">
                    {history.length > 0 ? 
                        <h2>Seu histórico de viagens</h2>
                        :<p className="text-sm">Você ainda não possui nenhuma viagem</p>}
                        
                        {history.map((element, i) => {
                            return (
                                <span key={i}>
                                    <History showName={true} {...element} />
                                </span>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}