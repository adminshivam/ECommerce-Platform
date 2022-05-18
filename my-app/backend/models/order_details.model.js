const mongoose= require("mongoose");

const Schema = mongoose.Schema;

const orderDetailsSchema = new Schema({
    customer_email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    product_id: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
    },
    sub_category: {
        type: String,
        required: true
    },
    is_payed: {
        type: Boolean,
        required: true
    },
    payment_id: {
        type:  Number
    }
})

const Order = mongoose.model('Order',orderDetailsSchema);

module.exports = Order;