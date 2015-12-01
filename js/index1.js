$(function () {

	var $loadingPercent  = $("#load_persent_bar"),
        $progressBar = $("#progress_bar"),
        $progressBarWrap = $("#progress_bar_wrap"),
        $barPoint = $("#bar_point"),
        $playTime = $("#play_time"),
        $totalTime = $("#total_time"),
        $playBtn = $("#play_btn");

    var isMoveState = false,
        canMove = false,
        totalTimeSec = 0,
        movePlaySec = 0,
        isUpdatePlayTime = false,
        loadPercent = null;

    var barWrapWidth = $progressBarWrap.width(),
        barWrapLeft = $progressBarWrap.offset().left;

    // 设置播放的音频
    // url  地址 必须
    // time 总时间 必须
    var list = [{
		name: 'Tobu,Itro - Sunburst',
		url: './music/Tobu,Itro - Sunburst.mp3',
		time: '03:08'
	}];

	var audioPlayerCtrl = {

        audioHandler : null,

        init : function () {
            var _t = this;
            _t.audioHandler = new AudioPlayer({
                id: 'music_player'
            });

            _t.audioHandler.add(list);

            _t.bindEvent();

            _t.audioHandler.loadIndex(0);
        },

        bindEvent: function () {
            var _t = this;

            // 开始加载 重置下UI
            _t.audioHandler.on('loadstart', function () {
                canMove = false;
                totalTimeSec = 0;
                $playTime.text('--:--');
                $totalTime.text('--:--');
                $progressBar.css('width', '0%');
                $loadingPercent.css('width', '0%');
            });

            // 可以播放状态
            // totalTime 总时间
            // name 音频的name
            // item 音频的所有信息
            _t.audioHandler.on('canplay', function (totalTime, name, item) {
                canMove = true;
                totalTimeSec = formatTimeToSec(totalTime);
                $playTime.text('00:00');
                $totalTime.text(totalTime);
            });

            // 更新时间
            // formatTime 格式化后的当前播放时间，ex: '00:12'，有升序和降序两种选择
            // playedPercent 已播放时间占总时间的百分比 0 - 100
            // position 已播放的秒数
            // duration 音频总秒数
            _t.audioHandler.on('timeupdate', function (formatTime, playedPercent, position, duration) {
                if( !isMoveState ) {
                    $playTime.text(formatTime);
                    $progressBar.css('width', playedPercent+'%');
                }
            });

            // 加载进度
            // percent 已加载进度 0 - 100
            _t.audioHandler.on('progress', function (percent) {
                if (percent > 100) {
                    percent = 100;
                }
                loadPercent = percent;
                $loadingPercent.css('width', percent+'%');
            });

            // 音频加载出错
            _t.audioHandler.on('error', function (e) {
                console.log('音频出错');
            });

            // 音频播放完毕
            _t.audioHandler.on('ended', function (e) {
               console.log('音频播放结束');
            });
        }
    };

    function bindEvent () {

    	// 播放按钮
        $playBtn.on('touchend click', function (e) {
            e.preventDefault();

            // canMove为false表示还没触发 canplay 事件
            if (!canMove) {
                Common.MS.alert('音频加载中...');
                return;
            }

            var state = $(this).attr('data-state');
            if( state == 'playing' ) {
                audioPlayerCtrl.audioHandler.pause();
                $(this).addClass('stop').attr('data-state', 'pause');
            } else {
            	// 针对预加载失败的hack
                if(loadPercent != null && Number(loadPercent) == 0) {
                    audioPlayerCtrl.audioHandler.pause();
                    audioPlayerCtrl.audioHandler.progress(1);
                }

                audioPlayerCtrl.audioHandler.play();

                $(this).removeClass('stop').attr('data-state', 'playing');
            }
        });

        // 拖动进度条播放
        $barPoint.on('touchmove', function (e) {
            e.preventDefault();
            if (!canMove) return;
            isMoveState = true;
            var left = e.changedTouches[0].clientX - barWrapLeft;
            var movePercent = ((left / barWrapWidth) * 100).toFixed(6);
            if ( left >= barWrapWidth ) {
                movePercent = 100;
            } else if (left <= 0) {
                movePercent = 0;
            }

            movePlaySec = totalTimeSec * movePercent / 100;
            $progressBar.css('width', movePercent+'%');
            $playTime.text(formatSec(movePlaySec));
        })
        .on('touchend', function () {
            if (!canMove) return;
            isMoveState = false;
            audioPlayerCtrl.audioHandler.pause();
            audioPlayerCtrl.audioHandler.progress(movePlaySec);
            audioPlayerCtrl.audioHandler.play();
            $playBtn.removeClass('stop').attr('data-state', 'playing');
        });

        // 点击进度条播放
        $progressBarWrap.on('touchend', function (e){
            e.preventDefault();
            if (!canMove) return;

            var left = e.changedTouches[0].clientX - barWrapLeft;
            var movePercent = ((left / barWrapWidth) * 100).toFixed(6);
            if ( left >= barWrapWidth ) {
                movePercent = 100;
            } else if (left <= 0) {
                movePercent = 0;
            }

            movePlaySec = parseInt(totalTimeSec * movePercent / 100, 10);

            $progressBar.css('width', movePercent+'%');
            $playTime.text(formatSec(movePlaySec));
            $playBtn.removeClass('stop').attr('data-state', 'playing');

            audioPlayerCtrl.audioHandler.pause();
            audioPlayerCtrl.audioHandler.progress(movePlaySec);
            audioPlayerCtrl.audioHandler.play();
        });
    }

    function formatTimeToSec (time) {
        var times = time.split(':');
        return Number(times[0]) * 60 + Number(times[1]);
    }

    function formatSec (second) {
        var _min,
            _sec;

        _min = parseInt(second / 60);
        _sec = parseInt(second % 60);

        return (_min >= 10 ? _min : '0' + _min) + ':'
            + (_sec >= 10 ? _sec : '0' + _sec);
    }

    function init () {
        audioPlayerCtrl.init();
        
        bindEvent();
    }

    init();


});