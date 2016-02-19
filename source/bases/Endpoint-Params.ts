interface EndpointParams {
	path: string;
  type: string;
	callback: Function;
	middlewares?: any;
  queryParams?: any;
  urlParams?: any;
  bodyParams?: any;
}