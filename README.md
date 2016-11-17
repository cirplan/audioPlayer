[![Build Status](https://travis-ci.org/cirplan/audioPlayer.svg?branch=master)](https://travis-ci.org/cirplan/audioPlayer)

# audioPlayer
针对移动端Html5 audio的播放组件，主要参考了Audio5js: https://github.com/zohararad/audio5js

[单音频例子](http://jeffdeng.me/audioPlayer/)

[多音频例子](http://jeffdeng.me/audioPlayer/index2.html)

[博文记录](http://jeffdeng.me/web/2015/11/30/html5-audio.html)

# 开始

```html
<script src="/js/audioPlayer.js"></script>
<script>
	var audioHandler = new AudioPlayer({
        id: 'music_player',
        list: [{
			name: 'Tobu,Itro - Sunburst',
			url: '/music/Tobu,Itro - Sunburst.mp3',
			time: '03:08'
		}]
    });

    audioHandler.loadIndex(0);

</script>
```

## API

audioPlayer 主要有下面的API:

### Methods 方法

* **load** - 根据url加载音频
* **play** - 播放
* **pause** - 暂停
* **playPause** - 自动播放/暂停
* **volume** - 设置音量 （0 - 1）
* **progress** - 设置进度
* **add** - 添加音频项到播放列表
* **clearList** - 清空播放列表
* **loadIndex** - 根据索引加载音频
* **loadPrev** - 加载上一首音频
* **loadNext** - 加载下一首音频

### Attributes 属性

* **audio** - audio 元素
* **timeFormat** - 已播放时间的格式化方式，0 升序/ 1 降序
* **list** - 播放列表
* **index** - 当前播放音频索引
* **playing** - 是否在播放
* **duration** - 当前播放音频的总秒数
* **position** - 当前播放音频的播放秒数
* **load_percent** - 当前音频的加载进度
* **seekable** - 是否可跳跃

## Events 事件

* **loadstart** - 当开始加载音频的时候触发
* **canplay** - 当可以播放时触发
* **loadedmetadata** - MP3 元数据已加载 (只对MP3文件有效)
* **play** - 当播放时触发
* **timeupdate** - 当播放事件更新时触发
* **pause** - 当暂停时触发
* **ended** - 当结束时触发
* **error** - 当音频播放/加载错误时触发
* **seeking** - 音频开始移动到一个新位置时
* **seeked** - 音频已经移动到一个新位置时

### Using Events 使用事件

用 `on` 方法去绑定事件, 用 `off` 去解绑事件. ex:

```html
<script src="/js/audioPlayer.js"></script>
<script>
    var list = [{
		name: 'Tobu,Itro - Sunburst',
		url: '/music/Tobu,Itro - Sunburst.mp3',
		time: '03:08'
	}];

	var audioHandler = new AudioPlayer({
        id: 'music_player'
    });

    audioHandler.add(list);
    audioHandler.loadIndex(0);

    audioHandler.on('canplay', function (totalTime, name, item) {
        ...
    });

    audioHandler.on('timeupdate', function (formatTime, playedPercent, position, duration) {
        ...
    });

    audioHandler.on('progress', function (percent) {
        ...
    });

</script>
```
### 具体例子

![](/images/audio1.gif)

具体的在example文件夹里面。

===============

# audioPlayer
Html5 audio player for mobile，reference to Audio5js: https://github.com/zohararad/audio5js

# start

```html
<script src="/js/audioPlayer.js"></script>
<script>
	var audioHandler = new AudioPlayer({
        id: 'music_player',
        list: [{
			name: 'Tobu,Itro - Sunburst',
			url: '/music/Tobu,Itro - Sunburst.mp3',
			time: '03:08'
		}]
    });

    audioHandler.loadIndex(0);

</script>
```

## API

audioPlayer exposes the following API:

### Methods

* **load** - load an audio file from URL
* **play** - play loaded audio
* **pause** - pause loaded audio
* **playPause** - toggle play/pause playback state
* **volume** - get / set volume (volume range is 0-1)
* **progress** - get / set currentTime
* **add** - add music list
* **clearList** - clear music list
* **loadIndex** - load the index of music list's url
* **loadPrev** - load prev music in music list
* **loadNext** - load next music in music list

### Attributes

* **audio** - the element of audio
* **timeFormat** - returns playing time ascending or descending，0 ascending/ 1 descending，0
* **list** - music play list
* **index** - now playing music index 
* **playing** - the audio is playing 
* **duration** - playing music duration
* **position** - playing music position
* **load_percent** - playing music load_percent
* **seekable** - audio is seekable

## Events

* **loadstart** - triggered when the audio start to download music
* **canplay** - triggered when the audio has been loaded can can be played
* **loadedmetadata** - MP3 meta-data has been loaded (works with MP3 files only)
* **play** - triggered when the audio begins playing
* **timeupdate** - triggered when the audio playhead position changes.
* **pause** - triggered when the audio pause
* **ended** - triggered when the audio ended
* **error** - triggered when the audio error
* **seeking** - audio is seeking to a new position (in seconds)
* **seeked** - audio has been seeked successfully to new position

### Using Events

use `on` to bind the event, use `off` to unbind the event. ex:

```html
<script src="/js/audioPlayer.js"></script>
<script>
    var list = [{
		name: 'Tobu,Itro - Sunburst',
		url: '/music/Tobu,Itro - Sunburst.mp3',
		time: '03:08'
	}];

	var audioHandler = new AudioPlayer({
        id: 'music_player'
    });

    audioHandler.add(list);
    audioHandler.loadIndex(0);

    audioHandler.on('canplay', function (totalTime, name, item) {
        ...
    });

    audioHandler.on('timeupdate', function (formatTime, playedPercent, position, duration) {
        ...
    });

    audioHandler.on('progress', function (percent) {
        ...
    });

</script>
```




