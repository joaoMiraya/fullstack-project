
type Error = {
    error: string;
}

export const ErrorsBox = (props: Error) => {

    return (
        <>
        
            <div className="flex text-red-400 rounded-md text-sm my-1">
                <p>{props.error}</p>
            </div>
        </>
    )
}