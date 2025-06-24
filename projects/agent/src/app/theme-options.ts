import { Injectable } from '@angular/core';

@Injectable()
export class ThemeOptions {
  sidebarHover = false;
  toggleSidebar = true;
  toggleSidebarMobile = false;
  toggleHeaderMobile = false;
  toggleThemeOptions = false;
  toggleDrawer = false;
  toggleFixedFooter = false;
  hideOther=false;
  logo = 'assets/images/login-images/l-logo.png';
}
