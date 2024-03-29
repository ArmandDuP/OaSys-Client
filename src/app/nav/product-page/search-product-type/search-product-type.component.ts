import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductType } from 'src/app/models/Product-Type.model';
import { ProductTypeService } from 'src/app/_services/product-type.service';
import { Output, EventEmitter } from '@angular/core';
import { ProductCategory } from 'src/app/models/Product-Category.model';
import { ProductCategoryService } from 'src/app/_services/product-category.service';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-search-product-type',
  templateUrl: './search-product-type.component.html',
  styleUrls: ['./search-product-type.component.css'],
})
export class SearchProductTypeComponent implements OnInit {
  @Output() return = new EventEmitter<string>();

  //product Type
  productTypes: ProductType[] = [];
  productTypesTemp: ProductType[] = [];

  //product Category
  productCategories: ProductCategory[] = [];
  productCategoriesTemp: ProductCategory[] = [];

  //dynamic Array
  dynamicArray = [];
  tempArray = [];

  searchText: string = '';

  //help pdf
  pdfPath = 'https://localhost:7113/Resources/pdfs/Search product type.pdf';
  displayPDF: boolean = false;

  constructor(
    private productTypeService: ProductTypeService,
    private productCategoryService: ProductCategoryService
  ) {}

  ngOnInit(): void {
    this.getAllProductTypes();
  }

  ////////////// pdf functions ///////////////////////////////
  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  search(stringToSearch: string) {
    this.pdfComponent.eventBus.dispatch('find', {
      query: stringToSearch,
      type: 'again',
      caseSensitive: false,
      findPrevious: undefined,
      highlightAll: true,
      phraseSearch: true,
    });
  }

  getAllProductTypes() {
    this.productTypeService.getAllProductTypes().subscribe((response) => {
      response = response.filter((temp) => {
        return temp.deleted == false;
      });
      this.productTypes = response;
      this.productTypesTemp = response;
      this.getProductCategories();
    });
  }

  getProductCategories() {
    this.productCategoryService.getAllProductCategories().subscribe((res) => {
      this.productCategories = res;
      this.createDynamicArray();
    });
  }

  createDynamicArray() {
    for (let i = 0; i < this.productTypes.length; i++) {
      const element = this.productTypes[i];
      if (!element.deleted) {
        //get category
        this.productCategoriesTemp = this.productCategories;
        this.productCategoriesTemp = this.productCategoriesTemp.filter(
          (temp) => {
            return temp.producT_CATEGORY_ID == element.producT_CATEGORY_ID;
          }
        );

        //dynamic array
        this.dynamicArray.push({
          name: element.typE_NAME,
          category: this.productCategoriesTemp[0].categorY_NAME,
          productType: element,
        });
      }
    }
    this.tempArray = this.dynamicArray;
  }

  Search() {
    this.dynamicArray = this.tempArray;
    if (this.searchText !== '') {
      this.dynamicArray = this.dynamicArray.filter((productType) => {
        return (
          productType.name.match(this.searchText) ||
          productType.category.match(this.searchText)
        );
      });
    }
  }

  Return() {
    this.return.emit('false');
  }
}
