const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');

const app = {
    currentIndex: 0,
    isPlaying: false,
    song:[
        {
            name: 'NOLOVENOLIFE',
            singer: 'Hieuthuhai',
            path: './music/NOLOVENOLIFE.mp3',
            image : './image/nolovenolife.png'
        },
        {
            name: 'ANH ĐÃ LÀM GÌ ĐÂU',
            singer: 'Hieuthuhai',
            path: './music/ANH ĐÃ LÀM GÌ ĐÂU.mp3',
            image : './image/khongthesay.png'
        },
        {
            name: 'KIM PHÚT KIM GIỜ',
            singer: 'Hieuthuhai',
            path: './music/KIM PHÚT KIM GIỜ.mp3',
            image : './image/kimphutkimgio.png'
        },
        {
            name: 'Không thể say',
            singer: 'Hieuthuhai',
            path: './music/Không Thể Say.mp3',
            image : './image/khongthesay.png'
        },
        {
            name: 'Exit Sign',
            singer: 'Hieuthuhai',
            path: './music/Exit Sign.mp3',
            image : './image/Hieuthuhai-01.png'
        }
    ],
    render: function(){
        const htmls = this.song.map((song) =>{
            return `
            <div class="song">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        })
        $('.playlist').innerHTML = htmls.join('');
    },
    denfinedProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.song[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const cdWidth = cd.offsetWidth;
        const _this = this;

        //Xử lý CD quay / dừng
        cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        //Xử lý phóng to / thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            //Nếu cdWidth > 0 thì gán vào cd.style.width, ngược lại gán 0
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //Xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        }

        //Khi bài hát được chạy
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        
        //Khi bài hát bị dừng
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //Xử lý khi tua bài hát
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        //Khi next bài hát
        nextBtn.onclick = function(){
            _this.nextSong();
            audio.play();
            
        }

        //Khi prev bài hát
        prevBtn.onclick = function(){
            _this.prevSong();
            audio.play();
        }
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.song.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.song.length - 1;
        }
        this.loadCurrentSong();
    },

    start: function(){
        //Định nghĩa các thuộc tính cho object
        this.denfinedProperties();

        //Lắng nghe xử lý các sự kiện(DOM events)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.render();
        
    }
}
app.start();