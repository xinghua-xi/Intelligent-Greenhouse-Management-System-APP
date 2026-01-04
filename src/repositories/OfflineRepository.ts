import AsyncStorage from '@react-native-async-storage/async-storage';
import { OfflineRecord } from '../types';

const STORAGE_KEY = '@smart_greenhouse_offline_data';

class OfflineRepository {
  // Get all records
  async getAll(): Promise<OfflineRecord[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Failed to load records', e);
      return [];
    }
  }

  // Add a new record
  async add(record: OfflineRecord): Promise<OfflineRecord[]> {
    try {
      const current = await this.getAll();
      const updated = [record, ...current];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save record', e);
      return [];
    }
  }

  // Mark all as synced (Mock sync logic)
  async syncAll(): Promise<OfflineRecord[]> {
    try {
      const current = await this.getAll();
      const updated = current.map(r => ({ ...r, synced: true }));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to sync records', e);
      return [];
    }
  }

  // Clear synced records
  async clearSynced(): Promise<OfflineRecord[]> {
    try {
      const current = await this.getAll();
      const updated = current.filter(r => !r.synced);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to clear synced', e);
      return [];
    }
  }
}

export const offlineRepository = new OfflineRepository();
