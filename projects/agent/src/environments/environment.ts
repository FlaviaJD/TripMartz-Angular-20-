// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
//   baseUrl:  '/antrip_webservices',
    SA_URL: 'https://hypermiles.com/uat',
    B2B_URL: 'https://hypermiles.com/uat',
    B2C_URL:'https://hypermiles.com/uat',
    IMAGE_URL:'https://hypermiles.com'//Image base url

    // IMAGE_URL:'http://54.198.46.240',//Image base url
    // SA_URL: 'http://54.198.46.240:4022',
    // B2B_URL: 'http://54.198.46.240:4028',
    // B2C_URL:'http://54.198.46.240:4025'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
