import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { PreviewComponent } from './preview/preview.component';


const routes: Routes = [{ path: 'edit/:id', component: EditComponent },
{ path: 'preview/:id', component: PreviewComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
