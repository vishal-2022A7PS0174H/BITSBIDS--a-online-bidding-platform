import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiManagerService} from '../../_services/api-manager.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from '../../_alert';
import {Router} from '@angular/router';
import {RegistrationRequestBody} from '../../_models/RegistrationRequestBody';
import {TranslateService} from '@ngx-translate/core';
import {LoggerService} from 'src/app/shared/logger.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit, AfterViewInit {
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  registerForm: FormGroup;
  submitted = false;

  signupFormShow = false;
  allCustomers: any;

  constructor(private apiManagerService: ApiManagerService,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private alertService: AlertService,
              private router: Router,
              private registrationRequestBody: RegistrationRequestBody,
              private translate: TranslateService,
              private loggerService: LoggerService) {
    translate.addLangs(['us', 'fr']);
    translate.setDefaultLang(localStorage.getItem('selected_lang'));
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', [Validators.required, this.customValidator()]],
      email: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      hostel: ['', Validators.required],
    });
  }

  customValidator() {
    return (control) => {
      const value = control.value;

      // Use a regular expression to match the specified pattern
      const pattern =  /^(201[4-9]|202[0-3])([A-Z][0-9])PS([0-2]\d{3}|3000)H$/;

      return pattern.test(value) ? null : { invalidFormat: true };
    };
  }

  ngAfterViewInit() {
  }

  get fields() {
    return this.registerForm.controls;
  }

  public doRegistration(): void {
    this.spinner.show();
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.spinner.hide();
      this.loggerService.log('registerForm', this.registerForm);
      return;
    }

    this.registrationRequestBody = this.registerForm.getRawValue();
    this.registrationRequestBody.role = ['user'];
    console.log('registrationRequestBody', this.registrationRequestBody);

    this.apiManagerService.registration(this.registrationRequestBody).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log('response', response);
        this.router.navigate(['authentication/login']);
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error(error.error.message, {autoClose: true});
      });
  }
}
