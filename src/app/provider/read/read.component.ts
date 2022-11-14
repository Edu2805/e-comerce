import { Component, OnInit } from "@angular/core";
import { Fornecedor } from "../models/providerEntity";
import { ProviderService } from "../services/provider.service";

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {

  public providers: Fornecedor[];
  errorMessage: string;

  constructor(private providerService: ProviderService) { }

  ngOnInit(): void {
    this.providerService.getAllProviders()
        .subscribe({
          next: providers => this.providers = providers,
          error(error) {
              error = this.errorMessage;
          },
        });
  }
}
