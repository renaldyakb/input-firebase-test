import React, { useState, useEffect } from "react";
import Loading from "../components/loading";

const HomePage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const jsonData = await res.json();
      setData(jsonData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <Loading />
        </>
      ) : (
        <div className='space-y-5 pt-11'>
          {data.map((item) => (
            <div key={item.id} className='bg-slate-300 space-y-3'>
              <h1>{item.title}</h1>
              <p>{`$ ${item.price}`}</p>
              <img src={item.image} alt='' width='100' />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default HomePage;
