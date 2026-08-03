import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function MyProducts() {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:8080/api/products/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setProducts(response.data);

            } catch (error) {
                console.error(error);
                alert("Failed to load products");
            }
        };

        fetchProducts();

    }, []);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this product?")) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8080/api/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProducts(products.filter(product => product.id !== id));

            alert("Product Deleted Successfully");

        } catch (error) {

            console.error(error);
            alert("Failed to delete product");

        }
    };

    return (

        <div className="min-h-screen bg-gray-100 p-10">
            <Navbar />


            <h1 className="text-3xl font-bold text-blue-600 mb-8">
                My Products
            </h1>

            <div className="grid md:grid-cols-3 gap-6">

                {products.map((product) => (

                    <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-lg p-5"
                    >

                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg"
                        />

                        <h2 className="text-xl font-bold mt-4">
                            {product.name}
                        </h2>

                        <p className="text-gray-600">
                            {product.description}
                        </p>

                        <p className="font-semibold mt-2">
                            ₹ {product.price}
                        </p>

                        <p>
                            Stock : {product.stock}
                        </p>

                        <p>
                            Category : {product.category}
                        </p>

                        <div className="flex gap-3 mt-5">

                            <Link
                                to={`/vendor/edit-product/${product.id}`}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
}

export default MyProducts;