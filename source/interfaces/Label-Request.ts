///<reference path="../interfaces/Address.ts"/>
///<reference path="../interfaces/Parcel.ts"/>

interface LabelRequest {
	fromAddress: Address;
  toAddress: Address;
	parcel: Parcel;
  isReturn?: boolean;
  purchaseLabel?: boolean;
  carriers?: string;
}