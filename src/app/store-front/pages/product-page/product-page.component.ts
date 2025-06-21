import { Component, inject, linkedSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { ProductsService } from '../../../products/services/products.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-product-page',
  imports: [],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);

  // productIdSlug = id de la ruta activa
  productIdSlugParam = this.activatedRoute.snapshot.params['idSlug'];
  productIdSlug = linkedSignal(() => this.productIdSlugParam);

  // rxResource
  productResource = rxResource({
    request: () => ({ idSlug: this.productIdSlug() }),
    loader: ({ request }) => {
      // if( !request.idSlug ) return of([]); // of devuelve un obersvable, con un array vacío

      return this.productsService.getProductByIdSlug(this.productIdSlug());
    },
  });
}
