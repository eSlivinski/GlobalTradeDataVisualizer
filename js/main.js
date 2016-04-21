//Lizzi Slivinski, 2013


//Global Variables::
var centroidLayerGroup= new L.LayerGroup,
  greens=["#edf8e9","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],
  reds= ["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],
  dataClicked,
  stateSelected,
  chartExist=false,
  year,
  
  dataType,
  dataset=[],
  stateClicked,
  moused=0,
  max,
  min,
  top5=[],
  colors=[],
  TOMAP,
  niceBreaks=[],
  availableYears= [],
  legendExist=false;


//Object Definitions::
//Slider Definition
var controls = L.control({position: 'bottomright'});

  controls.onAdd = function (map) {
      var slider = L.DomUtil.create('div', 'hero-unit jui-slider');
      slider.id = 'sliderContainer';
      slider.innerHTML += '<h7 id="year"></h7>';

      var sliderControl = L.DomUtil.create('div', 'holder', slider);
      sliderControl.id = 'slider';

      L.DomEvent.addListener(sliderControl, 'mousedown', function(e) {
          L.DomEvent.stopPropagation(e);
      });

      return slider;
  };

  
//Legend Definition
var legend = L.control({position: 'bottomleft'});


  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'hero-unit');
        div.id='legenddiv';

      return div;



  };

//Chart Definition---!!Not being Called
var chart = L.control({position: 'topright'});

  chart.onAdd = function (map) {

    var holder= L.DomUtil.create('div', 'hero-unit')
      holder.id="chartHolder"


    var content= L.DomUtil.create('div','top5Partners',holder)
        content.id="top5Partners"

    var content= L.DomUtil.create('div','chartcontent',holder)
        content.id="chartcontent"
        content.innerHTML +="<h4 class='pull-right'><em>Click A Circle to View Trends in Trade Partnerships</em>"




    return holder;
  };

  chart.onRemove = function(){
    $("#chartHolder").remove()
  }

  chart.update= function(map){

    if($("#chartHolder").length){

      makeChart();
    }
    

    
  }

//Function Definitions


function drawCircles(){
  //Centroid Layer Definition
  centroidLayer = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
      var coords = new L.LatLng(latlng.lat, latlng.lng);
      return L.circleMarker(coords, {
        radius: 0,
        fillColor: "#E08214",
        color: "#000000",
        weight: 0.2,
        opacity: 1,
        fillOpacity: 0.8    
      });
    },
    onEachFeature: function(feature, layer) {
      layer.on("mouseover", function(e) {
        layer.setStyle({weight:2.2});
      });
      layer.on("mouseout", function() {
        layer.setStyle({weight:0.2});

      });
    }
  })


  // Load the centroid geometry via TopoJSON
  $.getJSON('./js/centroids.json', function (data) {
    var input_geojson = topojson.feature(data, data.objects.country_centroids);

    centroidLayer.addData(input_geojson)

  });

  //Returns the centroidLayer
  centroidLayer.addTo(centroidLayerGroup)
}

//Creates Color Scales
function colorBreaker(y){
//Recieves the Argument y, y=value to be scaled

  //By Value Scales(Color Attribute Stored in HTML)
  if((dataType=='exports')||(dataType=='imports')){
    return y===0 ? 0 :
      y<100000000 ? colors[0] :
      y<250000000 ? colors[1] :
      y<500000000 ? colors[2] :
      y<750000000 ? colors[3] :
      y<1000000000 ? colors[4] :
      y<2000000000 ? colors[5] :
      y>2000000000 ? colors[6] :
        colors[6];
    
  //Trade Balance Scale (Colors Are only slightly different, Allowing for $(Select fill:) and Coordinated
  //Visualization, Despite Looking like they belong to the same class)
  }else if (dataType=='tradeBalance'){
      //Negative Trade Balance Scale
      if (y<0){
       return(Math.abs(y)<100000000) ? "#990915":
       (Math.abs(y)<250000000) ? "#990814":
       (Math.abs(y)<500000000) ? "#990613":
       (Math.abs(y)<750000000) ? "#990511":
       (Math.abs(y)<1000000000) ? "#990310":
       (Math.abs(y)<2000000000) ? "#99020E":
        "#99000D";

      //Positive Trade Balance Scale
      }else{
        return (Math.abs(y)<100000000) ? "#0F4994":
        (Math.abs(y)<250000000) ? "#0D4894": 
        (Math.abs(y)<500000000) ? "#0D4894":
        (Math.abs(y)<750000000) ? "#0C4794":
        (Math.abs(y)<1000000000) ? "#0A4694":
        (Math.abs(y)<2000000000) ? "#094594":
          "#084594";
            
      }
  //Percent Change Scales--Also Return Fill Attr that are just slightly differnt, but
  //Break values correspond with %
  }else if ((dataType=='importsChange')|| (dataType=='exportsChange')){
    //Negative Percent Change Scale
    if (y<0){
      return(Math.abs(y)<.5) ? "#990915":
      (Math.abs(y)<1) ? "#990814":
      (Math.abs(y)<5) ? "#990613":
      (Math.abs(y)<7.5) ? "#990511":
      (Math.abs(y)<10) ? "#990310":
      (Math.abs(y)<20)? "#99020E":
        "#99000D";

    //Positive Percent Change Scale
    }else if (y>0){
      return (Math.abs(y)<.5) ? "#0F4994":
      (Math.abs(y)<1) ? "#0D4894": 
      (Math.abs(y)<5) ? "#0D4894":
      (Math.abs(y)<7.5) ? "#0C4794":
      (Math.abs(y)<10) ? "#0A4694":
      (Math.abs(y)<20) ? "#094594":
        "#084594";
    }
  }    
}

  //Creates Radius Scales
  function circlesize(y){
    //Recieves the Argument y, y=value to be scaled

    //Radius Scale Corresponding with ys measured in $
    if((dataType=='exports')||(dataType=='imports')||(dataType=='tradeBalance')){
      return y===0 ? 0 :
        y<100000000 ? 3 :
        y<250000000 ? 6 :
        y<500000000 ? 9 :
        y<750000000 ? 12 :
        y<1000000000 ? 24 :
        y<2000000000 ? 36 :
          48;
        
    //Radius Scale Corresponding with ys measured in %
    }else{
      return y===0 ? 0 :
        y<.5 ? 3 :
        y<1 ? 6 :
        y<5 ? 9 :
        y<7.5 ? 12 :
        y<10 ? 24 :
        y<20 ? 36 :
          48;
    }
  }

//Returns formated numbers for the legend and popups
function formatter(number){
  var comma=d3.format(",");

  roundPlaceValues=Number($("#datachooser :checked").attr('round'));
  //Utillity function Recieves a value as an argument and 
  function roundedValues(value, placeValues){
    return Math.round(value/placeValues)*placeValues
  }

  if (dataType=='exportsChange'){
    formatted = d3.round((number*100), 2)
    return formatted+'%'
  }else if (dataType=='importsChange'){
    formatted = d3.round((number*100), 2)
    return formatted+'%'
  }else{
    return '$'+comma(roundedValues(number, 1000))
  }
}



//Begining of Document Callback
$(document).ready(function($) {
  //Initiate Modal Dropdown
  $('#stateChooser').modal();
  
  //Appends Modal Dropdown with Selector Map SVG
  initSelectorMap();
  //Creates Leaflet Mapframe
  initMap();
  //Adds Circles to Leaflet Mapframe
  drawCircles();


    
    //Adds Bar Chart Frame to Map
    //CALL TURNED OFF
    chart.addTo(map);
    controls.addTo(map);


  //Once a State and Dataset Are Selected From the Modal>Loads Selected Data
  function loadData(state) {
    map.setZoom(3)
    availableYears=[]
    
    /*map.fitBounds([
      [-51.71322176551185, -102.57634952398688],
      [74.77048769398986, 172.7019259440558]
    ]);*/
    

    stateSelected=state

    dataType= $("#datachooser :checked").val();

    d3.csv("data/" + state + "_"+dataType+".csv", function(data) {
      dataset = data;
      for (each in dataset[0]) {
        availableYears.push(each);
      }
      availableYears.splice( availableYears.indexOf("Country"), 1);
      availableYears.splice( availableYears.indexOf("id"), 1);

      min = d3.min(availableYears);
      max = d3.max(availableYears);

      $('#slider').slider({
        value:parseInt(max),
        min: parseInt(min),
        max: parseInt(max),
        step: 1,
        slide: function(event, ui) {
          $("#year").html(ui.value);
          current = ui.value;
          changeYear(current);
        }
      });

      d3.select("#year").html(max);
      setupMap();
    });
  }



  // Now style the map using the first year of data available
  function setupMap() {
    // console.log(dataset)
      
    /*annualdataTRADE=[]
    countries=[]*/
    var year=$("#year").html(),
      toMap = [];


      for(p=1;p<8;p++){colors.push($("#datachooser :checked").attr('color-'+p))}
    
    for (i=0;i<dataset.length;i++) {
        /*annualdataTRADE.push(parseInt(dataset[i][year]))
        countries.push(dataset[i].Country)*/

        if ((dataType=='exportsChange')||(dataType=='importsChange')||(dataType=='tradeBalance')){
          toMap.push(parseFloat(Math.abs(dataset[i][year])))

        }else{
          if (parseFloat(dataset[i][year])>0){
           toMap.push(parseFloat(dataset[i][year]))
          } 
        } 
       }
   
  /*var myobject=[]
  for (x in annualdataTRADE){
    object= [annualdataTRADE[x],countries[x]]
    myobject.push(object)
  }
  sorted=annualdataTRADE.sort(d3.descending)

  for (x=0; x<sorted.length; x++){
    for (y in myobject){ 
      if (myobject[y][0]==sorted[x]){
        top5.push(myobject[y])
      }
    }

  }*/



    TOMAP = toMap.sort(d3.ascending),

    colorjenks=d3.scale.threshold()
      .domain(niceBreaks)
      .range(colors)

      // console.log(colorjenks)


    if ($("#legenddiv").length){
      legend.removeFrom(map)      
    }

    legend.addTo(map);
    makeLegend();



    changeYear();
  };// End setupMap


  

 
  // Builds the SVG map used to select a state
  function initSelectorMap() {

    var width = 560,
      height = 900; 

    var projection = d3.geo.albersUsa()
      .scale(2100)
      .translate([width/2, height/2]);

    var path = d3.geo.path()
      .projection(projection);

    var svg = d3.select("#stateChooserMap")
      .append("svg")
        .attr("id", "svgMap")
      .append("g")
        .attr("id", "gMap");

    var abrev=['ia', 'il', 'in', 'ks', 'ky', 'MAFC', 'mi', 'mn', 'mo', 'oh', 'wi'],
        def= ['Iowa', 'Illinois', 'Indiana', 'Kansas', 'Kentucky', 'MAFC', 'Michigan','Minnesota', 'Missouri', 'Ohio', 'Wisconsin'];

    d3.json("js/mafc.json", function(error, us) {
      svg.selectAll(".states")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("class", "states")
        .attr("d", path)
        .attr("id", function(d) {return d.properties.postal;})
        .on("click", function(d) {
          for(k=0;k<abrev.length;k++){
              if(d3.select(this).attr("id").toLowerCase()==abrev[k]){
                stateClicked=def[k]
                $('#stateChooser').modal('hide');
              }
            }
          loadData(d3.select(this).attr("id").toLowerCase())
        })
      svg.selectAll(".subunit-label")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("text")
        .attr("class", "subunit-label")
        .attr("id", function(d){return d.properties.postal})
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        // .attr("dy", ".35em")
        .attr({"text-anchor": "center",
          "font-size": "1.6em",
          "font-family": 'Open Sans',
          "fill": "#fff"
        })
        .text(function(d) { return d.properties.postal; });
    //      $(".states").mouseenter(function(e){
    //         $('.subunit-label[id="'+$(this).attr("id")+'"]').attr("stroke-width","0.2")
    // });

        //$(".subunit-label [id='"+$(this).attr(id)+"']")
      })
      
 
    

  
    






    scaleMap();
  }
  

  $('#MAFC').click(function(d) {
    loadData(d3.select(this).attr("id"))
    $('#stateChooser').modal('hide');
    scaleMap();
  });

  function scaleMap() {
    $('#gMap').attr('transform', 'scale(' + 570/900 +')');
    $('#svgMap').height(570*0.618);
    $('#svgMap').css('height', $('#svgMap').height()*0.92);
    $('#svgMap').css('width', 570);
  }

  resize();




});//End document.ready callback






// Called when the slider changes and when the map is loaded; changes the map symbology
function changeYear() {


  /*maketop5();*/

  

  var allData=[],
    year= $("#year").html();


  map.closePopup();





  for(j=0;j<dataset.length;j++) {
    for (i in centroidLayer._layers) {
      if (centroidLayer._layers[i].feature.id == dataset[j].id) {
        if (dataset[j][year] === '0') {
          centroidLayer._layers[i].setStyle({ radius: 0 });
        }else{
          centroidLayer._layers[i]
              .unbindPopup()
              .bindPopup("<h3>" + dataset[j].Country + "</h3><p id ='popuptext'>"+formatter(dataset[j][year])+"</p>", {closeButton: false})
              .setStyle({radius: (circlesize(parseFloat(Math.abs(dataset[j][year]))))})
              .setStyle({fillColor: colorBreaker(parseFloat(dataset[j][year]))})
              .on('click', function(e){
                for (p=0;p<dataset.length;p++){
                  if (dataset[p].id==e.target.feature.id){
                    dataClicked=dataset[p];

                   chart.update(map)
              

                  }
                }
              })
              .on('mouseIn', function(e){
                //console.log(e)
              })
        }
      }
    }
  }
}







