<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Calculadora de Edad</title>
</head>
<body>

    <h1>Calculadora de Edad</h1>

    <form method="post">
        <label for="name">Nombre:</label>
        <input type="text" id="name" name="name" required><br><br>

        <label for="dob">Fecha de Nacimiento:</label>

        <input type="date" id="dob" name="dob" required><br><br>

        <input type="submit" value="Calcular Edad">

    </form>

    <p id="result">

        <?php

        if ($_SERVER["REQUEST_METHOD"] == "POST") {

            $name = htmlspecialchars($_POST['name']);

            $dob = new DateTime($_POST['dob']);

            $today = new DateTime();
            $ageInterval = $today->diff($dob);

            $ageInYears = $ageInterval->y;

            $remainingDays = $ageInterval->days - ($ageInYears * 365 + floor($ageInYears / 4)); // Ajuste para años bisiestos


            echo "Hola $name, a día de hoy tienes $ageInYears años y $remainingDays días.";

        }
        ?>

    </p>

</body>

</html>