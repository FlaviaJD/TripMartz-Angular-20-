import { NgModule } from '@angular/core';
import { LayoutsModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { AgentAccountManagerComponent } from './agent-account-manager.component';
import { AgentCreditBalanceComponent } from './agent-credit-balance/agent-credit-balance.component';
import { AgentDebitBalanceComponent } from './agent-debit-balance/agent-debit-balance.component';
import { AgentAccountManagerRoutingModule } from './agent-account-manager.routing.module';

@NgModule({
  declarations: [AgentAccountManagerComponent, AgentCreditBalanceComponent, AgentDebitBalanceComponent],
  imports: [
    SharedModule,
    LayoutsModule,
    AgentAccountManagerRoutingModule,
  ]
})
export class AgentAccountManagerModule {
 }
