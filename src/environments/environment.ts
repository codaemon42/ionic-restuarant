// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  currency: "Tk",
  //siteUrl: "https://woopearl.com/demo6/",
  siteUrl: "https://woopearl.com/",
  //siteUrl: "https://mohaazon.com/",
  //consumerKey: "ck_468797c7d9e0ee8b7a0ecea20188f29595140827",//woopearldemo6
  consumerKey: "ck_cd6fabc0eabcc28581aac759a581c038f0848d24",//woopearl
  //consumerKey: "ck_a0e1a9e99cc12d8ef52f069fd393278c6fe5bb55",//mohaazon
  //consumerKey: "ck_fd2cbec70a3dd10953dd12b8aec46f07a3248d56",
  //consumerSecret: "cs_9906a9dcb5c5a4241692e4c428cad61c8d700144",//mohaazon
  //consumerSecret: "cs_d49946a002084d8b643b440e58a83d69d92dfa14",//woopearldemo6
  consumerSecret: "cs_83f2d295f73a7368e1af08cce63da7793d170570",//woopearl
  //consumerSecret: "cs_3fe81a1803f899aeb58e72f4ac2228d087a3dad1",
  loggedUrl: '/main/tabs/account',
  //authUrl: 'https://mohaazon.com/',
  authUrl: 'https://woopearl.com/',
  //authConKey: 'ck_a0e1a9e99cc12d8ef52f069fd393278c6fe5bb55',//mohaazon
  authConKey: 'ck_cd6fabc0eabcc28581aac759a581c038f0848d24',//woopearl
  //authConKey: 'ck_468797c7d9e0ee8b7a0ecea20188f29595140827',//woopearldemo6
  //authConSecret: 'cs_9906a9dcb5c5a4241692e4c428cad61c8d700144',//mohaazon
  authConSecret: 'cs_83f2d295f73a7368e1af08cce63da7793d170570',//woopearl
  //authConSecret: 'cs_d49946a002084d8b643b440e58a83d69d92dfa14',//woopearldemo6
  bkashAccountType: 'personal',
  bkashPhoneNumber: '01884462875',
  oneSignalAppId: '81482d73-3d19-479b-9f61-57ab03c0e266',
  firebaseSenderId: '501138486368'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
