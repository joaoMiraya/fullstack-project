import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/authContext";


function Header(){
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const bref = useRef<HTMLButtonElement>(null);
    const { isAuth, user } = useAuth();

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            if (bref.current && bref.current.contains(event.target as Node)) {
                return;
            }
            setOpen(false);
        }
      };

      useEffect(() => {
        if(open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [open]);

    return(
        <>
            <header className="bg-[#1C1C1E] px-[2rem] h-[6rem]">
                <div className="flex h-full justify-between text-white">
                    <span className="flex items-center text-xl font-semibold">
                        <Link to={'/'}><h1>Taxi</h1></Link>
                    </span>
                    <nav className="flex items-end">
                        <ul className="hidden md:flex  gap-3">
                            <li className="hover:opacity-70 duration-300 cursor-pointer"><Link to={'/'}>Home</Link></li>
                           {isAuth && <li className="hover:opacity-70 duration-300 cursor-pointer"><Link to={`/profile/${user?.uid}`}>Perfil</Link></li>}
                        </ul>
                        <div className="md:hidden mb-4">
                            <button ref={bref} onClick={() => setOpen(!open)} className={`flex flex-col gap-1 ${open ? 'active' : ''}`}>
                                <span className="hamburguer__stick first__stick"></span>
                                <span className="hamburguer__stick second__stick"></span>
                                <span className="hamburguer__stick third__stick"></span>
                        </button>
                        </div>
                    </nav>
                </div>
            </header>
            <aside ref={ref} className={`absolute duration-300 z-50 ${open ? 'right-0' : 'right-full'}`}>
                <nav className="bg-[#1C1C1E] pt-12">
                    <ul className="flex flex-col items-center text-white h-screen min-w-48 gap-3">
                    <li className="hover:opacity-70 duration-300 cursor-pointer"><Link to={'/'}>Home</Link></li>
                        {isAuth && <li className="hover:opacity-70 duration-300 cursor-pointer"><Link to={`/profile/${user?.uid}`}>Perfil</Link></li>}
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default Header;