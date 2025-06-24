import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AgentCreditBalanceComponent } from './agent-credit-balance/agent-credit-balance.component';
import { AgentDebitBalanceComponent } from './agent-debit-balance/agent-debit-balance.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'agent-creditBalance',
        canActivate: [AuthGuard],
        component: AgentCreditBalanceComponent,
        data: {extraParameter: 'accountManagerMenus'}
      },
      {
        path: 'agent-debitBalance',
        canActivate: [AuthGuard],
        component: AgentDebitBalanceComponent,
        data: {extraParameter: 'accountManagerMenus'}
      }
   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentAccountManagerRoutingModule { }
