;(function() {
'use strict';

var plugin = {
	component: 'iptv',
	icon: '<svg height="36" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="8" width="34" height="21" rx="3" stroke="currentColor" stroke-width="3"/><line x1="13.0925" y1="2.34874" x2="16.3487" y2="6.90754" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="1.5" y1="-1.5" x2="9.31665" y2="-1.5" transform="matrix(-0.757816 0.652468 0.652468 0.757816 26.197 2)" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="9.5" y1="34.5" x2="29.5" y2="34.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
	name: 'IPTV'
};

// ========== ПЕРЕМЕННЫЕ ==========
var lists = [];
var curListId = -1;
var catalog = {};
var listCfg = {};
var epgCache = {};
var timeOffset = 0;
var timeOffsetSet = false;
var UID = '';
var chNumber = '';
var chTimeout = null;
var stopRemoveChElement = false;
var layerInterval;
var epgInterval;
var isSNG = false;

// EPG данные для каналов
var epgData = {};
var epgPath = '';

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function unixtime() {
	return Math.floor((new Date().getTime() + timeOffset) / 1000);
}

function toLocaleTimeString(time) {
	var date = new Date();
	var ofst = parseInt(Lampa.Storage.get('time_offset', 'n0').replace('n', ''));
	time = time || date.getTime();
	date = new Date(time + (ofst * 1000 * 60 * 60));
	return ('0' + date.getHours()).substr(-2) + ':' + ('0' + date.getMinutes()).substr(-2);
}

function toLocaleDateString(time) {
	var date = new Date();
	var ofst = parseInt(Lampa.Storage.get('time_offset', 'n0').replace('n', ''));
	time = time || date.getTime();
	date = new Date(time + (ofst * 1000 * 60 * 60));
	return date.toLocaleDateString();
}

function strReplace(str, key2val) {
	for (var key in key2val) {
		str = str.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), key2val[key]);
	}
	return str;
}

function tf(t, format, u, tz) {
	format = format || '';
	tz = parseInt(tz || '0');
	var thisOffset = 0;
	thisOffset += tz * 60;
	if (!u) thisOffset += parseInt(Lampa.Storage.get('time_offset', 'n0').replace('n', '')) * 60 - new Date().getTimezoneOffset();
	var d = new Date((t + thisOffset) * 6e4);
	var r = {yyyy:d.getUTCFullYear(),MM:('0'+(d.getUTCMonth()+1)).substr(-2),dd:('0'+d.getUTCDate()).substr(-2),HH:('0'+d.getUTCHours()).substr(-2),mm:('0'+d.getUTCMinutes()).substr(-2),ss:('0'+d.getUTCSeconds()).substr(-2),UTF:t*6e4};
	return strReplace(format, r);
}

function prepareUrl(url, epg) {
	var m = [], val = '', r = {start:unixtime, offset:0};
	if (epg && epg.length) {
		r = {
			start: epg[0] * 60,
			utc: epg[0] * 60,
			end: (epg[0] + epg[1]) * 60,
			utcend: (epg[0] + epg[1]) * 60,
			offset: unixtime() - epg[0] * 60,
			duration: epg[1] * 60,
			now: unixtime,
			lutc: unixtime,
			d: function(m){return strReplace(m[6]||'',{M:epg[1],S:epg[1]*60,h:Math.floor(epg[1]/60),m:('0'+(epg[1] % 60)).substr(-2),s:'00'})},
			b: function(m){return tf(epg[0], m[6], m[4], m[5])},
			e: function(m){return tf(epg[0] + epg[1], m[6], m[4], m[5])},
			n: function(m){return tf(unixtime() / 60, m[6], m[4], m[5])}
		};
	}
	while (!!(m = url.match(/\${(\((([a-zA-Z\d]+?)(u)?)([+-]\d+)?\))?([^${}]+)}/))) {
		if (!!m[2] && typeof r[m[2]] === "function") val = r[m[2]](m);
		else if (!!m[3] && typeof r[m[3]] === "function") val = r[m[3]](m);
		else if (m[6] in r) val = typeof r[m[6]] === "function" ? r[m[6]]() : r[m[6]];
		else val = m[1];
		url = url.replace(m[0], encodeURIComponent(val));
	}
	return url;
}

function catchupUrl(url, type, source) {
	type = (type || '').toLowerCase();
	source = source || '';
	if (!type) {
		if (!!source) {
			if (source.search(/^https?:\/\//i) === 0) type = 'default';
			else if (source.search(/^[?&/][^/]/) === 0) type = 'append';
			else type = 'default';
		}
		else if (url.indexOf('${') < 0) type = 'shift';
		else type = 'default';
		console.log(plugin.name, 'Autodetect catchup-type "' + type + '"');
	}
	var newUrl = '';
	switch (type) {
		case 'append':
			if (source) {
				newUrl = (source.search(/^https?:\/\//i) === 0 ? '' : url) + source;
				break;
			}
		case 'timeshift':
		case 'shift':
			newUrl = (source || url);
			newUrl += (newUrl.indexOf('?') >= 0 ? '&' : '?') + 'utc=${start}&lutc=${timestamp}';
			return newUrl;
		case 'flussonic':
		case 'flussonic-hls':
		case 'flussonic-ts':
		case 'fs':
			return url.replace(/\/(video|mono)\.(m3u8|ts)/, '/$1-\${start}-\${duration}.$2').replace(/\/(index|playlist)\.(m3u8|ts)/, '/archive-\${start}-\${duration}.$2').replace(/\/mpegts/, '/timeshift_abs-\${start}.ts');
		case 'xc':
			newUrl = url.replace(/^(https?:\/\/[^/]+)(\/live)?(\/[^/]+\/[^/]+\/)([^/.]+)\.m3u8?$/, '$1/timeshift$3\${(d)M}/\${(b)yyyy-MM-dd:HH-mm}/$4.m3u8').replace(/^(https?:\/\/[^/]+)(\/live)?(\/[^/]+\/[^/]+\/)([^/.]+)(\.ts|)$/, '$1/timeshift$3\${(d)M}/\${(b)yyyy-MM-dd:HH-mm}/$4.ts');
			break;
		case 'default':
			newUrl = source || url;
			break;
		case 'disabled':
			return false;
		default:
			console.log(plugin.name, 'Err: no support catchup-type="' + type + '"');
			return false;
	}
	if (newUrl.indexOf('${') < 0) return catchupUrl(newUrl, 'shift');
	return newUrl;
}

function getEpgSessCache(epgId, t) {
	var key = ['epg', epgId, epgPath].join('\t');
	var epg = sessionStorage.getItem(key);
	if (epg) {
		epg = JSON.parse(epg);
		if (t && epg.length) {
			while (epg.length && t >= (epg[0][0] + epg[0][1])) epg.shift();
		}
	}
	return epg;
}

function setEpgSessCache(epgId, epg) {
	var key = ['epg', epgId, epgPath].join('\t');
	sessionStorage.setItem(key, JSON.stringify(epg));
}

function networkSilent(url, success, fail, param) {
	var network = new Lampa.Reguest();
	network.silent(url, success, fail, param);
}

function networkNative(url, success, fail, isJson, param) {
	var network = new Lampa.Reguest();
	network.native(url, success, fail, isJson, param);
}

// ========== EPG ФУНКЦИИ ==========
function epgUpdateData(epgId) {
	var lt = Math.floor(unixtime() / 60);
	var t = Math.floor(lt / 60), ed, ede;
	
	if (!!epgData[epgId] && t >= epgData[epgId][0] && t <= epgData[epgId][1]) {
		ed = epgData[epgId][2];
		if (!ed || !ed.length || ed.length >= 3) return;
		ede = ed[ed.length - 1];
		lt = (ede[0] + ede[1]);
		var t2 = Math.floor(lt / 60);
		if ((t2 - t) > 6 || t2 <= epgData[epgId][1]) return;
		t = t2;
	}
	
	if (!!epgData[epgId]) {
		ed = epgData[epgId][2];
		if (typeof ed !== 'object') return;
		if (ed.length) {
			ede = ed[ed.length - 1];
			lt = (ede[0] + ede[1]);
			var t3 = Math.max(t, Math.floor(lt / 60));
			if (t < t3 && ed.length >= 3) return;
			t = t3;
		}
		epgData[epgId][1] = t;
	} else {
		epgData[epgId] = [t, t, false];
	}
	
	var success = function(epg) {
		if (epgData[epgId][2] === false) epgData[epgId][2] = [];
		for (var i = 0; i < epg.length; i++) {
			var e = epg[i];
			e[0] = e[0].getTime ? e[0].getTime() / 1000 : e[0];
			e[1] = e[1].getTime ? e[1].getTime() / 1000 : e[1];
			if (lt < (e[0] + e[1])) {
				epgData[epgId][2].push.apply(epgData[epgId][2], epg.slice(i));
				break;
			}
		}
		setEpgSessCache(epgId, epgData[epgId][2]);
		epgRender(epgId);
	};
	
	var fail = function() {
		if (epgData[epgId][2] === false) epgData[epgId][2] = [];
		setEpgSessCache(epgId, epgData[epgId][2]);
		epgRender(epgId);
	};
	
	if (epgData[epgId][2] === false) {
		var epg = getEpgSessCache(epgId, lt);
		if (!!epg) return success(epg);
	}
	
	var epgUrl = listCfg['epgApiChUrl'];
	if (!epgUrl) return;
	
	networkSilent(
		Lampa.Utils.protocol() + 'epg.rootu.top/api' + epgPath + '/epg/' + epgId + '/hour/' + t,
		success,
		fail
	);
}

function epgRender(epgId) {
	var epg = (epgData[epgId] || [0, 0, []])[2];
	if (epg === false) return;
	
	var t = Math.floor(unixtime() / 60);
	while (epg.length && t >= (epg[0][0] + epg[0][1])) epg.shift();
	
	if (!epg.length && epg.length < 3) epgUpdateData(epgId);
}

// ========== ПЕРЕКЛЮЧЕНИЕ КАНАЛОВ ==========
var chPanel = $('<div class="player-info info--visible js-ch" style="top: 9em;right: auto;z-index: 1000;"><div class="player-info__body"><div class="player-info__line"><div class="player-info__name">&nbsp;</div></div></div></div>').hide().fadeOut(0);
var chHelper = $('<div class="player-info info--visible js-ch" style="top: 14em;right: auto;z-index: 1000;"><div class="player-info__body"><div class="tv-helper"></div></div></div>').hide().fadeOut(0);
var chHelpEl = chHelper.find('.tv-helper');
var chNumEl = chPanel.find('.player-info__name');

function isPluginPlaylist(playlist) {
	return !(!playlist.length || !playlist[0].tv || !playlist[0].plugin || playlist[0].plugin !== plugin.component);
}

function channelSwitch(dig, isChNum) {
	if (!Lampa.Player.opened()) return false;
	var playlist = Lampa.PlayerPlaylist.get();
	if (!isPluginPlaylist(playlist)) return false;
	if (!$('body>.js-ch').length) $('body').append(chPanel).append(chHelper);
	
	var cnt = playlist.length;
	var prevChNumber = chNumber;
	chNumber += dig;
	var number = parseInt(chNumber);
	
	if (number && number <= cnt) {
		if (!!chTimeout) clearTimeout(chTimeout);
		stopRemoveChElement = true;
		chNumEl.text(playlist[number - 1].title);
		
		if (isChNum || parseInt(chNumber + '0') > cnt) {
			chHelper.finish().hide().fadeOut(0);
		} else {
			var help = [];
			var chHelpMax = 9;
			var start = parseInt(chNumber + '0');
			for (var i = start; i <= cnt && i <= (start + Math.min(chHelpMax, 9)); i++) {
				help.push(playlist[i - 1].title);
			}
			chHelpEl.html(help.join('<br>'));
			chHelper.finish().show().fadeIn(0);
		}
		
		if (number < 10 || isChNum) {
			chPanel.finish().show().fadeIn(0);
		}
		stopRemoveChElement = false;
		
		var chSwitch = function() {
			var pos = number - 1;
			if (Lampa.PlayerPlaylist.position() !== pos) {
				Lampa.PlayerPlaylist.listener.send('select', {
					playlist: playlist,
					position: pos,
					item: playlist[pos]
				});
				Lampa.Player.runas && Lampa.Player.runas(Lampa.Storage.field('player_iptv'));
			}
			chPanel.delay(1000).fadeOut(500, function() { stopRemoveChElement || chPanel.remove(); });
			chHelper.delay(1000).fadeOut(500, function() { stopRemoveChElement || chHelper.remove(); });
			chNumber = "";
		};
		
		if (isChNum === true) {
			chTimeout = setTimeout(chSwitch, 1000);
			chNumber = "";
		} else if (parseInt(chNumber + '0') > cnt) {
			chSwitch();
		} else {
			chTimeout = setTimeout(chSwitch, 3000);
		}
	} else {
		chNumber = prevChNumber;
	}
	return true;
}

function keydown(e) {
	var code = e.code;
	if (Lampa.Activity.active().component === plugin.component && Lampa.Player.opened() && !$('body.selectbox--open').length) {
		var playlist = Lampa.PlayerPlaylist.get();
		if (!isPluginPlaylist(playlist)) return;
		var isStopEvent = false;
		var curCh = Lampa.PlayerPlaylist.position() + 1;
		
		if (code === 428 || code === 34 || ((code === 37 || code === 4) && !$('.player.tv .panel--visible .focus').length && !$('.player.tv .player-footer.open .focus').length)) {
			curCh = curCh === 1 ? playlist.length : curCh - 1;
			isStopEvent = channelSwitch(curCh, true);
		} else if (code === 427 || code === 33 || ((code === 39 || code === 5) && !$('.player.tv .panel--visible .focus').length && !$('.player.tv .player-footer.open .focus').length)) {
			curCh = curCh === playlist.length ? 1 : curCh + 1;
			isStopEvent = channelSwitch(curCh, true);
		} else if (code >= 48 && code <= 57) {
			isStopEvent = channelSwitch(code - 48);
		} else if (code >= 96 && code <= 105) {
			isStopEvent = channelSwitch(code - 96);
		}
		
		if (isStopEvent) {
			e.event.preventDefault();
			e.event.stopPropagation();
		}
	}
}

// ========== ПАРСИНГ M3U ==========
function parseM3u(content, callback) {
	try {
		var lines = content.split(/\r?\n/);
		var channels = [];
		var groups = {};
		var defGroup = 'Other';
		var chNum = 0;
		var i = 0;
		
		if (!lines[0].startsWith('#EXTM3U')) {
			callback(null, 'Not valid M3U');
			return;
		}
		
		var header = lines[0];
		var epgUrl = '';
		var match;
		if (match = header.match(/x-tvg-url="([^"]+)"/)) epgUrl = match[1];
		if (match = header.match(/url-tvg="([^"]+)"/)) epgUrl = match[1];
		
		for (i = 1; i < lines.length; i++) {
			var line = lines[i].trim();
			if (!line.length) continue;
			
			if (line.startsWith('#EXTGRP:')) {
				defGroup = line.substring(8).trim();
				continue;
			}
			
			if (line.startsWith('#EXTINF:')) {
				var ch = { group: defGroup };
				var nameMatch = line.match(/#EXTINF:[^,]+,(.+)$/);
				if (nameMatch) ch.name = nameMatch[1].trim();
				else ch.name = 'Channel ' + (chNum + 1);
				
				var tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
				if (tvgIdMatch) ch.tvgId = tvgIdMatch[1];
				
				var tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
				if (tvgLogoMatch) ch.logo = tvgLogoMatch[1];
				
				var groupMatch = line.match(/group-title="([^"]*)"/);
				if (groupMatch) ch.group = groupMatch[1];
				
				var catchupMatch = line.match(/catchup="([^"]*)"/);
				if (catchupMatch) ch.catchupType = catchupMatch[1];
				
				var catchupDaysMatch = line.match(/catchup-days="([^"]*)"/);
				if (catchupDaysMatch) ch.catchupDays = parseInt(catchupDaysMatch[1]);
				
				var tvgRecMatch = line.match(/tvg-rec="([^"]*)"/);
				if (tvgRecMatch && !ch.catchupDays) ch.catchupDays = parseInt(tvgRecMatch[1]);
				
				i++;
				while (i < lines.length && lines[i].startsWith('#')) {
					var optLine = lines[i].trim();
					if (optLine.startsWith('#EXTVLCOPT:')) {
						var optMatch = optLine.match(/#EXTVLCOPT:([^=]+)=(.+)$/);
						if (optMatch) {
							if (optMatch[1] === 'http-referrer') ch.referrer = optMatch[2];
							if (optMatch[1] === 'http-user-agent') ch.userAgent = optMatch[2];
						}
					}
					i++;
				}
				
				if (i < lines.length) {
					var urlLine = lines[i].trim();
					var url = urlLine.split('|')[0];
					if (url.startsWith('http://') || url.startsWith('https://')) {
						ch.url = url;
						channels.push(ch);
						chNum++;
						
						if (!groups[ch.group]) groups[ch.group] = [];
						groups[ch.group].push(ch);
					}
				}
				continue;
			}
		}
		
		var menu = [{ name: 'Все каналы', count: channels.length, key: '' }];
		for (var g in groups) {
			menu.push({ name: g, count: groups[g].length, key: g });
		}
		
		callback({ channels: channels, menu: menu, epgUrl: epgUrl });
	} catch(e) {
		console.log('Parse error:', e);
		callback(null, e.message);
	}
}

// ========== ЗАГРУЗКА ПЛЕЙЛИСТА ==========
function loadPlaylist(url, callback) {
	networkNative(url, function(content) {
		parseM3u(content, function(result, error) {
			if (result) callback(result);
			else callback(null, error);
		});
	}, function(err) {
		networkSilent(Lampa.Utils.protocol() + 'epg.rootu.top/cors.php?url=' + encodeURIComponent(url), function(content) {
			parseM3u(content, function(result, error) {
				if (result) callback(result);
				else callback(null, error);
			});
		}, function() {
			callback(null, 'Failed to load playlist');
		}, false, { dataType: 'text' });
	}, false, { dataType: 'text' });
}

// ========== ИНТЕРФЕЙС ==========
// Стили
Lampa.Template.add(plugin.component + '_style', '<style>' +
	'.iptv-list{padding:1.5em;display:flex;align-items:center;justify-content:center;flex-direction:column;padding-bottom:1em}' +
	'.iptv-list__ico{width:4.5em;margin-bottom:2em;height:4.5em}.iptv-list__ico>svg{width:4.5em;height:4.5em}' +
	'.iptv-list__title{font-size:1.9em;margin-bottom:1em}.iptv-list__items{width:80%;margin:0 auto}' +
	'.iptv-list__items .scroll{height:22em}@media screen and (max-width:767px){.iptv-list__items{width:100%}}' +
	'.iptv-playlist-item{padding:1em;background-color:rgba(255,255,255,0.1);line-height:1.3;margin:1em;border-radius:1em;position:relative}' +
	'.iptv-playlist-item__body{display:flex;align-items:center}.iptv-playlist-item__url{width:60%;padding-left:1em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:right}' +
	'.iptv-playlist-item__title{text-align:center;padding:1em;font-size:1.3em}' +
	'.iptv-playlist-item__name{display:flex;align-items:center;width:40%}' +
	'.iptv-playlist-item__name-ico{background-color:#fff;border-radius:.5em;padding:.3em .5em;color:#000;min-width:2.3em;text-align:center}' +
	'.iptv-playlist-item__name-ico>span{font-size:1.2em;font-weight:900}' +
	'.iptv-playlist-item__name-text{font-weight:600;padding-left:1em}' +
	'.iptv-playlist-item__footer{display:flex;margin-top:1em;justify-content:space-between}' +
	'.iptv-playlist-item__details{display:flex}.iptv-playlist-item__label{color:rgba(255,255,255,0.5)}' +
	'.iptv-playlist-item__label>span{color:#fff}.iptv-playlist-item__label+.iptv-playlist-item__label:before{content:"|";display:inline-block;margin:0 1em;font-size:.7em}' +
	'.iptv-playlist-item.focus::after{content:"";position:absolute;top:-0.5em;left:-0.5em;right:-0.5em;bottom:-0.5em;border:.3em solid #fff;border-radius:1.4em;z-index:-1;pointer-events:none}' +
	'.iptv-content{display:flex;padding:0 1.5em;line-height:1.3}.iptv-content>div{flex-shrink:0}' +
	'.iptv-content__menu{width:30%;padding-right:4em}.iptv-content__channels{width:25%}.iptv-content__details{width:45%;padding-left:4em}' +
	'.iptv-menu__head{display:flex;margin-bottom:2.4em;align-items:flex-start}' +
	'.iptv-menu__search{flex-shrink:0;padding:.5em;margin-top:.6em;margin-right:.6em}' +
	'.iptv-menu__search>svg{width:1.5em !important;height:1.5em !important}' +
	'.iptv-menu__search.focus{border-radius:100%;background-color:#fff;color:#000}' +
	'.iptv-menu__title{font-size:2.4em;font-weight:300;padding-right:1em;margin-right:auto}' +
	'.iptv-menu__list-item{font-size:1.4em;font-weight:300;padding:.5em .8em;display:flex;align-items:center;opacity:.6}' +
	'.iptv-menu__list-item-icon{margin-right:.5em;flex-shrink:0}.iptv-menu__list-item-icon>svg{width:1em !important;height:1em !important}' +
	'.iptv-menu__list-item>span{flex-shrink:0;padding-left:1em;margin-left:auto}' +
	'.iptv-menu__list-item.active{color:#fff;background-color:rgba(255,255,255,0.1);border-radius:.8em;opacity:1}' +
	'.iptv-menu__list-item.focus{color:#000;background-color:white;border-radius:.8em;opacity:1}' +
	'.iptv-menu__list>div+div{margin-top:.3em}.iptv-channels{padding:1em;padding-left:5em}' +
	'.iptv-channel{background-color:#464646;border-radius:1em;padding-bottom:72%;position:relative}' +
	'.iptv-channel__body{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:1em;text-align:center}' +
	'.iptv-channel__ico{width:80%;opacity:0;max-height:100%}' +
	'.iptv-channel__icons{position:absolute;top:.6em;right:.6em;display:flex}' +
	'.iptv-channel__icons>svg{width:1.2em !important;height:1.2em !important;margin-left:.5em}' +
	'.iptv-channel__name{text-align:center;font-size:1.2em;overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}' +
	'.iptv-channel__simb{font-size:4em;font-weight:900;line-height:.7;margin-bottom:.4em}' +
	'.iptv-channel__chn{position:absolute;top:50%;right:100%;margin-right:.5em;font-size:1.9em;font-weight:600;margin-top:-0.7em;opacity:.5}' +
	'.iptv-channel.loaded .iptv-channel__ico{opacity:1}.iptv-channel.small--icon .iptv-channel__ico{width:6em;border-radius:.7em}' +
	'.iptv-channel.focus::before,.iptv-channel.active::before{content:"";position:absolute;top:-0.5em;left:-0.5em;right:-0.5em;bottom:-0.5em;border:.3em solid #fff;border-radius:1.4em;opacity:.4}' +
	'.iptv-channel.focus::before{opacity:1}.iptv-channel+.iptv-channel{margin-top:1em}' +
	'.iptv-details{padding-top:3.5em;mask-image:linear-gradient(to bottom,white 0,white 92%,rgba(255,255,255,0) 100%)}' +
	'.iptv-details__play{font-size:1.3em;margin-bottom:.5em}.iptv-details__play .lb{background:rgba(255,255,255,0.3);border-radius:.2em;padding:0 .4em;margin-right:.7em}' +
	'.iptv-details__play span:last-child{opacity:.5}.iptv-details__title{font-size:3.3em;font-weight:700}' +
	'.iptv-details__program{padding-top:3em}.iptv-details__list>div+div{margin-top:1.6em}' +
	'.iptv-program-date{font-size:1.2em;padding-left:4.9em;margin-bottom:1em;opacity:.5}' +
	'.iptv-program{display:flex;font-size:1.2em;font-weight:300;position:relative}' +
	'.iptv-program__time{flex-shrink:0;width:5em;position:relative}' +
	'.iptv-program__title{overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical}' +
	'.iptv-program__body{flex-grow:1}.iptv-program__timeline{border-radius:1em;background:rgba(255,255,255,0.1);margin-top:.9em}' +
	'.iptv-program__timeline>div{height:.1em;border-radius:1em;background:#fff;min-height:2px}' +
	'.iptv-list-empty{border:.2em dashed rgba(255,255,255,0.5);display:flex;align-items:center;justify-content:center;height:12em;border-radius:1em}' +
	'</style>');
$('body').append(Lampa.Template.get(plugin.component + '_style', {}, true));

// Шаблоны
Lampa.Template.add(plugin.component + '_list', '<div class="iptv-list layer--wheight"><div class="iptv-list__ico"><svg height="36" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="8" width="34" height="21" rx="3" stroke="white" stroke-width="3"/><line x1="13.0925" y1="2.34874" x2="16.3487" y2="6.90754" stroke="white" stroke-width="3" stroke-linecap="round"/><line x1="1.5" y1="-1.5" x2="9.31665" y2="-1.5" transform="matrix(-0.757816 0.652468 0.652468 0.757816 26.197 2)" stroke="white" stroke-width="3" stroke-linecap="round"/><line x1="9.5" y1="34.5" x2="29.5" y2="34.5" stroke="white" stroke-width="3" stroke-linecap="round"/></svg></div><div class="iptv-list__title">Выберите плейлист</div><div class="iptv-list__items"></div></div>');
Lampa.Template.add(plugin.component + '_playlist_item', '<div class="iptv-playlist-item selector layer--visible layer--render"><div class="iptv-playlist-item__body"><div class="iptv-playlist-item__name"><div class="iptv-playlist-item__name-ico"><span></span></div><div class="iptv-playlist-item__name-text"></div></div><div class="iptv-playlist-item__url"></div></div></div>');
Lampa.Template.add(plugin.component + '_list_add', '<div class="iptv-playlist-item selector layer--visible"><div class="iptv-playlist-item__title">Добавить новый плейлист</div></div>');
Lampa.Template.add(plugin.component + '_list_empty', '<div class="iptv-list-empty selector"><div class="iptv-list-empty__text">Нет плейлистов</div></div>');
Lampa.Template.add(plugin.component + '_content', '<div class="iptv-content"><div class="iptv-content__menu"></div><div class="iptv-content__channels"></div><div class="iptv-content__details"></div></div>');
Lampa.Template.add(plugin.component + '_menu', '<div class="iptv-menu"><div class="iptv-menu__body"><div class="iptv-menu__head"><div class="iptv-menu__title"></div><div class="iptv-menu__search selector"><svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9.9964" cy="9.63489" r="8.43556" stroke="currentColor" stroke-width="2.4"></circle><path d="M20.7768 20.4334L18.2135 17.8701" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"></path></svg></div></div><div class="iptv-menu__list"></div></div></div>');
Lampa.Template.add(plugin.component + '_details', '<div class="iptv-details layer--wheight"><div class="iptv-details__play"></div><div class="iptv-details__title"></div><div class="iptv-details__program"></div></div>');
Lampa.Template.add(plugin.component + '_details_empty', '<div class="iptv-details-epmty endless endless-up"><div><span></span><span style="width: 60%"></span></div><div><span></span><span style="width: 70%"></span></div><div><span></span><span style="width: 40%"></span></div><div><span></span><span style="width: 55%"></span></div><div><span></span><span style="width: 30%"></span></div><div><span></span><span style="width: 55%"></span></div><div><span></span><span style="width: 30%"></span></div></div>');

// Класс для отображения каналов на главной
function ChannelOnMain(data, playlist) {
	this.data = data;
	this.playlist = playlist;
	this.build();
}

ChannelOnMain.prototype.build = function() {
	var self = this;
	this.card = $('<div class="iptv-channel iptv-channel--main selector layer--visible layer--render"><div class="iptv-channel__body"><img class="iptv-channel__ico"></div></div>');
	this.icon = this.card.find('.iptv-channel__ico');
	
	this.card.on('hover:enter', function() {
		Lampa.Player.runas(Lampa.Storage.field('player_iptv'));
		Lampa.Player.play({ title: self.data.name, url: self.data.url, tv: true, plugin: plugin.component });
		Lampa.Player.playlist(self.playlist.map(function(a) { return { title: a.name, url: a.url, tv: true, plugin: plugin.component }; }));
	});
	
	this.icon.on('load', function() { self.card.addClass('loaded'); });
	this.icon.on('error', function() {
		var name = self.data.name;
		var fl = name.length <= 3 ? name.toUpperCase() : name.replace(/[^a-zа-я0-9]/gi, '').toUpperCase()[0];
		var hex = (Lampa.Utils.hash(name) * 1).toString(16);
		while (hex.length < 6) hex += hex;
		hex = hex.substring(0, 6);
		var r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
		var hexText = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
		self.card.find('.iptv-channel__body').html('<div class="iptv-channel__simb">' + fl + '</div><div class="iptv-channel__name">' + name + '</div>');
		self.card.find('.iptv-channel__body').css({ 'background-color': '#' + hex, 'color': hexText });
		self.card.addClass('loaded');
	});
	
	if (this.data.logo) this.icon.attr('src', this.data.logo);
	else this.icon.trigger('error');
};

ChannelOnMain.prototype.render = function(js) { return this.card; };
ChannelOnMain.prototype.destroy = function() { this.card.remove(); };

// Манифест для отображения на главной
Lampa.Manifest.plugins = {
	type: 'video',
	version: '1.0.0',
	name: plugin.name,
	component: plugin.component,
	onMain: function(data) {
		var history = Lampa.Storage.get('iptv_play_history', '[]');
		try { history = JSON.parse(history); } catch(e) { history = []; }
		var playlist = history.reverse();
		return {
			results: playlist,
			title: 'Продолжить просмотр',
			nomore: true,
			line_type: plugin.component,
			cardClass: function(item) { return new ChannelOnMain(item, playlist); }
		};
	}
};

// Страница плагина
function pluginPage(object) {
	var html = $('<div></div>');
	var scroll = new Lampa.Scroll({ mask: true, over: true });
	var body = $('<div class="' + plugin.component + ' category-full"></div>');
	var info, last;
	
	// Сохраняем историю просмотров
	function addToHistory(channel) {
		var history = Lampa.Storage.get('iptv_play_history', '[]');
		try { history = JSON.parse(history); } catch(e) { history = []; }
		history = history.filter(function(a) { return a.url !== channel.url; });
		history.push(channel);
		if (history.length > 50) history.shift();
		Lampa.Storage.set('iptv_play_history', JSON.stringify(history));
	}
	
	var playlistData = null;
	
	this.create = function() {
		var self = this;
		this.activity.loader(true);
		
		// Загружаем плейлист из настроек
		var playlistUrl = Lampa.Storage.get('iptv_playlist_url', '');
		if (!playlistUrl) {
			// Запрашиваем URL плейлиста
			Lampa.Input.edit({ title: 'Введите URL плейлиста', free: true, nosave: true, value: '' }, function(url) {
				if (url) {
					Lampa.Storage.set('iptv_playlist_url', url);
					self.create();
				} else {
					var empty = new Lampa.Empty({ descr: 'Укажите URL плейлиста в настройках' });
					html.append(empty.render());
					self.activity.loader(false);
					self.activity.toggle();
				}
			});
			return this.render();
		}
		
		loadPlaylist(playlistUrl, function(result, error) {
			if (result) {
				playlistData = result;
				catalog = { '': { title: 'Все каналы', channels: result.channels } };
				var groups = {};
				result.channels.forEach(function(ch) {
					if (!groups[ch.group]) groups[ch.group] = [];
					groups[ch.group].push(ch);
				});
				for (var g in groups) {
					catalog[g] = { title: g, channels: groups[g] };
				}
				
				buildInterface();
			} else {
				var empty = new Lampa.Empty({ descr: 'Ошибка загрузки плейлиста: ' + (error || 'Неизвестная ошибка') });
				html.append(empty.render());
				self.activity.loader(false);
				self.activity.toggle();
			}
		});
		
		function buildInterface() {
			var menuHtml = Lampa.Template.get(plugin.component + '_menu');
			var contentHtml = Lampa.Template.get(plugin.component + '_content');
			html.append(contentHtml);
			html.find('.iptv-content__menu').append(menuHtml);
			
			var menuList = html.find('.iptv-menu__list');
			var menuTitle = html.find('.iptv-menu__title');
			menuTitle.text('Каналы');
			
			// Добавляем категории
			var firstItem = null;
			for (var key in catalog) {
				var cat = catalog[key];
				var menuItem = $('<div class="iptv-menu__list-item selector"><div class="iptv-menu__list-item-icon"><svg height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="1.5"/></svg></div><div>' + cat.title + '</div><span>' + cat.channels.length + '</span></div>');
				menuItem.on('hover:enter', function(key) {
					return function() {
						showChannels(key);
						menuList.find('.active').removeClass('active');
						menuItem.addClass('active');
					};
				}(key));
				menuList.append(menuItem);
				if (!firstItem) firstItem = menuItem;
			}
			
			// Область каналов
			var channelsContainer = html.find('.iptv-content__channels');
			var detailsContainer = html.find('.iptv-content__details');
			var detailsHtml = Lampa.Template.get(plugin.component + '_details');
			detailsContainer.append(detailsHtml);
			
			var currentChannels = [];
			var currentCards = [];
			
			function showChannels(groupKey) {
				channelsContainer.empty();
				var channels = catalog[groupKey].channels;
				currentChannels = channels;
				currentCards = [];
				
				var channelsScroll = new Lampa.Scroll({ mask: true, over: true, end_ratio: 2, horizontal: false });
				var channelsBody = $('<div class="iptv-channels"></div>');
				channelsScroll.append(channelsBody);
				channelsContainer.append(channelsScroll.render(true));
				
				channels.forEach(function(ch, idx) {
					var card = $('<div class="iptv-channel selector layer--visible layer--render"><div class="iptv-channel__body"><img class="iptv-channel__ico"></div><div class="iptv-channel__chn">' + (idx + 1) + '</div><div class="iptv-channel__icons"></div></div>');
					var img = card.find('.iptv-channel__ico');
					
					// Иконки избранного и блокировки
					var icons = card.find('.iptv-channel__icons');
					
					// Обработка логотипа
					img.on('load', function() { card.addClass('loaded'); });
					img.on('error', function() {
						var name = ch.name;
						var fl = name.length <= 3 ? name.toUpperCase() : name.replace(/[^a-zа-я0-9]/gi, '').toUpperCase()[0];
						card.find('.iptv-channel__body').append('<div class="iptv-channel__simb">' + fl + '</div><div class="iptv-channel__name">' + name + '</div>');
						card.addClass('loaded');
					});
					if (ch.logo) img.attr('src', ch.logo);
					else img.trigger('error');
					
					card.on('hover:focus', function() {
						showDetails(ch);
						channelsScroll.update(card, true);
					});
					
					card.on('hover:enter', function() {
						addToHistory(ch);
						var video = {
							title: ch.name,
							url: prepareUrl(ch.url),
							thumbnail: ch.logo,
							plugin: plugin.component,
							iptv: true,
							tv: true
						};
						var playlist = channels.map(function(c, i) {
							return {
								title: (i + 1) + '. ' + c.name,
								url: prepareUrl(c.url),
								thumbnail: c.logo,
								plugin: plugin.component,
								iptv: true,
								tv: true
							};
						});
						Lampa.Keypad.listener.destroy();
						Lampa.Keypad.listener.follow('keydown', keydown);
						Lampa.Player.runas(Lampa.Storage.field('player_iptv'));
						Lampa.Player.play(video);
						Lampa.Player.playlist(playlist);
					});
					
					channelsBody.append(card);
					currentCards.push(card);
				});
			}
			
			function showDetails(ch) {
				var detailsPlay = detailsContainer.find('.iptv-details__play');
				var detailsTitle = detailsContainer.find('.iptv-details__title');
				var detailsProgram = detailsContainer.find('.iptv-details__program');
				
				detailsPlay.empty();
				var groupSpan = $('<span></span>').text(ch.group || '');
				detailsPlay.append(groupSpan);
				detailsTitle.text(ch.name);
				
				detailsProgram.empty().append(Lampa.Template.get(plugin.component + '_details_empty'));
				
				// Загрузка EPG
				if (ch.tvgId) {
					var epgId = ch.tvgId;
					var epgUrl = listCfg['epgApiChUrl'];
					if (epgUrl) {
						networkSilent(epgUrl, function(epgChannels) {
							if (epgChannels && epgChannels.id2epg && epgChannels.id2epg[epgId]) {
								epgId = epgChannels.id2epg[epgId];
							}
							epgData[epgId] = [0, 0, false];
							epgUpdateData(epgId);
							
							var checkInterval = setInterval(function() {
								var epg = epgData[epgId][2];
								if (epg !== false && epg.length) {
									clearInterval(checkInterval);
									detailsProgram.empty();
									var t = Math.floor(unixtime() / 60);
									var nowProgram = null;
									var nextPrograms = [];
									
									for (var i = 0; i < epg.length; i++) {
										var e = epg[i];
										if (t >= e[0] && t < (e[0] + e[1])) {
											nowProgram = e;
										} else if (t < e[0] && nextPrograms.length < 5) {
											nextPrograms.push(e);
										}
									}
									
									if (nowProgram) {
										var nowDiv = $('<div class="iptv-program selector"><div class="iptv-program__time">' + toLocaleTimeString(nowProgram[0] * 60000) + '</div><div class="iptv-program__body"><div class="iptv-program__title">' + nowProgram[2] + '</div><div class="iptv-program__timeline"><div style="width: ' + Math.round((unixtime() - nowProgram[0] * 60) * 100 / (nowProgram[1] * 60)) + '%"></div></div></div></div>');
										detailsProgram.append(nowDiv);
									}
									
									if (nextPrograms.length) {
										var afterTitle = $('<div class="iptv-program-date">Далее</div>');
										detailsProgram.append(afterTitle);
										nextPrograms.forEach(function(e) {
											var progDiv = $('<div class="iptv-program selector"><div class="iptv-program__time">' + toLocaleTimeString(e[0] * 60000) + '</div><div class="iptv-program__body"><div class="iptv-program__title">' + e[2] + '</div></div></div>');
											detailsProgram.append(progDiv);
										});
									}
									
									if (!nowProgram && !nextPrograms.length) {
										detailsProgram.append($('<div>Нет программы</div>'));
									}
								}
							}, 500);
							
							setTimeout(function() { clearInterval(checkInterval); }, 10000);
						}, function() {});
					}
				}
			}
			
			if (firstItem) firstItem.trigger('hover:enter');
			
			self.activity.loader(false);
			self.activity.toggle();
		}
		
		return this.render();
	};
	
	this.start = function() {
		var self = this;
		Lampa.Controller.add('content', {
			toggle: function() { Lampa.Controller.collectionSet(html); Lampa.Controller.collectionFocus(last || false, html); },
			left: function() { if (Navigator.canmove('left')) Navigator.move('left'); else Lampa.Controller.toggle('menu'); },
			up: function() { if (Navigator.canmove('up')) Navigator.move('up'); else Lampa.Controller.toggle('head'); },
			down: function() { if (Navigator.canmove('down')) Navigator.move('down'); },
			back: function() { Lampa.Activity.backward(); }
		});
		Lampa.Controller.toggle('content');
	};
	
	this.render = function() { return html; };
	this.destroy = function() { html.remove(); scroll.destroy(); };
	
	if (epgInterval) clearInterval(epgInterval);
	epgInterval = setInterval(function() {
		for (var epgId in epgData) {
			epgRender(epgId);
		}
	}, 10000);
}

Lampa.Component.add(plugin.component, pluginPage);

// Добавление в меню
function addToMenu() {
	var menu = $('.menu .menu__list').eq(0);
	var button = $('<li class="menu__item selector"><div class="menu__ico">' + plugin.icon + '</div><div class="menu__text">IPTV</div></li>');
	button.on('hover:enter', function() {
		Lampa.Activity.push({ url: '', title: 'IPTV', component: plugin.component, page: 1 });
	});
	menu.append(button);
}

// Добавляем настройку для URL плейлиста
Lampa.SettingsApi.addComponent({
	component: plugin.component,
	icon: plugin.icon,
	name: 'IPTV'
});

Lampa.SettingsApi.addParam({
	component: plugin.component,
	param: { name: 'iptv_playlist_url', type: 'input', placeholder: 'https://example.com/playlist.m3u' },
	field: { name: 'URL плейлиста' }
});

// Синхронизация времени
(function() {
	var network = new Lampa.Reguest();
	var ts = new Date().getTime();
	network.silent(Lampa.Utils.protocol() + 'epg.rootu.top/api/time',
		function(serverTime) {
			var te = new Date().getTime();
			timeOffset = (serverTime < ts || serverTime > te) ? serverTime - te : 0;
			timeOffsetSet = true;
		},
		function() { timeOffsetSet = true; }
	);
})();

// Запуск
if (window.appready) addToMenu();
else Lampa.Listener.follow('app', function(e) { if (e.type === 'ready') addToMenu(); });

UID = Lampa.Storage.get('iptv_uid', '');
if (!UID) {
	UID = Lampa.Utils.uid(10).toUpperCase().replace(/(.{4})/g, '$1-');
	Lampa.Storage.set('iptv_uid', UID);
}

isSNG = ['uk', 'ru', 'be'].indexOf(Lampa.Storage.field('language')) >= 0;
window.plugin_iptv_ready = true;

})();
