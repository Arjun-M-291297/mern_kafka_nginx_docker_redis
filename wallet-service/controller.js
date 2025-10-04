import WalletModel from "./models/wallet.js";

async function createWallet(userData) {
  try {
    const newWallet = new WalletModel({ userId: userData.userId, email: userData.email, balance: 1000 });
    await newWallet.save();
    return newWallet;
  } catch (error) {
    throw new Error("Server error");
  }
}
async function getWallet(req, res) {
  try {
    const { userId } = req.params;
    const wallet = await WalletModel.find({ userId });
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function creditToWallet(req, res) {
  try {
    const { userId, balance  } = req.body;
    const wallet = await WalletModel.findOneAndUpdate(
      { userId },
      { $inc: { balance } },
      { new: true, upsert: true }
    );
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
async function debitToWallet(data) {
  try {
    const { userId, balance } = data;
    const wallet = await WalletModel.findOneAndUpdate(
      { userId },
      { $inc: { balance: -balance } },
      { new: true, upsert: true }
    );
    if(wallet){
      console.log(`💰 Wallet debited for ${userId }`);
    }
    else{
      console.log(`❌ Wallet not found for userId: ${userId}`);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
export { getWallet, creditToWallet, debitToWallet, createWallet };
