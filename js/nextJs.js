"use strict";
/**
* Name: NextJs
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @NextJs
* Author: ThemeDev
* Developer: Hazi
*/
class NextExt{
    constructor( $el = ''){
        if( $el === ''){
            return;
        }
        return document.querySelectorAll($el);
    }

    static createElement($append, $element, $props, $child, $type = 'append'){
        let $el, $chiNew, $eleNew, $propsNew, $chieldNew, $typeNew;
        if( $element == '' || !$append){
            return null;
        }

        $el = NextExt.instance().nx_append($append, $element, $props, $type);
        
        if( Array.isArray($child) && $child.length > 0){
            $child.forEach(function($data, $c){
                if( $data.child && $data.child != ''){
                    $chiNew = ($data.child) ? $data.child : [];
                    $eleNew = ($chiNew[0]) ? $chiNew[0] : '';
                    $propsNew = ($chiNew[1]) ? $chiNew[1] : '';
                    $chieldNew = ($chiNew[2]) ? $chiNew[2] : '';
                    $typeNew = ($chiNew[3]) ? $chiNew[3] : 'append';

                    NextExt.createElement($el, $eleNew, $propsNew, $chieldNew, $typeNew);
                    
                }
            });
        }
        return $el;
    }

    // add element
    addElement($arr){
        var $el, $eleTag, $props, $child, $typeNew, $append;
        if( Array.isArray($arr) ){
            $arr.forEach(function($data){
                $el = ($data[0]) ? $data[0] : '';
                $append = document.querySelector($el);
                if($append){
                    $eleTag = ($data[1]) ? $data[1] : '';
                    $props = ($data[2]) ? $data[2] : '';
                    $child = ($data[3]) ? $data[3] : [];
                    $typeNew = ($data[4]) ? $data[4] : 'append';
                    NextExt.createElement($append, $eleTag, $props, $child, $typeNew);
                }
               
            });
        }
    }

    nx_append($append, $element, $props, $type = 'append'){
        let $attr = ['content', 'contenthtml', 'contentHTML', 'innerhtml', 'innerHTML', 'innerText', 'contentText', 'trigger', 'removetrigger'];
        if($append){
            let $e = document.createElement($element);
            if( Object.entries($props) ){ 
                for (const [$k, $v] of Object.entries($props)) {
                    if( $k == ''){
                        continue;
                    }
                    if( $attr.indexOf($k) > -1){
                        if( ['content', 'innertext', 'innerText', 'contentText'].indexOf($k) > -1){
                            $e.innerText = $v;
                        } else if ($k == 'trigger'){
                            NextExt.instance().addTrigger($e, $v);
                        } else if ($k == 'removetrigger'){
                            NextExt.instance().removeTrigger($e, $v);
                        } else{
                            $e.innerHTML = $v;
                        }
                    } else {
                        let $key = $k.replace(/_/g, '-').replace(/--/g, '-');
                        $e.setAttribute($key, $v);
                    }
                    
                };
            }
            if($type == 'before'){
                $append.insertBefore($e, $append.childNodes[0]);
            } else if($type == 'after'){
                let $len = $append.childNodes.length;
                $append.insertBefore($e, $append.childNodes[$len]);
            } else if( $type == 'append'){
                $append.appendChild($e);
            }else{
                if($append.childNodes[$type]){
                    $append.insertBefore($e, $append.childNodes[$type]);
                } 
            }
            return $e;
        }
        return null;
    }
    // append
    appendEle($append, $element, $props){
        return NextExt.instance().nx_append($append, $element, $props, 'append');
    }
    // after
    afterEle($append, $element, $props){
        return NextExt.instance().nx_append($append, $element, $props, 'after');
    }
    // before
    beforeEle($append, $element, $props){
        return NextExt.instance().nx_append($append, $element, $props, 'before');
    }
    removeTrigger($element, $props){
        if( Object.entries($props) ){
            for (const [$k, $v] of Object.entries($props)) {
                if( $k == ''){
                    continue;
                }
                var fn = $k;
                if( typeof fn === "function"){
                    $element.removeEventListener($k, fn);
                }
            }
        }
        return $element;
    }
    addTrigger($element, $props){
        if( Object.entries($props) ){
            for (const [$k, $v] of Object.entries($props)) {
                if( $k == ''){
                    continue;
                }
                
                if( Array.isArray($v) && $v.length > 0){
                    let $func = ($v[0]) ? $v[0] : ''; 
                    let $params = ($v[1]) ? $v[1] : false; 
                    
                    var fn = $func;
                    if( typeof fn === "function"){
                        $element.addEventListener($k, fn, $params);
                    }
                }else{
                    var fn = $v;
                    if( typeof fn === "function"){
                        $element.addEventListener($k, fn);
                    }
                }
            }
        }
        return $element;
    }

    jsonToStr( $json ){
        return JSON.stringify($json);
    }
    strToJson( $json ){
        return JSON.parse($json);
    }

    getJson($url){
        var xhr = NextExt.instance().httpRequest();
        xhr.open('GET', $url);
        xhr.send();
        return xhr;
    }

    checkFileExist( url ) { 
        let http = new XMLHttpRequest();
        if (url.length === 0) { 
            return false;
        } else {
            http.open('HEAD', url, false); 
            http.send();
            if (http.status === 200) { 
                return true;
            } else { 
                return false;
            } 
        } 
        return false;
    } 

    // get parents class
    getParents($parent, $find = ''){
        if( $parent ){
            if( Array.isArray($parent) && $parent.length > 0){
                $parent.forEach(function($v){
                    if($v){
                        NextExt.instance().getParents($v,$find);
                    }
                });
            } else {
                let $el = $parent.parentElement;
                if($el){
                    
                    let $chFind = $el.querySelectorAll($find);
                    if($chFind.length > 0 ){
                        return $chFind;
                    } else {
                       return NextExt.instance().getParents($el, $find);
                    }
                    
                }
            }
        }
    }

    // get parent
    getParent($el){
        return ($el.parentElement) ? $el.parentElement : null;
    }

    // get Class
    getClass($el){
        return ($el.classList) ? $el.classList : null;
    }

    // add class
    addClass($el, $class = ''){
        if($el  && $class != ''){
            if( Array.isArray($class) && $class.length > 0){
                $class.forEach(function($v){
                    if($v.trim() != ''){
                        let $split = $v.trim().split(" ");
                        if($split.length > 1){
                            return NextExt.instance().addClass($el, $split);
                        } else {
                            $el.classList.add($v.trim());
                        } 
                    }
                });
            } else {
                let $split = $class.trim().split(" ");
                if($split.length > 1){
                    return NextExt.instance().addClass($el, $split);
                }else{
                    $el.classList.add($class);
                }
            }
        }
    }

    // remove class
    removeClass($el, $class = ''){
        if($el && $class != ''){
            if( Array.isArray($class) && $class.length > 0){
                $class.forEach(function($v){
                    if($v.trim() != ''){
                        let $split = $v.trim().split(" ");
                        if($split.length > 1){
                            return NextExt.instance().removeClass($el, $split);
                        } else {
                            $el.classList.remove($v.trim());
                        } 
                    }
                });
            } else {
                let $split = $class.trim().split(" ");
                if($split.length > 1){
                    return NextExt.instance().removeClass($el, $split);
                }else{
                    $el.classList.remove($class);
                }
            }
        }
    }

    // toggle class
    toggleClass($el, $class = ''){
        if($el && $class != ''){
            if( Array.isArray($class) && $class.length > 0){
                $class.forEach(function($v){
                    if($v.trim() != ''){
                        let $split = $v.trim().split(" ");
                        if($split.length > 1){
                            return NextExt.instance().toggleClass($el, $split);
                        } else {
                            $el.classList.toggle($v.trim());
                        } 
                    }
                });
            } else {
                let $split = $class.trim().split(" ");
                if($split.length > 1){
                    return NextExt.instance().toggleClass($el, $split);
                }else{
                    $el.classList.toggle($class);
                } 
            }
        }
    }

    // get attribute
    getAttr($el, $attr = ''){
        if($el && $attr != ''){
            return ($el.hasAttribute($attr)) ? $el.getAttribute($attr) : null;
        }
        return null;
    }

    // set attribute
    setAttr($el, $attr = '', $val = ''){
        if($el){
            if( Object.entries($attr) ){ 
                for (const [$k, $v] of Object.entries($attr)) {
                    if( $k == ''){
                        continue;
                    }
                    let $key = $k.replace(/_/g, '-').replace(/--/g, '-');
                    $el.setAttribute($key, $v);
                }
            } else if($attr != '' && $val != ''){
                $el.setAttribute($attr, $val);
            }
        }
    }

    // check attribue
    checkAttr($el, $attr = ''){
        return ($el.hasAttribute($attr)) ? true : false;
    }

    find($el){
        return (document.querySelectorAll($el)) ? document.querySelectorAll($el) : null;
    }
    
    // ajax request
    ajaxRequest($params){
        let $method = ($params.method) ? $params.method : 'GET';

        var $ajax =  NextExt.instance().httpRequest();
        $ajax.open($method, NextExt.instance().buildUrl($params), true);
        NextExt.instance().header($ajax, $params);
        
        if( $method == 'post' || $method == 'POST'){
            let $data = NextExt.instance().dataSend($params);
            $ajax.send($data);
        } else {
            $ajax.send();
        }
       return $ajax;
    }

    // get request
    getRequest( $action, $params ){
        var $ajax =  NextExt.instance().httpRequest();
        $params.action = ($params.action) ? $params.action : $action;
        $ajax.open("GET", NextExt.instance().buildUrl($params), true);
        NextExt.instance().header($ajax, $params);
        $ajax.send();
       return $ajax;
    }

    //post request
    postRequest($action, $params){
        var $ajax =  NextExt.instance().httpRequest();
        $action = ($params.action) ? $params.action : $action;
        $ajax.open("POST", $action , true);
        let $data = NextExt.instance().dataSend($params);
        $ajax.send($data);
       return $ajax;
    }

    // build url
    buildUrl($params){
        let $action = ($params.action) ? $params.action : '';
        let $method = ($params.method) ? $params.method : 'GET';

        if( $method == 'get' || $method == 'GET'){
            let $data = ($params.data) ? $params.data : '';
            if( Object.entries($data) ){ 
                let $add = new URLSearchParams($data);
                if( $action.split('?').length > 1 ){
                    return $action+'&'+$add;
                }
                return $action+'?'+$add;
            }
        }
        return $action;
    }
    // request http
    httpRequest(){
        return new XMLHttpRequest();
    }
    // add header
    header($ajax, $params ){
        let $header = ($params.header) ? $params.header : '';
        // set header
        if( Object.entries($header) ){ 
            for (const [$k, $v] of Object.entries($header)) {
                if( $k == ''){
                    continue;
                }
                $ajax.setRequestHeader($k, $v);
            }
        }
        return $ajax;
    }
    // add data in url
    dataSend($params){
        let $data = ($params.data) ? $params.data : '';
        const $dataLink = [];
        if( Object.entries($data) ){ 
            return new URLSearchParams($data);
        }
        return;
    }

    // instance of class
    static instance() {
        return new NextExt();
    }
}


// decelar class veriable
var nJs = {
    el: NextExt.createElement,
    parents: NextExt.instance().getParents,
    parent: NextExt.instance().getParent,
    getClass: NextExt.instance().getClass,
    addClass: NextExt.instance().addClass,
    removeClass: NextExt.instance().removeClass,
    toggleClass: NextExt.instance().toggleClass,
    getAttr: NextExt.instance().getAttr,
    setAttr: NextExt.instance().setAttr,
    checkAttr: NextExt.instance().checkAttr,
    append: NextExt.instance().appendEle,
    after: NextExt.instance().afterEle,
    before: NextExt.instance().beforeEle,
    addElement: NextExt.instance().addElement,
    find: NextExt.instance().find,
    ajax: NextExt.instance().ajaxRequest,
    get: NextExt.instance().getRequest,
    post: NextExt.instance().postRequest,
    json: NextExt.instance().getJson,
    jsonToStr: NextExt.instance().jsonToStr,
    strToJson: NextExt.instance().strToJson,
    
};

// function declar 

var $n = function( $el ){
    $el = new NextExt($el);
    if(!$el){
        return null;
    }
    return {

        find: function( $selector ){
            return $el[0].querySelectorAll($selector);
        },

        each: function(){
            return $el;
        },

        attr: function( $attr ){
            return ($el[0].hasAttribute($attr)) ? $el[0].getAttribute($attr) : null;
        },

        data: function( $attr ){
            return ($el[0].hasAttribute('njs-' + $attr)) ? $el[0].getAttribute('njs-' + $attr) : null;
        }

    };
}




// nJs Tab
var $nJsTab = {
    init: function( $selector ){
        let $tabs = document.querySelectorAll($selector);
        if( $tabs ){
            $tabs.forEach(function($v, $k){
                $v.setAttribute('njs-tab', 'njstab-'+ $k);

                // tab
                $v.querySelectorAll('.njs-tab').forEach(function( $target, $key){
                    $target.setAttribute('njs-tab-target', 'njstab-'+ $k);
                    $target.removeEventListener('click', $nJsTab.toggleTab);
                    $target.addEventListener('click', $nJsTab.toggleTab);
                });

                // panel
                $v.querySelectorAll('.njs-panel').forEach(function( $panel, $key){
                    $panel.setAttribute('njs-tab-panel', 'njstab-'+ $k);
                });
            });
        }
    },

    toggleTab: function( $e ){
        $e.preventDefault();
        let $this = this;
        let $targetTab = $this.getAttribute('njs-tab-target');
        let $target = $this.getAttribute('njs-target');

        let $el = document.querySelector('[njs-tab='+$targetTab+']');
        if($el){
            $nJsTab.actionRemove($el);

            $this.classList.add('njs-active');

            $el.querySelectorAll($target).forEach(function($v){
                $v.classList.add('njs-show');
            });
        }
        


    },

    actionRemove: function( $el ){
        if($el){
            $el.querySelectorAll('.njs-tab').forEach(function( $target){
                $target.classList.remove('njs-active');
            });

            // panel
            $el.querySelectorAll('.njs-panel').forEach(function( $panel){
                $panel.classList.remove('njs-show');
            });
        }
    }

};

// tab calling
//$nJsTab.init('#nx-tab-style');