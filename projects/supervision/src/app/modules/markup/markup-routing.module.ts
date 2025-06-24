import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentsComponent } from './components';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
    {
        path: 'markup',
        component: BaseLayoutComponent,
        children: [
            {
                path: 'corporate',
                canActivate: [AuthGuard],
                component: AgentsComponent,
                data: { extraParameter: 'markupMenus' }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MarkupRoutingModule { }
