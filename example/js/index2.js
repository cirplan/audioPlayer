$(function () {

	var list = [{
		name: 'Tobu,Itro - Sunburst',
		url: '../music/Tobu,Itro - Sunburst.mp3',
		time: '03:08'
	}, {
		name: 'Heroes',
		url: '../music/Heroes.mp3',
		time: '03:29'
	}, {
		name: 'Macy Gray - Let You Win',
		url: '../music/Macy Gray - Let You Win.mp3',
		time: '03:57'
	}];

	var audioPlayerCtrl = {
        audioHandler : null,
        playIndex : null,
        playIconDom : null,

        init : function () {
            var _t = this;
            _t.audioHandler = new AudioPlayer({
                id: 'music_player'
            });

            _t.audioHandler.add(list);

            _t.bindEvent();
        },

        bindEvent : function () {
            var _t = this;

            // 播放按钮
            $(document).on('tap', '.audio_icon', function (e) {
                e.preventDefault();
                var $index = $(this).attr('data-index'),
                    $state = $(this).attr('data-state'),
                    $id = $(this).attr('data-id');

                var _this = $(this);
                if ($state == '1') {
                    _t.audioHandler.pause();
                    _this.addClass('audio_icon_pause').attr('data-state', '0');
                } else {
                    if ($index == _t.playIndex) {
                        _t.audioHandler.play();
                        _this.removeClass('audio_icon_pause');
                    } else {
                        _t.playIndex = $index;
                        _t.playIconDom = _this;
                        _t.audioHandler.loadIndex($index);

                        $('.audio_icon').each(function (index, dom) {
                            if (index != $index) {
                                if ($(dom).hasClass('audio_icon_pause') || !$(dom).hasClass('audio_icon_play') ) {
                                    $(dom).removeClass('audio_icon_pause').addClass('audio_icon_play').attr('data-state', '0');
                                }
                                $(dom).find('.right_circle').css('-webkit-transform', 'rotate(180deg)');
                                $(dom).find('.left_circle').css('-webkit-transform', 'rotate(180deg)');
                            }
                        });

                    }
                    _this.removeClass('audio_icon_play').attr('data-state', '1');
                }

            });
			
			// 可以播放
            _t.audioHandler.on('canplay', function (totalTime, name) {
                _t.audioHandler.play();
            });

            // 更新播放时间
            _t.audioHandler.on('timeupdate', function (formatTime, playedPercent, position, duration) {
                if( _t.playIconDom ) {

                    var percent = Number(position / duration);
                    var dom, playDeg;

                    if (percent <= 0.5) {
                        dom = _t.playIconDom.find('.right_circle');
                    } else {
                        dom = _t.playIconDom.find('.left_circle');
                        percent -= 0.5;
                    }

                    playDeg = 360 * percent;
                    playDeg += 180;
                    playDeg = playDeg.toFixed(4);
                    dom.css('-webkit-transform', 'rotate('+ playDeg +'deg)');
                }
            });

            // 播放结束
            _t.audioHandler.on('ended', function () {
                _t.playIconDom.removeClass('audio_icon_pause').addClass('audio_icon_play').attr('data-state', '0');
                _t.playIconDom.find('.right_circle').css('-webkit-transform', 'rotate(180deg)');
                _t.playIconDom.find('.left_circle').css('-webkit-transform', 'rotate(180deg)');
            });

            // 音频出错
            _t.audioHandler.on('error', function (e) {
                console.log('音频出错，请重新进入');
            });
        }
    };

    function init () {
        audioPlayerCtrl.init();
    }

    init();
});