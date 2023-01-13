import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceUsersComponent } from './preference-users.component';

describe('PreferenceUsersComponent', () => {
  let component: PreferenceUsersComponent;
  let fixture: ComponentFixture<PreferenceUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferenceUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferenceUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
