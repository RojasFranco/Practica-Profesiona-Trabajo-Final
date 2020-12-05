import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SupervisarClientesPage } from './supervisar-clientes.page';

describe('SupervisarClientesPage', () => {
  let component: SupervisarClientesPage;
  let fixture: ComponentFixture<SupervisarClientesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisarClientesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SupervisarClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
