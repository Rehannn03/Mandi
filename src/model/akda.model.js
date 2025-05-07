import mongoose from "mongoose";

const akdaSchema = new mongoose.Schema(
  {
    bepariId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bepari",
      required: true,
    },
    totalBakra: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    kharchaDetails: [
      {
        commision: {
          type: Number,
          default: 0,
        },
        kasar: {
          type: Number,
          default: 0,
        },
        kalamFare: {
          type: Number,
          default: 0,
        },
        jagaBhada: {
          type: Number,
          default: 0,
        },
        motorBhada: {
          type: Number,
          default: 0,
        },
        karkoni: {
          type: Number,
          default: 0,
        },
        mandiGawali: {
          type: Number,
          default: 0,
        },
        charaBhusa: {
          type: Number,
          default: 0,
        },
        mazdoori: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalKharcha: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    settled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Akda = mongoose.model("Akda", akdaSchema);

export default Akda;
