import { renderHook, act, waitFor } from '@testing-library/react';
import useFetchData from '../hooks/useFetchData';
import { fetchGroupes, fetchSemaines, fetchEnseignant, fetchCases, fetchEnseignantCodes } from '../api';

jest.mock('../api');

describe('useFetchData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait initialiser les états correctement', async () => {
        fetchGroupes.mockResolvedValue([]);
        fetchSemaines.mockResolvedValue([]);
        fetchEnseignant.mockResolvedValue({});
        fetchCases.mockResolvedValue([]);
        fetchEnseignantCodes.mockResolvedValue({});

        const { result } = renderHook(() => useFetchData('', [], 1, 1, '', jest.fn()));

        await waitFor(() => {
            expect(result.current.semainesID).toEqual([]);
            expect(result.current.semaines).toEqual([]);
            expect(result.current.nbCM).toBe(0);
            expect(result.current.nbTP).toBe(0);
            expect(result.current.nbTD).toBe(0);
            expect(result.current.nbGroupe).toBe(0);
            expect(result.current.groupes).toEqual([]);
            expect(result.current.enseignantCode).toBe('');
            expect(result.current.heures).toBe(0);
            expect(result.current.minutes).toBe(0);
            expect(result.current.clickedCells).toEqual({});
        });
    });
});
