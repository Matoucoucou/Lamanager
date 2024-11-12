<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class ImportService
{
    /**
     * Import the CSV file and process its data.
     *
     * @param string $filePath The path to the CSV file.
     * @return array Parsed data from the CSV file.
     */
    public function import($filePath): array
    {
        // Initialiser un tableau pour stocker les données du CSV
        $data = [];

        // Ouvrir le fichier CSV en mode lecture
        if (($handle = fopen($filePath, 'r')) !== false) {
            // Lire chaque ligne du fichier
            while (($row = fgetcsv($handle, 50, ',')) !== false) {
                // Ajouter chaque ligne au tableau $data
                $data[] = $row;
            }
            // Fermer le fichier
            fclose($handle);
        } else {
            Log::error("Unable to open file at path: $filePath");
        }

        return $data;
    }
}
