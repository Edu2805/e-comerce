import { ElementRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { fromEvent, merge, Observable } from "rxjs";
import { DisplayMessage, GenericValidator, ValidationMessages } from "../utils/generic-form-validation";

export abstract class FormBaseComponent {

    displayMessage: DisplayMessage = {};
    genericValidators: GenericValidator;
    validationMessages: ValidationMessages;

    unsaveChanges: boolean;

    protected messageConfigValidatorBase(validationMessages: ValidationMessages) {
        this.genericValidators = new GenericValidator(validationMessages);
    }

    protected formConfigValidatorsBase(
        formInputElements: ElementRef[],
        formGroup: FormGroup) {
        
            let controlBlurs: Observable<any>[] = formInputElements
                .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

            merge(...controlBlurs).subscribe(() => {
                this.validateForm(formGroup)
            });
    }

    protected validateForm(formGroup: FormGroup) {
        this.displayMessage = this.genericValidators.processarMensagens(formGroup);
        this.unsaveChanges = true;
    }
    
}