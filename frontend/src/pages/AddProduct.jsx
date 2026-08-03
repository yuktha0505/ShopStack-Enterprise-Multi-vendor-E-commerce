import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AddProduct() {

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        imageUrl: ""
    });

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:8080/api/products",
                product,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data);

            setProduct({
                name: "",
                description: "",
                price: "",
                stock: "",
                category: "",
                imageUrl: ""
            });

        } catch (error) {

            console.error(error);
            alert("Failed to add product");

        }
    };

    return (

        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-3xl mx-auto pt-10">

                <div className="bg-white rounded-xl shadow-lg p-8">

                    <h1 className="text-3xl font-bold text-blue-600 mb-8">
                        Add Product
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            value={product.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={product.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={product.price}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={product.stock}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={product.category}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            type="text"
                            name="imageUrl"
                            placeholder="Image URL"
                            value={product.imageUrl}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Add Product
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );
}

export default AddProduct;