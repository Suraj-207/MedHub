import React,{useEffect} from 'react'

const CheckLogin = () => {

    useEffect(() => {
        let fetchData;
        
        try {
          fetchData = async () => {
            const response = await fetch("http://localhost:5000/api/check-login");
            const data = await response.json();
            console.log(data);
            // if(response!== 200){
            //   setLoad(false);
            //   setErr(true)
            // }
          };
        } catch (err) {
          console.log(err);
        }
    
        fetchData();
      }, []);

    return (
        <div>
            <h1>check login</h1>
        </div>
    )
}

export default CheckLogin
