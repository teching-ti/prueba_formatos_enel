<?php

try {
    //se recibe la data y deberá ser decodificada
    $data = json_decode(file_get_contents('php://input'), true);

    //se guardan en variables php los datos obtenidos por el envío
    $nombreConductor = $data['nombreConductor'];
    $fechasVencimiento = $data['fechasVencimiento'];

    // Cargar el archivo JSON
    $jsonFile = '../scripts/datos.json';
    $jsonData = file_get_contents($jsonFile);
    $data = json_decode($jsonData, true);

    // Definir todos los tipos de conductores
    $tiposConductores = ['tecnico', 'supervisor', 'prevencionista'];

    // Recorrer cada tipo de conductor
    foreach ($tiposConductores as $tipo) {
        // Buscar al conductor por su nombre en el array correspondiente
        foreach ($data[$tipo] as &$conductor) {
            if ($conductor['name'] === $nombreConductor) {
                // Actualizar las fechas de vencimiento del botiquín
                foreach ($conductor['botiquin'] as &$elemento) {
                    $elemento['fecha_vencimiento'] = array_shift($fechasVencimiento);
                }
                // Romper el bucle una vez que se haya actualizado el conductor
                break 2;
            }
        }
    }

    // Guardar los datos actualizados en el archivo JSON
    file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT));

    // Imprime los datos
    echo json_encode([
        'nombreConductor' => $nombreConductor,
        'fechasVencimiento' => $fechasVencimiento
    ]);

} catch (Exception $e) {

    echo json_encode(['error' => $e->getMessage()]);
}
?>