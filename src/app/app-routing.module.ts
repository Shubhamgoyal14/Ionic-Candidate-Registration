import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FormcComponent } from './formc/formc.component';
import { FrontComponent } from './front/front.component';
import { SuccessComponent } from './success/success.component';
import { AdminComponent } from './admin/admin.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { CandetailsComponent } from './candetails/candetails.component';

const routes: Routes = [

  {path:'', component: FrontComponent},
  {path:'front', component: FrontComponent},
  {path:'formc', component: FormcComponent},
  {path:'success', component: SuccessComponent},
  {path:'admin', component: AdminComponent},
  {path:'admin-panel', component: AdminPanelComponent},
  { path: 'candetails', component: CandetailsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }, )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
