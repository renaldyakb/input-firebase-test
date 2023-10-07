import { useState, useEffect } from "react";
import { db } from "../../lib/utils/firebase";
import { getDocs, collection } from "firebase/firestore";
import Loading from "../../components/loading";
import { Link } from "react-router-dom";

const Data = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDocs(collection(db, "test-data"));
        const dataArray = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Urutkan data berdasarkan timestamp dari yang terbaru ke yang terlama
        dataArray.sort((a, b) => b.timestamp - a.timestamp);

        setData(dataArray);
        setLoading(false);
      } catch (error) {
        console.log("gagal bang !!", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk mengubah timestamp menjadi format tanggal dan jam
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    // Format tanggal dan jam sesuai preferensi Anda (contoh: "7/okt/2023 14:30:45")
    return date.toLocaleString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className='pt-16 w-7/12 mx-auto space-y-3'>
          {data.map((doc, index) => (
            <div
              key={index}
              className='bg-slate-300 hover:bg-slate-400 hover:scale-105 duration-150 rounded-2xl p-2 items-center space-x-3'
            >
              {/* Menggunakan Link untuk menavigasi ke DetailData */}
              <Link to={`/data/${doc.id}?echo=${encodeURIComponent(doc.nama)}`}>
                <div className='flex items-center space-x-4 hover:'>
                  <img
                    className='rounded-full w-20 h-20 , object-cover'
                    src={doc.gambar}
                    alt=''
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className='text-sm text-zinc-600'>
                      {formatTimestamp(doc.timestamp)}
                    </p>
                    <h1 className='font-bold'>{doc.nama}</h1>
                    <p>{doc.kerja}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Data;
