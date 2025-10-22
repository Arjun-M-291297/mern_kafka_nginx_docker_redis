import mongoose from "mongoose";
const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, required: true, default: 0 },
});
const WalletModel = mongoose.model("Wallet", walletSchema);
export default WalletModel;