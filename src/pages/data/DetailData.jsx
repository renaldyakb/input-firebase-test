import { useState, useEffect } from "react";
import { db } from "../../lib/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useLocation, useParams } from "react-router-dom";
import "animate.css";

const DetailData = () => {
  const { id } = useParams();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const nama = searchParams.get("nama");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataDoc = await getDoc(doc(db, "test-data", id));
        if (dataDoc.exists()) {
          setData(dataDoc.data());
        } else {
          console.log("Data tidak ditemukan");
        }
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, nama]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Data tidak ditemukan.</p>;
  }

  return (
    <div className='flex flex-col justify-center h-screen items-center'>
      <img
        src={data.gambar}
        alt={"gambar " + data.nama}
        className='w-[18em] h-[18em] rounded-full animate__animated animate__fadeInDown object-cover'
        width={340}
      />
      <p className='text-[2em]'>{data.nama}</p>
      <p>{data.kerja}</p>
      {/* Tampilkan informasi detail data lainnya di sini */}
    </div>
  );
};

export default DetailData;
