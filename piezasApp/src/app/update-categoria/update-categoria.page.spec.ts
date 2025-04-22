import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCategoriaPage } from './update-categoria.page';

describe('UpdateCategoriaPage', () => {
  let component: UpdateCategoriaPage;
  let fixture: ComponentFixture<UpdateCategoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
