function reset(){$("table tr").each(function(){if(!$(this).hasClass("title")&&!$(this).hasClass("sub")){$(this).remove();$(".output-top").fadeOut(0)}});$(".scissors").removeAttr("style");$(".cut").removeAttr("style");drag_x=0}function post(){username=$(".username").val();limit=$(".limit").text();$.post("get_tags.py",{username:username,limit:limit},function(e){if(!e)$(".username").addClass("error");else{e=$.parseJSON(e);$(".title td").text(username.toUpperCase()+"'S TAGS W/ "+limit+"+");reset();e.length?$(e).each(function(){this[0]==="temp_filename"?temp_file=this[1]:$(".tags .output code table").append("<tr><td>"+this[0]+'</td><td class="count">'+this[1]+"</td></tr>")}):$(".tags .output code table").append('<tr><td class="no-tags">NO TAGS</td></tr>');$(".tags").fadeIn("fast");$(".bot .arrow").fadeIn("fast");$(".bot").removeClass("bot-init");var t=$(".output").height()+20;$(".output").css("top",-1*t);$(".output").css("margin-bottom",20);$(".output").css("visibility","visible");$("html, body").animate({scrollTop:$(".outputter").offset().top-40},"slow");$(".output-top").fadeIn();$(".right").animate({height:10},"slow",function(){$(".output").animate({top:0},1e3,function(){$(".scissors img").addClass("cutting");setTimeout(function(){$(".scissors img").removeClass("cutting")},200)})})}$(".go").removeClass("disabled going");$(".go").text("Go!")})}function set_limit(e){$(".limit").text(e)}$(".heading-shadow").css({left:3,top:$("h1").offset().top+3,display:"block"});var drag_x=0,is_first_click=!0;$(".scissors").mousedown(function(){if(is_first_click){$(".tear-off").addClass("show-cut");setTimeout(function(){$(".tear-off").removeClass("show-cut");is_first_click=!1},200)}});$(".scissors").draggable({axis:"x",containment:"window",start:function(){$(this).find("img").addClass("cutting")},stop:function(){$(this).find("img").removeClass("cutting");if($(".cut").width()>$(".output").width()/2){var e=parseInt($(".cut").css("max-width"),10);$(this).animate({left:$(".output").offset().left+$(".output").width()+40},1e3,function(){$(this).fadeOut()});$(".cut").animate({width:e},800,function(){window.open("tmp/"+temp_file);$("pre a").attr("href","tmp/"+temp_file);$("pre a").fadeIn()})}},drag:function(e,t){var n=$(".output").offset().left-30;$(".cut").css("max-width",$(".output").width()+1);if(t.offset.left>n&&t.offset.left>drag_x){$(".cut").width(t.offset.left-n);drag_x=t.offset.left}}});var username,limit,temp_file;$(".slider").slider({value:4,min:1,max:20,step:1,slide:function(e,t){set_limit(t.value)},start:function(){$(".limit").addClass("limit-active")},stop:function(){$(".limit").removeClass("limit-active")}});set_limit($(".slider").slider("value"));$(".username").keyup(function(){$(this).val()!==""?$(".go").removeClass("disabled"):$(".go").addClass("disabled")});$(".go").click(function(){event.preventDefault();if(!$(this).hasClass("disabled")){$(".username").removeClass("error");$(this).addClass("disabled going");$(this).text("Going...");post()}else $(".username").addClass("error")});