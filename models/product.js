const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  Overview: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  variants: [
    {
      weight: {
        type: String,
        enum: ["250 g","1 kg", "5 kg","30 kg","200 g","10 kg","50 kg","50 g"],
        required: true,
      },
      stock: {
        type: Number,
        required: true,
        default: 0,
      },
      price: {
        type: Number,
        required: true,
      },
      discountedPrice: {
        type: Number,
        required: true,
      }
    }
  ],

  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      }
    }
  ],

  category: {
    type: String,
    required: true,
  },

  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    }
  ],

  packaging: {
    type: String,
    default: "Sealed foil Pouch"
  },
  shellLife: {
    type: String,
    default: "12 months from packaging date"
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Product", productSchema);
