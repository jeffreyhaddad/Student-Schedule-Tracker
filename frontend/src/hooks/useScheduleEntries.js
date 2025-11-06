/**
 * useScheduleEntries Hook
 * 
 * Manages schedule entries state and CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import { scheduleEntryService } from '../services/scheduleEntryService';

export function useScheduleEntries() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all entries
    const fetchEntries = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await scheduleEntryService.getAll();
            setEntries(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Create entry
    const createEntry = useCallback(async (entryData) => {
        setLoading(true);
        setError(null);

        try {
            const newEntry = await scheduleEntryService.create(entryData);
            setEntries(prev => [newEntry, ...prev]);
            return newEntry;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update entry
    const updateEntry = useCallback(async (id, entryData) => {
        setLoading(true);
        setError(null);

        try {
            const updatedEntry = await scheduleEntryService.update(id, entryData);
            setEntries(prev => prev.map(entry =>
                entry.id === id ? updatedEntry : entry
            ));
            return updatedEntry;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete entry
    const deleteEntry = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            await scheduleEntryService.delete(id);
            setEntries(prev => prev.filter(entry => entry.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Search entries
    const searchEntries = useCallback(async (query) => {
        setLoading(true);
        setError(null);

        try {
            const data = await scheduleEntryService.search(query);
            setEntries(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get by weekday
    const getByWeekday = useCallback(async (weekday) => {
        setLoading(true);
        setError(null);

        try {
            const data = await scheduleEntryService.getByWeekday(weekday);
            setEntries(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Load entries on mount
    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    return {
        entries,
        loading,
        error,
        fetchEntries,
        createEntry,
        updateEntry,
        deleteEntry,
        searchEntries,
        getByWeekday,
        clearError
    };
}
