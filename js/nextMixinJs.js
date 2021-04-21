"use strict";
/**
* Name: NextJs
* Desc: A Simple and Lightweight JavScript Framework.
* version: 1.0.0
* Package: @NextJs
* Author: ThemeDev
* Developer: Hazi
*/
class NextMixinJs{
    
    

    loadMixin( $selector = '', $settings = ''){
        let $el =  document.querySelectorAll($selector);
        if( !$el ){
            return;
        }

        $el.forEach(function($v, $k){
            $v.classList.add('njs-mixin-wrapper');
            $v.setAttribute('njs-mixin', 'nextmix-'+$k); 
            $v.setAttribute('njs-display', 'desktop'); 
            if( $settings != ''){
                $v.setAttribute('njs-settings', JSON.stringify($settings)); 
            }

            NextMixinJs.instance().getSettings($v);

            
            //get filter
            NextMixinJs.instance().getFilter($v);

            // content settings
            NextMixinJs.instance().getContents($v);

            
        });
        
        NextMixinJs.instance().responsiveMode();
    }

    responsiveMode(){

         // desktop mode
         var desktop = window.matchMedia("(min-width: 1025px)");
         NextMixinJs.instance().desktopMedia(desktop);
         desktop.addListener(NextMixinJs.instance().desktopMedia);

        // tablate mode
        var tablet = window.matchMedia("(max-width: 1024px) and (min-width: 768px)");
        NextMixinJs.instance().tablateMedia(tablet);
        tablet.addListener(NextMixinJs.instance().tablateMedia);

        // mobile 
        var mobile = window.matchMedia("(max-width: 767px)");
        NextMixinJs.instance().mobileMedia(mobile);
        mobile.addListener( NextMixinJs.instance().mobileMedia);

        // window resize
        window.addEventListener('resize', NextMixinJs.instance().resizeMedia);
    }

    resizeMedia( e ){
        var w = window.outerWidth;
        var h = window.outerHeight;

        document.querySelectorAll('.njs-mixin-wrapper').forEach(function($v){
            NextMixinJs.instance().getContents($v);
        });
    }
    desktopMedia( $x ){
        if($x.matches){
            document.querySelectorAll('.njs-mixin-wrapper[njs-settings]').forEach(function($v){
                $v.setAttribute('njs-display', 'desktop');
            });
        }
        document.querySelectorAll('.njs-mixin-wrapper').forEach(function($v){
            NextMixinJs.instance().getContents($v);
        });
    }
    tablateMedia( $x ){
        if($x.matches){
            document.querySelectorAll('.njs-mixin-wrapper[njs-settings]').forEach(function($v){
                $v.setAttribute('njs-display', 'tablate');
            });
        } else {
            document.querySelectorAll('.njs-mixin-wrapper[njs-settings]').forEach(function($v){
                $v.setAttribute('njs-display', 'desktop');
            });
        }

        document.querySelectorAll('.njs-mixin-wrapper').forEach(function($v){
            NextMixinJs.instance().getContents($v);
        });
    }

    mobileMedia( $x){
        if($x.matches){
            document.querySelectorAll('.njs-mixin-wrapper[njs-settings]').forEach(function($v){
                $v.setAttribute('njs-display', 'mobile');
            });
        } 
        document.querySelectorAll('.njs-mixin-wrapper').forEach(function($v){
            NextMixinJs.instance().getContents($v);
        });
    }

    getSettings( $el ){
        let $default = {
            type : 'grid', // grid, metro, masonry
            ratio: 1,
            columns: 3,
            columnsTablet: 2,
            columnsMobile: 1,
            gutter: 30,
            filter: '.njs-filter',
            filterItem: '.njs-filter-item',
            filterAction: 'click',
            itemContainer: '.njs-item-container',
            item: '.njs-item',
            itemHeight: '.njs-item-height',
        };

        let $settings = $el.getAttribute('njs-settings');
        if( !$settings ){
            $el.setAttribute('njs-settings', JSON.stringify($default));
            return $default;
        } 

        $settings = JSON.parse($settings);

        let $neSettings = {};
        $neSettings.type = ($settings.type) ? $settings.type : $default.type;
        $neSettings.ratio = ($settings.ratio) ? $settings.ratio : $default.ratio;
        $neSettings.columns = ($settings.columns) ? $settings.columns : $default.columns;
        $neSettings.columnsTablet = ($settings.columnsTablet) ? $settings.columnsTablet : $default.columnsTablet;
        $neSettings.columnsMobile = ($settings.columnsMobile) ? $settings.columnsMobile : $default.columnsMobile;
        $neSettings.gutter = ($settings.gutter) ? $settings.gutter : $default.gutter;
        $neSettings.filter = ($settings.filter) ? $settings.filter : $default.filter;
        $neSettings.filterItem = ($settings.filterItem) ? $settings.filterItem : $default.filterItem;
        $neSettings.itemContainer = ($settings.itemContainer) ? $settings.itemContainer : $default.itemContainer;
        $neSettings.item = ($settings.item) ? $settings.item : $default.item;

        return $neSettings;
    }

    getFilter( $el ){
        let $settings = NextMixinJs.instance().getSettings($el);
        var $filter = ($settings.filter) ? $settings.filter : '';
        var $filterItem = ($settings.filterItem) ? $settings.filterItem : '*';
        var $filterAction = ($settings.filterAction) ? $settings.filterAction : 'click';
        if( $filter !== ''){
            
            let $filEl = document.querySelectorAll($filter);
            if( $filEl ){
                let $elIndex = $el.getAttribute('njs-mixin');
                $filEl.forEach(function($v, $k){
                   
                   $v.setAttribute('njs-filter', $elIndex);

                   let $item = $v.querySelectorAll($filterItem);
                   if($item.length == 0){
                      $item = $v.querySelectorAll('*');
                   }

                   let $dataFilter = '*';

                   $item.forEach(function($v1){

                      $v1.removeEventListener($filterAction, NextMixinJs.instance().toggleFilter);
                      $v1.addEventListener($filterAction, NextMixinJs.instance().toggleFilter);
                      $v1.setAttribute('njs-filter-content', $elIndex);

                      if( $v1.classList.contains('njs-current') ){
                        if( $v1.getAttribute('njs-filter-action') ){
                            $dataFilter = $v1.getAttribute('njs-filter-action');
                        }
                        $el.setAttribute('njs-active', '-1');
                      }

                   });

                });
            }
        }
    }

    toggleFilter( e ){
        e.preventDefault();
        let $this = this;
        let $dataFilter = '*';
        if( $this.getAttribute('njs-filter-action') ){
            $dataFilter = $this.getAttribute('njs-filter-action');
        }
        
        let $target = $this.getAttribute('njs-filter-content');

        let $el = document.querySelector('[njs-mixin="'+$target+'"]');
        if($el){
            $el.setAttribute('njs-active', $dataFilter);

            NextMixinJs.instance().getContents($el);
        }
       return;
    }

    openFilter( $el, $target){
        let $settings = NextMixinJs.instance().getSettings($el);
        let $columns = ($settings.columns) ? $settings.columns : 3;
        let $gutter = ($settings.gutter) ? $settings.gutter : 0;
        let $itemConSelector = ($settings.itemContainer) ? $settings.itemContainer : '.njs-item-container';
        let $itemSelector = ($settings.item) ? $settings.item : '.njs-item';
        
        let $itemCon = $el.querySelector($itemConSelector);
        if( !$itemCon ){
            return;
        }
        var $totalHeight = 0;
        let $items = $itemCon.querySelectorAll($itemSelector);
        let $targetClass = $target.replace('.', '').replace('#', '');
        if($items){
            $items.forEach(function($v, $k){
                if($targetClass != '*'){
                   
                    if($v.classList.contains($targetClass) ){

                        /*let $clientItem = $v.getBoundingClientRect();
                        let $height = ($clientItem.height) ? $clientItem.height: 0;
                        let $width = ($clientItem.width) ? $clientItem.width: 0;
    
                        $totalHeight += Math.floor($height + $gutter);*/

                        $v.style.display = 'block';
                        console.log($target);
                    } else {
                        $v.style.display = 'none';
                    }
                    
                } else {
                    $v.style.display = 'block';
                }
            });
            
                        
        }
        
        if($totalHeight != 0 && $target != '*'){
            //$itemCon.style.height = ($totalHeight / $columns)  + 'px';
        }
    
        
    }

    getContents( $el ){
        let $settings = NextMixinJs.instance().getSettings($el);
       
        let $columns = ($settings.columns) ? $settings.columns : 3;
        let $type = ($settings.type) ? $settings.type : 'grid';
        let $ratio = ($settings.ratio) ? $settings.ratio : 1;
        let $gutter = ($settings.gutter) ? $settings.gutter : 0;
        

        let $client = $el.getBoundingClientRect();
        
        var $tWidth = $client.width;
        var $tHeight = $client.height;

        var $target1 = $el.getAttribute('njs-active');
        if( $target1 == -1){
            var $target = '*';
        } else {
            var $target = $target1;
        }
        let $targetClass = $target.replace('.', '').replace('#', '');
        
        var $responMode = $el.getAttribute('njs-display');
        if($responMode == "tablate"){
            $columns = ($settings.columnsTablet) ? $settings.columnsTablet : 2;
        }
        else if($responMode == "mobile"){
            $columns = ($settings.columnsMobile) ? $settings.columnsMobile : 1;
        }
        let $gutterCOl = Math.floor($gutter * ($columns - 1));
        let $itemWidth = Math.floor(($tWidth - $gutterCOl) / $columns);

        let $itemConSelector = ($settings.itemContainer) ? $settings.itemContainer : '.njs-item-container';
        let $itemSelector = ($settings.item) ? $settings.item : '.njs-item';
        let $itemHeightSelector = ($settings.itemHeight) ? $settings.itemHeight : '.njs-item-height';
        
        let $itemCon = $el.querySelector($itemConSelector);
        if( !$itemCon ){
            return;
        }
        $itemCon.style.position = 'relative';

        var $totalHeight = 0;
        let $heigthColumnCount = 0;
        let $items = $itemCon.querySelectorAll($itemSelector);

        if($target == '*'){
            var $targetList = $items;
        }else{
            var $targetList = $itemCon.querySelectorAll($itemSelector+$target);
        }
        
        if($items){
            let $top = 0;
            let $left = 0;
            let $itemLeft = 0;
            let $stepTop = 0;

            let $widthRatio = 1;
            let $heightRatio = $ratio;
           
            let $totalItemLe = Number($items.length);
            let $Itemheight = 'auto';
            let $start = 0;
            let $totalItem = 1;
            let $maxHeight = [];
            let $list = 0;
            let $hei = 0;
            let $heiIndex = 0;
            $items.forEach(function($v, $k){

                let $clientItem = $v.getBoundingClientRect();
                let $style = window.getComputedStyle($v);
                let leftTrans = $style.getPropertyValue('left');
                let topTrans = $style.getPropertyValue('top');

                let $height = Math.floor(($clientItem.height) ? $clientItem.height: 0);
                let $width = ($clientItem.width) ? $clientItem.width: 0;

                $widthRatio = Math.floor(($v.getAttribute('njs-width')) ? $v.getAttribute('njs-width') : 1);
                $heightRatio = Math.floor(($v.getAttribute('njs-height')) ? $v.getAttribute('njs-height') : $ratio);
               
                if( $widthRatio > $columns){
                    $widthRatio = $columns;
                }
               
                // set width
                var $itWidth = Math.floor( ($itemWidth * $widthRatio) + ($gutter * ($widthRatio - 1)) );
                
                // set height
                $Itemheight = Math.floor($itemWidth * $heightRatio)  + 'px';
                $top = Math.floor( ($itemWidth * $heightRatio) + $gutter);


                if($v.classList.contains($targetClass) || $targetClass == '*'){
                    $maxHeight.push($top);
                }

                let $heightItem = $v.querySelector($itemHeightSelector);
                if( !$heightItem ){
                    $heightItem = $v;
                }
                $heightItem.style.height = $Itemheight;
                
                $v.style.width =  $itWidth + 'px';
                $v.style.position = 'absolute';
                $v.setAttribute('njs-index-item', $totalItem);
                // set another style
                let $display = $style.getPropertyValue('display');

                if( $target1 != -1 ){
                    if($v.classList.contains($targetClass) || $targetClass == '*'){
                   
                        let leftTrans2 = $itemLeft + 'px';
                        let topTrans2 = $stepTop + 'px';
                       
                        if(leftTrans == leftTrans2 && $targetClass == '*'){
                            leftTrans = '0px';
                        } else{
                            leftTrans = Number(parseInt(leftTrans2) - parseInt(leftTrans)) + 'px';
                        }
                        
                        if(topTrans == topTrans2 && $targetClass == '*'){
                            topTrans = '0px';
                        } else{
                            topTrans = Number(parseInt(topTrans2) - parseInt(topTrans)) + 'px';
                        }
                        if($display == 'none'){
                            $v.style.opacity = 1;
                            $v.style.display = '';
                            $v.style.transform = 'translate3d('+leftTrans+', '+topTrans+', 0px)';
                        }else{
                            $v.style.transform = 'translate3d('+leftTrans+', '+topTrans+', 0px)';
                        }
                        $v.style.transitionProperty = 'opacity, transform';
                        $v.style.transitionDuration = '0.4s';
                        $v.style.transitionDelay = '0ms';
                    }else{
                        $v.style.opacity = 0;
                        $v.style.transform = 'scale(0.001)';
                        $v.style.transitionProperty = 'opacity, transform';
                        $v.style.transitionDuration = '0.4s';
                        $v.style.transitionDelay = '0ms';
                    }
                   
                }
               
                // end another style
                if( $target1 == -1){
                    $v.style.top = $stepTop + 'px';
                    $v.style.left = $itemLeft + 'px';
                }else{
                  clearTimeout($timeOut);
                  var $timeOut = setTimeout(function($v, $stepTop, $itemLeft) {
                        $v.style.top = $stepTop + 'px';
                        $v.style.left = $itemLeft + 'px';
                        if($v.classList.contains($targetClass) || $targetClass == '*'){
                            $v.style.transform = '';
                            $v.style.opacity = '';
                        } else {
                            $v.style.display = 'none';
                            $v.style.opacity = 0;
                            $v.style.transform = '';
                        }
                        $v.style.transitionProperty = '';
                        $v.style.transitionDuration = '';
                        $v.style.transitionDelay = '';
                    }, 500, $v, $stepTop, $itemLeft);
                }

               
                if($v.classList.contains($targetClass) || $targetClass == '*'){
                    $start += $widthRatio;
                    let $avg = Math.floor($start % $columns);

                    let $e = ($targetList[$list+1]) ? $targetList[$list+1] : '';

                    if($avg == 0){
                        $stepTop += NextMixinJs.instance().maxValue($maxHeight);
                        $itemLeft = 0;
                        $start = 0;
                        $maxHeight = [];
                    } else{
                        $itemLeft += $itWidth + $gutter;
                        if( $e ){
                            let $next = Math.floor(($e.getAttribute('njs-width')) ? $e.getAttribute('njs-width') : 1);
                            let $nextTotal = Number($start + $next);
                            //console.log($next + ' - ' +$totalItem);
                            if( $nextTotal > $columns){
                                $stepTop += NextMixinJs.instance().maxValue($maxHeight);
                                $itemLeft = 0;
                                $start = 0;
                                $maxHeight = [];
                            } 

                            /*if($type == 'masonry'){
                                if( $e ){
                                    let $nextH = Math.floor(($e.getAttribute('njs-height')) ? $e.getAttribute('njs-height') : 1);
                                    if( $hei == 0){
                                        $hei = $heightRatio;
                                    } else {
                                        $heiIndex += $nextH; 
                                    }
                                    if($hei > $heiIndex){

                                    }
                                } 
                            }*/
                        } else {
                            $stepTop += NextMixinJs.instance().maxValue($maxHeight);
                            $start = 0;
                            $maxHeight = [];
                        }

                        
                    }
                    
                    $totalHeight = Math.floor($stepTop);
                    $list++;
                }

                $totalItem++;
            });
        }
        
        $itemCon.style.height = '100%';
        $itemCon.style.minHeight = Math.floor($totalHeight - $gutter)  + 'px';
    }

    maxValue(arr) {
        var len = arr.length, max = -1;
        while (len--) {
          if (arr[len] > max) {
            max = arr[len];
          }
        }
        return max;
    };

    nextElementEl($v){
        let $e = ($v.nextElementSibling) ? $v.nextElementSibling : '';
        if( $e ){
            let $style = window.getComputedStyle($e);
            let $opacity = $style.getPropertyValue('opacity');
            
            if($opacity == '0'){
                return NextMixinJs.instance().nextElementEl($e);
            }
            return $e;
        }
        return $v;
    }
    // instance of class
    static instance() {
        return new NextMixinJs();
    }
}


var $nJsMix = {
    load: NextMixinJs.instance().loadMixin
};

// calling
//$nJsMix.load('.dl_addons_grid_wrapper');
