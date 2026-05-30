// src/app/core/repositories/user.repository.ts

import { Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { firebaseDb } from '../../configurations/firebase.config';
import { AppUser } from '../models/app-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  private readonly collectionName = 'users';

  async findByUid(uid: string): Promise<AppUser | null> {
    const ref = doc(firebaseDb, this.collectionName, uid);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as AppUser;
  }

  async findAll(): Promise<AppUser[]> {
    const ref = collection(firebaseDb, this.collectionName);
    const snapshot = await getDocs(ref);

    return snapshot.docs.map((docSnapshot) => {
      return docSnapshot.data() as AppUser;
    });
  }

  async createOrUpdate(user: AppUser): Promise<void> {
    const ref = doc(firebaseDb, this.collectionName, user.uid);

    await setDoc(
      ref,
      {
        ...user,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  async delete(uid: string): Promise<void> {
    const ref = doc(firebaseDb, this.collectionName, uid);
    await deleteDoc(ref);
  }
}
