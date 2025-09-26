<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer/Exception.php';
require '../PHPMailer/PHPMailer.php';
require '../PHPMailer/SMTP.php';

try {
    if(!empty($_POST["file"])){
        $data = base64_decode($_POST["file"]);
        $asunto = $_POST["subj"];
        file_put_contents($_POST['nombre'].".pdf", $data);
    }else{
        echo "error";
    }

    $mail = new PHPMailer(true);

        // Configuracion del servidor SMTP
        $mail->isSMTP();


        // Configuracion del correo electronico
        $mail->setFrom('emisor@formatosdigitales.teching.com.pe', 'Aut. Balance y correcion cadena');

        error_log("El nombre es".$_POST["nombre"]);

        if($_POST["nombre"]=="ACTA_DE_INSPECCION"){
            date_default_timezone_set('America/Lima');
            $fecha_hora_actual = date('dmY_His');
            $mail->addAddress('jvp9830@gmail.com', 'Receptor');
            $mail->Subject = 'Formato Balance_'.$asunto;
            $mail->addAttachment($_POST['nombre'].".pdf", $_POST['nombre']."_".$fecha_hora_actual);
        }else{
            $mail->addAddress('jvalladares@teching.com.pe', 'Receptor');
            $mail->Subject = 'Formato Balance_'.$asunto;
            $mail->addAttachment($_POST['nombre'].".pdf", $_POST['nombre'].".pdf");
        }

        // Contenido del mensaje (opcional)
        $mail->Body = 'Se adjunta documento generado';

        // Enviar el correo electronico
        $mail->send();
        error_log("Mensaje enviado");
} catch (Exception $e) {
    error_log("Error al enviar el correo: {$mail->ErrorInfo}");
}
?>