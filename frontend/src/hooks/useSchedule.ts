import { useState, useEffect } from 'react';
import type { ScheduleEntry } from '../services/scheduleService';
import { scheduleService } from '../services/scheduleService';
import { useAuth } from './useAuth';

export function useSchedule() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const data = await scheduleService.getAll(user.id);
        setEntries(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch schedule';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user?.id]);

  const createEntry = async (scheduleData: any) => {
    const newEntry = await scheduleService.create(user!.id, scheduleData);
    setEntries([...entries, newEntry]);
    return newEntry;
  };

  const updateEntry = async (entryId: number, scheduleData: any) => {
    const updated = await scheduleService.update(user!.id, entryId, scheduleData);
    setEntries(entries.map((e) => (e.id === entryId ? updated : e)));
    return updated;
  };

  const deleteEntry = async (entryId: number) => {
    await scheduleService.delete(user!.id, entryId);
    setEntries(entries.filter((e) => e.id !== entryId));
  };

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
