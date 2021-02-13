import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpecialModalPage } from './special-modal.page';

describe('SpecialModalPage', () => {
  let component: SpecialModalPage;
  let fixture: ComponentFixture<SpecialModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
