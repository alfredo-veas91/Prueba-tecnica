import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePiezaPage } from './create-pieza.page';

describe('CreatePiezaPage', () => {
  let component: CreatePiezaPage;
  let fixture: ComponentFixture<CreatePiezaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePiezaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
