import { connectMongo } from '../apps/api/src/db/connect';
import User from '../apps/api/src/db/models/User';
import Merchant from '../apps/api/src/db/models/Merchant';
import Product from '../apps/api/src/db/models/Product';
import CategoryTag from '../apps/api/src/db/models/CategoryTag';
import Recipe from '../apps/api/src/db/models/Recipe';
import Order from '../apps/api/src/db/models/Order';

async function main() {
  await connectMongo();

  console.log('Seeding users...');
  const user = await User.findOneAndUpdate(
    { email: 'demo@lighteats.io' },
    { name: 'LightEats Demo', gender: 'female', heightCm: 165, weightKg: 58, targetWeightKg: 52 },
    { upsert: true, new: true }
  );

  console.log('Seeding merchants...');
  const merchant = await Merchant.findOneAndUpdate(
    { name: 'LightEats 官方旗舰店' },
    {
      name: 'LightEats 官方旗舰店',
      contact: '400-888-8888',
      ownerUserId: user._id,
      status: 'approved',
      address: '上海市浦东新区张江路 188 号'
    },
    { upsert: true, new: true }
  );

  console.log('Seeding category tags...');
  const tags = ['低脂', '高蛋白', '低碳', '素食', '沙拉', '暖食', '便当', '高纤维'];
  await Promise.all(tags.map((name) => CategoryTag.updateOne({ name }, { name, kind: 'tag' }, { upsert: true })));

  const baseImage =
    'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80';
  const productTemplates = [
    { title: '香煎鸡胸沙拉', tags: ['低脂', '沙拉'], ingredients: ['鸡胸肉', '罗马生菜', '玉米粒'] },
    { title: '牛油果三文鱼碗', tags: ['高蛋白'], ingredients: ['三文鱼', '牛油果', '藜麦'] },
    { title: '藜麦牛肉能量碗', tags: ['低碳'], ingredients: ['藜麦', '牛里脊', '西兰花'] },
    { title: '全麦鸡肉卷', tags: ['便当'], ingredients: ['全麦饼皮', '鸡胸肉', '生菜'] },
    { title: '照烧鸡腿饭', tags: ['暖食'], ingredients: ['鸡腿肉', '糙米饭', '胡萝卜'] },
    { title: '牛肉藜麦沙拉', tags: ['高蛋白', '沙拉'], ingredients: ['牛肉', '藜麦', '番茄'] },
    { title: '和风豆腐沙拉', tags: ['素食', '低脂'], ingredients: ['嫩豆腐', '海藻', '胡萝卜'] },
    { title: '希腊酸奶水果杯', tags: ['轻食'], ingredients: ['酸奶', '莓果', '燕麦'] },
    { title: '芦笋鸡胸餐盒', tags: ['低脂', '便当'], ingredients: ['鸡胸肉', '芦笋', '糙米'] },
    { title: '香草烤鳕鱼', tags: ['高蛋白'], ingredients: ['鳕鱼', '香草碎', '柠檬'] },
    { title: '泰式虾仁沙拉', tags: ['沙拉'], ingredients: ['虾仁', '青柠', '薄荷'] },
    { title: '田园素食沙拉', tags: ['素食'], ingredients: ['藜麦', '鹰嘴豆', '彩椒'] },
    { title: '牛排能量碗', tags: ['高蛋白'], ingredients: ['西冷牛排', '糙米', '蔬菜'] },
    { title: '日式三文鱼便当', tags: ['便当'], ingredients: ['三文鱼', '糙米', '紫菜'] },
    { title: '番茄鸡肉意面', tags: ['暖食'], ingredients: ['鸡肉', '全麦意面', '番茄'] },
    { title: '蘑菇豆腐煲', tags: ['素食', '暖食'], ingredients: ['豆腐', '香菇', '菜心'] },
    { title: '黑椒牛肉卷', tags: ['高蛋白'], ingredients: ['牛肉', '彩椒', '洋葱'] },
    { title: '菠菜鸡蛋松饼', tags: ['轻食'], ingredients: ['菠菜', '鸡蛋', '燕麦'] },
    { title: '南瓜糙米饭', tags: ['低脂'], ingredients: ['南瓜', '糙米', '豆类'] },
    { title: '藜麦什锦碗', tags: ['高纤维'], ingredients: ['藜麦', '牛油果', '豆类'] },
    { title: '青柠鸡胸沙拉', tags: ['低脂'], ingredients: ['鸡胸肉', '青柠', '生菜'] },
    { title: '扁豆蔬菜汤', tags: ['素食'], ingredients: ['扁豆', '西芹', '番茄'] },
    { title: '烤南瓜鸡胸碗', tags: ['暖食'], ingredients: ['南瓜', '鸡胸肉', '羽衣甘蓝'] },
    { title: '金枪鱼鹰嘴豆沙拉', tags: ['高蛋白'], ingredients: ['金枪鱼', '鹰嘴豆', '生菜'] }
  ];

  console.log('Seeding products...');
  let price = 26;
  for (const template of productTemplates) {
    price += 1.2;
    await Product.updateOne(
      { title: template.title },
      {
        merchantId: merchant._id,
        title: template.title,
        price: Math.round(price * 10) / 10,
        unit: '份',
        stock: 200,
        caloriesPerUnit: 320 + Math.round(Math.random() * 80),
        proteinG: 25 + Math.round(Math.random() * 8),
        fatG: 10 + Math.round(Math.random() * 5),
        carbG: 30 + Math.round(Math.random() * 10),
        tags: template.tags,
        ingredients: template.ingredients,
        images: [baseImage],
        status: 'on'
      },
      { upsert: true }
    );
  }

  console.log('Creating sample recipe and order...');
  const recipe = await Recipe.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      dateRange: { start: new Date(), end: new Date() },
      totalCalories: 1900,
      macro: { proteinG: 120, fatG: 55, carbG: 210 },
      days: [
        {
          date: new Date(),
          meals: [
            {
              name: '早餐',
              items: [
                {
                  title: '香煎鸡胸沙拉',
                  productId: (await Product.findOne({ title: '香煎鸡胸沙拉' }))?._id,
                  qty: 1,
                  unit: '份',
                  calories: 350,
                  proteinG: 35,
                  fatG: 10,
                  carbG: 28
                }
              ]
            }
          ]
        }
      ],
      createdFrom: { prompt: 'seed script', params: {} }
    },
    { upsert: true, new: true }
  );

  await Order.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      items: recipe.days[0].meals[0].items.map((item: any) => ({
        productId: item.productId,
        qty: 1,
        priceSnapshot: 29.9
      })),
      amount: 29.9,
      status: 'paid',
      address: '上海市浦东新区张江路 188 号',
      payment: { method: 'mock', txnId: 'MOCK-001' }
    },
    { upsert: true }
  );

  console.log('Seed completed.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
