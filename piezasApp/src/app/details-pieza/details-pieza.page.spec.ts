import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsPiezaPage } from './details-pieza.page';

describe('DetailsPiezaPage', () => {
  let component: DetailsPiezaPage;
  let fixture: ComponentFixture<DetailsPiezaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPiezaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
