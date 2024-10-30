import { Routes } from '@angular/router';
import { SnakeComponent } from './routes/snake/snake.component';
import { MiscellaneousComponent } from './routes/miscellaneous/miscellaneous.component';
import { TestComponent } from './routes/test/test.component';
import { ConfigBuilderComponent } from './routes/config-builder/config-builder.component';

export const routes: Routes = [
    {
        path: "",
        // TODO:  loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
        // https://angular.dev/guide/ngmodules/lazy-loading#imports-and-route-configuration
        component: TestComponent,
    },
    {
        path: "miscellaneous",
        component: MiscellaneousComponent,
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
