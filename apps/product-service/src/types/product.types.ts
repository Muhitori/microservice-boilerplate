export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	stock: number;
}

export interface ProductCreate {
	name: string;
	description: string;
	price: number;
	stock: number;
}

export interface ProductId {
	id: string;
}

export interface UpdateProductRequest {
	id: string;
	productData: Product;
}
