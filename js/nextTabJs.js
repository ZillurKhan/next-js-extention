"use strict";
/**
* Name: NextJs
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @NextJs
* Author: ThemeDev
* Developer: Hazi
*/
// nJs Tab
var $nJsTab = {

    init: function( $selector, $settings = ''){
        let $tabs = document.querySelectorAll($selector);
        if( $tabs ){
            $tabs.forEach(function($v, $k){
                $v.setAttribute('njs-tab', 'njstab-'+ $k);
                if( $settings != ''){
                    $v.setAttribute('njs-settings', JSON.stringify($settings)); 
                }

                
                // set Settings
                let $sett = $nJsTab.getSettings( $v );
                var $tabType = ($sett.type) ? $sett.type : 'css';
                // tab
                var $tabSelector = ($sett.tabSelector) ? $sett.tabSelector : '.njs-tab';
                $v.querySelectorAll($tabSelector).forEach(function( $target, $key){
                    $target.setAttribute('njs-tab-target', 'njstab-'+ $k);
                    $target.removeEventListener('click', $nJsTab.toggleTab);
                    $target.addEventListener('click', $nJsTab.toggleTab);

                    if( !$target.getAttribute('njs-target')){
                        $target.setAttribute('njs-target', '.njstab-content'+ $k + '-' +$key);
                    }
                });

                // panel
                var $panelSelector = ($sett.panelSelector) ? $sett.panelSelector : '.njs-panel';
                $v.querySelectorAll($panelSelector).forEach(function( $panel, $key){
                    $panel.setAttribute('njs-tab-panel', 'njstab-'+ $k);
                    $panel.classList.add('njstab-content'+ $k + '-'+$key);

                    if($tabType == 'css'){
                        if( !$panel.style.display ){
                            $panel.style.display = 'none';
                        }
                    }
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

            let $sett = $nJsTab.getSettings( $el );
            var $tabType = ($sett.type) ? $sett.type : 'css';

            var $tabActive = ($sett.tabActiveClass) ? $sett.tabActiveClass : 'njs-active';
            $this.classList.add($tabActive);

            var $panelActive = ($sett.panelActiveClass) ? $sett.panelActiveClass : 'njs-show';
            $el.querySelectorAll($target).forEach(function($v){
                
                if($tabType == 'css'){
                    $v.style.display = 'block';
                    $v.style.animationName = 'fadeIn';
                    $v.style.animationDuration = '1.25s';
                } else {
                    $v.classList.add($panelActive);
                }
            });
        }
        


    },

    actionRemove: function( $el ){
        if($el){
            let $sett = $nJsTab.getSettings( $el );
            var $tabType = ($sett.type) ? $sett.type : 'css';

            var $tabSelector = ($sett.tabSelector) ? $sett.tabSelector : '.njs-tab';
            var $tabActive = ($sett.tabActiveClass) ? $sett.tabActiveClass : 'njs-active';
            $el.querySelectorAll($tabSelector).forEach(function( $target){
                $target.classList.remove($tabActive);
            });

            // panel
            var $panelSelector = ($sett.panelSelector) ? $sett.panelSelector : '.njs-panel';
            var $panelActive = ($sett.panelActiveClass) ? $sett.panelActiveClass : 'njs-show';
            $el.querySelectorAll($panelSelector).forEach(function( $panel){
                if($tabType == 'css'){
                    $panel.style.display = 'none';
                    $panel.style.animationName = '';
                    $panel.style.animationDuration = '';
                }else{
                    $panel.classList.remove($panelActive);
                }
                
            });
        }
    },

    getSettings: function( $el ){
        let $default = {
            type: 'css', // css, class
            tabSelector : '.njs-tab',
            tabActiveClass : 'njs-active',
            panelSelector : '.njs-panel',
            panelActiveClass : 'njs-show',
        };

        let $settings = $el.getAttribute('njs-settings');
        if( !$settings ){
            $el.setAttribute('njs-settings', JSON.stringify($default));
            return $default;
        } 

        $settings = JSON.parse($settings);
        let $neSettings = {};
        $neSettings.type = ($settings.type) ? $settings.type : $default.type;
        $neSettings.tabSelector = ($settings.tabSelector) ? $settings.tabSelector : $default.tabSelector;
        $neSettings.tabActiveClass = ($settings.tabActiveClass) ? $settings.tabActive : $default.tabActiveClass;
        $neSettings.panelSelector = ($settings.panelSelector) ? $settings.panelSelector : $default.panelSelector;
        $neSettings.panelActiveClass = ($settings.panelActiveClass) ? $settings.panelActiveClass : $default.panelActiveClass;
       
        return $neSettings;
    }

};

// tab calling
//$nJsTab.init('#nx-tab-style');