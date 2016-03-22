interface EndpointParams {
	path: string;
  type: string;
	callback: Function;
	middleware?: any;
  apiCache?: any;
  queryParams?: any;
  urlParams?: any;
  bodyParams?: any;
}