import { Routes } from '@angular/router';
import { SnakeComponent } from './routes/snake/snake.component';
import { TestComponent } from './routes/test/test.component';
import { ConfigBuilderComponent } from './routes/config-builder/config-builder.component';
import { HomeComponent } from './routes/home/home.component';

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
        path: 'test',
        component: TestComponent,
    },
    {
        path: 'config-builder',
        component: ConfigBuilderComponent,
    }
];
