"use strict";
/**
* Name: NextJs
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @NextJs
* Author: ThemeDev
* Developer: Hazi
*/

var $nJsAccrodion = {
    init: function(  $selector, $settings = '' ){
        let $tabs = document.querySelectorAll($selector);
        if( $tabs ){
            $tabs.forEach(function($v, $k){
                $v.setAttribute('njs-accrodion', 'njsaccrodion-'+ $k);
                if( $settings != ''){
                    $v.setAttribute('njs-settings', JSON.stringify($settings)); 
                }

                
                // set Settings
                let $sett = $nJsAccrodion.getSettings( $v );
                var $tabType = ($sett.type) ? $sett.type : 'css';
                // tab
                var $controlSelector = ($sett.controlSelector) ? $sett.controlSelector : '.njs-accrodion-control';
                $v.querySelectorAll($controlSelector).forEach(function( $target, $key){
                    $target.setAttribute('njs-accrodion-target', 'njsaccrodion-'+ $k + '__' + $key);
                    $target.removeEventListener('click', $nJsAccrodion.toggleTab);
                    $target.addEventListener('click', $nJsAccrodion.toggleTab);

                });

                // panel
                var $panelSelector = ($sett.panelSelector) ? $sett.panelSelector : '.njs-accrodion-panel';
                $v.querySelectorAll($panelSelector).forEach(function( $panel, $key){
                    $panel.setAttribute('njs-accrodion-panel', 'njsaccrodion-'+ $k + '__' + $key);
                    
                    if($tabType == 'css'){
                        if( !$panel.style.display ){
                            $panel.style.display = 'none';
                        }
                    }
                });
            });
        }
    },

    toggleTab: function($e){
        $e.preventDefault();
        let $this = this;
        let $targetTab = $this.getAttribute('njs-accrodion-target');
        let $sp = $targetTab.split('__');
        let $el = document.querySelector('[njs-accrodion='+$sp[0]+']');
        if($el){

            
            let $sett = $nJsAccrodion.getSettings( $el );
            var $tabType = ($sett.type) ? $sett.type : 'css';
            var $toggleType = ($sett.toggleType) ? $sett.toggleType : 'close';

            if( $toggleType == 'close'){
                $nJsAccrodion.actionRemove($el, $this);
            }
            
            var $tabActive = ($sett.controlActiveClass) ? $sett.controlActiveClass : 'njs-active';
            $this.classList.toggle($tabActive);

            var $panelActive = ($sett.panelActiveClass) ? $sett.panelActiveClass : 'njs-show';
            $el.querySelectorAll('[njs-accrodion-panel="'+$targetTab+'"]').forEach(function($v){
                
                if($tabType == 'css'){
                    $nJsAccrodion.toggleCss($v);
                } else {
                    $v.classList.toggle($panelActive);
                }
            });

        }

    },

    actionRemove: function( $el, $this){

        if($el){
            let $sett = $nJsAccrodion.getSettings( $el );
            var $tabType = ($sett.type) ? $sett.type : 'css';

            var $controlSelector = ($sett.controlSelector) ? $sett.controlSelector : '.njs-accrodion-control';
            var $tabActive = ($sett.controlActiveClass) ? $sett.controlActiveClass : 'njs-active';
            $el.querySelectorAll($controlSelector).forEach(function( $target){
                if( $target != $this){
                    $target.classList.remove($tabActive);
                }
               
            });

            let $targetTab = $this.getAttribute('njs-accrodion-target');
            // panel
            var $panelSelector = ($sett.panelSelector) ? $sett.panelSelector : '.njs-accrodion-panel';
            var $panelActive = ($sett.panelActiveClass) ? $sett.panelActiveClass : 'njs-show';
            $el.querySelectorAll($panelSelector).forEach(function( $panel){
                let $targetTabSelf = $panel.getAttribute('njs-accrodion-panel');

                if($tabType == 'css'){
                    if( $targetTab != $targetTabSelf){
                        $panel.style.overflow = 'hidden';
                        $panel.style.transition = '.3s ease-in-out 0s';
                        
                        var $clientItem = $panel.getBoundingClientRect();

                        $panel.style.height = $clientItem.height+'px';

                        clearTimeout($timeOut);
                        var $timeOut = setTimeout(function($v1){
                            $v1.style.height = '0px';
                        }, 300, $panel);

                        clearTimeout($timeOut1);
                        var $timeOut1 = setTimeout(function($v1){
                            $v1.style.overflow = '';
                            $v1.style.height = '';
                            $v1.style.display = 'none';
                            $v1.style.transition = '';
                        }, 700, $panel);
                    }
                }else{
                    if( $targetTab != $targetTabSelf){
                        $panel.classList.remove($panelActive);
                    }
                }
            });
        }
    },

    getSettings: function( $el ){
        let $default = {
            type: 'css', // css, class
            controlSelector : '.njs-accrodion-control',
            controlActiveClass : 'njs-active',
            panelSelector : '.njs-accrodion-panel',
            panelActiveClass : 'njs-show',
            toggleType: 'close' // close, open
        };

        let $settings = $el.getAttribute('njs-settings');
        if( !$settings ){
            $el.setAttribute('njs-settings', JSON.stringify($default));
            return $default;
        } 

        $settings = JSON.parse($settings);
        let $neSettings = {};
        $neSettings.type = ($settings.type) ? $settings.type : $default.type;
        $neSettings.controlSelector = ($settings.controlSelector) ? $settings.controlSelector : $default.controlSelector;
        $neSettings.controlActiveClass = ($settings.controlActiveClass) ? $settings.tabActive : $default.controlActiveClass;
        $neSettings.panelSelector = ($settings.panelSelector) ? $settings.panelSelector : $default.panelSelector;
        $neSettings.panelActiveClass = ($settings.panelActiveClass) ? $settings.panelActiveClass : $default.panelActiveClass;
        $neSettings.toggleType = ($settings.toggleType) ? $settings.toggleType : $default.toggleType;
       
        return $neSettings;
    },

    toggleCss: function( $v ){
        let $disPlay = $v.style.display;
        if($disPlay == 'none'){
            $v.style.display = 'block';
            $v.style.overflow = 'hidden';
            var $clientItem = $v.getBoundingClientRect();
            $v.style.height = '0px';
            $v.style.transition = '.3s ease-in-out 0s';

            clearTimeout($timeOut);
            var $timeOut = setTimeout(function($v1, $clientItem){
                $v1.style.height = $clientItem.height+'px';
            }, 300, $v, $clientItem);

            clearTimeout($timeOut1);
            var $timeOut1 = setTimeout(function($v1){
                $v1.style.overflow = '';
                $v1.style.height = '';
                $v1.style.transition = '';
            }, 700, $v);

        }else{
            $v.style.overflow = 'hidden';
            $v.style.transition = '.3s ease-in-out 0s';

            var $clientItem = $v.getBoundingClientRect();
            $v.style.height = $clientItem.height+'px';

            clearTimeout($timeOut);
            var $timeOut = setTimeout(function($v1){
                $v1.style.height = '0px';
            }, 300, $v);

            clearTimeout($timeOut1);
            var $timeOut1 = setTimeout(function($v1){
                $v1.style.overflow = '';
                $v1.style.height = '';
                $v1.style.display = 'none';
                $v1.style.transition = '';
            }, 700, $v);
        }
    }

};

// Accrodion calling
//$nJsAccrodion.init('.accrodion-wrapper');