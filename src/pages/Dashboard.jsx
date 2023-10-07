import React, { useState, useEffect } from "react";
import { db, storage } from "../lib/utils/firebase";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const Dashboard = () => {
  const [nama, setNama] = useState("");
  const [kerja, setPekerjaan] = useState("");
  const [file, setFile] = useState(null); // State untuk mengelola file yang akan diunggah
  const [data, setData] = useState([]); // State untuk menyimpan data dari Firestore
  const [isEmpty, setIsEmpty] = useState(true); // State untuk menentukan apakah data kosong

  // TAMPILKAN DATA
  useEffect(() => {
    // Mengambil data dari Firestore saat komponen dimuat
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "test-data"));
        const dataArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(dataArray);
        setIsEmpty(dataArray.length === 0);
      } catch (error) {
        console.error("Gagal mengambil data dari Firestore:", error);
      }
    };

    fetchData();
  }, []); // Gunakan array kosong untuk memastikan hanya dijalankan sekali saat komponen dimuat

  // HAPUS DATA
  const handleDelete = async (id, gambar) => {
    // Menampilkan dialog konfirmasi
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );

    if (!confirmDelete) {
      // Pengguna membatalkan penghapusan
      return;
    }

    try {
      // Hapus data dari Firestore
      await deleteDoc(doc(db, "test-data", id));

      // Hapus gambar dari Firebase Storage jika ada
      if (gambar) {
        const fileRef = ref(storage, gambar);
        await deleteObject(fileRef);
      }

      // Perbarui state data setelah penghapusan
      setData((prevData) => prevData.filter((item) => item.id !== id));
      setIsEmpty(data.length === 1); // Perbarui status isEmpty

      console.log("Data berhasil dihapus");
    } catch (error) {
      console.error("Gagal menghapus data:", error);
    }
  };

  // SIMPAN DATA
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newData = {
        nama,
        kerja,
        timestamp: Date.now(), // Menambahkan properti timestamp dengan waktu saat ini
      };

      // Simpan data ke Firestore
      const docRef = await addDoc(collection(db, "test-data"), newData);

      if (file) {
        // Jika ada file yang akan diunggah
        const fileRef = ref(
          storage,
          `images/${docRef.id}/${file.name.replace(/\.[^/.]+$/, "")}.webp`
        ); // Menyimpan file dalam folder /images dengan nama sesuai docRef
        await uploadBytes(fileRef, file); // file adalah berkas yang ingin diunggah
        const gambar = await getDownloadURL(fileRef); // Mendapatkan URL file yang telah diunggah
        await updateDoc(doc(db, "test-data", docRef.id), {
          gambar, // Menambahkan field fileUrl ke dalam docRef
        });

        // Tambahkan data baru ke dalam state data
        setData((prevData) => [
          { id: docRef.id, ...newData, gambar },
          ...prevData, // Menambahkan data sebelumnya
        ]);
      } else {
        // Tambahkan data baru ke dalam state data (tanpa gambar jika tidak ada file)
        setData((prevData) => [
          { id: docRef.id, ...newData },
          ...prevData, // Menambahkan data sebelumnya
        ]);
      }

      // Reset form
      setNama("");
      setPekerjaan("");
      setFile(null);

      // Perbarui status isEmpty setelah penambahan data baru
      setIsEmpty(false);

      console.log("Data berhasil ditambahkan");
    } catch (error) {
      console.error("Gagal menambahkan data:", error);
    }
  };

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
      // second: "2-digit",
    });
  };

  return (
    <div className='pt-10'>
      <h1 className='font-bold'>Dashboard</h1>
      <form onSubmit={handleSubmit} className='flex items-center'>
        <input
          type='text'
          value={nama}
          placeholder='nama'
          className='border p-1 border-sky-900'
          onChange={(e) => setNama(e.target.value)}
        />

        <input
          type='text'
          value={kerja}
          placeholder='pekerjaan'
          className='border p-1 border-sky-900 ml-2'
          onChange={(e) => setPekerjaan(e.target.value)}
        />

        <input
          type='file'
          accept='image/*' // Batasi unggahan hanya pada berkas gambar
          onChange={(e) => setFile(e.target.files[0])} // Mengambil file gambar dari input file
        />

        <button className='p-3 bg-blue-600 rounded-lg ml-4' type='submit'>
          Tambah Data
        </button>
      </form>

      {/* Menampilkan data dari Firestore yang telah diurutkan berdasarkan waktu inputan terbaru hingga yang terdahulu */}
      <h2 className='text-xl font-semibold'>Data dari Firestore:</h2>
      <div className='mt-6 bg-slate-200 h-[44em] overflow-scroll py-10 relative'>
        {isEmpty ? (
          <p className='font-bold absolute inset-0 top-1/2 text-center'>
            GAK ADA DATA BANG !!
          </p>
        ) : (
          <ul className='space-y-3'>
            {data
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((item) => (
                <div
                  key={item.id}
                  className='bg-slate-300 rounded-xl shadow-lg flex relative p-2 w-10/12 space-x-3  mx-auto items-center '
                >
                  {item.gambar && (
                    <>
                      <img
                        src={item.gambar}
                        alt={`Gambar ${item.nama}`}
                        className='rounded-full w-16 h-16 object-cover'
                        width='50'
                        height='50'
                      />
                      <button
                        onClick={() => handleDelete(item.id, item.gambar)}
                        className='p-2 absolute bg-red-600 rounded-lg right-6 text-white ml-2'
                      >
                        Hapus
                      </button>
                    </>
                  )}
                  <div>
                    <p className='text-sm text-blue-800'>
                      {formatTimestamp(item.timestamp)}
                    </p>
                    <p>
                      <b>Nama :</b> {item.nama}
                    </p>
                    <p>
                      <b> Pekerjaan :</b> {item.kerja}
                    </p>
                  </div>
                  {!item.gambar && (
                    <button
                      onClick={() => handleDelete(item.id, null)}
                      className='p-2 absolute right-5 bg-red-600 rounded-lg text-white ml-2'
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
