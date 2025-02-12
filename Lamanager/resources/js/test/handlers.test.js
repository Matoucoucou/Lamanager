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

describe('handleClick', () => {
    it('devrait appeler onCellClick si enseignantId est absent', () => {
        const onCellClick = jest.fn();
        handleClick(0, 0, 1, 1, false, false, null, onCellClick, false, jest.fn(), 1, {}, [], [], '', 0, 0, {}, jest.fn());
        expect(onCellClick).toHaveBeenCalled();
    });
});

describe('handleContextMenu', () => {
    it('devrait appeler preventDefault et stopPropagation sur l\'événement', () => {
        const event = { preventDefault: jest.fn(), stopPropagation: jest.fn(), clientX: 0, clientY: 0 };
        handleContextMenu(event, 0, 0, false, {}, jest.fn());
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
    });
});

describe('handleCloseContextMenu', () => {
    it('devrait définir setContextMenu à null', () => {
        const setContextMenu = jest.fn();
        handleCloseContextMenu(setContextMenu);
        expect(setContextMenu).toHaveBeenCalledWith(null);
    });
});

describe('handleDuplicate', () => {
    it('devrait définir setShowDuplicatePopup à true', () => {
        const setShowDuplicatePopup = jest.fn();
        handleDuplicate(setShowDuplicatePopup);
        expect(setShowDuplicatePopup).toHaveBeenCalledWith(true);
    });
});

describe('handleDuplicateConfirm', () => {
    it('devrait définir setIsLoading à true', async () => {
        const setIsLoading = jest.fn();
        await handleDuplicateConfirm({}, [], {}, [], jest.fn(), setIsLoading, jest.fn(), jest.fn(), '', '', jest.fn(), jest.fn());
        expect(setIsLoading).toHaveBeenCalledWith(true);
    });
});

describe('handleMove', () => {
    it('devrait définir setShowMovePopup à true', () => {
        const setShowMovePopup = jest.fn();
        handleMove(setShowMovePopup);
        expect(setShowMovePopup).toHaveBeenCalledWith(true);
    });
});

describe('handleMoveConfirm', () => {
    it('devrait définir setIsLoading à true', async () => {
        const setIsLoading = jest.fn();
        await handleMoveConfirm(0, {}, [], {}, [], jest.fn(), setIsLoading, jest.fn(), jest.fn());
        expect(setIsLoading).toHaveBeenCalledWith(true);
    });
});

describe('handleDelete', () => {
    it('devrait définir setShowDeletePopup à true', () => {
        const setShowDeletePopup = jest.fn();
        handleDelete(jest.fn(), setShowDeletePopup);
        expect(setShowDeletePopup).toHaveBeenCalledWith(true);
    });
});

describe('handleDeleteConfirm', () => {
    it('devrait définir setShowDeletePopup à false', async () => {
        const setShowDeletePopup = jest.fn();
        await handleDeleteConfirm({}, [], [], jest.fn(), setShowDeletePopup, '', '', {});
        expect(setShowDeletePopup).toHaveBeenCalledWith(false);
    });
});

describe('handleUpdate', () => {
    it('devrait définir setShowUpdatePopup à true', () => {
        const setShowUpdatePopup = jest.fn();
        handleUpdate(setShowUpdatePopup, jest.fn(), {}, [], []);
        expect(setShowUpdatePopup).toHaveBeenCalledWith(true);
    });
});
