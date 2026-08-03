import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function ProductDetails() {

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `http://localhost:8080/api/products/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setProduct(response.data);

            } catch (error) {

                console.error(error);
                alert("Failed to load product");

            }

        };

        fetchProduct();

    }, [id]);

    if (!product) {
        return <h2 className="text-center mt-10">Loading...</h2>;
    }

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">

                <div className="grid md:grid-cols-2 gap-10">

                    <img
                        src={
                            product.imageUrl && product.imageUrl.trim() !== ""
                                ? product.imageUrl
                                : "https://via.placeholder.com/500x400?text=No+Image"
                        }
                        alt={product.name}
                        className="rounded-xl w-full h-96 object-cover"
                    />

                    <div>

                        <h1 className="text-4xl font-bold">
                            {product.name}
                        </h1>

                        <p className="text-gray-600 mt-4">
                            {product.description}
                        </p>

                        <h2 className="text-3xl text-blue-600 font-bold mt-6">
                            ₹ {product.price}
                        </h2>

                        <p className="mt-4">
                            <strong>Category:</strong> {product.category}
                        </p>

                        <p className="mt-2">
                            <strong>Stock:</strong> {product.stock}
                        </p>

                        <p className="mt-2">
                            <strong>Seller:</strong> {product.vendorName}
                        </p>

                        <button
                            className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
                        >
                            Add to Cart
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default ProductDetails;