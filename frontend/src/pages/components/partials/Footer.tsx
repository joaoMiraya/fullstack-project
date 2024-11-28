
export const Footer = () => { 
    
    const year = new Date().getFullYear();
    return(
        <>
            <footer className="bg-[#1C1C1E] p-[2rem] mt-12">
                <div className="flex justify-center items-center text-center text-white">
                    <p>Shopper © Todos os direitos reservados - {year}</p>
                </div>
            </footer>
        </>
    )
}
