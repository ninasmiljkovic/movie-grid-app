import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MovieGridComponent} from './components/movie-grid/movie-grid.component';

const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { path: 'movies', component: MovieGridComponent },
  { path: '**', redirectTo: 'movies' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
