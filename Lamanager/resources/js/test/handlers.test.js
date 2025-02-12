import { handleClick, handleContextMenu, handleCloseContextMenu, handleDuplicate, handleDuplicateConfirm, handleMove, handleMoveConfirm, handleDelete, handleDeleteConfirm, handleUpdate, handleUpdateConfirm, parseRows, parseWeeks } from '../handlers';

describe('parseRows', () => {
    it('devrait analyser une chaîne de lignes séparées par des virgules', () => {
        expect(parseRows('1,2,3')).toEqual([1, 2, 3]);
    });

    it('devrait analyser une chaîne de plages de lignes', () => {
        expect(parseRows('1-3')).toEqual([1, 2, 3]);
    });

    it('devrait analyser une combinaison de lignes et de plages', () => {
        expect(parseRows('1,3-5,7')).toEqual([1, 3, 4, 5, 7]);
    });

    it('devrait retourner un tableau vide pour une chaîne vide', () => {
        expect(parseRows('')).toEqual([]);
    });
});

describe('parseWeeks', () => {
    it('devrait analyser une chaîne de semaines séparées par des virgules', () => {
        expect(parseWeeks('1,2,3')).toEqual([1, 2, 3]);
    });

    it('devrait analyser une chaîne de plages de semaines', () => {
        expect(parseWeeks('1-3')).toEqual([1, 2, 3]);
    });

    it('devrait analyser une combinaison de semaines et de plages', () => {
        expect(parseWeeks('1,3-5,7')).toEqual([1, 3, 4, 5, 7]);
    });

    it('devrait retourner un tableau vide pour une chaîne vide', () => {
        expect(parseWeeks('')).toEqual([]);
    });
});