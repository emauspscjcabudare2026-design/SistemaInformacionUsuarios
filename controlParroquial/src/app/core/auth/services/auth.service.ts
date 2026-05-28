import { Injectable, inject, signal, computed } from '@angular/core';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { firebaseAuth } from '../../../configurations/firebase.config';
import { AppUser } from '../../models/app-user.model';
import { UserRepository } from '../../repositories/user.repository';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userRepository = inject(UserRepository);

  readonly firebaseUser = signal<User | null>(null);
  readonly appUser = signal<AppUser | null>(null);
  readonly authReady = signal(false);

  readonly isLoggedIn = computed(() => !!this.firebaseUser());
  readonly role = computed(() => this.appUser()?.role ?? null);

  private readonly authReadyPromise: Promise<void>;

  constructor() {
    this.authReadyPromise = new Promise((resolve) => {
      onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
        this.firebaseUser.set(firebaseUser);

        if (!firebaseUser) {
          this.appUser.set(null);
          this.authReady.set(true);
          resolve();
          return;
        }

        const appUser = await this.loadUserProfile(firebaseUser.uid);

        this.appUser.set(appUser);
        this.authReady.set(true);
        resolve();
      });
    });
  }

  async waitUntilAuthReady(): Promise<void> {
    return this.authReadyPromise;
  }

  async loginAndLoadProfile(
    email: string,
    password: string,
  ): Promise<AppUser> {
    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    const appUser = await this.loadUserProfile(credential.user.uid);

    if (!appUser) {
      await this.logout();
      throw new Error('USER_PROFILE_NOT_FOUND');
    }

    if (!appUser.active) {
      await this.logout();
      throw new Error('USER_DISABLED');
    }

    this.firebaseUser.set(credential.user);
    this.appUser.set(appUser);
    this.authReady.set(true);

    return appUser;
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);

    this.firebaseUser.set(null);
    this.appUser.set(null);
  }

  private async loadUserProfile(uid: string): Promise<AppUser | null> {
    return this.userRepository.findByUid(uid);
  }
}
