define(function(require, exports, module) {

    "use strict";

    var login = {
        viewSize:[],
        viewWidth: 0,
        viewHeight: 0,
        init: function() {
            this.airBalloon('div.air-balloon');
            this.submt();
        },
        rand: function(mi,ma) {
            var range = ma - mi;
            var out = mi + Math.round( Math.random() * range) ;
            return parseInt(out);
        },
        getViewSize: function() {
            var de = document.documentElement;
            var db = document.body;
            var viewW = de.clientWidth === 0 ?  db.clientWidth : de.clientWidth;
            var viewH = de.clientHeight === 0 ?  db.clientHeight : de.clientHeight;
            return new Array(viewW,viewH);
        },
        /*
        @function 热气球移动
        */
        airBalloon: function(balloon) {
            var that = this;
            that.resize();
            $(balloon).each(function(){
                $(this).css({top: that.rand(40, that.viewHeight * 0.5 ) , left : that.rand( 10 , that.viewWidth - $(this).width() ) });
                that.fly(this);
            });
            $(window).resize(function(){
                that.resize();
                $(balloon).each(function(){
                    $(this).stop().animate({top: that.rand(40, that.viewHeight * 0.5 ) , left : that.rand( 10 , that.viewWidth - $(this).width() ) } ,1000 , function(){
                        that.fly(this);
                    });
                });
            });
        },
        resize: function() {
            var that = this;
            that.viewSize = that.getViewSize();
            that.viewWidth = $(document).width() ;
            that.viewHeight = that.viewSize[1] ;
        },
        fly: function fly(obj) {
            var that = this;
            var $obj = $(obj);
            var currentTop = parseInt($obj.css('top'));
            var currentLeft = parseInt($obj.css('left') );
            var targetLeft = that.rand( 10 , that.viewWidth - $obj.width() );
            var targetTop = that.rand(40, that.viewHeight /2 );
            /*求两点之间的距离*/
            var removing = Math.sqrt( Math.pow( targetLeft - currentLeft , 2 )  + Math.pow( targetTop - currentTop , 2 ) );
            /*每秒移动24px ，计算所需要的时间，从而保持 气球的速度恒定*/
            var moveTime = removing / 24;
            $obj.animate({ top : targetTop , left : targetLeft} , moveTime * 1000 , function(){
                setTimeout(function(){
                    that.fly(obj);
                }, that.rand(1000, 3000) );
            });
        },
        submt: function() {
            $('#submit').click(function() {
                var api = snow.apiUrl + '/admin';
                $.ajax({
                    url: api,
                    type: 'post',
                    data: $('#form-user-login').serialize()
                })
                .done(function(res) {
                    if(res.success) {
                        location.href = snow.apiUrl + '/admin/list.do';
                    }
                });
            });
        },
        main: function() {
            this.init();
        }
    };

    login.main();
});