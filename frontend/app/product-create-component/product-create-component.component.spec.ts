import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreateComponentComponent } from './product-create-component.component';

describe('ProductCreateComponentComponent', () => {
  let component: ProductCreateComponentComponent;
  let fixture: ComponentFixture<ProductCreateComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCreateComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCreateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
