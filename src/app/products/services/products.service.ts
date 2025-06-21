import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    const url = `${baseUrl}/products`;

    return this.http.get<ProductsResponse>(url, {
      params: { limit, offset, gender },
    });
    // .pipe(tap((resp) => console.log(resp)));
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    const url = `${baseUrl}/products/${idSlug}`;
    return this.http.get<Product>(url); //.pipe(tap((resp) => console.log(resp)));
  }
}
