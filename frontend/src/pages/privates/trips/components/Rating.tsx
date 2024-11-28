import RatingStars from "../../../components/utils/Rating";

interface RatingProps {
    rating: number;
    comment: string;
};

export const Rating = (props: RatingProps) => {

    return (

        <>
            <div className="flex flex-col justify-center items-baseline gap-2 mb-2 bg-white rounded-md p-2 shadow-inner">
                    <RatingStars count={5} value={props.rating} />
                <span>
                    <p className="text-[12px]">{props.comment}</p>
                </span>
            </div>
        </>
    )
}