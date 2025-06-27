import coupon from "../models/coupons.model.js";

export const getCoupons = async (req, res) => {

    try {
        const coupons = await coupon.findOne({ userId: req.user._id, isActive: true });
        if (!coupons) {
            return res.status(404).json({ message: 'No active coupons found' });
        }else{
            res.status(200).json({ coupons });
        }
    } catch (error) {
        console.log("Error getting coupons:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const validateCoupons = async (req, res) => {
    try {
        const { couponCode } = req.body;
        const coupons = await coupon.findOne({ couponCode: couponCode,userId:req.user._id, isActive: true });
        if (!coupons) {
            return res.status(404).json({ message: 'No active coupons found' });
        }

        if(coupons.expirationDate < Date.now()) {
            coupons.isActive = false;
            await coupons.save();
            return res.status(400).json({ message: 'Coupon has expired' });
        }
        else{
            res.status(200).json({
                message: 'Coupon is valid',
                discountPercentage: coupons.discountPercentage,
                couponCode: coupons.code,
                expirationDate: coupons.expirationDate,
             });
        }
    } catch (error) {
        console.log("Error validating coupons:", error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}