import Merchant from '../db/models/Merchant';
import Product from '../db/models/Product';
import CategoryTag from '../db/models/CategoryTag';

export async function seedSampleData() {
  const existingMerchant = await Merchant.findOne({ name: '轻食演示商家' });
  let merchant = existingMerchant;
  if (!merchant) {
    merchant = await Merchant.create({
      name: '轻食演示商家',
      contact: 'demo@merchant.com',
      status: 'approved',
      address: '上海市黄浦区演示路 66 号'
    });
  }

  const tags = ['低脂', '高蛋白', '低碳', '素食', '沙拉', '便当'];
  await Promise.all(
    tags.map((tag) =>
      CategoryTag.updateOne({ name: tag }, { name: tag, kind: 'tag' }, { upsert: true })
    )
  );

  const sampleProducts = [
    {
      title: '香煎鸡胸沙拉',
      price: 29.9,
      unit: '份',
      stock: 200,
      caloriesPerUnit: 320,
      proteinG: 32,
      fatG: 8,
      carbG: 25,
      tags: ['低脂', '沙拉'],
      ingredients: ['鸡胸肉', '生菜', '玉米'],
      images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80']
    },
    {
      title: '牛油果三文鱼碗',
      price: 36.8,
      unit: '份',
      stock: 150,
      caloriesPerUnit: 380,
      proteinG: 28,
      fatG: 18,
      carbG: 30,
      tags: ['高蛋白'],
      ingredients: ['三文鱼', '牛油果', '藜麦'],
      images: ['https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80']
    },
    {
      title: '藜麦牛肉能量碗',
      price: 32.0,
      unit: '份',
      stock: 180,
      caloriesPerUnit: 420,
      proteinG: 34,
      fatG: 14,
      carbG: 38,
      tags: ['低碳'],
      ingredients: ['藜麦', '牛肉', '西兰花'],
      images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80']
    }
  ];

  for (const product of sampleProducts) {
    await Product.updateOne({ title: product.title }, { ...product, merchantId: merchant._id, status: 'on' }, {
      upsert: true
    });
  }
}
