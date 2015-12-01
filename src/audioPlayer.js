/*
 * AudioPlayer
 * reference to Audio5js: https://github.com/zohararad/audio5js
 * withdout Flash suppourt, just Html audio for mobile
 * github: https://github.com/cirplan/audioPlayer
 */

;(function (win, id, factory) {
    "use strict";
    if (typeof (module) !== 'undefined' && module.exports) { // CommonJS
        module.exports = factory(id, win);
    } else if (typeof (define) === 'function' && define.amd ) { // AMD
        define(function () {
            return factory(id, win);
        });
    } else { // <script>
        win[id] = factory(id, win);
    }

})(window, 'AudioPlayer', function (id, window) {
    "use strict";

    var extend = function (origin, add) {
        if (!add || typeof add !== 'object') return origin;

        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
            origin[keys[i]] = add[keys[i]];
        }
        return origin;
    }

    function EventDispatch () {}

    EventDispatch.prototype = {
        constructor: EventDispatch,

        on: function (evt, fn, ctx) {
            this.subscribe(evt, fn, ctx, false);
        },

        one: function (evt, fn, ctx) {
            this.subscribe(evt, fn, ctx, true);
        },

        off: function (evt, fn) {
            if ( this._listeners === undefined ) return;

            var listerners = this._listeners,
                _fn;
            for( var i = 0, len = listerners[evt].length; i < len; i++ ) {
                _fn = listerners[evt][i].fn;
                if ( _fn === fn ) {
                    listerners[evt].splice(i, 1);
                    break;
                }
            }
        },

        subscribe: function (evt, fn, ctx, once) {
            if (this._listeners === undefined) {
                this._listeners = {};
            }

            this._listeners[evt] = this._listeners[evt] || [];
            this._listeners[evt].push({fn: fn, ctx: ctx, once: (once || false)});
        },

        trigger: function (evt) {
            if (this._listeners && this._listeners.hasOwnProperty(evt)) {
                var args = Array.prototype.slice.call(arguments, 1);
                var listerners = this._listeners,
                    _list = [],
                    _listerner;

                while (listerners[evt].length > 0) {
                    _listerner = listerners[evt].shift();
                    if (typeof _listerner.fn === 'function') {
                        _listerner.fn.apply(_listerner.ctx, args);
                    }

                    if ( !_listerner.once ) {
                        _list.push(_listerner);
                    }
                }
                listerners[evt] = _list;
            }
        }
    };

    var AudioPlayer = function (config) {
        this.audio 			= null;
        this.timeFormat     = 0; // 0 升序 / 1 降序
        this.list 			= null;
        this.index 			= 0;
        this.playing  		= false;
        this.vol      		= 1;
        this.duration 		= 0;
        this.position 		= 0;
        this.load_percent 	= 0;
        this.seekable 		= false;

        this.init(config);
    }

    AudioPlayer.prototype = {
        constructor: AudioPlayer,

        init: function (config) {
            this.audio = document.querySelector("#"+config.id);
            this.list  = config.list || [];
            this.timeFormat = config.timeFormat || 0;
            this.bindEvents();
        },

        setupEventListeners: function () {
            this.listeners = {
                loadstart 		: this.onLoadStart.bind(this),
                canplay 		: this.onCanplay.bind(this),
                loadedmetadata	: this.onLoadMetadata.bind(this),
                play 			: this.onPlay.bind(this),
                timeupdate 		: this.onTimeUpdate.bind(this),
                pause 			: this.onPause.bind(this),
                ended  			: this.onEnded.bind(this),
                error   		: this.onError.bind(this),
                seeking			: this.onSeeking.bind(this),
                seeked			: this.onSeeked.bind(this)
            };
        },

        bindEvents: function () {
            if ( this.listeners === undefined ) {
                this.setupEventListeners();
            }

            this.audio.addEventListener('loadstart', this.listeners.loadstart, false);
            this.audio.addEventListener('canplay', this.listeners.canplay, false);
            this.audio.addEventListener('loadedmetadata', this.listeners.loadedmetadata, false);
            this.audio.addEventListener('play', this.listeners.play, false);
            this.audio.addEventListener('timeupdate', this.listeners.timeupdate, false);
            this.audio.addEventListener('pause', this.listeners.pause, false);
            this.audio.addEventListener('ended', this.listeners.ended, false);
            this.audio.addEventListener('error', this.listeners.error, false);
            this.audio.addEventListener('seeking', this.listeners.seeking, false);
            this.audio.addEventListener('seeked', this.listeners.seeked, false);
        },

        unbindEvents: function () {
            this.audio.removeEventListener('loadstart', this.listeners.loadstart);
            this.audio.removeEventListener('canplay', this.listeners.canplay);
            this.audio.removeEventListener('loadedmetadata', this.listeners.loadedmetadata);
            this.audio.removeEventListener('play', this.listeners.play);
            this.audio.removeEventListener('timeupdate', this.listeners.timeupdate);
            this.audio.removeEventListener('pause', this.listeners.pause);
            this.audio.removeEventListener('ended', this.listeners.ended);
            this.audio.removeEventListener('error', this.listeners.error);
            this.audio.removeEventListener('seeking', this.listeners.seeking);
            this.audio.removeEventListener('seeked', this.listeners.seeked);
        },

        onLoadStart: function () {
            this.trigger('loadstart');
        },

        onCanplay: function () {
            this.seekable = this.audio.seekable && this.audio.seekable.length > 0;

            if ( this.seekable ) {
                this.timer = setInterval(this.onProgress.bind(this), 500);
            }

            var name = this.list[this.index].name || '',
                time = this.list[this.index].time || '';

            this.trigger('canplay', time, name, this.list[this.index]);
        },

        onLoadMetadata: function () {
            this.trigger('loadedmetadata');
        },

        onPlay: function () {
            this.playing = true;
            this.trigger('play');
        },

        onTimeUpdate: function () {
            if ( this.audio && this.playing ) {
                var formatTime, playedPercent;
                try {
                    this.position = this.audio.currentTime;
                    this.duration = this.audio.duration === Infinity ? null : this.audio.duration;

                    if ( this.timeFormat == 1 ) {
                        formatTime = formatSec(this.duration - this.position); // 降序
                    } else {
                        formatTime = formatSec(this.position); // 默认升序
                    }

                    playedPercent = ((this.position / this.duration) * 100).toFixed(6);

                } catch (e) {}

                this.trigger('timeupdate', formatTime, playedPercent, this.position, this.duration);
            }
        },

        onPause: function () {
            this.playing = false;
            this.trigger('pause');
        },

        onEnded: function () {
            this.playing = false;
            this.trigger('ended');
        },

        onError: function (e) {
            this.trigger('error', e);
        },

        onSeeking: function () {
            this.trigger('seeking');
        },

        onSeeked: function () {
            this.trigger('seeked');
        },

        onProgress: function () {
            if ( this.audio && this.audio.buffered !== null && this.audio.buffered.length ) {
                this.duration = this.audio.duration === Infinity ? null : this.audio.duration;
                this.load_percent = ((this.audio.buffered.end(this.audio.buffered.length - 1) / this.duration) * 100).toFixed(4);
                if (isNaN(this.load_percent)) {
                    this.load_percent = 0;
                }
                
                if ( this.load_percent >= 100 ) {
                    this.clearLoadProgress();
                }

                this.trigger('progress', this.load_percent);
            }
        },

        clearLoadProgress: function () {
            if ( this.timer !== undefined ) {
                clearInterval(this.timer);
                delete this.timer;
            }
        },

        reset: function () {
            this.clearLoadProgress();
            this.seekable = false;
            this.duration = 0;
            this.position = 0;
            this.load_percent = 0;
        },

        load: function (url) {
            this.reset();
            this.audio.setAttribute('src', url);
            this.audio.load();
            this.trigger('pause');
        },

        play: function () {
            if (!this.seekable) {
                this.timer = setInterval(this.onProgress.bind(this), 500);
            }
            this.audio.play();
        },

        pause: function () {
            this.audio.pause();
        },

        playPause: function () {
            this[this.playing ? 'pause' : 'play']();
        },

        volume: function (vol) {
            if ( vol && vol > 0 && vol < 1 ) {
                this.audio.volume = vol;
            } else {
                return this.audio.volume;
            }
        },

        progress: function (sec) {
            if (sec) {
                this.audio.pause();
                this.audio.currentTime = sec;
                this.audio.play();
            } else {
                return this.audio.currentTime;
            }
        },

        add: function (list) {
            var _t = this;
            if ( list instanceof Array ) {
                for( var i = 0; i < list.length; i++ ) {
                    _t.list.push(list[i]);
                }
            }
        },

        clearList: function () {
            this.list = [];
        },

        loadIndex: function (index) {
            if ( this.list[index] ) {
                this.load(this.list[index].url);
                this.index = index;
            }
        },

        loadPrev: function (flag) {
            var _index = this.index;
            _index--;
            if( _index >= 0 && this.list[_index] ) {
                this.load(this.list[_index].url);
                this.index = _index;
            }
        },

        loadNext: function (flag) {
            var _index = this.index;
            _index++;
            if( _index < this.list.length && this.list[_index] ) {
                this.load(this.list[_index].url);
                this.index = _index;
            }
        }
    }

    function formatSec (second) {
        var _min,
            _sec;

        _min = parseInt(second / 60);
        _sec = parseInt(second % 60);

        return (_min >= 10 ? _min : '0' + _min) + ':'
            + (_sec >= 10 ? _sec : '0' + _sec);
    }

    if ( '__proto__' in {} ) {
        AudioPlayer.prototype.__proto__ = EventDispatch.prototype;
    } else {
        extend(AudioPlayer.prototype, EventDispatch.prototype);
    }

    return AudioPlayer;

});