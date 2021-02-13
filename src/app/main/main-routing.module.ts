import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: MainPage,
    children: [
      {
        path: 'home',
        children:[
          {
            path: '',
            loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
          },
          {
            path: ':productId',
            loadChildren: ()=> import('../main/home/product-detail/product-detail.module').then(m=> m.ProductDetailPageModule)
          }
        ]

      },
      {
        path: 'category',
        children: [
          {
            path: '',
            loadChildren: () => import('./category/category.module').then(m => m.CategoryPageModule)
          },
          {
            path: ':categoryId',
            loadChildren: () => import('./category/single-category/single-category.module').then(m=>m.SingleCategoryPageModule)
          }
        ]

      },
      {
        path: 'search',
        loadChildren: ()=> import('./search/search.module').then(m=>m.SearchPageModule)
      },
      {
        path: 'cart',
        loadChildren: ()=>import('./cart/cart.module').then(m=>m.CartPageModule)
      },
      {
        path: 'checkout',
        loadChildren: ()=>import('./checkout/checkout.module').then(m=>m.CheckoutPageModule)
      },
      {
        path: 'account',
        children: [
          {
          path: '',
          loadChildren: ()=> import('./account/account.module').then(m=>m.AccountPageModule)
          },
          {
            path: 'register',
            loadChildren: ()=> import('./account/register/register.module').then(m=> m.RegisterPageModule)
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/main/tabs/home',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
