import React, { useState } from "react";
import { BsCloudUpload } from "react-icons/bs";
import { ImagetoBase64 } from "../utils/ImagetoBase64";
import toast from "react-hot-toast";
const Newproduct = () => {
  const [data, setData] = useState({
    name: "",
    category: "",
    image: "",
    price: "",
    description: "",
  });
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, image, category, price } = data;
    if (name && image && category && price) {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/uploadproduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const fetchRes = await fetchData.json();
      console.log(fetchRes);
      toast(fetchRes.message);
      setData(() => {
        return {
          name: "",
          category: "",
          image: "",
          price: "",
          description: ""
        };
      });
    } else {
      toast("Please fill all fields");
    }
    // send data to server
  };
  const uploadImage = async (e) => {
    const data = await ImagetoBase64(e.target.files[0]);
    setData((preve) => {
      return {
        ...preve,
        image: data,
      };
    });
  };
  return (
    <div className="p-4">
      <form
        className="m-auto w-full max-w-md  shadow flex flex-col p-3 bg-white"
        onSubmit={handleSubmit}
        method="post"
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="bg-slate-200 p-1 m-1"
          onChange={handleOnchange}
          value={data.name}
        />

        <label htmlFor="category">Category</label>
        <select
          className="bg-slate-200 p-1 m-1"
          id="category"
          name="category"
          onChange={handleOnchange}
          value={data.category}
        >
          <option value="other">Select Category</option>
          <option value="vegetable">Vegetable</option>
          <option value="fruit">Fruit</option>
          <option value="meat">Meat</option>
          <option value="dairy">Dairy</option>
          <option value="bakery">Bakery</option>
          <option value="grains">Grains</option>
          <option value="beauty">Beauty</option>
          <option value="oil & masala">Oil & Masala</option>
        </select>

        <label htmlFor="image">
          Image
          <div className="h-40 w-full bg-slate-200 m-1 rounded flex items-center justify-center cursor-pointer">
            {data.image ? (
              <img src={data.image} className="h-full" alt={data.name}></img>
            ) : (
              <span className="text-5xl">
                <BsCloudUpload />
              </span>
            )}

            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={uploadImage}
              className="hidden"
            ></input>
          </div>
        </label>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="bg-slate-200 p-1 m-1  resize-none overflow-hidden "
          rows={2}
          onChange={handleOnchange}
          value={data.description}
        />

        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          className="bg-slate-200 p-1 m-1"
          onChange={handleOnchange}
          value={data.price}
        />

        <button className="max-w-[150px] m-auto p-2   bg-orange-500 w-full hover:bg-orange-600 cursor-pointer text-lg rounded-lg mt-4 text-white font-medium drop-shadow-sm text-center">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Newproduct;
