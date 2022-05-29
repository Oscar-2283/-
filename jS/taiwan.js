let dataid = "F-C0032-001"
let apikey = "CWB-A387D4A9-FFF8-4252-98D0-EC612D81582F"

let url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/' + dataid + '?Authorization=' + apikey + '&format=JSON';

let cities = [
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'],
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣'], ['臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣'],
    ['臺南市', '高雄市', '屏東縣'], ['宜蘭縣', '花蓮縣', '臺東縣'], ['澎湖縣', '金門縣', '連江縣'],
];

let currentCities; //天氣卡需要顯示的那些城市
let region =document.querySelectorAll('.button button')
let orgData = {};

currentCities = cities[0]; //全部城市

fetch_data();


function fetch_data(){
    
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data) ; //
            organizationData(data);//處理資料組織
            arrange_cities(); //處理每個城市
        })
}

function organizationData(data){
    let locations = data.records.location;
    locations.forEach(location => {
        // console.log(location);
        let locationName = location.locationName;
        // console.log(locationName); //各縣市
        let  weather_time = location.weatherElement[0].time[0]; //取出時間
        let  weather_futuretime = location.weatherElement[0].time[1]; //取出時間
        let wx =weather_time.parameter.parameterName;//天氣狀況
        let wxfuture = weather_futuretime.parameter.parameterName;
        // console.log(wx)
        let wxNum =weather_time.parameter.parameterValue;//天氣type
        let wxNumFuture = weather_futuretime.parameter.parameterValue;
        // console.log(wxNum);        


        let startTime = weather_time.startTime;
        let startTimeFuture = weather_futuretime.startTime;
        let endTime =  weather_time.endTime;
        let endTimeFuture =  weather_futuretime.endTime;
        // console.log(startTime);
        // console.log(endTime);
        let maxT = location.weatherElement[4].time[0].parameter.parameterName;
        let maxTFuture = location.weatherElement[4].time[1].parameter.parameterName;
        let minT = location.weatherElement[2].time[0].parameter.parameterName;
        let minTFuture = location.weatherElement[2].time[1].parameter.parameterName;
        // console.log(maxT,minT);
        let pop = location.weatherElement[1].time[0].parameter.parameterName;//濕度百分比
        let popFuture = location.weatherElement[1].time[1].parameter.parameterName;//濕度百分比
        // console.log(pop);
        let CI = location.weatherElement[3].time[0].parameter.parameterName;//舒適度
        let CIFuture = location.weatherElement[3].time[1].parameter.parameterName;//舒適度
        // console.log(CI);

        orgData[locationName] = {
            'wx': wx,
            'startTime':startTime,
            'endTime':endTime,
            'maxT':maxT,
            'minT':minT,
            'pop':pop,
            'CI':CI,
            'wxfuture': wxfuture,
            'startTimeFuture':startTimeFuture,
            'endTimeFuture':endTimeFuture,
            'maxTFuture':maxTFuture,
            'minTFuture':minTFuture,
            'popFuture':popFuture,
            'CIFuture':CIFuture,
            'wxNum':wxNum,
            'wxNumFuture':wxNumFuture,


        }
    })
    console.log(orgData);
    // console.log(orgData.基隆市)
}

region.forEach(function(area,index){
    area.addEventListener('click',function(){
        console.log(area)
        console.log(index)
        // currentCities[index]
        // area.style.fontSize = '2rem';
        currentCities = cities[index];
        arrange_cities()
    })
});

// 使用原生 JavaScript 的寫法
// 先抓取台北市的 path 物件
const el_taipei_city = document.getElementById('1e48e0bb-8964-4121-b347-b900162cf771')
// 加上監聽器，打印出我們要的 data-* attribute 內容
current_place_obj = orgData.filter((obj)=>obj.tag === 'taipei_city')[0]

// 結果 -> taipei_city
const app = new Vue({
    el: '#app',
    mounted() {
        paths = document.querySelectorAll('path');
        let _this = this // 把這個 vm 本身存在 _this，以供後續函式內部使用
        paths.forEach(e => {
            e.onmouseover = function () {
                _this.filter = this.dataset.name
            }
        })
    },
    data: () => {
        return {
            filter: '',
            place_data: null,
        }
    },
    computed: {
        now_area() {
            let result = place_data.filter((obj) => obj.tag === this.filter)
            if (result.length == 0) {
                return null
            } else {
                return result[0]
            }
        }
    },
})

function arrange_cities(){
 let forcast = document.querySelector('.forcast');
 card_region.innerHTML = ''

 currentCities.forEach((city,index) => {



    let cityData = orgData[city];


    ////////////////////// 
        let weather_pic;
        let weather_pic2;
        
        let number1 = parseInt(cityData.wxNum);
        let number2 = parseInt(cityData.wxNumFuture);
        console.log (number1);
        console.log (typeof 1);
        switch(number1){
            
            case 1 :case 2 :case 3:
                weather_pic = "./img/weather/day.svg";
                break;
            ///多雲
            case 4: case 5: case 6:
                weather_pic ="./img/weather/cloudy-day-2.svg";
                break;
            case 7: //陰天
                weather_pic ="./img/weather/cloudy.svg";
                break;
            case 8: case 9: case 10 : case 11: case 12: case 13: case 14: //雨
                weather_pic ="./img/weather/rainy-5.svg";
                break;
            case 15 :case 16 :case 17 :case 18: //雷
                weather_pic ="./img/weather/thunder.svg";
                break;
            case 19 :case 20: //雷雨
                weather_pic ="./img/weather/thunder.svg";
                break;
            case 21 :case 22: //雷雨
                weather_pic ="./img/weather/thunder.svg";
                break;
            case 23: //雪雨
                weather_pic ="./img/weather/snowy-3.svg";
                break;
            case 24: //晴
                weather_pic ="./img/weather/day.svg";
                break;
            case 25 :case 26 :case 27 :case 28: //陰
                weather_pic ="./img/weather/cloudy.svg";
                break;
            case 29 :case 30: //雨
                weather_pic ="./img/weather/rainy-7.svg";
                break;
            default :
                weather_pic ="./img/weather/weather.svg";   
                break
        }
        switch(number2){
            
            case 1 :case 2 :case 3:
                weather_pic2 = "./img/weather/day.svg";
                break;
            ///多雲
            case 4: case 5: case 6:
                weather_pic2 ="./img/weather/cloudy-day-2.svg";
                break;
            case 7: //陰天
                weather_pic2 ="./img/weather/cloudy.svg";
                break;
            case 8: case 9: case 10 : case 11: case 12: case 13: case 14: //雨
                weather_pic2 ="./img/weather/rainy-5.svg";
                break;
            case 15 :case 16 :case 17 :case 18: //雷
                weather_pic2 ="./img/weather/thunder.svg";
                break;
            case 19 :case 20: //雷雨
                weather_pic2 ="./img/weather/thunder.svg";
                break;
            case 21 :case 22: //雷雨
                weather_pic2 ="./img/weather/thunder.svg";
                break;
            case 23: //雪雨
                weather_pic2 ="./img/weather/snowy-3.svg";
                break;
            case 24: //晴
                weather_pic2 ="./img/weather/day.svg";
                break;
            case 25 :case 26 :case 27 :case 28: //陰
                weather_pic2 ="./img/weather/cloudy.svg";
                break;
            case 29 :case 30: //雨
                weather_pic2 ="./img/weather/rainy-7.svg";
                break;
            default :
                weather_pic2 ="./img/weather/weather.svg";   
                break
        }
        console.log(weather_pic)
        console.log(weather_pic2)

     
     forcast.innerHTML += 
        
     `  
     <div class =flip>
     <div class="flip-card-inner">
         <div class="flip-card-front">
         <img src=${weather_pic} alt="">
         <h2>${city}</h2>
             <div class =show>
                 <div class = left>
                     <p>${cityData.wx}</p>
                     <p>${cityData.startTime.substr(6,10).replaceAll('-','/')}<p>至<p>${cityData.endTime.substr(6,10).replaceAll('-','/')}</p>
                 </div>
                 <div class = right>
                     <p>${cityData.maxT}~${cityData.minT} °C</p>
                     <p ><i class="fa-solid fa-umbrella"></i> ${cityData.pop}%</p>
                     <p>${cityData.CI}</p>
                 </div>
             </div>
         </div>



     
    `

 });

 
}


