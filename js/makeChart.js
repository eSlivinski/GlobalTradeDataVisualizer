
function maketop5(){
  console.log('t5')
$("#top5Partners").empty()


$('<h4>Trends in '+stateClicked+'&nbsp;'+$("#datachooser :checked").attr("string")+' Data</h4><br>').appendTo("#top5Partners")

$('<div id= "t5">Top 5 Partners</div>').appendTo("#top5Partners")
for(i=1; i<6; i++){

    $('<p class offset1><strong>'+i+'. &nbsp;'+top5[i][1]+': </strong> '+formatter(top5[i][0])+'</li>').appendTo("#top5Partners")
  }

}
function makeChart(){
  var upperdomain;
  if ((dataType=='exportsChange')||(dataType=='importsChange')){
          upperdomain= 20
        }else{
          upperdomain= 2000000000
        }

        $("#chartcontent").empty()
        $('<h4>'+dataClicked.Country+'</h4>').appendTo("#chartcontent")

      ;

      var dataset = [parseInt(dataClicked[2008]), parseInt(dataClicked[2009]),parseInt(dataClicked[2010]),parseInt(dataClicked[2011]), parseInt(dataClicked[2012])];
      var years =[2008, 2009, 2010, 2011, 2012]

      var w=145,
        h= 100;

   
      console.log(upperdomain)
      var heightGetter=d3.scale.linear()
        .domain([0, upperdomain])
        .range([1,100])

      var colorGetter=d3.scale.threshold()
        .domain(niceBreaks)
        .range(colors)

      var mysvg = d3.select("#chartcontent")
        .append("svg")
        .attr("id", "mysvg")
        .attr("width", w)
        .attr("height", h);

      mysvg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("id", function(d,i){
          return (2008+i)
        })
        .attr("x", function(d,i){
          return i*23;
        })
        .attr("y", function(d){
          return (h-heightGetter(d));
        })
        .attr("width", 22)
        .attr("height", function(d){
          return (heightGetter(d))
        })
        .attr("fill", function(d){
          return(colorBreaker(d))
        })
        .on('click', function(e){

          $("#year").replaceWith("<p id='year'>"+this.id+"</p>")
          $( "#slider" ).slider({ value: this.id })
          changeYear()

          // $("this.id").appendTo("#year")
          // console.log("click",this.id)
        })

      mysvg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .attr("x", function(d,i){
          return i*23;
        })
        .attr("y", function(d){
          return (h-heightGetter(d));
        })
        .text(function(d,i){
          return (2008+i)
        })
        .attr("font-size","11px")



  }