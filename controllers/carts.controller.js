import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find existing item in cart
        const existingItemIndex = user.cartItem.findIndex(item => item.product.toString() === productId);
        
        if (existingItemIndex !== -1) {
            // Increment quantity if item exists
            user.cartItem[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart
            user.cartItem.push({ product: productId, quantity: 1 });
        }

        await user.save();
        
        // Populate the cart items to return full product details
        const populatedUser = await User.findById(user._id).populate('cartItem.product');
        const addedItem = populatedUser.cartItem.find(item => item.product._id.toString() === productId);

        res.status(201).json({ 
            message: 'Item added to cart', 
            cartItem: {
                id: addedItem._id,
                productId: addedItem.product._id,
                name: addedItem.product.name,
                price: addedItem.product.price,
                quantity: addedItem.quantity,
                image: addedItem.product.image
            }
        });
    } catch (error) {
        console.log("Error adding to cart:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteAllFromCart = async (req, res) => {
    try {
        const user = req.user;
        user.cartItem = [];
        await user.save();

        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        console.log("Error clearing cart:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteOneCart = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL params
    const user = req.user;

    const itemIndex = user.cartItem.findIndex(item => 
      item._id.toString() === id // Compare cart item ID
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove the item completely
    user.cartItem.splice(itemIndex, 1);
    await user.save();

    return res.status(200).json({ 
      message: 'Item removed from cart',
      removedItemId: id 
    });

  } catch (error) {
    console.log("Error deleting from cart:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = req.user;

        // Validate quantity
        if (typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        const itemIndex = user.cartItem.findIndex(item => item.product.toString() === productId);
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity === 0) {
            // Remove item if quantity is 0
            user.cartItem.splice(itemIndex, 1);
        } else {
            // Update quantity
            user.cartItem[itemIndex].quantity = quantity;
        }

        await user.save();

        // Return updated cart item with product details if still exists
        if (quantity > 0) {
            const populatedUser = await User.findById(user._id).populate('cartItem.product');
            const updatedItem = populatedUser.cartItem[itemIndex];
            
            return res.status(200).json({
                message: 'Quantity updated',
                cartItem: {
                    id: updatedItem._id,
                    productId: updatedItem.product._id,
                    name: updatedItem.product.name,
                    price: updatedItem.product.price,
                    quantity: updatedItem.quantity,
                    image: updatedItem.product.image
                }
            });
        }

        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.log("Error updating quantity:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getCarts = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Populate the cart items with full product details
        const user = await User.findById(req.user._id).populate('cartItem.product');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItems = user.cartItem.map(item => ({
            id: item._id,
            productId: item.product._id,
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            category: item.product.category,
            image: item.product.image,
            isFeatured: item.product.isFeatured,
            discount: item.product.discount,
            rating: item.product.rating,
            quantity: item.quantity,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }));

        res.status(200).json({ data: cartItems });
    } catch (error) {
        console.log("Error getting cart:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}