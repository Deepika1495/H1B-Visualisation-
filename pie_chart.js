var width = 500,
    height = 500,
    left = $(window).width()*0.25;
    radius = Math.min(width, height) / 2;

var color = ["#2ca02c", "#db3d3d", "#ffdb4d", "#ffa64d"];

var pie = d3.layout.pie()
    .value(function(d) {
        return d.y16;
    })
    .sort(null);

var arc = d3.svg.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 20);

var svg = d3.select("body").append("svg")
    .attr("id","pie")
    .attr("width", width)
    .attr("height", height)
    .attr("left", left)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var years = ["2016", "2015", "2014", "2013", "2012"];

var yearval = ["y12","y13","y14","y15","y16"];

var toolTip = d3.select("body").append("div").attr("class", "toolTip");

d3.csv("count_pie.csv", type, function(error, data) {
  if (error) throw error;
  var path = svg.datum(data).selectAll("path")
      .data(pie)
      .enter().append("path")
      .attr("fill", function(d, i) {
        return color[i];
      })
      .attr("d", arc)
      .each(function(d) {
        this._current = d;
      });
  textbe(4);

  d3.selectAll("input")
    .on("change", change);

  var timeout = time(0);

  function time(i){
    setTimeout(function() {
      d3.select("input[value="+yearval[i]+"]").property("checked", true).each(change);
      time(i+1)}, 1000);
  } 

  function textinchart(value) {
    
    if (value == "y16") {
      textbe(0);
    }
    if (value == "y15") {
      textbe(1);
    }
    if (value == "y14") {
      textbe(2);
    }
    if (value == "y13") {
      textbe(3);
    }
    if (value == "y12") {
      textbe(4);
    }
  }

  function textbe(d) {
    d3.select("text").remove();
    svg.append("text")
      .attr("text-anchor", "middle")
      .style('font-size', '4em')
      .attr('y', 20)
      .text(years[d]);
  }

  function change() {
    var value = this.value;
    clearTimeout(timeout);
    textinchart(value);
    pie.value(function(d) {
       return d[value];
    });
    var sum = d3.sum(data.map(function (d){ return d[value]}));
    path = path.data(pie); 
    path.transition().duration(750).attrTween("d", arcTween);
    path.on("mousemove", function(d){
      toolTip.style("left", d3.event.pageX+10+"px");
      toolTip.style("top", d3.event.pageY-25+ "px");
      toolTip.style("display", "inline-block");
      toolTip.html(d.data.label + "<br>" + Math.round((d.value/sum)*10000)/100 +"%");
    });
    path.on("mouseout", function(d){
      div.style("display", "inline-block");
    });
  }
});

function type(d) {
  d.y16 = +d.y16;
  d.y15 = +d.y15;
  d.y14 = +d.y14;
  d.y13 = +d.y13;
  d.y12 = +d.y12
  return d;
}

function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}
