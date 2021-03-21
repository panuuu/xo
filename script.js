$(function(){
  cleardata() ;
})

  const createblock = dimension =>
  {
      const WinPattern = winpattern(dimension) ;
      localStorage.setItem('pn_xo_dimension', dimension) ;
      localStorage.setItem('pn_xo_winpattern', JSON.stringify(WinPattern)) ;
      var tx = "";
      var loop = 0 ;
      for (var i = 1; i <= dimension; i++) {
          tx += `<tr>`;
          for (var j = 1; j <= dimension; j++)
          {
              tx += `<td   id="td`+loop+`" onclick="turn(`+loop+`)"> </td>`;
              loop++ ;
          }
          tx += `</tr>`;
      }
      $("#GameZone").html(tx);

      var myArray = new Array("");
      localStorage.setItem('pn_xo_nowturn', 'X') ;
      localStorage.setItem('pn_xo_X_slot', JSON.stringify(myArray) ) ;
      localStorage.setItem('pn_xo_O_slot', JSON.stringify(myArray) ) ;
      localStorage.setItem('pn_xo_Selected_slot', JSON.stringify(myArray) ) ;
      localStorage.setItem('pn_xo_movehistory', 0 ) ;
      localStorage.setItem('pn_xo_winner', 0 ) ;
      localStorage.setItem('pn_xo_allblock', dimension*dimension ) ;
      localStorage.setItem('pn_xo_turned', 0 ) ;
      $("#gamestatus").html("ตาผู้เล่น : X") ;

  }



  const winpattern = dimension =>
  {
    var winpattern = [];
    // แนวตั้ง
    for (var i = 0; i < dimension ; i++)
    {
      var a = [] ;
      for (var j = 0; j < dimension*dimension  ; j = j+dimension)
      {
        a.push(i+j);
      }
      winpattern.push(a) ;
    }

    // แนวนอน
    var a = [] ;
    var co = 1 ;
    for (var i = 0 ; i < dimension*dimension ; i++)
    {
      a.push(i);
      co++ ;
      if (co == dimension + 1 )
      {
        winpattern.push(a) ;
        var a = [] ;
        var co = 1 ;
      }
    }

    // แนวแทยง
    b = [] ;
    for (var i = 0; i < dimension*dimension ; i = i+(dimension+1))
    {
      b.push(i);
    }
    winpattern.push(b) ;

    c = [] ;
    var loopnum = 1 ;
    for (var i = dimension-1; i < (dimension*dimension); i = i+(dimension-1))
    {
      if (loopnum <= dimension   ) {
        c.push(i);
      }
      loopnum++ ;
    }
      winpattern.push(c) ;
      return winpattern ;
  }


  const turn = map => {
  if (localStorage.getItem("pn_xo_winner") != 0) {
      return false;
  }

  var nowturn = localStorage.getItem("pn_xo_nowturn");
  let blank = $("#td" + map)
      .html()
      .trim().length;
  let thtd = $("#td" + map);
  var selectedslot = JSON.parse(localStorage.getItem("pn_xo_Selected_slot"));

  if (selectedslot.includes(map) == 0) {
      var nextturn = "";
      if (nowturn == "X") {
          nextturn = "O";
      } else {
          nextturn = "X";
      }
      localStorage.setItem("pn_xo_nowturn", nextturn);
      thtd.html(nowturn);

      var pn_xo_movehistory = localStorage.getItem("pn_xo_movehistory");
      var myArray = [{ winner: 0, turn: nowturn, turn: nowturn, map: map, winblock: "" }];

      if (pn_xo_movehistory == 0) {
          localStorage.setItem("pn_xo_movehistory", JSON.stringify(myArray));
      } else {
          pn_xo_movehistory = JSON.parse(pn_xo_movehistory);
          pn_xo_movehistory.push(myArray[0]);
          localStorage.setItem("pn_xo_movehistory", JSON.stringify(pn_xo_movehistory));
      }

      var slot = localStorage.getItem("pn_xo_" + nowturn + "_slot");
      slot = JSON.parse(slot);
      slot.push(map);
      localStorage.setItem("pn_xo_" + nowturn + "_slot", JSON.stringify(slot));
      selectedslot.push(map);
      localStorage.setItem("pn_xo_Selected_slot", JSON.stringify(selectedslot));

      var turned = localStorage.getItem("pn_xo_turned");
      turned++;
      localStorage.setItem("pn_xo_turned", turned);

      $("#gamestatus").html("ตาผู้เล่น : " + nextturn);
  }

  checkwin(nowturn);
};




  const checkdraw = () => {
    var allblock = localStorage.getItem('pn_xo_allblock')   ;
    var turned = localStorage.getItem('pn_xo_turned')   ;
    var pn_xo_winner = localStorage.getItem('pn_xo_winner')   ;
    if (turned == allblock  && pn_xo_winner == '0')
    {
      setTimeout(function()
      {
        $("#gamestatus").html(" ไม่มีผู้ชนะ , เริ่มเกมใหม่ ") ;
      },100) ;
      return false ;
    }
  }



  const checkwin = (player) => {
    var winwawy = JSON.parse(localStorage.getItem('pn_xo_winpattern')) ;
    var playerslot = JSON.parse(localStorage.getItem('pn_xo_'+player+'_slot')) ;
    winwawy.map(e => {
      var counte = 0 ;
      var all = e.length ;

      playerslot.map(d => {
          if (e.includes(d) == 1)
          {
            counte++ ;
          }
          if (counte == all )
          {
                // setTimeout(function(){alert(player+' Win') ;},100) ;
                $("#gamestatus").html("ผู้เล่น " + player + " เป็นผู้ชนะ") ;
                localStorage.setItem('pn_xo_winner', player ) ;
                var myArray = [{ 'winner' : player , 'turn': '' , 'turn': '' , 'color': '' , 'map' : '' , 'winblock' : e  }];
                var pn_xo_movehistory = JSON.parse(localStorage.getItem('pn_xo_movehistory')) ;
                pn_xo_movehistory.push(myArray[0]) ;
                localStorage.setItem("pn_xo_movehistory", JSON.stringify(pn_xo_movehistory));
                e.map(f => {
                  $("#td"+f).css('background','#de615e') ;
                })
                return false ;
          }
      })
    })
    checkdraw() ;
  }


  const playhistory = () => {
    $("td").css('background','white') ;
    $("td").html('') ;
    var pn_xo_movehistory = localStorage.getItem('pn_xo_movehistory') ;
    pn_xo_movehistory = JSON.parse(pn_xo_movehistory) ;
    var LoopTime = 500 ;
    pn_xo_movehistory.map(e => {

      setTimeout(function(){
        var thtd = $("#td"+e.map) ;
        if (e.winner == 0)
        {
          // thtd.css('background',e.color) ;
          thtd.html(e.turn) ;
        }
        else
        {
          e.winblock.map(f => {
            $("#td"+f).css('background','#de615e') ;
          }) ;

        }
      }, LoopTime);
      LoopTime += 400 ;
    })
  }


  const startnewgame = () => {
    var DefDimension = parseInt($("#DefDimension").val());
    if (DefDimension <= 1) {
        alert("ใส่ตัวเลขมากกว่า 1");
        return false;
    }
    createblock(DefDimension);
    $("#NewgameModal").modal("hide");
  }


  const validate = evt => {
      var theEvent = evt || window.event;

      if (theEvent.type === "paste") {
          key = event.clipboardData.getData("text/plain");
      } else {
          var key = theEvent.keyCode || theEvent.which;
          key = String.fromCharCode(key);
      }
      var regex = /[0-9]|\./;
      if (!regex.test(key)) {
          theEvent.returnValue = false;
          if (theEvent.preventDefault) theEvent.preventDefault();
      }
  }



  const cleardata = () => {
    localStorage.removeItem('pn_xo_dimension') ;
    localStorage.removeItem('pn_xo_nowturn') ;
    localStorage.removeItem('pn_xo_winpattern') ;
    localStorage.removeItem('pn_xo_X_slot') ;
    localStorage.removeItem('pn_xo_O_slot') ;
    localStorage.removeItem('pn_xo_Selected_slot') ;
    localStorage.removeItem('pn_xo_movehistory') ;
    localStorage.removeItem('pn_xo_winner') ;
    localStorage.removeItem('pn_xo_allblock') ;
    localStorage.removeItem('pn_xo_turned') ;

  }
