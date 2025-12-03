import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Product", 
          required: true 
        },

        quantity: { type: Number, default: 1 },

        price: { type: Number, required: true },

        // 🔥 NEW FIELD
        type: { type: String, required: true }, // shirt | pant

        // 🔥 Size: S, M, L, 28, 30, 32...
        size: { type: String, required: true },
      },
    ],

    subtotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
