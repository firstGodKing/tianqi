$(function() {

    // 图片基础路径
    var imgUrl = './img/';

    // 配置天气图标
    var weatherIcons = {
        yun: {
            title: '多云',
            icon: 'yun.png'
        },
        qing: {
            title: '晴',
            icon: 'qing.png'
        },
        lei: {
            title: '雷阵雨',
            icon: 'lei.png'
        },
        yu: {
            title: '小雨',
            icon: 'xiao.png'
        },
        yin: {
            title: '阴',
            icon: 'yin.png'
        },

        // 未知天气
        default: {
            title: '未知',
            icon: ''
        },
    }

    function getWeatherData(city) {

        // 获取天气数据

        var data = {
            appid: '78697123',
            appsecret: 'bjmWpYN5',
            version: 'v6'
        };

        if (city !== undefined) {
            data.city = city;
        }

        $.ajax({
            type: 'GET',
            url: 'https://www.tianqiapi.com/api',
            data: data,
            dataType: 'jsonp',
            success: function(data) {
                console.log(data)
                    // 获取定位位置
                $('.location-city').text(data.city);

                // 绑定实时天气数据
                var weatherData = ['date', 'week', 'tem', 'wea', 'air_level', 'win', 'win_speed', 'win_meter'];

                // 生成天气数据
                for (var i = 0; i < weatherData.length; i++) {
                    if (weatherData[i] === 'wea') {
                        $('.' + weatherData[i]).css({
                            backgroundImage: 'url(' + imgUrl + (weatherIcons[data.wea_img] == undefined ? weatherIcons.default : weatherIcons[data.wea_img]).icon + ')',
                        });
                    } else {
                        $('.' + weatherData[i]).text(weatherData[i] === 'tem' ? data[weatherData[i]] + '℃' : data[weatherData[i]]);
                    }
                }

                // 获取24小时天气和未来一周的天气
                var params = {
                    appid: '78697123',
                    appsecret: 'bjmWpYN5',
                    version: 'v9'
                };

                if (city !== undefined) {
                    params.city = city;
                }

                $.ajax({
                    type: 'GET',
                    url: 'https://www.tianqiapi.com/api',
                    data: params,
                    dataType: 'jsonp',
                    success: function(result) {

                        console.log(result)

                        // 绑定24小时天气数据
                        var hoursWeatherData = result.data[0].hours;

                        $.each(hoursWeatherData, function(i, v) {

                            var $li = $(`<li>
                                <div>${v.hours}</div>
                                <div class="hours-weather-icon" style="background-image: url('${imgUrl + (weatherIcons[v.wea_img] == undefined  ? weatherIcons.default : weatherIcons[v.wea_img]).icon}')"></div>
                                <div>${v.tem}℃</div>
                                <div>${v.win}</div>
                            </li>`);

                            $('#hoursWeather').append($li);
                        })

                        var futureWeatherData = result.data.slice(1);

                        $.each(futureWeatherData, function(i, v) {
                            var $li = $(`<li class="clearfix">
                            <span>${v.day.replace(/ (星期[一二三四五六日]) / , '')}</span>
                            <span>
                                <i class="future-weather-icon" style="background-image: url('${imgUrl + (weatherIcons[v.wea_img] == undefined ? weatherIcons.default : weatherIcons[v.wea_img]).icon}')"></i>
                            </span>
                            <span>${v.tem2 + '℃ ~' + v.tem1 + '℃'}</span>
                            <span>${v.win[1]}</span>
                            <span></span>
                            </li>`);

                            $('#futureWeather').append($li);
                        })
                    }

                })
            }
        })
    }

    getWeatherData();

    // 搜索
    $('.search-icon').on('click', function() {
        // 获取搜索城市
        var city = $('.search-ipt').val();

        if (city == undefined || city.trim() == "") {
            return;
        }

        // $('#futureWeather').html("");

        $('#hoursWeather, #futureWeather').empty();

        getWeatherData(city);
    })
})