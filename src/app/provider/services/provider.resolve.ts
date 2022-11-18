import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Fornecedor } from "../models/providerEntity";
import { ProviderService } from "./provider.service";

@Injectable()
export class ProviderResolve implements Resolve<Fornecedor> {

    constructor(private providerService: ProviderService) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.providerService.findProviderById(route.params['id']);
    }
    
}