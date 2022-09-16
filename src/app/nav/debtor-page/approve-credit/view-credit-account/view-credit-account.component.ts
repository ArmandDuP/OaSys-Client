import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CustomerApplication } from 'src/app/models/CustomerApplication.model';
import { CustomerApplicationService } from 'src/app/_services/CustomerApplication.service';
import { CustomerAccount } from 'src/app/models/Customer-account.model';
import { CustomerAccountService } from 'src/app/_services/customer-account.service';
import { AccountStatus } from 'src/app/models/AccountStatus.model';
import { AccountStatusService } from 'src/app/_services/AccountStatus.service';
import { ValidationServicesComponent } from 'src/app/validation-services/validation-services.component';
import { Province } from 'src/app/models/province.model';
import { ProvinceService } from 'src/app/_services/Province.service';
import { City } from 'src/app/models/City.model';
import { CityService } from 'src/app/_services/City.service';
import { Debtor } from 'src/app/models/debtor.model';
import { DebtorService } from '../../../../_services/debtor.service';

@Component({
  selector: 'app-view-credit-account',
  templateUrl: './view-credit-account.component.html',
  styleUrls: ['./view-credit-account.component.css'],
})
export class ViewCreditAccountComponent implements OnInit {
  //cutomer applications
  @Input() customerApplication: CustomerApplication;
  customerApplications: CustomerApplication[] = [];
  customerApplicationsTemp: CustomerApplication[] = [];

  @Output() return = new EventEmitter<string>();

  //debtor
  @Input() debtor: Debtor;
  debtors: Debtor[] = [];
  debtorsTemp: Debtor[] = [];

  //unique
  uniqueContactNumber: boolean = true;
  uniqueEmail: boolean = true;

  //province
  provinces: Province[] = [];
  provincesTemp: Province[] = [];

  //city
  cities: City[] = [];
  citiesTemp: City[] = [];

  //validate
  nameDetails: boolean = true;
  surnameDetails: boolean = true;
  emailDetails: boolean = true;
  contactDetails: boolean = true;
  creditDetails: boolean = true;
  provinceDetails: boolean = true;
  categorySelected: boolean = false;
  cityDetails: boolean = true;
  validate: ValidationServicesComponent = new ValidationServicesComponent();
  successSubmit: boolean = false;

  accountStatus: AccountStatus = {
    accountStatusID: 0,
    descrption: '',
  };
  accountStatusses: AccountStatus[] = [];
  accountStatussesTemp: AccountStatus[] = [];

  customerAccount: CustomerAccount = {
    customeR_ACCOUNT_ID: 0,
    accounT_STATUS_ID: 0,
    provincE_ID: 0,
    cityID: 0,
    name: '',
    surname: '',
    email: '',
    contacT_NUMBER: 0,
    amounT_OWING: 0,
    crediT_LIMIT: 0,
    remindeR_MESSAGE: '',
  };

  constructor(
    private customerApplicationService: CustomerApplicationService,
    private accountStatusService: AccountStatusService,
    private customerAccountService: CustomerAccountService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private debtorService: DebtorService
  ) {}

  ngOnInit(): void {
    this.getProvinces();
    this.getAllAccountStatusses();
  }

  FormValidate() {
    this.nameValidate();
    this.ValidateContactNumber();
    this.surnameValidate();
    this.emailValidate();
    this.Provalidate();
    this.cityValidate();
    this.creditValidate();
    this.compareEmail();
    this.compareContactNumber();
  }

  nameValidate() {
    this.nameDetails = this.validate.ValidateString(
      this.customerApplication.name
    );
  }

  surnameValidate() {
    this.surnameDetails = this.validate.ValidateString(
      this.customerApplication.surname
    );
  }

  ValidateContactNumber() {
    this.contactDetails = this.validate.ValidateContactNumber(
      this.customerApplication.contactNumber
    );
    this.compareContactNumber();
  }

  compareContactNumber() {
    this.uniqueContactNumber = true;
    this.debtorsTemp = this.debtors;
    this.debtorsTemp = this.debtorsTemp.filter((debtor) => {
      return debtor.contacT_NUMBER == this.customerApplication.contactNumber;
    });
    if (this.debtorsTemp.length > 0) {
      this.uniqueContactNumber = false;
    }

    this.customerApplicationsTemp = this.customerApplications;
    this.customerApplicationsTemp = this.customerApplicationsTemp.filter(
      (customer) => {
        return customer.contactNumber == this.customerApplication.contactNumber;
      }
    );
    if (
      this.customerApplicationsTemp.length > 0 &&
      this.customerApplication.customerApplicationID !=
        this.customerApplicationsTemp[0].customerApplicationID
    ) {
      this.uniqueContactNumber = false;
    }
  }

  emailValidate() {
    this.emailDetails = this.validate.ValidateEmail(
      this.customerApplication.email
    );
    this.compareEmail();
  }

  compareEmail() {
    this.uniqueEmail = true;
    this.debtorsTemp = this.debtors;
    this.debtorsTemp = this.debtorsTemp.filter((debtor) => {
      return debtor.email == this.customerApplication.email;
    });
    if (this.debtorsTemp.length > 0) {
      this.uniqueEmail = false;
    }

    this.customerApplicationsTemp = this.customerApplications;
    this.customerApplicationsTemp = this.customerApplicationsTemp.filter(
      (customer) => {
        return customer.email == this.customerApplication.email;
      }
    );
    if (
      this.customerApplicationsTemp.length > 0 &&
      this.customerApplication.customerApplicationID !=
        this.customerApplicationsTemp[0].customerApplicationID
    ) {
      this.uniqueEmail = false;
    }
  }

  Provalidate() {
    if (this.customerApplication.provinceID == -1) {
      this.provinceDetails = false;
    } else {
      this.provinceDetails = true;
    }
  }

  cityValidate() {
    if (this.customerApplication.cityID == -1) {
      this.cityDetails = false;
    } else this.cityDetails = true;
  }

  creditValidate() {
    if (
      this.customerApplication.creditLimit == null ||
      this.customerApplication.creditLimit <= 0
    ) {
      this.creditDetails = false;
    } else
      this.creditDetails = this.validate.ValidateMoney(
        this.customerApplication.creditLimit
      );
  }

  getProvinces() {
    this.provinceService.getAllProvinces().subscribe((res) => {
      this.provinces = res;
      console.log('this is all the provinces');
      console.log(this.provinces);
      this.getCities();
    });
  }

  getCities() {
    this.cityService.getAllCitys().subscribe((res) => {
      this.cities = res;
      console.log('this is all the cities');
      console.log(this.cities);
      this.getDebtors();
    });
  }

  getDebtors() {
    this.debtorService.getAllDebtors().subscribe((res) => {
      this.debtors = res;
      this.getCustomerApplications();
    });
  }

  getCustomerApplications() {
    this.customerApplicationService
      .getAllCustomerApplications()
      .subscribe((res) => {
        this.customerApplications = res;
      });
    this.categorySelect(this.customerApplication.provinceID);
  }

  categorySelect(id: number) {
    this.citiesTemp = this.cities;
    this.citiesTemp = this.citiesTemp.filter((city) => {
      return city.provinceID == id;
    });
    this.categorySelected = true;
  }

  getAllAccountStatusses() {
    this.accountStatusService.getAllAccountStatusses().subscribe((response) => {
      this.accountStatusses = response;
      console.log(this.accountStatusses);
    });
  }

  Return() {
    this.return.emit('false');
  }

  onSubmit() {
    this.FormValidate();

    if (
      !this.nameDetails ||
      !this.surnameDetails ||
      !this.emailDetails ||
      !this.contactDetails ||
      !this.creditDetails
    ) {
      console.log('if statement true');
    } else {
      console.log('if statement false');

      this.customerApplication.accountStatusID = 1;
      this.customerApplicationService
        .updateCustomerApplication(this.customerApplication)
        .subscribe((response) => {
          console.log(response);
        });

      this.customerAccount.accounT_STATUS_ID =
        this.customerApplication.accountStatusID;
      this.customerAccount.provincE_ID = this.customerApplication.provinceID;
      this.customerAccount.cityID = this.customerApplication.cityID;
      this.customerAccount.name = this.customerApplication.name;
      this.customerAccount.surname = this.customerApplication.surname;
      this.customerAccount.email = this.customerApplication.email;
      this.customerAccount.contacT_NUMBER =
        this.customerApplication.contactNumber;
      this.customerAccount.crediT_LIMIT = this.customerApplication.creditLimit;

      this.customerAccountService
        .addCustomerAccount(this.customerAccount)
        .subscribe((response) => {
          console.log(response);
          this.successSubmit = true;
        });
    }
  }

  async Decilne() {
    this.FormValidate();

    if (
      !this.nameDetails ||
      !this.surnameDetails ||
      !this.emailDetails ||
      !this.contactDetails ||
      !this.creditDetails
    ) {
      console.log('if statement true');
    } else {
      console.log('if statement false');

      this.customerApplication.accountStatusID = 2;
      this.customerApplicationService
        .updateCustomerApplication(this.customerApplication)
        .subscribe((response) => {
          console.log(response);
        });
      this.successSubmit = true;

      // this.customerAccount.accounT_STATUS_ID =
      //   this.customerApplication.accountStatusID;
      // this.customerAccount.provincE_ID = this.customerApplication.provinceID;
      // this.customerAccount.name = this.customerApplication.name;
      // this.customerAccount.surname = this.customerApplication.surname;
      // this.customerAccount.email = this.customerApplication.email;
      // this.customerAccount.crediT_LIMIT = this.customerApplication.creditLimit;

      // this.customerAccountService
      //   .addCustomerAccount(this.customerAccount)
      //   .subscribe((response) => {
      //     console.log(response);
      //   });
    }
  }
}
