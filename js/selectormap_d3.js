    function getColors(typeSelected){

  var greens= ['#EDF8E9','#C7E9C0', '#A1D99B', '#74C476', '#41AB5D','#238B45', '#005A32'],
    blues= ["#eff3ff","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],
    reds= ["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],
    redGreen=["#b2182b","#ef8a62","#fddbc7","#ffffff","#e0e0e0","#999999","#4d4d4d"];
  
  if return(typeSelected=='imports'){
    return reds
  }else if(typeSelected=='exports'){
    return greens
  }else if ((typeSelected=='exportsChange')||(typeSelected=='importsChange')||(typeSelected=='tradeBalance')){
    return ["#084594", "#99000d","#084594", "#99000d","#084594", "#99000d","#084594"]
  }
}