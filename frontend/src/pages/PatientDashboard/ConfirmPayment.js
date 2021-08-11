import React,{useEffect} from "react";
import { useParams } from "react-router-dom";

const ConfirmPayment = () => {
  const { id } = useParams();
  const params = window.location.search
  console.log(params)

  useEffect(() => {
    let fetchData;
    try {
      fetchData = async () => {
        const response = await fetch(
          "https://localhost:3000/confirmpayment/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            }
          }
        );
        const result = await response.json();
        if (result === null) {
          console.log("unidentified token");
        } else {
            console.log(result)
        //   setDetailsHandler(result);
        }
        if (response.ok) {
          console.log("done");
        }
      };
    } catch (err) {
      console.log(err);
    }
    fetchData();
  }, []);
  return (
    <div>
      <div style={{ fontSize: "50px" }}>Now showing post {id}</div>
      <div style={{ fontSize: "50px" }}>Now showing post {id}</div>
      <div style={{ fontSize: "50px" }}>Now showing post {id}</div>
      <div style={{ fontSize: "50px" }}>Now showing post {id}</div>
    </div>
  );
};

export default ConfirmPayment;
