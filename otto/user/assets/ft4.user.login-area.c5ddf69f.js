var o_user=o_user||{},o_util=o_util||{};o_user.loginarea=o_user.loginarea||{},o_util.event=o_util.event||{},o_user.loginarea.viewBuilder=function(e,n){"use strict";function i(){var e,i,o=n.getElementById("us_id_loginAreaMenu");o&&(o.style.display="none"),e=n.querySelector(".us_js_loginMenuCurtain"),i=n.getElementById("us_js_id_loginAreaContainerWrapper"),e&&i.removeChild(e);}function o(){var i=n.getElementById("us_id_loginAreaMenu");return"none"!==e.getComputedStyle(i).display;}function t(e){e.target.closest("#us_id_loginAreaContainerWithName")||o()&&(i(),n.documentElement.classList.contains("touchable")&&(n.body.style.cursor="default"));}return{hideLoginAreaMenu:i,isLoginAreaMenuVisible:o,showLoginAreaMenu:function showLoginAreaMenu(){var e=n.getElementById("us_id_loginAreaMenu"),i=n.createElement("div"),o=n.getElementById("us_js_id_loginAreaContainerWrapper"),r=n.getElementById("us_id_loginAreaContainerWithName");i.classList.add("us_layerCurtain","us_js_loginMenuCurtain"),o.insertBefore(i,r),i.addEventListener("click",t),e&&(e.style.display="block"),n.dispatchEvent(new CustomEvent("o_user.login.area.menu.opened"));}};},o_user.loginarea.presenterBuilder=function(e,n){"use strict";return{init:function init(){var i,o,t;document.getElementById("us_js_id_loginAreaContainerToReplace")&&(t=document.getElementById("us_js_id_loginAreaContentToReplaceHeader"))&&(o=document.getElementById("us_js_id_loginAreaContainerToReplace"),i=document.getElementById("us_js_id_loginAreaContentToRemove"),o&&(o.outerHTML=t.innerHTML),i&&i.parentNode.removeChild(i)),n.delegate(document,"click",".us_js_loginAreaMenuHandle",function(){e.isLoginAreaMenuVisible()?e.hideLoginAreaMenu():e.showLoginAreaMenu();}),n.delegate(document,"click","#us_id_closeLoginMenuButton",function(){e.hideLoginAreaMenu();}),n.delegate(document,"click",".user_js_show_more_login_area_links",function(){var e=document.querySelectorAll(".login_area_menu_hide_link");[].forEach.call(e,function(e){e.classList.remove("login_area_menu_hide_link");}),this.parentNode.classList.add("login_area_menu_hide_link");}),n.delegate(document,"click",".user_js_more_login_area_links_follow",function(){window.open(window.atob(this.getAttribute("data-ub64e")),"_self");}),document.addEventListener("o_user.login.area.menu.close",function(){e.hideLoginAreaMenu();});}};},o_global.eventLoader.onAllScriptsExecuted(4,function(){"use strict";o_user.loginareaInitialized||(o_user.loginareaInitialized=!0,o_user.loginarea.view=o_user.loginarea.viewBuilder(window,document),o_user.loginarea.presenter=o_user.loginarea.presenterBuilder(o_user.loginarea.view,o_util.event),o_user.loginarea.presenter.init());});//# sourceMappingURL=/user/assets/ft4.user.login-area.c5ddf69f.js.map