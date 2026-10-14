/* ============================================================================
   auth.js — page protection

   Included at the top of every protected page. If the user isn't logged in
   (no username in sessionStorage), they're immediately redirected to login.
   ========================================================================== */

(function () {
  'use strict';

  if (!sessionStorage.getItem("winaUser")) {
    window.location.replace("login.html");
  }
})();