import Product from "../models/product.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import cloudinary from "cloudinary";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products.length) {
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductsFeatured = async (req, res) => {
    try {
        let products = await Product.find({ isFeatured: true });

        if (!products.length) {
            return res.status(404).json({ message: "No featured products found" });
        }

        if (products.length > 3) {
            products = products.slice(0, 3);
        }

        // Apply 10% discount
        const discountedProducts = products.map(product => ({
            ...product._doc,
            price: parseFloat((product.price * 0.9).toFixed(2)),
        }));

        res.status(200).json({
            success: true,
            message: "Featured products fetched successfully",
            data: discountedProducts
        });
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, image, description, price, category } = req.body;

        let cloudinaryResult = null;
        if (image) {
            cloudinaryResult = await cloudinaryUpload(image, "products");
        }

        const product = new Product({
            name,
            image: cloudinaryResult?.secure_url || "",
            description,
            price,
            category
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            await cloudinary.v2.uploader.destroy(publicId, { resource_type: "image" });
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const recomandationProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $match: { isFeatured: true } },
            { $sample: { size: 3 } },
            { $project: { _id: 1, name: 1, image: 1, description: 1, price: 1 } }
        ]);

        if (!products.length) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({
            success: true,
            message: "Recommended products fetched successfully",
            data: products
        });
    } catch (error) {
        console.error("Error fetching recommended products:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });

        if (!products.length) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.isFeatured = !product.isFeatured;
        await product.save();
        await updateProductCache();

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProductCache = async () => {
    try {
        const products = await Product.find({ isFeatured: true }).lean();
        console.log(`Updated cache with ${products.length} featured products.`);
        // Save to cache system like Redis if implemented
    } catch (error) {
        console.error("Error updating product cache:", error);
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addRates = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const userId = req.user._id;

        // Validate rating
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false,
                message: "Rating must be a number between 1 and 5" 
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: "Product not found" 
            });
        }

        // Check if user already has a review
        const existingReviewIndex = product.reviews.findIndex(
            review => review.user.equals(userId)
        );

        if (existingReviewIndex >= 0) {
            // Update existing review rating
            product.reviews[existingReviewIndex].rating = rating;
        } else {
            // Add new review
            product.reviews.push({
                user: userId,
                rating: rating
            });
            product.ratingCount += 1;
        }

        // Calculate new average rating
        const totalRatings = product.reviews.reduce(
            (sum, review) => sum + review.rating, 0
        );
        product.rating = totalRatings / product.reviews.length;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Rating submitted successfully",
            data: {
                newAverageRating: product.rating,
                newRatingCount: product.reviews.length
            }
        });
    } catch (error) {
        console.error("Error adding rating:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Internal server error" 
        });
    }
}

export const getProductRates = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const averageRate = product.rates.reduce((sum, rate) => sum + rate, 0) / product.rates.length || 0;
        res.status(200).json({
            success: true,
            message: "Product rates fetched successfully",
            data: {
                averageRate: parseFloat(averageRate.toFixed(2)),
                totalRates: product.rates.length
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const globalSearch = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });

        if (!products.length) {
            return res.status(404).json({ message: "No products found matching the search criteria" });
        }

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        console.error("Error during global search:", error);
        res.status(500).json({ message: error.message });
    }
}

