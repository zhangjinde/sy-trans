interface EndpointParams {
	path: string;
  type: string;
	callback: Function;
	middleware?: any;
  cache?: any;
  queryParams?: any;
  urlParams?: any;
  bodyParams?: any;
}