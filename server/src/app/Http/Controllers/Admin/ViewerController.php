<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ViewerController extends Controller
{
    private $apacheLogsEnabled = false;
    const APACHE_LOG_DIR = "/var/log/apache2/";

    public function index(Request $request)
    {
        $options = $this->getOptions();
        $fileSelected = ($request->get('log')) ? $request->get('log'): 0;
        $file = $this->getLogContent($fileSelected);
        return view('admin/viewer', ['logs' => $options,
                                     'file' => $file,
                                     'selected' => $fileSelected
                                    ]);
    }

    public function getLogContent($selected=0){
        $logs = $this->getFileLogs();
        if(empty($logs)){
            return "NO HAY ARCHIVOS DE LOGS.";
        }
        $content = "";
        $log = storage_path('logs').DIRECTORY_SEPARATOR.$logs[$selected];
        if(file_exists($log)){
            return file_get_contents($log);
        }else{
            $log = self::APACHE_LOG_DIR.$logs[$selected];
            if(file_exists($log)){
                return file_get_contents($log);
            }
        }
        return "Imposible recuperar el contenido del log.";
    }

    public function getFileLogs()
    {
        $logs = [];
        $dir = storage_path('logs');
        $files = scandir($dir);
        foreach ($files as $file) {
            if (stripos($file, '.log')) {
                $logs[] = $file;
            }
        }
        if($this->apacheLogsEnabled){
            $files = scandir(self::APACHE_LOG_DIR);
            foreach ($files as $file) {
                if ((stripos($file, '.log')) &&
                    (!stripos($file, '.gz'))){
                        $logs[] = $file;
                }
            }
        }
        return $logs;
    }

    public function getOptions()
    {
        $index = 0;
        $logGroups = [];
        $logs = [];
        $dir = storage_path('logs');
        $files = scandir($dir);
        foreach ($files as $file) {
            if (stripos($file, '.log')) {
                $logs[$index] = $file;
                $index++;
            }
        }
        $logGroups[] = [
            'label' => 'Backend Logs',
            'items' => $logs,
        ];
        if($this->apacheLogsEnabled){
            $logs  = [];
            $files = scandir(self::APACHE_LOG_DIR);
            foreach ($files as $file) {
                if ((stripos($file, '.log')) &&
                    (!stripos($file, '.gz'))){
                        $logs[$index] = $file;
                        $index++;
                }
            }
            $logGroups[] = [
                'label' => 'Apache Logs',
                'items' => $logs,
            ];
        }
        return $logGroups;
    }

    public function del(Request $request)
    {
        $selected = $request->get('selected');
        $logs = $this->getFileLogs();
        if(empty($logs)){
            return back();
        }
        $log = storage_path('logs').DIRECTORY_SEPARATOR.$logs[$selected];
        if(file_exists($log)){
            unlink($log);
            return back();
        }else{
            $log = self::APACHE_LOG_DIR.$logs[$selected];
            if(file_exists($log)){
                unlink($log);
                return back();
            }
        }
        return back();
    }
}
