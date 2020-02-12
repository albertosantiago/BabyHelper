<?php namespace App\Api;

class BladeHelpers{

    public function booleanTranslate($bool)
    {
        if($bool){
            echo "YES";
        }else{
            echo "NO";
        }
    }

    public function nullFormat($value)
    {
        if(empty($value)){
            echo "NONE";
        }else{
            echo $value;
        }
    }

    public function formatCheckbox($name, $value, $extra='')
    {
        $checked = '';
        if($value){
            $checked = "checked='checked'";
        }
        echo "<input type='checkbox' name='$name' $checked $extra />";
    }

    public function formatFilterBooleanSelect($name, $default='all')
    {
        $value = -1;
        if($default!='all'){
            if($default){
                $value = 1;
            }else{
                $value = 0;
            }
        }

        if(isset($_GET['filters'])){
            $value = $_GET['filters'][$name];
        }
        $selectedAll = $selectedYes = $selectedNo  = "";
        if($value==1){
            $selectedYes = "selected='selected'";
        }elseif($value==0){
            $selectedNo = "selected='selected'";
        }else{
            $selectedAll = "selected='selected'";
        }

        echo "<select name='filters[$name]' class='form-control'>
                <option $selectedAll value='-1'>All</option>
                <option $selectedYes value='1'>Yes</option>
                <option $selectedNo value='0'>No</option>
            </select>";
    }

    public function formatTableHeader($headers)
    {
        $chunks = explode('?', $_SERVER['REQUEST_URI']);
        $requestURI = $chunks[0];
        $sort  = (!empty($_GET['sort']))?$_GET['sort']: '';
        $order = (!empty($_GET['dir']))?$_GET['dir']: 'DESC';
        $params = $_GET;

        $html = "<tr>";
        foreach($headers as $header){
            if(!empty($header['name'])){
                $params['sort'] = $header['name'];
                if($header['name']==$sort){
                    if($order=='DESC'){
                        $params['dir'] = 'ASC';
                    }else{
                        $params['dir'] = 'DESC';
                    }
                }else{
                    $params['dir'] = 'DESC';
                }
                $paramString = http_build_query($params);
                $url = $requestURI."?".$paramString;
                $th = "<a style='color:#000' href='$url'>".$header['text']."</a>";
            }else{
                $th = $header['text'];
            }
            $html .= "<th>".$th."</th>";
        }
        $html .= "</tr>";
        return $html;
    }
}
