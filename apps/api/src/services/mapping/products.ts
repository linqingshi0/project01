import Product from '../../db/models/Product';

export async function mapMealsToProducts(meals: any[]) {
  const allProducts = await Product.find({ status: 'on' }).lean();

  return meals.map((meal) => ({
    ...meal,
    items: meal.items.map((item: any) => {
      const matched = allProducts
        .filter((product) => {
          const keywords = [product.title, ...(product.tags || []), ...(product.ingredients || [])]
            .join(' ')
            .toLowerCase();
          const title = item.title.toLowerCase();
          return title.split(/[\s,]+/).some((word: string) => keywords.includes(word));
        })
        .sort((a, b) => (a.price || 0) - (b.price || 0));

      const product = matched[0];
      return {
        ...item,
        productId: product?._id || null,
        product,
        externalUrl: product ? product.externalUrl : item.externalUrl || null
      };
    })
  }));
}

export async function findRecommendedProducts(tags: string[] = []) {
  const query: any = { status: 'on' };
  if (tags.length) {
    query.tags = { $in: tags };
  }
  return Product.find(query).limit(6).lean();
}
