import '../index.css';
import { useState } from 'react';
import Login from "./login/Login";
import { Register } from './components/register/Register';

function Home(){
  const [login, setLogin] = useState(true);

  const handleChangeForm = () => {
    setLogin(!login)
  };

    return(
        <>
        <div className="flex flex-col items-center p-[2rem] min-h-screen pb-12">
          <div className='min-w-[16rem] sm:min-w-[28rem] mb-6'>
            {login&&
              <Login func={handleChangeForm} />
            }
            {!login&&
            <Register func={handleChangeForm} />
            }
          </div>
        </div>
        </>
    )
}

export default Home;