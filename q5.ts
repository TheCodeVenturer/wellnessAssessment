import axios from "axios";
import { z } from "zod";
const url = "https://dummyjson.com/products";

type Review = {
	rating: number;
	comment: string;
	date: Date;
	reviewerName: string;
	reviewerEmail: string;
};

type Product = {
	id: number;
	title: string;
	description: string;
	category: string;
	price: number;
	tags: string[];
	brand: string;
	discount: number;
	reviews: Review[];
};

const productSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	category: z.string(),
	price: z.number(),
	tags: z.array(z.string()),
	brand: z.string(),
});

const validateProduct = (product: Product) => {
	try {
		productSchema.parse(product);
		return true;
	} catch (error) {
		console.error(error.errors);
		return false;
	}
};

const fetchData = async (): Promise<String | Product[]> => {
	try {
		const response = await axios.get(url);
		if (!response.data) {
			console.log("No data found");
			return "No data found";
		}
		if (!response.data.products) {
			console.log("No products found");
			return "No products found";
		}
		console.log(response.data.products.length);
		const products: Product[] = response.data.products.filter(
			(product: Product) => validateProduct(product)
		);
		console.log(products.length);
		const updateProducts = products.map((product) => {
			const price = (product.price * (100 - product.discount)) / 100;
			const avgRating =
				product.reviews.reduce(
					(acc, review) => acc + review.rating,
					0
				) / product.reviews.length;
			return {
				...product,
				discountedPrice: product.price * 2,
				avgRating: Math.round(avgRating * 100) / 100,
			};
		});
		// console.log(updateProducts);
		return updateProducts;
	} catch (error) {
		console.error(error);
		return error.message();
	}
};

const products = await fetchData();
console.log(products);
