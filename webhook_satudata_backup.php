<?php
$secret = 's0To_c4K_h@R'; // Optional security token

// Lokasi log
$logPath = '/var/www/html/webhook_log/webhook_satudata.log';

// Tulis log awal saat webhook dipanggil
file_put_contents($logPath, date('Y-m-d H:i:s') . " - Webhook satudata triggered\n", FILE_APPEND);

// Ambil payload dari Bitbucket
$payload = file_get_contents('php://input');
$data = json_decode($payload, true);

// Simpan user yang menjalankan script
file_put_contents($logPath, "User: " . shell_exec('whoami') . "\n", FILE_APPEND);

// Cek apakah push ke branch main
if (isset($data['push']['changes'][0]['new']['name']) &&
    $data['push']['changes'][0]['new']['name'] === 'main') {

    // Jalankan git pull sebagai user www-data, menggunakan SSH key
    putenv('GIT_SSH_COMMAND=ssh -i /var/www/.ssh/id_rsa_bitbucket');
    chdir('/var/www/html/satudata');
    $output = shell_exec('git pull origin main 2>&1');

    // Simpan output git pull ke log
    file_put_contents($logPath, "Git Output:\n" . $output . "\n", FILE_APPEND);
}

// Beri respon OK
http_response_code(200);
echo "OK";
?>
