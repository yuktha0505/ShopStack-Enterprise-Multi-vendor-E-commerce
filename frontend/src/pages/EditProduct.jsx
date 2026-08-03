import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        imageUrl: ""
    });

    useEffect(() => {

        const fetchProduct = async () => {

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

                const selectedProduct = response.data.find(
                    (p) => p.id === Number(id)
                );

                if (selectedProduct) {
                    setProduct(selectedProduct);
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchProduct();

    }, [id]);

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

            await axios.put(
                `http://localhost:8080/api/products/${id}`,
                product,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Product Updated Successfully");

            navigate("/vendor/my-products");

        } catch (error) {
            console.error(error);
            alert("Failed to update product");
        }
    };

    return (

        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-3xl mx-auto pt-10">

                <div className="bg-white shadow-lg rounded-xl p-8">

                    <h1 className="text-3xl font-bold text-blue-600 mb-8">
                        Edit Product
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <input
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            placeholder="Product Name"
                            className="w-full border rounded-lg p-3"
                        />

                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            placeholder="Price"
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            type="number"
                            name="stock"
                            value={product.stock}
                            onChange={handleChange}
                            placeholder="Stock"
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            placeholder="Category"
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            name="imageUrl"
                            value={product.imageUrl}
                            onChange={handleChange}
                            placeholder="Image URL"
                            className="w-full border rounded-lg p-3"
                        />

                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                        >
                            Update Product
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );
}

export default EditProduct;