(function () {
  let app = new Vue({
    el: '#app',
    data: {
      prizes: [],
      prizes_2017: [],
      prizes_2018: [],
      prize_name: '',
      prize_icon: '',
      prize_rotate: [],
      prize_transition: '',
      each_deg: 0,
      rotate_deg: 0,
      start_deg: 0,
      current_deg: 0,
      index: 0,
      current_year: 2017,
      duration: 3000,
      time_remaining: 20,
      num: 0,
      numbers: [],
      isToggle: false,
      isClicked: false,
      isShow: true,
      showPrize: false,
      prize_title: 'Chúc Mừng', 
      probabilityMap: {
        0: 10,
        1: 40, 
        2: 10,
        3: 10, 
        4: 40, 
        5: 10 
      }
    },
    mounted() {
      let vm = this;
      vm.initPrize();
    },
    watch: {
      current_year: {
        handler: 'restart',
      }
    },
    computed: {
      // 判斷轉盤 class
      containerClass() {
        let vm = this;
        return vm.current_year === 2017 ? 'container' : 'container container-large';
      },
      itemClass() {
        let vm = this;
        return vm.current_year === 2017 ? 'item item-skew' : 'item item-skew-large';
      },
      contentClass() {
        let vm = this;
        return vm.current_year === 2017 ? 'item-content' : 'item-content item-content-large';
      },
      countClass() {
        let vm = this;
        return vm.current_year === 2017 ? 'count' : 'count count-large';
      }
    },
    methods: {
      closeAlert() {
        console.log("Close button clicked"); // Debug
        this.isShow = false; // Ẩn alert
        this.isClicked = false; // Đặt lại trạng thái click
        this.showPrize = false; // Ẩn .prize
      },
      prizeActive() {
        // 抽到獎品後變更 item 的 css
        let vm = this;
        setTimeout(() => {
          vm.$refs.item[vm.index].classList.value = `${vm.itemClass} active`;
        }, vm.duration);
        console.log('item active');
      },
      setCurrentYear(year) {
        let vm = this;
        if (vm.isClicked) return;
        vm.current_year = year;
      },
      restart() {
        let vm = this;
        vm.$refs.item[vm.index].classList.value = vm.itemClass;
        if (vm.current_year === 2017) {
          vm.time_remaining = 20;
          vm.reset();
          vm.initPrize();
        } else if (vm.current_year === 2018) {
          vm.time_remaining = 120;
          vm.reset();
          vm.initPrize_2018();
        }
      },
      reset() {
        let vm = this;
        vm.isShow = true;
        vm.index = 0;
        vm.prize_name = '';
        vm.prize_icon = '';
        vm.prize_rotate = [];
        vm.numbers = [];
        vm.start_deg = 0;
        vm.rotate_deg = `rotate(0deg)`;
        vm.current_deg = 0;
        vm.isClicked = false;
        vm.prize_transition = `none`;
        vm.prize_title = 'Chúc Mừng'; // Reset prize_title
        console.log('RESET');
      },
      initPrize() {
        let vm = this;
        axios.get('./prize20.json')
          .then(function (response) {
            vm.prizes_2017 = JSON.parse(response.request.responseText);
            vm.num = vm.prizes_2017.length;
            vm.degree(vm.num);
            vm.prizes = vm.prizes_2017;
            vm.numberArray();
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      initPrize_2018() {
        let vm = this;
        vm.prizes_2018 = [];
        for (let i = 1; i <= 120; i++) {
          let item = {};
          if (i === 1) {
            item.name = 1;
            item.count = 1;
            vm.prizes_2018.push(item);
          } else if (i > 1 && i <= 16) {
            item.name = i;
            item.count = 1;
            vm.prizes_2018.push(item);
          } else if (i === 17) {
            item.name = i;
            item.count = 5;
            vm.prizes_2018.push(item);
          } else if (i === 18) {
            item.name = i;
            item.count = 10;
            vm.prizes_2018.push(item);
          } else if (i === 19) {
            item.name = i;
            item.count = 20;
            vm.prizes_2018.push(item);
          } else if (i === 20) {
            item.name = i;
            item.count = 69;
            vm.prizes_2018.push(item);
          }
        }
        vm.num = vm.prizes_2018.length;
        vm.prizes = vm.prizes_2018;
        vm.degree(vm.num);
        vm.numberArray();
      },
      degree(num) {
        // 計算每個轉盤角度
        let vm = this;
        for (let i = 1; i <= num; i++) {
          let deg = 360 / num;
          vm.each_deg = deg;
          let eachDeg;
          eachDeg = i * deg;
          vm.prize_rotate.push(eachDeg);
        }
      },
      numberArray() {
        // 產生獎品 index 編號 => [0,1,2,3,4,5]
        let vm = this;
        vm.numbers = vm.prizes.map((prize, index) => {
          return index;
        });
      },
      rotateHandler(num) {
        let vm = this;
        // 刪去沒有獎品的 index
        vm.prizes.filter((prize, index) => {
          let filterArray;
          if (prize.count <= 0) {
            let filterArray = vm.numbers.filter((num) => {
              return num !== index;
            });
            vm.numbers = filterArray;
          }
        });

        if (vm.time_remaining > 0) {
          vm.$refs.item[vm.index].classList.value = vm.itemClass;
          // 執行旋轉
          vm.prize_draw(num);
        } else if (vm.time_remaining <= 0) {
          vm.$refs.item[vm.index].classList.value = vm.itemClass;
          vm.restart();
        }
      },
      prize_draw(num) {
        // 執行抽獎
        let vm = this;
        if (vm.isClicked) return;
        vm.isShow = vm.isClicked;
        vm.isClicked = true;
        setTimeout(() => {
          prize.count--;
          vm.showPrize = true; // <-- Đặt showPrize ở đây
          console.log('3.旋轉角度:', vm.current_deg, '獎品:', prize.name, '剩餘數量:', prize.count, ' index', vm.index);
        }, vm.duration);
        vm.$refs.item[vm.index].classList.value = vm.itemClass;

        // Tạo danh sách trọng số dựa trên probabilityMap
        let weightedNumbers = [];
        vm.numbers.forEach(index => {
          let weight = vm.probabilityMap[index] || 1;  // Nếu ô không có trong danh sách, gán trọng số mặc định là 1
          for (let i = 0; i < weight; i++) {
            weightedNumbers.push(index);
          }
        });

        // Chọn ngẫu nhiên dựa trên trọng số
        vm.index = weightedNumbers[Math.floor(Math.random() * weightedNumbers.length)];
        console.log('1.剩餘牌號', vm.numbers);

        // 預先旋轉四圈
        let circle = 4;
        let degree;
        //degree=初始角度 + 旋轉4圈 + 獎品旋轉角度[隨機數] - 餘數
        degree = vm.start_deg + circle * 360 + vm.prize_rotate[vm.index] - vm.start_deg % 360;

        // 將初始角度 start_deg:0度 = 旋轉後的角度 degree，下次執行從當下角度開始
        vm.start_deg = degree;
        //綁定旋轉角度到指針
        vm.current_year === 2017 ? vm.rotate_deg = `rotate(${degree}deg)` : vm.rotate_deg = `rotate(${degree - vm.each_deg / 2}deg)`;

        vm.prize_transition = `all ${vm.duration / 1000}s cubic-bezier(0.42, 0, 0.2, 0.91)`;
        vm.time_remaining--;
        vm.isClicked = true;

        // 取當下開始角度的餘數，與輪盤角度比對(除錯用)
        let remainder = vm.start_deg % 360;
        if (remainder <= 0) {
          // 為了不產生負數或0，加360
          vm.current_year === 2017 ? vm.current_deg = remainder + 360 : vm.current_deg = remainder + 360 - vm.each_deg / 2;
        } else if (remainder > 0) {
          vm.current_year === 2017 ? vm.current_deg = remainder : vm.current_deg = remainder - vm.each_deg / 2;
        }
        console.log('2.執行旋轉', degree, 'index', vm.index);
        let prize = vm.prizes[vm.index];
        vm.prize_name = prize.name;
        vm.prize_icon = prize.icon;

        // Kiểm tra nếu là ô Hụt
        if (prize.name === "Hụt") {
          vm.prize_title = "Chúc bạn may mắn lần sau !";
          vm.prize_name = " ";
          vm.prize_title2 = "Đáng tiếc"
        } else {
          vm.prize_title = "Bạn đã nhận được";
          vm.prize_title2 = "Chúc mừng"
        }

        if (vm.current_year === 2018) {
          vm.prize_icon = "card_giftcard";
        }
        vm.prizeActive();
        setTimeout(() => {
          prize.count--;
          console.log('3.旋轉角度:', vm.current_deg, '獎品:', prize.name, '剩餘數量:', prize.count, ' index', vm.index);
        }, vm.duration);

        // 點選動畫結束後，將"已點選"改回"未點選"
        setTimeout(() => {
          if (vm.isClicked === true) {
            vm.isClicked = false;
          }
        }, vm.duration);
      }
    },
  });
})();