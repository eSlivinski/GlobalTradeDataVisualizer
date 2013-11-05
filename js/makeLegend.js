function makeLegend(){

    $('<h4 id="LegendTitle" align="center">'+stateClicked+':&nbsp;'+$("#datachooser :checked").attr("string")+'</h4>').appendTo("#legenddiv")
    $('<div id="LegendInfo></div>').appendTo("#legenddiv")
    if ((dataType=='imports')||(dataType=='exports')||(dataType=='tradeBalance')){
        $('<h5 align="center"><em>(In Billions of Dollars)</em></h5>').appendTo("#legenddiv")
    }
    
    
        //$('<h4><em>Direction of Change:</em></h4><table><th style="width: 70px"></th><th style="width: 70px"></th><tr><td class="third"><div style="background: '+colors[1]+'"><b>Negative<br>Change:</div></td><td class="third"><div style="background: '+colors[0]+'"><b>Positive<br>Change:</div></td></tr>').appendTo("#legenddiv")
    
    if ((dataType=='exportsChange')||(dataType=='importsChange')){
        niceBreaks = ["50%","100%","500%", "750%","1000%", "2000%","2000%"],
        niceBreaks.reverse();
        var cuts = [20,10,7.5,5,1,.5,.0005]
      } else {
        niceBreaks = ["$.1","$.25","$.5","$.75","$1","$2", "$2"]
        niceBreaks.reverse();
        var cuts= [2000000000,1000000000,750000000,500000000,250000000,100000000, 1]
      }

      var circlesign="Positive"
      for (xi=0;xi<2;xi++){
        
        var w=150,
            h= 130;
        var signs= ['< ','< ','< ','< ','< ','< ','> ',]
        var breaks= [96, 72, 48, 24,18, 12,6];    


        var dataset= niceBreaks

        var semicirclesvg = d3.select("#legenddiv")
            .append("svg")
            .attr("class", "semicirclesvg"+xi)
            .attr("width", w)
            .attr("height", h)

        if ((dataType=='exportsChange')||(dataType=='importsChange')||(dataType=='tradeBalance')){
            semicirclesvg.append("text")
                .attr({
                    x: w/4,
                    y: h-100-12,
                    "font-size": 14,
                    "text-anchor": "center",
                    fill: function(){ 
                        if (circlesign=="Positive"){
                            return "#0D4894"
                        }else{
                            return "#990915"
                        }
                    },
                })
                .text(function(){return circlesign})

            //$('<h5 align="center"><em>'+circlesign+'</em></h5>').appendTo("#legenddiv")
            //$('<h4><em>Direction of Change:</em></h4><table><th style="width: 70px"></th><th style="width: 70px"></th><tr><td class="third"><div style="background: '+colors[1]+'"><b>Negative<br>Change:</div></td><td class="third"><div style="background: '+colors[0]+'"><b>Positive<br>Change:</div></td></tr>').appendTo("#legenddiv")
        }


        for (k=0; k<7;k++){
            semicirclesvg.append("circle")
            .attr({
                class: "legcircle",
                id: function(){return(breaks[k])},
                cx: function(){
                    if(circlesign=="Positive")
                        {return 150}
                    else{return 0}
                },
                cy: function(){return (h-(breaks[k]/2))},
                r: function(){return(breaks[k]/2)},
                fill: function(){
                    if ((dataType=='exportsChange')||(dataType=='importsChange')||(dataType=='tradeBalance')){
                        if(circlesign=="Positive"){
                            return(colorBreaker(cuts[k]))
                        }else if (circlesign=="Negative"){
                            return (colorBreaker(-Math.abs(cuts[k])))
                        };
                    }else{
                        return(colorBreaker(cuts[k]))
                    };
                },
                stroke: "black",
                "stroke-width": "0.2"
                //"fill-opacity": 0.8
                })
            .attr("iterator", function(){return 6-k})

        };

        circlesign="Negative"
      }

      for (k=0; k<7; k++){
        // Appending Negative Labels (k%2=1,3,5)
        if(k%2){
            d3.select(".semicirclesvg0")
                .append("svg:line")
                .attr("class", "legline")
                .attr("x1", 50)
                .attr("y1", (h-breaks[6-k]))
                .attr("x2", 150)
                .attr("y2", (h-breaks[6-k]))
                .attr("iterator", function(){return k})
                .attr("style", "stroke: black; stroke-width: .5");


            d3.select(".semicirclesvg0").append("text")
                .attr("class", "d3leglabels")
                .text(signs[6-k]+dataset[6-k])
                .attr("x", 46)
                .attr("text-anchor", "end")
                .attr("iterator", function(){return k})
                .attr("y", ((h-breaks[6-k])+3));


        }else{
            d3.select(".semicirclesvg1")
                .append("svg:line")
                .attr("class", "legline")
                .attr("x1", 0)
                .attr("y1", (h-breaks[6-k]))
                .attr("x2", 100)
                .attr("y2", (h-breaks[6-k]))
                .attr("iterator", function(){return k})
                .attr("style", "stroke: black; stroke-width: .5");

            d3.select(".semicirclesvg1").append("text")
                .attr("class", "d3leglabels")
                .text(signs[k]+dataset[6-k])
                .attr("x", 104)
                .attr("text-anchor", "start")
                .attr("iterator", function(){return k})
                .attr("y", ((h-breaks[6-k])+3));
        }

    }

      //Creates mouse interaction 
    $('.legcircle').mouseenter(function(e){
        //console.log($('.leaflet-clickable[fill="'+$(this).attr("fill")+'"]'))

        $('.legcircle[fill="'+$(this).attr("fill")+'"]').attr("stroke","black")
            .attr("stroke-width", "3")
        $('.leaflet-clickable[fill="'+$(this).attr("fill")+'"]').attr("stroke-width","3")
        $('.legline[iterator="'+$(this).attr("iterator")+'"]').attr("style", "stroke: black; stroke-width: 2");
    })
    $('.leaflet-clickable').mouseenter(function(e){
        //console.log($('.leaflet-clickable[fill="'+$(this).attr("fill")+'"]'))

        // $(this).attr("stroke","black")
        //     .attr("stroke-width", "2")
        $('.legcircle[fill="'+$(this).attr("fill")+'"]').attr("stroke-width","3")
    })
    $('.legcircle').mouseleave(function(e){
        $('.legcircle[fill="'+$(this).attr("fill")+'"]').attr("stroke","black").attr("stroke-width", ".2")
        $('.leaflet-clickable[fill="'+$(this).attr("fill")+'"]').attr("stroke-width","0.2")
        $('.legline[iterator="'+$(this).attr("iterator")+'"]').attr("style", "stroke: black; stroke-width: .5");
    })
    $('.leaflet-clickable').mouseleave(function(e){
        // $(this).attr("stroke","black").attr("stroke-width", "1")
        $('.legcircle[fill="'+$(this).attr("fill")+'"]').attr("stroke-width","0.2")
    })
};
