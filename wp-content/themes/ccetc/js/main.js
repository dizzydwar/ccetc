var $ = jQuery.noConflict();

var w_height;
var scrolled;
var preview_box_width;
var preview_entry_height;
var ratio;

              
$(document).ready(function() {
       at_the_top = true;
       resize();
       click_handlers();
       setup_slideshow();
});
$( window ).resize(function() {
       resize();
});
$( window ).scroll(function() {
       scrolled = $("body").scrollTop();
});

function resize(){
       get_dimensions();
       scale_start_screen();
       apply_ratio();
       
       resize_thumb_area();
       justify_height();
       
       scale_slideshow();
}

function click_handlers(){
       get_random();
       toggle_menu();
       menu_click();
}





/*
function collaps_start_screen(){
       var seperator_bot_position = $(".block_separator").offset().top;
}
*/


function get_dimensions(){
       w_height = $(window).height();
}

function apply_ratio(){
       $(".has_ratio").each(function(){
              var e = $(this);
              var ratio = e.attr("data-ratio");   

              if(e.width() !== 0){
                    var new_height = e.width()*ratio;
                    e.height(new_height);
              }else{
                    var new_width = e.height()/ratio;
                    e.width(new_width); 
                    if(e.hasClass("before")){                                   
                           e.css("marginLeft",-(new_width - 1));
                    }
              }
              max_w = e.parent("div").width();

              if(e.width() > max_w){
                     e.width("100%");
              }

       });
}

function scale_start_screen(){
       if ($('#start_screen').length > 0) {
              var top_ofs =$('#start_screen').position().top;
              
              $('#start_screen').height(w_height - top_ofs);  
              $('#main_quote').css("top",($('#start_screen').height() ) * 0.33 - $('#main_quote').height()/2);   
       }
}

function resize_thumb_area(){
       $(".thumb_area").each(function(){
              preview_box_width = $(".preview").width();
              ratio = $(this).attr("data-ratio");
              $(this).height(preview_box_width / ratio);
       });
}

function justify_height(){
       preview_entry_height = 0;
       $(".fixed_height .entry-content").each(function(){
              if($(this).height() > preview_entry_height){
                     preview_entry_height = $(this).height();
              }
       });
       $(".fixed_height .entry-content").height(preview_entry_height);
}


       
function get_random(){
       $(document).on("click","#get_random, .ccetc_macht",function(){
              ajax_get_random();
       }); 
}


function menu_click(){
       $("#menu-primary a").click(function(e, callback){
              e.preventDefault();
              var link = $(this).attr("href");
              var name = $(this).html();
              $("#current_page").html(name);
              
              dfd.done(function(){
                     window.location.href = link;       
              });
       });
}

var dfd = $.Deferred();

var current;
var nav;
var current_width;
var nav_margin;
var menu_width;

function toggle_menu(){
              
       current = $("#current_page");
       nav = $("#site-navigation");
       current_width = current.width();      
       nav_margin = parseInt(nav.find("a").css("paddingLeft"));     
       menu_width = nav.width();
       
       
       // status bei pageload setzten
       
       if($('body').hasClass("home")){
              current.css("right",- (current_width + nav_margin));
              
              nav.css("right", - current_width);
              nav.css("opacity",1);
       }else{
              current.css("right",0);
              current.css("opacity",1);
              
              nav.css("right", - (menu_width + current_width + nav_margin));
              nav.addClass("collapsed");
       }
       
       
       $("#my_menu_toggle, #current_page").mouseover(function(){
              // menu öffnen
              if(nav.hasClass("collapsed") === true){
                     show_menu();
              }  
       });
       
       $("#my_menu_toggle, #menu-primary a").click(function(){
              // menu öffnen
              if(nav.hasClass("collapsed") === true){
                     show_menu();
              }  
              // menu schließen
              else{ 
                     hide_menu();
              }
       });
       
}

function hide_menu(){
       nav.animate({
              right:- (menu_width + nav_margin),
              opacity: 0
              }, 150, function() {
                     
              nav.addClass("collapsed");

              current.animate({
                     right:0,
                     opacity: 1
              }, 300, function() {
                     current.removeClass("collapsed");
                     dfd.resolve();
              });
       });
}

function show_menu(){
       current.animate({
              right:- current_width,
              opacity: 0
              }, 150, function() {

              current.addClass("collapsed");

              nav.animate({
                     right: - current_width,
                     opacity: 1
              }, 300, function() {
                     nav.removeClass("collapsed");  

              });
       });
}







// GALLERY

var img_ratio = 0.5;
var imgWidth = 0;
var img_height = 0;
var num_img_shown = 1;
var stored_img_height = 0;

function scale_slideshow(){
       $(".slideshow").each(function(index){
              container = $(this).find(".slide_container");

              // set image width
              imgWidth = $(".slide_content").width() / num_img_shown;
              img_height = imgWidth * img_ratio;
              
              stored_img_height = 0;
              if(stored_img_height < img_height){
                     stored_img_height = img_height;
              }
              
              // calculate container width
              $(this).find(".slide").width(imgWidth);

              // set all images and container to this height
              $(this).find(".slide").height(stored_img_height);                      
              $(this).find(".slide_content").height(stored_img_height);

              //reset the slider so the first image is still visible          
              var position = $(this).find(".slide.current").index();
              var offset = position * imgWidth;
              container.css({'left':-offset+'px'});
              
              //scale buttons
              scale_buttons();
       });
};

function scale_buttons(){
       var s_height = $(".gallery_button").closest(".slideshow").find(".slide").height();
       $(".gallery_button").each(function(){
             $(this).height(s_height); 
       });
}

function setup_slideshow(){
       $(".slideshow").each(function(index){
              $(this).prepend('<p class="gallery_button prev ir">prev</p>');
              $(this).prepend('<p class="gallery_button next ir">next</p>');
              
              console.log($(this).width());
              
              var container = $(this).find(".slide_container");

              // set image width
              imgWidth = $(this).find(".slide_content").width() / num_img_shown;
              img_height = imgWidth * img_ratio;
              
              if(stored_img_height < img_height){
                     stored_img_height = img_height;
              }
              
              // set img width
              $(this).find(".slide").width(imgWidth);

              // set img and container height
              $(this).find(".slide").height(stored_img_height);                      
              $(this).find(".slide_content").height(stored_img_height);

              // if more than one image
              if($(this).find(".slide").length > 1){

                     // depending on how many images are shown at once...
                     // clone the last images and put them at the front
                     for(i = 1; i <= num_img_shown; i++){
                            container.children('.slide:nth-last-child('+i+')').clone().addClass("clone").prependTo(container);              
                     }
                     // clone the first REAL images 
                     for(i = 1; i <= num_img_shown; i++){
                            var j = i + num_img_shown; // skip added the clones
                            container.children('.slide:nth-child('+j+')').clone().addClass("clone").appendTo(container);
                     }

                     // mark the first and last REAL image - no clones
                     // and set current image
                     container.children('.slide').not(".clone").first().addClass("first current");
                     container.children('.slide').not(".clone").last().addClass("last");


                     var imgCount = container.children('.slide').length;//count the images
                     container.width(imgWidth * (imgCount));//set the width of the container to the number of images - plus 2 to account for the cloned images

                     var position = $(this).find(".slide.current").index();
                     var offset = position * imgWidth;

                     container.css({'left':-offset+'px'});//reset the slider so the first image is still visible              

              }
              
              scale_buttons();
              
       });
       
      

       // slideshow buttons
       var prev = function(button){
              var imgWidth = button.closest(".slideshow").find(".slide").width();
              var container = button.closest(".slideshow").find(".slide_container");
              var imgCount = container.find('.slide').length;

              container.stop(true,true); //complete any animation still running  

              var newLeft = container.position().left+(imgWidth);//calculate the new position which is the current position plus the width of one image

              container.animate({'left':newLeft+'px'},function(){//slide to the new position
                     if(container.children('.slide:nth-child(2)').hasClass("current")){
                            container.css({'left':- (imgCount - (num_img_shown * 2))*imgWidth+'px'});

                            container.children(".current").removeClass("current");
                            container.children('.slide:nth-last-child('+(num_img_shown * 2)+')').addClass("current");
                     }else{
                            var new_current = container.children(".current").prev("li, div, img");
                            container.children(".current").removeClass("current");
                            new_current.addClass("current");
                     }
              });
              return false;
       };


       $('body').delegate(".prev","click",function(){
              prev($(this));
       });


       var next = function(button){

              var imgWidth = button.closest(".slideshow").find(".slide").width();
              var container = button.closest(".slideshow").find(".slide_container");

              container.stop(true,true); //complete any animation still running - in case anyone's a bit click happy... 

              var newLeft = container.position().left-(imgWidth);//calculate the new position which is the current position minus the width of one image

              container.animate({'left':newLeft+'px'},function(){//slide to the new position...

                     if(container.children(".last").hasClass("current")){
                            container.css({'left':- num_img_shown*imgWidth+'px'});

                            container.children(".first").not("clone").addClass("current");
                            container.children(".last").removeClass("current");
                     }else{
                            var new_current = container.children(".current").next("li, div, img");
                            container.children(".current").removeClass("current");
                            new_current.addClass("current");
                     }
              });
              return false;
       };

       $('body').delegate(".next","click",function(){
              next($(this));
       });

       //smooth_load();
}