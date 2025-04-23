import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPiezaPage } from './edit-pieza.page';

describe('EditPiezaPage', () => {
  let component: EditPiezaPage;
  let fixture: ComponentFixture<EditPiezaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPiezaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
