import axios from 'axios';
import { getColorClass, traitementNom, addCellToDatabase, deleteCellFromDatabase, handleCellClick } from '../utils.js';

describe('utils.js', function () {
    let axiosPostMock, axiosDeleteMock;

    beforeEach(() => {
        axiosPostMock = jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({}));
        axiosDeleteMock = jest.spyOn(axios, 'delete').mockImplementation(() => Promise.resolve({}));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getColorClass', function () {
        it('devrait retourner la classe de couleur correcte en fonction de colIndex', function () {
            expect(getColorClass(0, 1, 1)).toBe('bg-yellow-300');
            expect(getColorClass(1, 1, 1)).toBe('bg-red-300');
            expect(getColorClass(2, 1, 1)).toBe('bg-blue-300');
        });
    });

    describe('traitementNom', function () {
        it('devrait tronquer le nom de plus de 8 caractères', function () {
            expect(traitementNom('abcdefghij')).toBe('abcdefgh...');
        });

        it('devrait retourner le nom tel quel s\'il fait 8 caractères ou moins', function () {
            expect(traitementNom('abcd')).toBe('abcd');
        });
    });

    describe('addCellToDatabase', function () {

        it('devrait lancer une erreur et la consigner en cas d\'ajout échoué', async function () {
            const error = new Error('Échec de l\'ajout');
            axiosPostMock.mockRejectedValueOnce(error);
            const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

            await expect(addCellToDatabase(1, 1, 1, 1, 1, 0)).rejects.toThrow(error);
            expect(consoleErrorMock).toHaveBeenCalledWith('Erreur lors de l\'ajout à la base de données:', error);

            consoleErrorMock.mockRestore();
        });

        it('devrait retourner les données de réponse en cas d\'ajout réussi', async function () {
            const responseData = { success: true };
            axiosPostMock.mockResolvedValueOnce({ data: responseData });

            await expect(addCellToDatabase(1, 1, 1, 1, 1, 0)).resolves.toBe(responseData);
        });

    });

    describe('deleteCellFromDatabase', function () {
        it('devrait retourner les données de réponse en cas de suppression réussie', async function () {
            const responseData = { success: true };
            axiosDeleteMock.mockResolvedValueOnce({ data: responseData });

            await expect(deleteCellFromDatabase(1, 2, 3)).resolves.toBe(responseData);
        });

        it('devrait lancer une erreur et la consigner en cas de suppression échouée', async function () {
            const error = new Error('Échec de la suppression');
            axiosDeleteMock.mockRejectedValueOnce(error);
            const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

            await expect(deleteCellFromDatabase(1, 2, 3)).rejects.toThrow(error);
            expect(consoleErrorMock).toHaveBeenCalledWith('Erreur lors de la suppression de la base de données:', error);

            consoleErrorMock.mockRestore();
        });
    });
});
