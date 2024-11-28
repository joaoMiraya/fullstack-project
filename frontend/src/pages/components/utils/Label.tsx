
interface LabelInterface {
    name: string;
    value: string;
};

export const Label = (props: LabelInterface) => {

    return(

        <>
            <label className="text-sm text-gray-600" htmlFor={props.name}>{props.value}</label>
        </>
    )
}