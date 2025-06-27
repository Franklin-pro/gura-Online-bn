import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const {productId}  = req.body;
        const user = req.user;
        const existingItem = await user.cartItem.find(item => item.productId === productId);
        if (existingItem) {
            return existingItem.quantity += 1;
        } else{
            const newItem = { productId, quantity: 1 };
            user.cartItem.push(newItem);
            await user.save();
            res.status(201).json({ message: 'Item added to cart', cartItem: user.cartItem });
        }
    } catch (error) {
        console.log("Error adding to cart:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const deleteAllFromCart = async (req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user;
        const existingItem = await user.cartItem.find(item => item.productId === productId);
        if (existingItem) {
            user.cartItem = user.cartItem.filter(item => item.productId !== productId);
            await user.save();
            res.status(200).json({ message: 'Item removed from cart', cartItem: user.cartItem });
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        console.log("Error deleting all from cart:", error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = req.user;
        const existingItem = await user.cartItem.find(item => item.productId === productId);
        if (existingItem) {
            if( quantity === 0) {
                user.cartItem = user.cartItem.filter(item => item.productId !== productId);
            }
            else {
                existingItem.quantity = quantity;
            }
            await user.save();
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        console.log("Error updating quantity:", error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}

export const getCarts = async (req, res) => {
    try {
        const products = await Product.find({_id: { $in:req.user.cartItem}});
        const cartItems = products.map(product => {
            const cartItem = req.user.cartItem.find(item => item.productId === product._id);
            return {
                ...product.toJSON(),
                quantity: cartItem ? cartItem.quantity : 0
            };
        });
        res.status(200).json({ cartItems });
  
    } catch (error) {
        console.log("Error getting cart:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
