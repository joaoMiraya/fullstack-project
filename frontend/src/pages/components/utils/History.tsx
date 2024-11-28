import { useEffect, useState } from "react"
import { convertMetersInKm, convertTime, formatDate, formatMoney } from "../../../scripts/main"
import { HistoryProps } from "../../../types/types"
import { api } from "../../../services/api";
import RatingStars from "./Rating";
import { Label } from "./Label";
import { Link } from "react-router-dom";



export const History = (props:HistoryProps) => {
    const [ origin, setOrigin ]= useState('');
    const [ dest, setDest ]= useState('');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);

    useEffect(()=> {
        const parsedOrigin = JSON.parse(props.origin);
        const parsedDestination = JSON.parse(props.destination);

        api.get(`ride/get/address/${parsedOrigin[0].lat}/${parsedOrigin[0].lng}`).then((res) => {
           setOrigin(res.data);
         }).catch((err) => {
             console.log(err);
         });
         api.get(`ride/get/address/${parsedDestination[0].lat}/${parsedDestination[0].lng}`).then((res) => {
            setDest(res.data);
          }).catch((err) => {
              console.log(err);
          });
      
    }, [props.origin, props.destination]);

    const handleRating = () => {
        const data = {
            customerId: props.passenger_id,
            driverId: props.driver_id,
            racingId: props.r_id,
            stars: rating,
            comment: comment
        };

        api.post('ride/rating', data).then(() => {
            window.location.reload();
        }).catch((err) => {
            console.log(err);
        })
    };

    return (

        <div className="p-2 border-solid border-[1px] border-gray-4000 rounded-sm">
            <p className="text-[12px] place-self-end">{formatDate(props.created_at, true)}</p>
            <span className="flex items-baseline justify-between text-sm">
            {props.showName &&<Link to={`/driver/${props.driver_id}`}><p className="hover:underline text-[#00ADEF] duration-300">{props.driver}</p></Link>}
            <p>{props.car}</p>
            </span>
            <span>
                <p className="text-sm">Origem:</p>
                <p className="text-[12px]">{origin}</p>
                <hr className="my-2" />
                <p className="text-sm">Destino:</p>
                <p className="text-[12px]">{dest}</p>
            </span>
            <hr className="my-2" />
            <span className="flex items-baseline justify-between text-sm">
                <p>Duração:</p>
                <p>{convertTime(props.duration)}</p>
            </span>
            <span className="flex items-baseline justify-between text-sm">
                <p>Distancia:</p>
                <p>{convertMetersInKm(props.distance)} Km</p>
            </span>
            <hr className="my-2" />
            <span className="flex items-baseline justify-between text-sm">
                <p>Valor:</p>
                <p>{formatMoney(props.value)}</p>
            </span>
            <hr className="my-2"/>
            {props.rating &&
                <span>
                    <p>Sua avaliação</p>
                    <RatingStars count={5} value={props.rating} />
                </span>
            }
            {!props.rating &&
                <span>
                    <p>Avalie essa corrida</p>
                    <RatingStars
                        count={5}
                        value={rating}
                        edit={true}
                        onChange={(value) => setRating(value)}
                    />
                    {rating > 0 &&
                        <span className="flex flex-col gap-2 mt-2">
                            <Label name="comment" value="Comentário:" />
                            <input placeholder="Comente sobre a corrida" className="border-solid border-gray-400 border-[1px] rounded-full outline-none pl-2 text-sm" type="text" name="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                            <button onClick={() => handleRating()} className="text-sm bg-[#00ADEF] shadow-md text-white rounded-full px-2">Enviar</button>
                        </span>
                     }
                </span>
            }
        </div>
    )
}