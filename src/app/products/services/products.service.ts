import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Unisex,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    const url = `${baseUrl}/products`;

    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(url, {
        params: { limit, offset, gender },
      })
      .pipe(
        // tap((resp) => console.log(resp)),
        // tap((resp) => console.log(key)),
        tap((products) => this.productsCache.set(key, products))
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    const url = `${baseUrl}/products/${idSlug}`;

    const key = idSlug;
    if (this.productCache.has(key)) {
      return of(this.productCache.get(key)!);
    }

    return this.http.get<Product>(url).pipe(
      // tap((resp) => console.log(resp)),
      // tap((resp) => console.log(key)),
      tap((product) => this.productCache.set(key, product))
    );
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }

    const url = `${baseUrl}/products/${id}`;

    const key = id;
    if (this.productCache.has(key)) {
      return of(this.productCache.get(key)!);
    }

    return this.http
      .get<Product>(url)
      .pipe(tap((product) => this.productCache.set(key, product)));
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>
  ): Observable<Product> {
    return this.http
      .patch<Product>(`${baseUrl}/products/${id}`, productLike)
      .pipe(tap((product) => this.updateProductCache(product)));
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http
      .post<Product>(`${baseUrl}/products/`, productLike)
      .pipe(tap((product) => this.updateProductCache(product)));
  }

  updateProductCache(product: Product) {
    const producId = product.id;
    this.productCache.set(producId, product);

    this.productsCache.forEach((productsResponse) => {
      productsResponse.products = productsResponse.products.map(
        (currentProduct) => {
          return currentProduct.id === producId ? product : currentProduct;
        }
      );
    });
  }
}
