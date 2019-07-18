import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySceneComponent } from './display-scene.component';

describe('DisplaySceneComponent', () => {
  let component: DisplaySceneComponent;
  let fixture: ComponentFixture<DisplaySceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaySceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
