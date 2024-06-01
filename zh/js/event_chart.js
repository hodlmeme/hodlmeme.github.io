Highcharts.stockChart('container', {
    exporting: {
        enabled: false
    },
    chart: {
        inverted: true,
        zooming: {
            mouseWheel: {
                enabled: false
            }
        }
    },
    title: {
        // text: 'HODL大事件年表',
        // align: 'left'
    },
    subtitle: {
        // text: 'Source: <a href="https://en.wikipedia.org/wiki/Timeline_of_historic_inventions" >Wikipedia</a>',
        // align: 'left'
    },
    rangeSelector: {
        buttons: [
        // {
        //     type: 'year',
        //     count: 30,
        //     text: '30y'
        // }, {
        //     type: 'year',
        //     count: 100,
        //     text: '100y'
        // }
        ]
    },
    navigator: {
        opposite: true,
        xAxis: {
            reversed: false,
            tickPixelInterval: 50
        }
    },
    xAxis: {
        visible: false,
        ordinal: false,
        min: Date.UTC(2024, 4, 13),
        reversed: false
    },
    yAxis: {
        visible: false,
        min: 0,
        max: 2
    },
    time:{
      useUTC: false,
      timezone: 'Asia/Shanghai',
    },
    tooltip: {
        style: {
            width: '300px',
            fontSize: '10px'
        },
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat:
            //'日期: {point.x:%Y-%m-%d %H:%M:%S}<br>' +
            //'{#if point.custom.location}' +
            //    'Location: {point.custom.location}<br>{/if}' +
            '{#if point.custom.details}{point.custom.details}{/if}'
    },
    series: [{
        type: 'timeline',
        cursor: 'pointer',
        pointStart: Date.UTC(2024, 1, 1),
        pointIntervalUnit: 'day',
        marker: {
            enabled: true,
            radius: 4,
            symbol: 'circle'
        },
        data: eventsData,
        dataLabels: {
            format: '<b>{x:%Y-%m-%d}: {point.name}</b>',
            style: {
                fontSize: '12px'
            }
        },
        events:{
            click:function(event){
                if(event.point.custom.link != undefined) {
                    window.open(event.point.custom.link, '_blank');
                }
            }
        }
    }]
}, function (chart) {

    // Add mousewheel support:
    Highcharts.addEvent(
        chart.container,
        document.onmousewheel === undefined ? 'DOMMouseScroll' : 'mousewheel',
        function (event) {
            let range, delta, extr, step, newMin, newMax,
                prevent = true;
            const axis = chart.xAxis[0];
            const e = chart.pointer.normalize(event);
            // Firefox uses e.detail, WebKit and IE uses deltaY
            delta = e.detail || (e.deltaY / 120);
            delta = delta < 0 ?
                (axis.reversed ? -1 : 1) :
                (axis.reversed ? 1 : -1);

            if (chart.isInsidePlot(
                e.chartX - chart.plotLeft, e.chartY - chart.plotTop
            )) {
                extr = axis.getExtremes();
                range = (extr.max - extr.min);
                step = range * delta / 15;

                newMin = extr.min + step;
                newMax = extr.max + step;

                if (newMax > extr.dataMax) {
                    newMax = extr.dataMax;
                    newMin = newMax - range;
                    prevent = false;
                }
                if (newMin < extr.dataMin) {
                    newMin = extr.dataMin;
                    newMax = newMin + range;
                    prevent = false;
                }

                axis.setExtremes(newMin, newMax, true, false);

                if (prevent) {
                    if (e) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        }
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }
                        e.cancelBubble = true;
                    }
                }
            }
        }
    );
});