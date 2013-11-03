(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};

  Handlebars.partials = Handlebars.templates;
templates['adminmenu'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<svg class=\"toggle-button\" width=\"20\" height=\"20\">\n    <rect x=\"9\" y=\"0\" width=\"2\" height=\"20\" fill=\"white\" />\n    <rect x=\"0\" y=\"9\" width=\"20\" height=\"2\" fill=\"white\" />\n</svg>\n<div class=\"menu-items\">\n    <svg class=\"bar-button\" width=\"20\" height=\"20\" viewBox=\"0 0 27 47\">\n        <path d=\"M3.46706059,1.57 L23.3730606,1.57 C24.3130606,3.34 24.8810606,5.34 25.0850606,7.42 L1.75606059,7.42 C1.95906059,5.34 2.52806059,3.35 3.46706059,1.57 C3.46706059,1.57 2.52806059,3.35 3.46706059,1.57 L3.46706059,1.57 L3.46706059,1.57 Z M19.1920606,23.08 C26.7340606,19.79 27.6410606,9.14 26.6620606,7.42 L26.6410606,7.42 C26.4190606,4.91 25.7150606,2.5 24.5140606,0.4 L24.2920606,0 L2.54906059,0 L2.32706059,0.4 C1.06806059,2.61 0.357060593,5.14 0.178060593,7.78 C-0.204939407,9.08 -0.0379394067,12.34 1.35306059,15.63 C1.45606059,15.88 1.56906059,16.13 1.68106059,16.38 L1.76406059,16.56 C3.73606059,20.73 7.28506059,23.75 11.4710606,24.47 L11.4710606,43.79 C7.62406059,43.95 4.75506059,44.53 4.75506059,45.23 C4.75506059,46.04 8.66606059,46.71 13.4850606,46.71 C18.3160606,46.71 22.2230606,46.04 22.2230606,45.23 C22.2230606,44.53 19.3580606,43.95 15.5070606,43.79 L15.5070606,24.45 C16.8090606,24.21 18.0450606,23.73 19.1920606,23.08 L19.1920606,23.08 Z M19.1920606,23.08\" fill=\"#121212\"></path>\n    </svg>\n    <svg class=\"coffee-button\" width=\"20\" height=\"20\" viewBox=\"0 0 32 27\">\n        <path d=\"M22.136,13.41 L22.125,13.41 L21.907,13.44 L21.927,13.42 C20.561,13.5 15.827,13.86 14.763,13.86 C6.996,13.86 2.369,12.55 1.789,11.77 C2.369,10.98 6.996,9.67 14.763,9.67 C17.452,9.67 22.176,9.9 24.751,10.59 C26.464,10.99 27.486,11.43 27.738,11.77 C27.377,12.26 25.431,12.95 22.136,13.41 C22.136,13.41 25.431,12.95 22.136,13.41 L22.136,13.41 L22.136,13.41 Z M25.835,22.97 C26.689,22.14 27.264,21.06 27.264,19.87 L29.528,12.4 C29.528,12.18 29.511,11.98 29.484,11.77 L29.438,11.8 L29.443,11.77 C29.443,10.59 28.047,9.79 26.117,9.23 L23.13,8.6 C19.299,8.01 15.084,8 14.763,8 C14.165,8 0.085,8.04 0.085,11.77 L0.088,11.8 L0.043,11.77 C0.018,11.98 0,12.18 0,12.4 L2.263,19.87 C2.263,21.14 3.015,22.29 4.066,23.14 C1.539,23.52 0,24.03 0,24.59 C0,25.79 6.976,26.75 15.582,26.75 C24.188,26.75 31.165,25.79 31.165,24.59 C31.165,23.95 29.1,23.36 25.835,22.97 L25.835,22.97 Z M25.835,22.97\" fill=\"#121212\"></path>\n        <path d=\"M9.74515688,4.72 C9.88215688,4.91 10.0281569,5.08 10.1811569,5.25 L10.5621569,5.63 C10.8021569,5.87 11.0271569,6.11 11.2071569,6.33 C11.2951569,6.44 11.3701569,6.54 11.4251569,6.63 C11.4781569,6.72 11.5241569,6.78 11.5351569,6.88 C11.5491569,6.98 11.4931569,7.12 11.3881569,7.27 C11.2811569,7.41 11.1301569,7.54 10.9531569,7.68 C11.1631569,7.76 11.3891569,7.78 11.6301569,7.75 C11.8701569,7.73 12.1351569,7.62 12.3551569,7.39 C12.5751569,7.16 12.6941569,6.82 12.7141569,6.52 C12.7361569,6.22 12.6881569,5.95 12.6221569,5.71 C12.4841569,5.21 12.2571569,4.82 12.0121569,4.46 C11.8921569,4.28 11.7411569,4.09 11.6341569,3.95 C11.5261569,3.83 11.4281569,3.7 11.3391569,3.57 C10.9691569,3.06 10.7101569,2.59 10.6141569,2.05 C10.5121569,1.5 10.6251569,0.8 10.9531569,0 C10.0941569,0.18 9.32715688,0.9 9.07915688,1.91 C8.95715688,2.4 8.98215688,2.95 9.11315688,3.43 C9.24715688,3.92 9.47915688,4.35 9.74515688,4.72\" fill=\"#121212\"></path>\n        <path d=\"M14.7463135,4.72 C14.8833135,4.91 15.0303135,5.08 15.1813135,5.25 L15.5633135,5.63 C15.8023135,5.87 16.0273135,6.11 16.2073135,6.33 C16.2953135,6.44 16.3693135,6.54 16.4263135,6.63 C16.4763135,6.72 16.5253135,6.78 16.5353135,6.88 C16.5483135,6.98 16.4963135,7.12 16.3883135,7.27 C16.2813135,7.41 16.1303135,7.54 15.9553135,7.68 C16.1633135,7.76 16.3903135,7.78 16.6323135,7.75 C16.8713135,7.73 17.1373135,7.62 17.3563135,7.39 C17.5773135,7.16 17.6963135,6.82 17.7153135,6.52 C17.7363135,6.22 17.6913135,5.95 17.6233135,5.71 C17.4863135,5.21 17.2583135,4.82 17.0143135,4.46 C16.8923135,4.28 16.7413135,4.09 16.6343135,3.95 C16.5273135,3.83 16.4273135,3.7 16.3383135,3.57 C15.9713135,3.06 15.7113135,2.59 15.6153135,2.05 C15.5133135,1.5 15.6233135,0.8 15.9553135,0 C15.0953135,0.18 14.3273135,0.9 14.0793135,1.91 C13.9563135,2.4 13.9823135,2.95 14.1163135,3.43 C14.2473135,3.92 14.4783135,4.35 14.7463135,4.72\" fill=\"#121212\"></path>\n        <path d=\"M19.7454624,4.72 C19.8834624,4.91 20.0294624,5.08 20.1814624,5.25 L20.5624624,5.63 C20.8024624,5.87 21.0264624,6.11 21.2074624,6.33 C21.2964624,6.44 21.3714624,6.54 21.4254624,6.63 C21.4784624,6.72 21.5254624,6.78 21.5364624,6.88 C21.5494624,6.98 21.4954624,7.12 21.3884624,7.27 C21.2814624,7.41 21.1304624,7.54 20.9554624,7.68 C21.1634624,7.76 21.3914624,7.78 21.6304624,7.75 C21.8714624,7.73 22.1364624,7.62 22.3564624,7.39 C22.5764624,7.16 22.6954624,6.82 22.7154624,6.52 C22.7374624,6.22 22.6904624,5.95 22.6234624,5.71 C22.4854624,5.21 22.2584624,4.82 22.0144624,4.46 C21.8924624,4.28 21.7404624,4.09 21.6334624,3.95 C21.5274624,3.83 21.4294624,3.7 21.3384624,3.57 C20.9704624,3.06 20.7104624,2.59 20.6154624,2.05 C20.5134624,1.5 20.6254624,0.8 20.9554624,0 C20.0954624,0.18 19.3284624,0.9 19.0814624,1.91 C18.9554624,2.4 18.9824624,2.95 19.1154624,3.43 C19.2464624,3.92 19.4774624,4.35 19.7454624,4.72\" fill=\"#121212\"></path>\n    </svg>\n</div>\n";
  });
templates['event'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  		<column>\n			";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</column>\n  	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n			<div class=\"shift "
    + escapeExpression(((stack1 = ((stack1 = depth0.shift),stack1 == null || stack1 === false ? stack1 : stack1.cssClass)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.shift),stack1 == null || stack1 === false ? stack1 : stack1.durationType)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" id=\"shift_"
    + escapeExpression(((stack1 = ((stack1 = depth0.shift),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n				<div class='title'>\n					"
    + escapeExpression(((stack1 = ((stack1 = depth0.shift),stack1 == null || stack1 === false ? stack1 : stack1.type)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n					";
  stack2 = helpers['if'].call(depth0, depth0.twins, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n				</div>\n				<div class='time'>"
    + escapeExpression(((stack1 = ((stack1 = depth0.shift),stack1 == null || stack1 === false ? stack1 : stack1.start)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = ((stack1 = depth0.shift),stack1 == null || stack1 === false ? stack1 : stack1.stop)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n\n                <div class='reveal-modal take_shift small'>\n                    Ta skift "
    + escapeExpression(((stack1 = ((stack1 = depth0.shift),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n                    <a class=\"close-reveal-modal\">&#215;</a>\n                </div>        \n			</div>\n\n			";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n						(";
  if (stack1 = helpers.twins) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.twins; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ")\n					";
  return buffer;
  }

  buffer += "<script type=\"text/javascript\">\n    $(document).ready(function() {    \n        $(\".shift\").click(function() {\n            $(\"> .take_shift\" ,this).foundation('reveal', 'open', {\n                animation: 'fade',\n                animationSpeed: 100,\n                closeOnBackgroundClick: true,\n                dismissModalClass: 'close-reveal-modal'\n            });\n        });\n    });\n</script>\n\n<div class='event'>\n	<h2>"
    + escapeExpression(((stack1 = ((stack1 = depth0.event),stack1 == null || stack1 === false ? stack1 : stack1.start)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " - "
    + escapeExpression(((stack1 = ((stack1 = depth0.event),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h2>\n  	";
  stack2 = helpers.each.call(depth0, depth0.columns, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  	<column>\n		<div class='comments'>\n			<div class='title'>Kommentarer</div>\n			"
    + escapeExpression(((stack1 = ((stack1 = depth0.event),stack1 == null || stack1 === false ? stack1 : stack1.description)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n		</div>\n	</column>		\n</div>";
  return buffer;
  });
templates['popout'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<svg class=\"close-button\" width=\"20\" height=\"20\">\n    <g class=\"cross\">\n    <rect x=\"9\" y=\"0\" width=\"2\" height=\"20\" fill=\"white\" />\n    <rect x=\"0\" y=\"9\" width=\"20\" height=\"2\" fill=\"white\" />\n    </g>\n</svg>\n<div class=\"popout-content\">\n</div>\n";
  });
templates['sidebar.shiftlist'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n<div class=\"shift row\" data-index=\""
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <span class=\"no-click large-8\">";
  if (stack2 = helpers.count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "x ";
  if (stack2 = helpers.shifttype) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.shifttype; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\n    <span class=\"no-click large-4 text-right time\">";
  if (stack2 = helpers.start) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.start; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " - ";
  if (stack2 = helpers.stop) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.stop; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\n</div>\n";
  return buffer;
  }

  buffer += "<header class=\"row\">\n    <span class=\"large-3\">Skift</span>\n    <span class=\"large-9 text-right\">\n        <a class=\"default-shifts\" href=\"#\">+standard</a>\n    </span>\n</header>\n";
  stack1 = helpers.each.call(depth0, depth0.shifts, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<form class=\"shift-form add-shift-box row\" action=\"/\">\n    <input type=\"submit\" style=\"position:absolute;top:0;left:0;width:0;height:0;margin:0;padding:0;visibility:hidden;\" />\n    <input class=\"count text-center\" name=\"count\" value=\"\" type=\"text\" placeholder=\"ant.\" />\n    <input class=\"shifttype\" name=\"shifttype\" value=\"\" type=\"text\" placeholder=\"type\" />\n    <input name=\"start\" value=\"\" type=\"text\" class=\"start text-center\" placeholder=\"fra\" pattern=\"(0[0-9]|1[0-9]|2[0-3])([:\\.][0-5][0-9])\" />\n    <input name=\"stop\" value=\"\" type=\"text\" class=\"start text-center\" placeholder=\"til\" pattern=\"(0[0-9]|1[0-9]|2[0-3])([:\\.][0-5][0-9])\" />\n</form>\n";
  return buffer;
  });
templates['sidebar.bar'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<section>\n    <h2>Ny barkveld</h2>\n    Opprett nye skift for en barkveld.\n</section>\n<section id=\"sidebar-bar-date\" style=\"height:270px; overflow:hidden;\">\n    <header class=\"row date-header\">\n        <span class=\"large-3\">Dato</span>\n        <span class=\"large-9 selected-date\"></span>\n    </header>\n    <table class=\"datepicker\">\n    </table>\n</section>\n<section class=\"shifts\">\n</section>\n<section>\n    <header>\n        Kommentar\n    </header>\n    <textarea></textarea>\n</section>\n<section>\n    <button id=\"save-night\">Lagre</button>\n</section>\n";
  });
})();