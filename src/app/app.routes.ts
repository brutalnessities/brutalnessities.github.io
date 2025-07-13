import { Routes } from '@angular/router';
import { SnakeComponent } from './routes/snake/snake.component';
import { ConfigBuilderComponent } from './routes/config-builder/config-builder.component';
import { HomeComponent } from './routes/home/home.component';
import { AboutMeComponent } from './routes/about-me/about-me.component';
import { PinochleComponent } from './routes/pinochle/pinochle.component';

export const routes: Routes = [
    {
        path: "",
        // TODO:  loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
        // https://angular.dev/guide/ngmodules/lazy-loading#imports-and-route-configuration
        component: HomeComponent,
    },
    {
        path: 'snake',
        component: SnakeComponent,
    },
    {
        path: 'about-me',
        component: AboutMeComponent,
    },
    {
        path: 'pinochle',
        component: PinochleComponent,
    },
    {
        path: 'config-builder',
        component: ConfigBuilderComponent,
    }
];
