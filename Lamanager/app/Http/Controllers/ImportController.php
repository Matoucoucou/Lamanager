<?php

namespace App\Http\Controllers;

use AllowDynamicProperties;
use App\Services\ImportService;
use Illuminate\Http\Request;

#[AllowDynamicProperties] class ImportController extends Controller
{
    protected $importService;

    /**
     * Inject CsvImportService into the controller.
     *
     * @param ImportService $csvImportService
     */
    public function __construct(ImportService $importService)
    {
        $this->importService = $importService;
    }

    /**
     * Handle the CSV import request.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function import(Request $request): \Illuminate\Http\JsonResponse
    {
        // Validation du fichier
        //$request->validate([
        //    'csv' => 'required|file|mimes:csv,txt|max:2048'
        //]);

        // Obtenir le chemin du fichier téléchargé
        $filePath = $request->file('csv')->getRealPath();

        // Utiliser le service pour importer les données
        $data = $this->importService->import($filePath);

        // Vérifiez si des données ont été importées
        if (!empty($data)) {
            return response()->json([
                'status' => 'success',
                'message' => 'File Imported Successfully',
                'data' => $data
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No data found in CSV file'
            ], 400);
        }
    }
}
