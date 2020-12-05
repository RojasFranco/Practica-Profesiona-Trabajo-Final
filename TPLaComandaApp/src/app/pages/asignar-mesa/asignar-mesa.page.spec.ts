import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AsignarMesaPage } from './asignar-mesa.page';

describe('AsignarMesaPage', () => {
  let component: AsignarMesaPage;
  let fixture: ComponentFixture<AsignarMesaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarMesaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AsignarMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
