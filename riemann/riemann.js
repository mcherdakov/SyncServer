function canvasPoint(x,y){
    var X = this.X(x);
    var Y = this.Y(y);
    this.context.fillRect(X,Y,1,1);
}

function canvasClear(w,h,x,y){
  if(typeof x == 'undefined' || typeof y === 'undefined'){
    this.context.clearRect(0, 0, 800, 500);
  }
  if(typeof w == 'undefined'){
    w = 1;
  }
  if(typeof h == 'undefined'){
    h = 1;
  }
  this.context.clearRect(x,y,w,h);
}

function gcd(a, b)
{
  if(a == 0 || b == 0)
    return a+b;
  else if(a > b)
  {
    return gcd(a%b,b);
  }
  else
  {
    return gcd(a,b%a);
  }
}

function Riemann(N){
  Scatter.clear();
  var t = new Date();
  var i = 1;
  var interval = setInterval(function(){
    if(i == N)
    {
      var T;
      clearInterval(interval);
      console.log( (T = new Date() - t) );
      d3.select('#controls')
        .selectAll('p')
        .data(['Время построения',T+'ms'])
        .html(function(d){return d})
        .enter()
        .append('p')
        .html(function(d){return d});
    }
    for(var j = 1; j < i; ++j){
      if(gcd(j,i) == 1) {
    var curP = Scatter.addPoint(j/i, i);
    }
    }
    ++i;
  },5);
}
