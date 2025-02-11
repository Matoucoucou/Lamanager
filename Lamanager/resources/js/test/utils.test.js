import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import { getColorClass, traitementNom, addCellToDatabase, deleteCellFromDatabase, handleCellClick } from '../utils.js';

describe('utils.js', function () {
    let axiosPostStub, axiosDeleteStub;

    beforeEach(() => {
        axiosPostStub = sinon.stub(axios, 'post');
        axiosDeleteStub = sinon.stub(axios, 'delete');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getColorClass', function () {
        it('devrait retourner la classe de couleur correcte en fonction de colIndex', function () {
            expect(getColorClass(0, 1, 1)).to.equal('bg-yellow-300');
            expect(getColorClass(1, 1, 1)).to.equal('bg-red-300');
            expect(getColorClass(2, 1, 1)).to.equal('bg-blue-300');
        });
    });

    describe('traitementNom', function () {
        it('devrait tronquer le nom de plus de 8 caractères', function () {
            expect(traitementNom('abcdefghij')).to.equal('abcdefgh...');
        });

        it('devrait retourner le nom tel quel s\'il fait 8 caractères ou moins', function () {
            expect(traitementNom('abcd')).to.equal('abcd');
        });
    });

    describe('deleteCellFromDatabase', function () {
        it('devrait retourner les données de réponse en cas de suppression réussie', async function () {
            const responseData = { success: true };
            axiosDeleteStub.resolves({ data: responseData });

            const result = await deleteCellFromDatabase(1, 2, 3);
            expect(result).to.equal(responseData);
        });

        it('devrait lancer une erreur et la consigner en cas de suppression échouée', async function () {
            const error = new Error('Échec de la suppression');
            axiosDeleteStub.rejects(error);
            const consoleErrorStub = sinon.stub(console, 'error');

            try {
                await deleteCellFromDatabase(1, 2, 3);
            } catch (e) {
                expect(e).to.equal(error);
                expect(consoleErrorStub.calledOnce).to.be.true;
                expect(consoleErrorStub.calledWith('Erreur lors de la suppression de la base de données:', error)).to.be.true;
            }

            consoleErrorStub.restore();
        });
    });
});
