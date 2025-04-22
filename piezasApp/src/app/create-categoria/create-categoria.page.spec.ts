import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCategoriaPage } from './create-categoria.page';

describe('CreateCategoriaPage', () => {
  let component: CreateCategoriaPage;
  let fixture: ComponentFixture<CreateCategoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
