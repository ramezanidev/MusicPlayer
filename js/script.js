// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var $ = document;
var resize_container = $.querySelector('.resize_container');
var right_container = $.querySelector('.right_container');
var info_muicsName = $.querySelector('.info_muicsName');
var info_img = $.querySelector('.info_img').querySelector('img');
var left_container = $.querySelector('.left_container');
var info_Artist = $.querySelector('.info_Artist');
var info_time = $.querySelector('.info_time');
var progress_bar = $.querySelector('.progress_bar');
var volume_progress = $.querySelector('.volume_progress');
var repeat = $.querySelector('.repeat');
var pause_btn = $.querySelector('.pause_btn');
var next_btn = $.querySelector('.next_btn');
var previous_btn = $.querySelector('.previous_btn');
var list_item = $.getElementsByClassName('list_item');
var isplay_list = $.querySelector('.isplay_list')
var drop_affter_btn = $.querySelector('.drop_affter_btn')
var drop_before_btn = $.querySelector('.drop_before_btn')
var like_item = $.getElementsByClassName('like_item')
var music_list = $.getElementById('music_list');
var total_time = $.querySelector('.total_time');
var volume_btn = $.querySelector('.volume_btn');
var like_list_btn = $.querySelector('.like_list_btn');
var play_time = $.querySelector('.play_time');
var c_t_Artist = $.querySelector('.c_t_Artist');
var bg_cover_music = $.querySelector('.bg_cover_music');
var c_t_MusicName = $.querySelector('.c_t_MusicName');
var right_container = $.querySelector('.right_container');
var cover_music_img = $.querySelector('.cover_music_img');
var audioItem = $.getElementById('audioItem');
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var repeat_active = false;
var ispaly = false;
var volmute = false;
var volnow = 1;
var musicTimenow = 0;
var totalTimenow = 0;
var request, musicListArrey, Arr;
var liksArrey = [];
var playing = {
    muicsName: '',
    Artist: '',
    img: '',
    url: '',
    list_El: ''
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
!function sendRequest() {
    window.XMLHttpRequest ? request = new XMLHttpRequest() : request = new ActiveXObject('Microsoft.XMLHTTP');
    request.open('GET', 'js/list.json')
    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {
            musicListArrey = JSON.parse(request.responseText);
            if (musicListArrey) {
                addListItems();
            }
        }
    }
    request.send()
}()
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function addListItems() {
    musicListArrey.forEach((a) => {
        let el = createElList(a.muicsName, a.Artist, a.img, a.url)
        el.addEventListener('click', selectMusic = (e) => {
            e = e.currentTarget;
            playing.muicsName = e.childNodes[1].childNodes[0].innerHTML;
            playing.Artist = e.childNodes[1].childNodes[1].innerHTML;
            playing.img = e.childNodes[2].getAttribute('src');
            playing.url = e.getAttribute('data-url');
            playing.list_El = e;
            setValues();
            musicPaly();
        })
        music_list.appendChild(el)
    });
    for (let i = 0; i < like_item.length; i++) {
        const element = like_item[i];
        element.addEventListener('click', (event) => {
            event.currentTarget.childNodes[0].classList.toggle('fas');
            event.stopPropagation();
            if (event.currentTarget.childNodes[0].getAttribute('class') === 'far fa-heart fas') {
                e = event.currentTarget.parentNode;
                liksArrey[liksArrey.length] = {
                    muicsName: e.children[1].children[0].innerHTML,
                    Artist: e.children[1].children[1].innerHTML,
                    img: e.children[2].getAttribute('src'),
                    url: e.getAttribute('data-url'),
                }
            } else {
                for (let a = 0; a < liksArrey.length; a++) {
                    if (liksArrey[a].url === event.currentTarget.parentNode.getAttribute('data-url')) {
                        liksArrey.splice(a, 1)
                    }
                }
            }
            addlocalStorage()
        })
    };
    Arr = localStorage.liks;
    Arr = JSON.parse(Arr)
    Arr.forEach((a) => {
        liksArrey[liksArrey.length] = {
            muicsName: a.muicsName,
            Artist: a.Artist,
            img: a.img,
            url: a.url,
        };

        for (let i = 0; i < list_item.length; i++) {
            const element = list_item[i];
            element.querySelector('img').addEventListener('error', () => element.querySelector('img').setAttribute('src', 'img/default.jpg'))
            if (element.getAttribute('data-url') === a.url) {
                element.childNodes[0].childNodes[0].classList.toggle('fas')
            }
        }
    })
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ resize pages
resize_container.addEventListener('mousedown', (e) => {
    let startX = e.clientX;
    let startWidth = parseInt($.defaultView.getComputedStyle(left_container).width);
    $.documentElement.addEventListener('mouseup', () => $.documentElement.removeEventListener('mousemove', resizeMove));
    $.documentElement.addEventListener('mousemove', resizeMove = (e) => {
        left_container.style.width = (startWidth + e.clientX - startX) + 'px';
        right_container.style.width = 'calc(100% - ' + (startWidth + e.clientX - startX) + 'px - 5px)'
    });
});
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var resetLiItem = () => { for (let i = 0; i < list_item.length; i++) { list_item[i].classList.remove('isplay_list') } };
addlocalStorage = () => localStorage.setItem("liks", JSON.stringify(liksArrey))
repeat.addEventListener('click', () => { repeat.classList.toggle('repeat_active'); repeat_active = !repeat_active; console.log(repeat_active); });
volume_progress.addEventListener('mousedown', setProgress);
progress_bar.addEventListener('mousedown', setProgress);
pause_btn.addEventListener('click', () => ispaly ? musicPause() : musicPaly())
next_btn.addEventListener('click', changeMusic);
previous_btn.addEventListener('click', changeMusic);
audioItem.addEventListener("timeupdate", updateProgressBar);
audioItem.addEventListener('error', () => { playing.list_El.style.display = "none"; playing.list_El.nextElementSibling.click() })
info_img.addEventListener('error', () => { info_img.setAttribute('src', 'img/default.jpg') })
drop_affter_btn.addEventListener('click', () => { audioItem.currentTime = audioItem.currentTime + 10 })
drop_before_btn.addEventListener('click', () => { audioItem.currentTime = audioItem.currentTime - 10 })
audioItem.addEventListener("ended", () => { if (repeat_active) { audioItem.currentTime = 0; audioItem.play() } else { resetLiItem(); playing.list_El.nextElementSibling.click() } });
like_list_btn.addEventListener('click', () => {
    like_list_btn.childNodes[0].classList.toggle('fas');
    like_list_btn.classList.toggle('like_list_active');
    if (like_list_btn.getAttribute('class') === 'like_list_btn like_list_active') {
        music_list.innerHTML='';
        liksArrey.forEach((a)=>{
            let el = createElList(a.muicsName, a.Artist, a.img, a.url)
            el.addEventListener('click', selectMusic = (e) => {
                e = e.currentTarget;
                playing.muicsName = e.childNodes[1].childNodes[0].innerHTML;
                playing.Artist = e.childNodes[1].childNodes[1].innerHTML;
                playing.img = e.childNodes[2].getAttribute('src');
                playing.url = e.getAttribute('data-url');
                playing.list_El = e;
                setValues();
                musicPaly();
            })
            music_list.appendChild(el)
            for (let i = 0; i < list_item.length; i++) {
                const element = list_item[i];
                element.querySelector('img').addEventListener('error', () => element.querySelector('img').setAttribute('src', 'img/default.jpg'))
                if (element.getAttribute('data-url') === a.url) {
                    element.childNodes[0].childNodes[0].classList.toggle('fas')
                }
            }
        })
    } else {
        music_list.innerHTML='';
        liksArrey=[]
        addListItems()
    }
})
volume_btn.addEventListener('click', () => {
    volume_btn.children[0].classList.toggle('fa-volume-up');
    volume_btn.children[0].classList.toggle('fa-volume-mute');
    volmute = !volmute;
    if (volmute) {
        audioItem.volume = 0;
        volume_progress.style.height = 0;
        volume_progress.style.overflow = 'hidden';
    } else {
        audioItem.volume = volnow;
        volume_progress.style.height = '4px';
        volume_progress.style.overflow = 'revert';
    }
});
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function changeMusic(e) {
    var el = playing.list_El;
    try {
        if (e.currentTarget.id == 'next_btn') {
            resetLiItem();
            el.nextElementSibling.click();
        } else {
            resetLiItem();
            el.previousElementSibling.click()
        }
    } catch (err) {
        console.log(err.message);
        el.classList.toggle('isplay_list');
        audioItem.play()
        right_container.classList = 'right_container cover_music_play'
        ispaly = true
    }
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function updateProgressBar(e) {
    if (ispaly) {
        let currentTime = e.srcElement.currentTime;
        let duration = e.srcElement.duration;
        totalTimenow = duration;
        let durationMin = Math.floor(duration / 60);
        let durationSec = Math.floor(duration % 60);
        if (durationSec < 10) { durationSec = "0" + durationSec }
        if (durationSec) {
            total_time.innerHTML = durationMin + ":" + durationSec;
            info_time.innerHTML = durationMin + ":" + durationSec
        }
        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);
        if (currentSec < 10) { currentSec = "0" + currentSec }
        play_time.innerHTML = currentMin + ":" + currentSec;
        progress_bar.querySelector('span').style.width = (currentTime / duration) * 100 + '%';
        volume_progress.querySelector('span').style.width = e.srcElement.volume * 100 + '%';
    }
}
function setValues() {
    try {
        info_muicsName.innerText = playing.muicsName;
        c_t_MusicName.innerText = playing.muicsName;
        info_Artist.innerText = playing.Artist;
        c_t_Artist.innerText = playing.Artist;
        bg_cover_music.style.backgroundImage = 'url('+playing.img+')';
        info_img.setAttribute('src', playing.img)
        cover_music_img.setAttribute('src', playing.img)
        audioItem.setAttribute('src', playing.url);
        resetLiItem();
    } catch (err) {
        console.log(err.message);
    }
}
function setProgress(e) {
    var el = e.currentTarget;
    var el_span = e.currentTarget.querySelector('span');
    el_span.style.width = (e.offsetX / parseInt($.defaultView.getComputedStyle(e.currentTarget).width)) * 100 + '%';
    switch (el.id) {
        case 'volume_progress':
            volnow = parseInt(el_span.style.width) / 100;
            audioItem.volume = volnow
            break;
        case 'progress_bar':
            musicTimenow = (totalTimenow * parseInt(el_span.style.width)) / 100;
            audioItem.currentTime = musicTimenow;
    }
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function musicPaly() {
    if (playing.list_El) {
        audioItem.play();
        ispaly = true;
        playing.list_El.classList.toggle('isplay_list');
        pause_btn.children[0].classList = 'fas fa-pause'
    } else {
        list_item[0].click()
    }
    right_container.classList = 'right_container cover_music_play'
}
function musicPause() {
    audioItem.pause();
    ispaly = false;
    playing.list_El.classList.toggle('isplay_list');
    pause_btn.children[0].classList = 'fas fa-play'
    right_container.classList = 'right_container'
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function createElList(muicsName, Artist, img, url) {
    let li = document.createElement('li');
    li.className = "list_item";
    li.setAttribute('data-url', url)
    li.innerHTML = '<div class="like_item"><i class="far fa-heart"></i></div><div class="list_item_body"><p>' + muicsName + '</p><span>' + Artist + '</span></div><img src="' + img + '">';
    return li;
}


