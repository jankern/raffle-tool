import { Price } from './Interfaces';

export class PriceImplementation implements Price {
    priceText: string;

    constructor(priceText: string, nullable: boolean) {
        this.priceText = priceText;
    }
}