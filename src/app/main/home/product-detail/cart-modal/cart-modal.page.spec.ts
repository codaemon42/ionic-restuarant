import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CartModalPage } from './cart-modal.page';

describe('CartModalPage', () => {
  let component: CartModalPage;
  let fixture: ComponentFixture<CartModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CartModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
