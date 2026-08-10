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
        discount: "",
        stock: "",
        category: "",
        imageUrl: ""
    });

    const [loading, setLoading] = useState(true);


    // Fetch product
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

                    setProduct({
                        name: selectedProduct.name || "",
                        description: selectedProduct.description || "",
                        price: selectedProduct.price || "",
                        discount: selectedProduct.discount ?? 0,
                        stock: selectedProduct.stock || "",
                        category: selectedProduct.category || "",
                        imageUrl: selectedProduct.imageUrl || ""
                    });

                }

            } catch (error) {

                console.error("Error loading product:", error);

            } finally {

                setLoading(false);

            }

        };

        fetchProduct();

    }, [id]);


    // Handle input changes
    const handleChange = (e) => {

        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });

    };


    // Calculate final price for preview
    const finalPrice =
        product.price
            ? Number(product.price) -
            (Number(product.price) *
                Number(product.discount || 0)) /
            100
            : 0;


    // Update product
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const productData = {
                ...product,
                price: Number(product.price),
                discount: Number(product.discount || 0),
                stock: Number(product.stock)
            };

            await axios.put(
                `http://localhost:8080/api/products/${id}`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Product Updated Successfully");

            navigate("/vendor/my-products");

        } catch (error) {

            console.error("Update error:", error);

            if (error.response) {
                alert(error.response.data);
            } else {
                alert("Failed to update product");
            }

        }

    };


    if (loading) {

        return (
            <div className="min-h-screen bg-gray-100">

                <Navbar />

                <h2 className="text-center mt-10 text-xl">
                    Loading Product...
                </h2>

            </div>
        );

    }


    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="max-w-3xl mx-auto pt-10 pb-10">

                <div className="bg-white shadow-lg rounded-xl p-8">

                    <h1 className="text-3xl font-bold text-blue-600 mb-8">
                        Edit Product
                    </h1>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Product Name */}

                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            placeholder="Product Name"
                            required
                            className="w-full border rounded-lg p-3"
                        />


                        {/* Description */}

                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            placeholder="Description"
                            required
                            className="w-full border rounded-lg p-3"
                        />


                        {/* Price */}

                        <div>

                            <label className="block font-semibold mb-2">
                                Product Price (₹)
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                placeholder="Price"
                                min="0"
                                required
                                className="w-full border rounded-lg p-3"
                            />

                        </div>
                        

                        {/* Discount */}

                        <div>

                            <label className="block font-semibold mb-2">
                                Discount (%)
                            </label>

                            <input
                                type="number"
                                name="discount"
                                value={product.discount}
                                onChange={handleChange}
                                placeholder="Discount percentage"
                                min="0"
                                max="100"
                                className="w-full border rounded-lg p-3"
                            />

                            <p className="text-sm text-gray-500 mt-1">
                                Enter a value between 0% and 100%.
                            </p>

                        </div>


                        {/* Price Preview */}

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

                            <p className="text-gray-600">
                                Original Price
                            </p>

                            <p className="text-lg font-semibold">
                                ₹ {Number(product.price || 0).toFixed(2)}
                            </p>


                            <p className="text-gray-600 mt-2">
                                Discount
                            </p>

                            <p className="text-lg font-semibold text-red-600">
                                {Number(product.discount || 0)}%
                            </p>


                            <p className="text-gray-600 mt-2">
                                Final Price
                            </p>

                            <p className="text-2xl font-bold text-green-600">
                                ₹ {finalPrice.toFixed(2)}
                            </p>

                        </div>


                        {/* Stock */}

                        <div>

                            <label className="block font-semibold mb-2">
                                Stock Quantity
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={product.stock}
                                onChange={handleChange}
                                placeholder="Stock"
                                min="0"
                                required
                                className="w-full border rounded-lg p-3"
                            />

                        </div>


                        {/* Category */}

                        <input
                            type="text"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            placeholder="Category"
                            className="w-full border rounded-lg p-3"
                        />


                        {/* Image URL */}

                        <input
                            type="text"
                            name="imageUrl"
                            value={product.imageUrl}
                            onChange={handleChange}
                            placeholder="Image URL"
                            className="w-full border rounded-lg p-3"
                        />


                        {/* Update Button */}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
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