import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMarketplaceComponentComponent } from './product-marketplace-component.component';

describe('ProductMarketplaceComponentComponent', () => {
  let component: ProductMarketplaceComponentComponent;
  let fixture: ComponentFixture<ProductMarketplaceComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMarketplaceComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMarketplaceComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
